"""
Поиск товаров на маркетплейсах WB и Ozon по запросу бренда для выявления нарушений ИС.
"""
import json
import urllib.request
import urllib.parse
import datetime


def handler(event: dict, context) -> dict:
    cors_headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors_headers, "body": ""}

    params = event.get("queryStringParameters") or {}
    query = params.get("query", "емколбаски").strip()
    marketplace = params.get("marketplace", "all")

    results = []
    errors = []

    if marketplace in ("wb", "all"):
        wb_items, err = search_wildberries(query)
        results.extend(wb_items)
        if err:
            errors.append(f"WB: {err}")

    if marketplace in ("ozon", "all"):
        ozon_items, err = search_ozon(query)
        results.extend(ozon_items)
        if err:
            errors.append(f"Ozon: {err}")

    today = datetime.date.today().isoformat()
    return {
        "statusCode": 200,
        "headers": cors_headers,
        "body": json.dumps({
            "results": results,
            "total": len(results),
            "query": query,
            "errors": errors,
            "date": today,
        }, ensure_ascii=False),
    }


def fetch_json(url: str, headers: dict, timeout: int = 15):
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8"))


def search_wildberries(query: str):
    """Поиск через WB catalog API с корректными параметрами."""
    encoded = urllib.parse.quote(query)
    today = datetime.date.today().isoformat()

    # Основной поиск
    url = (
        f"https://search.wb.ru/exactmatch/ru/common/v9/search"
        f"?appType=1&curr=rub&dest=-1257786"
        f"&query={encoded}"
        f"&resultset=catalog&sort=popular&spp=30"
        f"&suppressSpellcheck=false"
    )
    headers = {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept": "*/*",
        "Accept-Language": "ru-RU,ru;q=0.9",
        "Origin": "https://www.wildberries.ru",
        "Referer": f"https://www.wildberries.ru/catalog/0/search.aspx?search={encoded}",
    }

    try:
        data = fetch_json(url, headers)
    except Exception as e:
        return [], str(e)

    # WB может вернуть preset-редирект — пробуем достать products из разных мест
    products = (
        data.get("data", {}).get("products", [])
        or data.get("search_result", {}).get("products", [])
        or []
    )

    # Если WB вернул preset — парсим через catalog API
    preset_query = data.get("query", "")
    if not products and "preset=" in preset_query:
        preset_id = preset_query.split("preset=")[-1].split("&")[0]
        catalog_url = (
            f"https://catalog.wb.ru/presets/bucket_11921/catalog"
            f"?appType=1&curr=rub&dest=-1257786"
            f"&preset={preset_id}&sort=popular&spp=30"
        )
        try:
            cat_data = fetch_json(catalog_url, headers)
            products = cat_data.get("data", {}).get("products", [])
        except Exception:
            pass

    items = []
    for p in products[:25]:
        name = p.get("name", "")
        brand = p.get("brand", "")
        supplier = p.get("supplier", "")
        article = str(p.get("id", ""))
        price_raw = p.get("salePriceU", 0) or p.get("priceU", 0)
        price = price_raw // 100 if price_raw else 0
        rating = p.get("reviewRating", 0)
        feedbacks = p.get("feedbacks", 0)

        risk = assess_risk(name, brand, query)

        items.append({
            "id": f"wb-{article}",
            "productName": name,
            "brand": brand,
            "seller": supplier or brand or "Неизвестно",
            "marketplace": "wb",
            "articleId": article,
            "violationType": "Товарный знак",
            "riskLevel": risk,
            "price": price,
            "rating": rating,
            "feedbacks": feedbacks,
            "detectedAt": today,
            "status": "new",
            "url": f"https://www.wildberries.ru/catalog/{article}/detail.aspx",
        })

    return items, None


def search_ozon(query: str):
    """Поиск через Ozon API."""
    encoded = urllib.parse.quote(query)
    today = datetime.date.today().isoformat()

    url = (
        f"https://www.ozon.ru/api/composer-api.bff/web/v1/search"
        f"?text={encoded}&page=1"
        f"&layout_container=categorySearchMegapagination"
        f"&layout_page_index=2"
    )
    headers = {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept": "application/json",
        "Accept-Language": "ru-RU,ru;q=0.9",
        "Referer": f"https://www.ozon.ru/search/?text={encoded}",
        "x-o3-app-name": "ozon-front",
        "x-o3-app-version": "2.0",
    }

    try:
        data = fetch_json(url, headers)
    except Exception as e:
        return [], str(e)

    # Ozon хранит товары в нескольких возможных местах
    products = []
    catalog = data.get("catalog", {}) or {}
    products = catalog.get("products", [])

    if not products:
        # fallback: ищем в widgetStates
        widget_states = data.get("widgetStates", {})
        for key, val in widget_states.items():
            if "searchResultsV2" in key or "tileGrid" in key:
                try:
                    inner = json.loads(val) if isinstance(val, str) else val
                    items_raw = inner.get("items", [])
                    for item in items_raw:
                        main = item.get("mainState", [])
                        name, article, price, brand = "", "", 0, ""
                        for state in main:
                            atom = state.get("atom", {})
                            if state.get("id") == "name":
                                name = atom.get("label", "")
                            if state.get("id") == "price":
                                price_str = atom.get("price", "0")
                                if isinstance(price_str, str):
                                    price_str = price_str.replace("\u00a0", "").replace(" ", "").replace("₽", "").strip()
                                    try:
                                        price = int(float(price_str))
                                    except Exception:
                                        price = 0
                            if state.get("id") == "brand":
                                brand = atom.get("label", "")
                        article = str(item.get("sku", item.get("id", "")))
                        risk = assess_risk(name, brand, query)
                        if name:
                            products.append({
                                "name": name, "brand": brand,
                                "id": article, "price_val": price,
                            })
                except Exception:
                    continue
            if products:
                break

    items = []
    for p in products[:25]:
        name = p.get("name", "")
        article = str(p.get("id", p.get("sku", "")))
        brand = p.get("brand", "")
        price_val = p.get("price_val", 0)

        if not price_val:
            price_raw = p.get("price", {})
            if isinstance(price_raw, dict):
                price_str = price_raw.get("price", "0")
                if isinstance(price_str, str):
                    price_str = price_str.replace("\u00a0", "").replace(" ", "").replace("₽", "").strip()
                    try:
                        price_val = int(float(price_str))
                    except Exception:
                        price_val = 0
            elif isinstance(price_raw, (int, float)):
                price_val = int(price_raw)

        seller_raw = p.get("seller", {})
        seller = seller_raw.get("name", brand) if isinstance(seller_raw, dict) else (seller_raw or brand)

        risk = assess_risk(name, brand, query)

        items.append({
            "id": f"ozon-{article}",
            "productName": name,
            "brand": brand,
            "seller": seller or "Неизвестно",
            "marketplace": "ozon",
            "articleId": article,
            "violationType": "Товарный знак",
            "riskLevel": risk,
            "price": price_val,
            "detectedAt": today,
            "status": "new",
            "url": f"https://www.ozon.ru/product/{article}/",
        })

    return items, None


def assess_risk(name: str, brand: str, query: str) -> str:
    name_lower = name.lower()
    brand_lower = brand.lower()
    query_lower = query.lower()
    query_words = [w for w in query_lower.split() if len(w) > 2]

    if query_lower in name_lower or query_lower in brand_lower:
        return "critical"

    word_matches = sum(1 for w in query_words if w in name_lower or w in brand_lower)
    if query_words and word_matches == len(query_words):
        return "high"
    if word_matches > 0:
        return "medium"

    return "low"
