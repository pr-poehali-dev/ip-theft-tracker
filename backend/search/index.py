"""
Поиск товаров на маркетплейсах WB и Ozon по запросу бренда для выявления нарушений ИС.
"""
import json
import urllib.request
import urllib.parse
import urllib.error


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

    if marketplace in ("wb", "all"):
        wb_items = search_wildberries(query)
        results.extend(wb_items)

    if marketplace in ("ozon", "all"):
        ozon_items = search_ozon(query)
        results.extend(ozon_items)

    return {
        "statusCode": 200,
        "headers": cors_headers,
        "body": json.dumps({"results": results, "total": len(results), "query": query}, ensure_ascii=False),
    }


def search_wildberries(query: str) -> list:
    encoded = urllib.parse.quote(query)
    url = f"https://search.wb.ru/exactmatch/ru/common/v9/search?appType=1&curr=rub&dest=-1257786&query={encoded}&resultset=catalog&sort=popular&spp=30&suppressSpellcheck=false"

    req = urllib.request.Request(url, headers={
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "application/json",
    })

    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except Exception:
        return []

    products = data.get("data", {}).get("products", [])
    items = []
    for p in products[:20]:
        name = p.get("name", "")
        brand = p.get("brand", "")
        supplier = p.get("supplier", "")
        article = str(p.get("id", ""))
        price_raw = p.get("priceU", 0) or p.get("salePriceU", 0)
        price = price_raw // 100

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
            "detectedAt": "2026-03-25",
            "status": "new",
            "url": f"https://www.wildberries.ru/catalog/{article}/detail.aspx",
        })

    return items


def search_ozon(query: str) -> list:
    url = "https://api.ozon.ru/composer-api.bff/api/v2/search/products"
    encoded_query = urllib.parse.quote(query)
    full_url = f"https://www.ozon.ru/api/composer-api.bff/web/v1/search?text={encoded_query}&page=1&layout_container=categorySearchMegapagination&layout_page_index=2"

    req = urllib.request.Request(full_url, headers={
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "application/json",
        "x-o3-app-name": "ozon-front",
    })

    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except Exception:
        return []

    items = []
    catalog = data.get("catalog", {})
    products = catalog.get("products", []) if catalog else []

    for p in products[:20]:
        name = p.get("name", "")
        article = str(p.get("id", p.get("sku", "")))
        price_raw = p.get("price", {})
        price = 0
        if isinstance(price_raw, dict):
            price_str = price_raw.get("price", "0").replace("\u00a0", "").replace(" ", "").replace("₽", "").strip()
            try:
                price = int(float(price_str))
            except Exception:
                price = 0
        brand = p.get("brand", "")
        seller = p.get("seller", {}).get("name", brand) if isinstance(p.get("seller"), dict) else brand

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
            "price": price,
            "detectedAt": "2026-03-25",
            "status": "new",
            "url": f"https://www.ozon.ru/product/{article}/",
        })

    return items


def assess_risk(name: str, brand: str, query: str) -> str:
    name_lower = name.lower()
    brand_lower = brand.lower()
    query_lower = query.lower()

    query_words = query_lower.split()
    exact_match = query_lower in name_lower or query_lower in brand_lower

    if exact_match:
        return "critical"

    word_matches = sum(1 for w in query_words if w in name_lower or w in brand_lower)
    if word_matches == len(query_words):
        return "high"
    if word_matches > 0:
        return "medium"

    return "low"
