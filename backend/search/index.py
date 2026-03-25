"""
Поиск товаров на маркетплейсах WB и Ozon по нескольким брендам/товарным знакам.
Поддерживает множественный ввод через запятую и морфологические формы слов.
"""
import json
import urllib.request
import urllib.parse
import datetime
import re


# ──────────────────────────────────────────────
# Морфология: словоформы для частых корней
# ──────────────────────────────────────────────

MORPHO_MAP = {
    "колбаск": [
        "колбаски", "колбасок", "колбаска", "колбаске",
        "колбаску", "колбасками", "колбасках",
    ],
    "колбас": [
        "колбаса", "колбасы", "колбасе", "колбасу",
        "колбасой", "колбасах", "колбасами",
    ],
    "сосиск": [
        "сосиска", "сосиски", "сосисок", "сосиске",
        "сосиску", "сосисками", "сосисках",
    ],
    "шпикачк": [
        "шпикачки", "шпикачка", "шпикачек",
    ],
    "сардельк": [
        "сарделька", "сардельки", "сарделек",
        "сарделькой", "сардельками",
    ],
    "ветчин": [
        "ветчина", "ветчины", "ветчине",
        "ветчину", "ветчиной",
    ],
}


def expand_morpho(word: str) -> list[str]:
    """Возвращает список всех словоформ для слова, если нашли корень в словаре."""
    w = word.lower().strip()
    for root, forms in MORPHO_MAP.items():
        # Если слово совпадает с одной из форм — возвращаем все формы
        if w in [f.lower() for f in forms] or w.startswith(root):
            return list(set(forms + [w]))
    return [w]


def parse_queries(raw: str) -> list[str]:
    """Разбивает строку по запятым/точкам с запятой, убирает пустые."""
    parts = re.split(r"[,;]+", raw)
    result = []
    for p in parts:
        p = p.strip()
        if p:
            result.append(p)
    return result or [raw.strip()]


def build_search_variants(query: str) -> list[str]:
    """
    Для каждого слова в запросе собирает морфологические варианты,
    возвращает список уникальных поисковых запросов.
    """
    words = query.lower().split()
    if not words:
        return [query]

    # Расширяем каждое слово морфологически
    expanded_words = [expand_morpho(w) for w in words]

    # Если у какого-то слова несколько форм — генерируем комбинации
    # Но ограничиваем до разумного числа запросов
    variants = set()
    base = " ".join(words)
    variants.add(base)

    # Для каждого слова с формами добавляем варианты с заменой
    for i, forms in enumerate(expanded_words):
        if len(forms) > 1:
            for form in forms:
                new_words = words[:i] + [form] + words[i+1:]
                variants.add(" ".join(new_words))

    return list(variants)[:8]  # Не более 8 вариантов на запрос


# ──────────────────────────────────────────────
# Handler
# ──────────────────────────────────────────────

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
    raw_query = params.get("query", "").strip()
    marketplace = params.get("marketplace", "all")

    # Разбиваем на несколько брендов
    brands = parse_queries(raw_query)

    all_results = []
    all_errors = []
    seen_ids = set()

    today = datetime.date.today().isoformat()

    for brand in brands:
        # Получаем все морфологические варианты для этого бренда
        variants = build_search_variants(brand)

        brand_results = []
        for variant in variants:
            if marketplace in ("wb", "all"):
                items, err = search_wildberries(variant, brand)
                for item in items:
                    if item["id"] not in seen_ids:
                        seen_ids.add(item["id"])
                        brand_results.append(item)
                if err:
                    all_errors.append(f"WB ({variant}): {err}")

            if marketplace in ("ozon", "all"):
                items, err = search_ozon(variant, brand)
                for item in items:
                    if item["id"] not in seen_ids:
                        seen_ids.add(item["id"])
                        brand_results.append(item)
                if err:
                    all_errors.append(f"Ozon ({variant}): {err}")

        all_results.extend(brand_results)

    # Сортируем: критические сначала
    risk_order = {"critical": 0, "high": 1, "medium": 2, "low": 3}
    all_results.sort(key=lambda x: risk_order.get(x.get("riskLevel", "low"), 3))

    return {
        "statusCode": 200,
        "headers": cors_headers,
        "body": json.dumps({
            "results": all_results,
            "total": len(all_results),
            "brands": brands,
            "query": raw_query,
            "errors": all_errors,
            "date": today,
        }, ensure_ascii=False),
    }


# ──────────────────────────────────────────────
# Wildberries
# ──────────────────────────────────────────────

def fetch_json(url: str, headers: dict, timeout: int = 15):
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8"))


def search_wildberries(query: str, brand_query: str):
    encoded = urllib.parse.quote(query)
    today = datetime.date.today().isoformat()

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

    products = (
        data.get("data", {}).get("products", [])
        or data.get("search_result", {}).get("products", [])
        or []
    )

    # Preset-редирект WB
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
    for p in products[:20]:
        name = p.get("name", "")
        brand = p.get("brand", "")
        supplier = p.get("supplier", "")
        article = str(p.get("id", ""))
        price_raw = p.get("salePriceU", 0) or p.get("priceU", 0)
        price = price_raw // 100 if price_raw else 0
        rating = p.get("reviewRating", 0)
        feedbacks = p.get("feedbacks", 0)

        risk = assess_risk(name, brand, brand_query)

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
            "searchQuery": query,
            "brandQuery": brand_query,
            "detectedAt": today,
            "status": "new",
            "url": f"https://www.wildberries.ru/catalog/{article}/detail.aspx",
        })

    return items, None


# ──────────────────────────────────────────────
# Ozon
# ──────────────────────────────────────────────

def search_ozon(query: str, brand_query: str):
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

    catalog = data.get("catalog", {}) or {}
    products = catalog.get("products", [])

    if not products:
        widget_states = data.get("widgetStates", {})
        for key, val in widget_states.items():
            if "searchResultsV2" in key or "tileGrid" in key:
                try:
                    inner = json.loads(val) if isinstance(val, str) else val
                    items_raw = inner.get("items", [])
                    for item in items_raw:
                        main = item.get("mainState", [])
                        name, article, price_val, brand = "", "", 0, ""
                        for state in main:
                            atom = state.get("atom", {})
                            if state.get("id") == "name":
                                name = atom.get("label", "")
                            if state.get("id") == "price":
                                price_str = atom.get("price", "0")
                                if isinstance(price_str, str):
                                    price_str = price_str.replace("\u00a0", "").replace(" ", "").replace("₽", "").strip()
                                    try:
                                        price_val = int(float(price_str))
                                    except Exception:
                                        price_val = 0
                            if state.get("id") == "brand":
                                brand = atom.get("label", "")
                        article = str(item.get("sku", item.get("id", "")))
                        if name:
                            products.append({
                                "name": name, "brand": brand,
                                "id": article, "price_val": price_val,
                            })
                except Exception:
                    continue
            if products:
                break

    items = []
    for p in products[:20]:
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

        risk = assess_risk(name, brand, brand_query)

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
            "searchQuery": query,
            "brandQuery": brand_query,
            "detectedAt": today,
            "status": "new",
            "url": f"https://www.ozon.ru/product/{article}/",
        })

    return items, None


# ──────────────────────────────────────────────
# Оценка риска
# ──────────────────────────────────────────────

def assess_risk(name: str, brand: str, query: str) -> str:
    name_lower = name.lower()
    brand_lower = brand.lower()
    query_lower = query.lower()

    # Расширяем запрос морфологически для проверки совпадений
    all_variants = build_search_variants(query_lower)

    # Точное совпадение хотя бы одного варианта
    for v in all_variants:
        if v in name_lower or v in brand_lower:
            return "critical"

    # Частичное совпадение по словам
    query_words = [w for w in query_lower.split() if len(w) > 2]
    word_forms = []
    for w in query_words:
        word_forms.extend(expand_morpho(w))

    form_matches = sum(1 for f in word_forms if f in name_lower or f in brand_lower)
    if form_matches >= len(query_words):
        return "high"
    if form_matches > 0:
        return "medium"

    return "low"
