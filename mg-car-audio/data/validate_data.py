#!/usr/bin/env python3
"""Validate the MG Car Audio import files before uploading them to Shopify.

    python3 mg-car-audio/data/validate_data.py               # structure checks only
    python3 mg-car-audio/data/validate_data.py --check-urls  # also fetch every image URL (needs network)

Checks products.csv, products-no-metafields.csv and redirects.csv. Exits with status 1 on any error.
"""

import csv
import os
import re
import sys
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
sys.dont_write_bytecode = True  # keep data/ free of __pycache__
sys.path.insert(0, HERE)
from build_products import TEMPLATE_HEADER, METAFIELD_COLUMNS, COLLECTIONS  # noqa: E402

REQUIRED_SERVICE_PRICES = {
    "carplay-installation-bmw": "350.00",
    "android-auto-installation-bmw-id7": "299.00",
    "android-radio-installation": "150.00",
    "bmw-idrive7-video-in-motion": "149.00",
    "bmw-japan-to-europe-conversion": "450.00",
    "booking-deposit": "50.00",
}
PAGES = {"about", "contact", "get-a-quote", "book-a-fitting", "carplay-installation", "bmw-carplay",
         "gallery", "faq", "warranty-returns", "shipping", "services"}
EXTRA_TAGS = {"demo-placeholder", "wireless-carplay", "android-auto", "japan-to-europe", "booking-deposit"}
HANDLE_RE = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")
PRICE_RE = re.compile(r"^\d+\.\d{2}$")
FITTED_RE = re.compile(r"^€\d+$")
SCREEN_RE = re.compile(r'^\d+(\.\d+)?"$')

errors = []
warnings = []


def err(msg):
    errors.append(msg)


def read_csv(path):
    raw = open(path, "rb").read()
    if raw.startswith(b"\xef\xbb\xbf"):
        warnings.append("%s starts with a UTF-8 BOM (Shopify accepts it, but it isn't needed)" % path)
    raw.decode("utf-8")  # raises if not UTF-8
    with open(path, encoding="utf-8-sig", newline="") as f:
        return list(csv.reader(f))


def check_products(path, with_metafields):
    rows = read_csv(path)
    header, data = rows[0], rows[1:]
    expected = TEMPLATE_HEADER + (list(METAFIELD_COLUMNS.values()) if with_metafields else [])
    name = os.path.basename(path)
    if header != expected:
        err("%s: header does not match Shopify's 57-column template%s" %
            (name, " + metafield columns" if with_metafields else ""))
        return {}
    col = {h: i for i, h in enumerate(header)}
    products = {}
    order = []
    for n, row in enumerate(data, start=2):
        if len(row) != len(header):
            err("%s line %d: %d cells, expected %d" % (name, n, len(row), len(header)))
            continue
        g = lambda h: row[col[h]]  # noqa: E731
        handle = g("URL handle")
        if not handle:
            err("%s line %d: empty URL handle" % (name, n))
            continue
        if not HANDLE_RE.match(handle):
            err("%s line %d: handle %r is not lowercase-hyphenated" % (name, n, handle))
        if handle not in products:
            if not g("Title"):
                err("%s line %d: first row of %s has no Title" % (name, n, handle))
            products[handle] = dict(first=row, variants=[], images=[], line=n)
            order.append(handle)
        elif g("Title"):
            err("%s line %d: Title repeated on a later row of %s" % (name, n, handle))
        p = products[handle]
        is_variant = bool(g("Option1 value") or g("Price"))
        if is_variant:
            p["variants"].append(row)
            price = g("Price")
            if not PRICE_RE.match(price) or float(price) <= 0:
                err("%s line %d: %s price %r is not a positive number with 2 decimals" % (name, n, handle, price))
            for h in ("Charge tax", "Requires shipping"):
                if g(h) not in ("TRUE", "FALSE"):
                    err("%s line %d: %s %r must be TRUE or FALSE" % (name, n, h, g(h)))
            if g("Continue selling when out of stock") not in ("DENY", "CONTINUE"):
                err("%s line %d: bad inventory policy %r" % (name, n, g("Continue selling when out of stock")))
            if g("Inventory tracker") not in ("", "shopify"):
                err("%s line %d: bad inventory tracker %r" % (name, n, g("Inventory tracker")))
            if g("Inventory tracker") == "shopify" and not g("Inventory quantity").isdigit():
                err("%s line %d: tracked variant without a numeric inventory quantity" % (name, n))
            if not g("SKU"):
                err("%s line %d: variant of %s has no SKU" % (name, n, handle))
        if g("Product image URL"):
            url = g("Product image URL")
            if not url.startswith("https://"):
                err("%s line %d: image URL must be https" % (name, n))
            if not g("Image alt text").strip():
                err("%s line %d: image without alt text (%s)" % (name, n, handle))
            if not g("Image position").isdigit():
                err("%s line %d: image without a numeric position" % (name, n))
            p["images"].append((int(g("Image position") or 0), url))
        if not is_variant and not g("Product image URL"):
            err("%s line %d: row is neither a variant nor an image row" % (name, n))

    skus = {}
    counts = {c: 0 for c in COLLECTIONS}
    for handle in order:
        p = products[handle]
        first = p["first"]
        g = lambda h: first[col[h]]  # noqa: E731
        n = p["line"]
        if g("Published on online store") != "TRUE" or g("Status") != "Active":
            err("%s: %s must be Published TRUE and Status Active" % (name, handle))
        if not p["variants"]:
            err("%s: %s has no variant rows" % (name, handle))
            continue
        # Options consistent: one option (Option1) on every product here, values unique.
        opt_name = g("Option1 name")
        if not opt_name:
            err("%s: %s has no Option1 name" % (name, handle))
        values = [v[col["Option1 value"]] for v in p["variants"]]
        if any(not v for v in values):
            err("%s: %s has a variant without Option1 value" % (name, handle))
        if len(set(values)) != len(values):
            err("%s: %s has duplicate option values" % (name, handle))
        if opt_name == "Title" and values != ["Default Title"]:
            err("%s: %s uses Option1 name 'Title' but isn't a single Default Title variant" % (name, handle))
        for v in p["variants"][1:]:
            if v[col["Option1 name"]] or v[col["Option2 value"]] or v[col["Option3 value"]]:
                err("%s: %s later variant rows must not repeat option names or add options" % (name, handle))
        for v in p["variants"]:
            sku = v[col["SKU"]]
            if sku in skus:
                err("%s: duplicate SKU %s (%s and %s)" % (name, sku, skus[sku], handle))
            skus[sku] = handle
        positions = sorted(pos for pos, _ in p["images"])
        if positions != list(range(1, len(positions) + 1)):
            err("%s: %s image positions %s are not 1..n" % (name, handle, positions))
        if not p["images"]:
            err("%s: %s has no image" % (name, handle))
        # SEO
        if not g("SEO title") or len(g("SEO title")) > 70:
            err("%s: %s SEO title missing or over 70 chars (%d)" % (name, handle, len(g("SEO title"))))
        if not g("SEO description") or len(g("SEO description")) > 155:
            err("%s: %s SEO description missing or over 155 chars (%d)" % (name, handle, len(g("SEO description"))))
        body = g("Description")
        for needle in ("What's included", "Dublin 12"):
            if needle not in body:
                err("%s: %s description is missing %r" % (name, handle, needle))
        if not (("Compatibility" in body) or ("Good to know" in body) or ("Please note" in body)):
            err("%s: %s description has no compatibility / good-to-know notes" % (name, handle))
        # Tags and types
        tags = [t.strip() for t in g("Tags").split(",") if t.strip()]
        for t in tags:
            if t in COLLECTIONS:
                counts[t] += 1
            elif not (t.startswith("make:") or t.startswith("type:") or t in EXTRA_TAGS):
                err("%s: %s has unknown tag %r" % (name, handle, t))
        is_install = g("Type") == "Installation"
        ship_values = {v[col["Requires shipping"]] for v in p["variants"]}
        if is_install:
            if g("Vendor") != "MG Car Audio":
                err("%s: installation %s must have vendor MG Car Audio" % (name, handle))
            if ship_values != {"FALSE"}:
                err("%s: installation %s must have Requires shipping FALSE" % (name, handle))
            if "demo-placeholder" in tags:
                err("%s: installation %s should not be tagged demo-placeholder" % (name, handle))
        else:
            if "demo-placeholder" not in tags:
                err("%s: hardware %s must be tagged demo-placeholder" % (name, handle))
            if ship_values != {"TRUE"}:
                err("%s: hardware %s must have Requires shipping TRUE" % (name, handle))
        if handle in REQUIRED_SERVICE_PRICES:
            prices = {v[col["Price"]] for v in p["variants"]}
            if prices != {REQUIRED_SERVICE_PRICES[handle]}:
                err("%s: %s must be priced %s on every variant, found %s" %
                    (name, handle, REQUIRED_SERVICE_PRICES[handle], sorted(prices)))
            if not is_install:
                err("%s: %s must have product type Installation" % (name, handle))
        # Metafields
        if with_metafields:
            for key in ("car_make", "car_model"):
                cell = g(METAFIELD_COLUMNS[key])
                if cell:
                    items = cell.split("\n")
                    if any(i != i.strip() or not i for i in items):
                        err("%s: %s %s list has blank or padded values" % (name, handle, key))
                    if len(set(items)) != len(items):
                        err("%s: %s %s list has duplicates" % (name, handle, key))
            makes = g(METAFIELD_COLUMNS["car_make"]).split("\n") if g(METAFIELD_COLUMNS["car_make"]) else []
            for m in makes:
                if m != "Universal" and "make:%s" % m not in tags:
                    err("%s: %s car_make %r has no matching make: tag" % (name, handle, m))
            fp = g(METAFIELD_COLUMNS["fitted_price"])
            if fp and not FITTED_RE.match(fp):
                err("%s: %s fitted_price %r should look like €350" % (name, handle, fp))
            ss = g(METAFIELD_COLUMNS["screen_size"])
            if ss and not SCREEN_RE.match(ss):
                err("%s: %s screen_size %r should look like 10.25\"" % (name, handle, ss))
        for v in p["variants"][1:]:
            for h in METAFIELD_COLUMNS.values() if with_metafields else []:
                if v[col[h]]:
                    err("%s: %s metafield values must be on the first row only" % (name, handle))

    for h in REQUIRED_SERVICE_PRICES:
        if h not in products:
            err("%s: required product %s is missing" % (name, h))
    if not 4 <= counts["best-sellers"] <= 6:
        err("%s: best-sellers has %d products, expected 4-6" % (name, counts["best-sellers"]))
    if counts["carplay-android-auto"] < 8:
        err("%s: carplay-android-auto has only %d products" % (name, counts["carplay-android-auto"]))
    return dict(products=products, col=col, counts=counts)


def check_redirects(path, product_handles):
    rows = read_csv(path)
    name = os.path.basename(path)
    if rows[0] != ["Redirect from", "Redirect to"]:
        err("%s: header must be exactly Redirect from,Redirect to" % name)
        return 0
    seen = set()
    for n, row in enumerate(rows[1:], start=2):
        if len(row) != 2:
            err("%s line %d: expected 2 cells" % (name, n))
            continue
        src, dst = row
        if not src.startswith("/") or src != src.strip() or " " in src:
            err("%s line %d: bad source path %r" % (name, n, src))
        if src in seen:
            err("%s line %d: duplicate source %s" % (name, n, src))
        seen.add(src)
        if src == dst:
            err("%s line %d: redirects to itself" % (name, n))
        m = re.match(r"^/(products|collections|pages)/([a-z0-9-]+)$", dst)
        if m:
            kind, handle = m.groups()
            if kind == "products" and handle not in product_handles:
                err("%s line %d: target product %s is not in products.csv" % (name, n, handle))
            if kind == "collections" and handle != "all" and handle not in COLLECTIONS:
                err("%s line %d: target collection %s is not one of the 12 collections" % (name, n, handle))
            if kind == "pages" and handle not in PAGES:
                err("%s line %d: target page %s is not in docs/SETUP.md's page list" % (name, n, handle))
        elif dst not in ("/", "/cart", "/search"):
            err("%s line %d: unexpected target %r" % (name, n, dst))
    return len(rows) - 1


def check_urls(products, col):
    urls = sorted({u for p in products.values() for _, u in p["images"]})
    for url in urls:
        try:
            req = urllib.request.Request(url, method="HEAD", headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=30) as r:
                status = r.status
                ctype = r.headers.get("Content-Type", "")
        except Exception as e:  # noqa: BLE001
            err("image %s: %s" % (url, e))
            continue
        if status != 200 or not ctype.startswith("image/"):
            err("image %s: HTTP %s %s" % (url, status, ctype))
        else:
            print("  200 %-10s %s" % (ctype, url))
    return len(urls)


if __name__ == "__main__":
    result = check_products(os.path.join(HERE, "products.csv"), True)
    check_products(os.path.join(HERE, "products-no-metafields.csv"), False)
    handles = set(result.get("products", {}).keys())
    n_redirects = check_redirects(os.path.join(HERE, "redirects.csv"), handles)
    if "--check-urls" in sys.argv and result:
        print("Checking image URLs...")
        check_urls(result["products"], result["col"])
    if result:
        print("products.csv: %d products, %d variants" %
              (len(handles), sum(len(p["variants"]) for p in result["products"].values())))
        print("collection tag counts: %s" % ", ".join("%s=%d" % kv for kv in result["counts"].items()))
    print("redirects.csv: %d redirects" % n_redirects)
    for w in warnings:
        print("WARNING:", w)
    if errors:
        for e in errors:
            print("ERROR:", e)
        sys.exit(1)
    print("OK: no errors")
