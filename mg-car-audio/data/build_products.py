#!/usr/bin/env python3
"""Build data/products.csv (Shopify product import) for the MG Car Audio demo store.

Run from anywhere:  python3 mg-car-audio/data/build_products.py
Then validate:      python3 mg-car-audio/data/validate_data.py

Writes two files next to this script:
  products.csv                  Shopify's current 57-column product template + 4 product metafield columns
  products-no-metafields.csv    Same products without the metafield columns (fallback, see docs/SETUP.md §5)

Column names and order are copied from Shopify's current product_template.csv (the 57-column version
with "URL handle", "Description", "Option1 Linked To" and unit-price columns). Metafield columns use
the header format Shopify documents: "<name> (product.metafields.<namespace>.<key>)".
List metafields (list.single_line_text_field) hold one value per line inside the cell, which is how
Shopify's own product export writes them. Edit this script, not the CSV, then re-run it.

PLACEHOLDERS: every hardware price, spec line and "fitted from" price on a product tagged
`demo-placeholder` is invented for the demo. Service prices are MG's real prices (see PRICE_SOURCES).
"""

import csv
import os

HERE = os.path.dirname(os.path.abspath(__file__))

# Shopify's current product CSV template, in order (57 columns).
TEMPLATE_HEADER = [
    "Title", "URL handle", "Description", "Vendor", "Product category", "Type", "Tags",
    "Published on online store", "Status", "SKU", "Barcode",
    "Option1 name", "Option1 value", "Option1 Linked To",
    "Option2 name", "Option2 value", "Option2 Linked To",
    "Option3 name", "Option3 value", "Option3 Linked To",
    "Price", "Compare-at price", "Cost per item", "Charge tax", "Tax code",
    "Unit price total measure", "Unit price total measure unit",
    "Unit price base measure", "Unit price base measure unit",
    "Inventory tracker", "Inventory quantity", "Continue selling when out of stock",
    "Weight value (grams)", "Weight unit for display", "Requires shipping", "Fulfillment service",
    "Product image URL", "Image position", "Image alt text", "Variant image URL", "Gift card",
    "SEO title", "SEO description", "Color (product.metafields.shopify.color-pattern)",
    "Google Shopping / Google product category", "Google Shopping / Gender",
    "Google Shopping / Age group", "Google Shopping / Manufacturer part number (MPN)",
    "Google Shopping / Ad group name", "Google Shopping / Ads labels",
    "Google Shopping / Condition", "Google Shopping / Custom product",
    "Google Shopping / Custom label 0", "Google Shopping / Custom label 1",
    "Google Shopping / Custom label 2", "Google Shopping / Custom label 3",
    "Google Shopping / Custom label 4",
]

# Product metafields from docs/BUILD_SPEC.md §8. Definitions must exist in admin BEFORE import.
METAFIELD_COLUMNS = {
    "car_make": "Car make (product.metafields.custom.car_make)",          # list.single_line_text_field
    "car_model": "Car model (product.metafields.custom.car_model)",       # list.single_line_text_field
    "screen_size": "Screen size (product.metafields.custom.screen_size)", # single_line_text_field
    "fitted_price": "Fitted price (product.metafields.custom.fitted_price)",  # single_line_text_field
}

# Shopify Standard Product Taxonomy (checked against Shopify/product-taxonomy v2025-09 and main).
CAT_AV = "Vehicles & Parts > Vehicle Parts & Accessories > Motor Vehicle Electronics > Motor Vehicle A/V Players & In-Dash Systems"
CAT_ELECTRONICS = "Vehicles & Parts > Vehicle Parts & Accessories > Motor Vehicle Electronics"
CAT_BACKUP_CAM = "Vehicles & Parts > Vehicle Parts & Accessories > Motor Vehicle Electronics > Motor Vehicle Parking Cameras > Backup Cameras"

# MG's own images on their current Wix site (all returned HTTP 200 on 25 Sep 2026).
WIX = "https://static.wixstatic.com/media/"
IMG = {
    "bmw_carplay": WIX + "c67c38_a37dca29310e41c9a3845bd6232bfa53~mv2.png",
    "audi_carplay": WIX + "c67c38_499cf02703c84716bc97648b5d9f121d~mv2.png",
    "android_auto_dash": WIX + "c67c38_025ff690eb284fd08df1b0ac249caa62~mv2.png",
    # Same picture as android_auto_dash, uploaded by MG for its BMW Android Auto (ID7) service page.
    "bmw_android_auto": WIX + "c67c38_a8ae81884fca446a99f1d17b50a9fc1c~mv2.png",
    "single_din_radio": WIX + "c67c38_08d9d90c4e7e4fbb8a59abd6019c2342~mv2.jpg",
    "dash_radio": WIX + "c67c38_5bc2192defd241cfa481482e85e323f4~mv2.jpg",
    "bmw_j2e": WIX + "c67c38_ecaab01d8d9247cf9eb5fdb58b84d3fd~mv2.png",
    "mercedes_j2e": WIX + "c67c38_09bdf2daf636454e9f123d55abeed61e~mv2.png",
    "vw_j2e": WIX + "c67c38_6cbeac468066461db525fae46c3c1981~mv2.png",
    "radio_frequency": WIX + "c67c38_e66ffa12a2d346d589b8e0995672474c~mv2.png",
    "showroom": WIX + "c67c38_9f66ce5182fa4d39be339a5217ee9483~mv2.jpeg",
}

ALT = {
    "bmw_carplay": "BMW widescreen iDrive display showing Apple CarPlay with maps, music and messages",
    "audi_carplay": "Audi dashboard screen running Apple CarPlay, with an iPhone held in front of it",
    "android_auto_dash": "Widescreen dashboard display running Android Auto with Google Maps and Spotify",
    "bmw_android_auto": "Widescreen dashboard display running Android Auto with Google Maps and Spotify",
    "single_din_radio": "Standard single-DIN car radio, the kind of unit an Android touchscreen replaces",
    "dash_radio": "Car centre console with a head unit fitted between the air vents",
    "bmw_j2e": "MG Car Audio graphic: BMW Japan-to-Europe conversion, from Japanese to European settings",
    "mercedes_j2e": "MG Car Audio graphic: Mercedes-Benz Japan-to-Europe conversion services",
    "vw_j2e": "MG Car Audio graphic: Volkswagen Japan-to-Europe conversion of radio, maps and settings",
    "radio_frequency": "MG Car Audio graphic: radio frequency change from the Japanese to the Irish FM band",
    "showroom": "MG Car Audio showroom in Dublin 12, with head units, speakers and accessories on the wall",
}

COLLECTIONS = [
    "carplay-android-auto", "android-radios", "screen-upgrades", "speakers", "subwoofers",
    "amplifiers", "dashcams", "reverse-cameras", "accessories", "installation-services",
    "gift-vouchers", "best-sellers",
]

# Where each real price comes from (checked 25 Sep 2026).
PRICE_SOURCES = {
    "carplay-installation-bmw": "BMW Apple CarPlay €350, mgcaraudio.ie/book-online (spec §5)",
    "android-auto-installation-bmw-id7": "€299, 1 hr, mgcaraudio.ie/book-online (spec §5)",
    "android-radio-installation": "€150, 1 hr 30 min, mgcaraudio.ie/book-online (spec §5)",
    "bmw-idrive7-video-in-motion": "€149, mgcaraudio.ie/book-online (spec §5)",
    "bmw-japan-to-europe-conversion": "€450, 2 hr, mgcaraudio.ie/book-online (spec §5)",
    "booking-deposit": "€50, mgcaraudio.ie/book-online (spec §5); terms from /service-page/customer-deposit-to-book-the-slot",
    "mercedes-japan-to-europe-conversion": "€450, 2 hr, mgcaraudio.ie/service-page/mercedes-japanese-to-european-spec-conversion (spec §5 says price on request: CONFIRM)",
    "vw-japan-to-europe-conversion": "€350, 2 hr, mgcaraudio.ie/service-page/vw-japan-to-europe-conversion (spec §5 says price on request: CONFIRM)",
    "radio-frequency-conversion-japan-to-europe": "€150, 1 hr, mgcaraudio.ie/service-page/radio-frequency-conversion-japan-to-europe (spec §5 says price on request: CONFIRM)",
    "reverse-camera-installation": "BMW €750, Audi €699, VW €650, Honda €399, mgcaraudio.ie/category/reverse-camera-installation-service",
}


# ---------------------------------------------------------------------------------------------
# Copy helpers
# ---------------------------------------------------------------------------------------------

def ul(items):
    return "<ul>" + "".join("<li>%s</li>" % i for i in items) + "</ul>"


def section(title, body):
    return "<h3>%s</h3>%s" % (title, body)


CTA_HARDWARE = section(
    "Fitted at our Dublin 12 workshop",
    "<p>Want it fitted? Our technicians install it at our workshop in Ballymount, Dublin 12, "
    "with a neat, factory-style finish and everything tested before you drive away. Book a slot online "
    "with a <strong>€50 deposit</strong> (it comes off your final bill), or send us your reg and a photo "
    "of your dash on WhatsApp and we'll confirm it suits your car first.</p>",
)

CTA_SERVICE = section(
    "Fitted at our Dublin 12 workshop",
    "<p>Book your slot online and we'll look after the rest at our workshop in Ballymount, Dublin 12 "
    "(Mon–Fri 9:30am–7pm, Sat 11am–7pm, Sun by appointment). A <strong>€50 deposit</strong> secures your "
    "slot and comes off your final bill. Not sure this is the right service for your car? Send us your reg "
    "and a photo of your dash on WhatsApp and we'll point you to the right one.</p>",
)


def body(lead, *parts):
    return "<p>%s</p>" % lead + "".join(parts)


# ---------------------------------------------------------------------------------------------
# Products
# ---------------------------------------------------------------------------------------------
# Each product: handle, title, type, vendor, category, tags, body, seo_title, seo_description,
# option_name, variants [(value, price, sku)], images [key], shipping (bool), weight_g,
# inventory (int or None), metafields {car_make: [..], car_model: [..], screen_size, fitted_price}

HARDWARE = "demo-placeholder"

PRODUCTS = [
    # ---------------- Hardware: demo placeholders (own-label names, invented prices) ----------------
    dict(
        handle="wireless-carplay-interface-bmw-nbt-evo",
        title="Wireless CarPlay & Android Auto Interface – BMW NBT / NBT EVO",
        type="CarPlay Interface",
        category=CAT_AV,
        tags=["carplay-android-auto", "best-sellers", "make:BMW", "type:carplay-interface",
              "wireless-carplay", "android-auto", HARDWARE],
        body=body(
            "<strong>Wireless Apple CarPlay and Android Auto on your BMW's original iDrive screen.</strong> "
            "No new screen and no cutting of factory wiring, and the standard iDrive menus are always one "
            "press away.",
            section("Why drivers choose it", ul([
                "Your phone connects wirelessly a few seconds after you start the car",
                "Full-screen maps, music, calls and messages on the factory 8.8\" or 10.25\" display",
                "Control it with the iDrive controller, the touchscreen (where fitted) and your steering wheel buttons",
                "Keeps your factory reversing camera and parking sensor display",
                "Calls come through the car's own speakers, with a dedicated microphone for clear audio",
            ])),
            section("What's included", ul([
                "CarPlay and Android Auto interface module",
                "Plug-in harness for your iDrive version (choose it above)",
                "External microphone",
                "USB socket for wired use and charging",
            ])),
            section("Compatibility", ul([
                "BMW iDrive NBT (approx. 2013–2016) and NBT EVO ID4, ID5 and ID6 (approx. 2016–2019)",
                "F-series 1, 2, 3, 4 and 5 Series, X1, X3 and X5 with the factory navigation screen",
                "Many NBT EVO cars can have CarPlay switched on in software instead. We'll tell you if yours can before you buy",
                "Not sure which iDrive you have? Send us a photo of your screen and we'll tell you in minutes",
            ])),
            CTA_HARDWARE,
        ),
        seo_title="Wireless CarPlay for BMW NBT & NBT EVO | MG Car Audio",
        seo_description="Wireless Apple CarPlay and Android Auto on your BMW's factory iDrive NBT or NBT EVO screen. Keeps iDrive, camera and wheel controls. Fitted in Dublin 12.",
        option_name="iDrive system",
        variants=[
            ("NBT (approx. 2013–2016)", "249.00", "MG-IF-BMW-NBT"),
            ("NBT EVO ID4 (approx. 2016–2017)", "249.00", "MG-IF-BMW-EVO4"),
            ("NBT EVO ID5 / ID6 (approx. 2017–2019)", "249.00", "MG-IF-BMW-EVO56"),
        ],
        images=["bmw_carplay"],
        shipping=True, weight_g=450, inventory=10,
        metafields=dict(
            car_make=["BMW"],
            car_model=["1 Series (F20/F21)", "2 Series (F22/F23)", "3 Series (F30/F31)",
                       "4 Series (F32/F33/F36)", "5 Series (F10/F11)", "X1 (F48)", "X3 (F25)", "X5 (F15)"],
            screen_size="",
            fitted_price="€350",
        ),
    ),
    dict(
        handle="wireless-carplay-interface-audi-mmi-3g",
        title="Wireless CarPlay & Android Auto Interface – Audi MMI 3G / 3G+",
        type="CarPlay Interface",
        category=CAT_AV,
        tags=["carplay-android-auto", "make:Audi", "type:carplay-interface", "wireless-carplay",
              "android-auto", HARDWARE],
        body=body(
            "<strong>Bring wireless Apple CarPlay and Android Auto to your Audi's MMI screen</strong> and keep "
            "the factory look, the MMI dial and your steering wheel buttons exactly as they are.",
            section("Why drivers choose it", ul([
                "Wireless CarPlay and Android Auto on the original fixed or pop-up MMI screen",
                "Scroll and select with the MMI rotary dial you already know",
                "Switch back to MMI navigation, radio and car settings at any time",
                "Your reversing camera and parking display keep working as before",
                "Hands-free calls, Siri and Google Assistant through the car's speakers",
            ])),
            section("What's included", ul([
                "CarPlay and Android Auto interface module",
                "Plug-in harness for MMI 3G or MMI 3G+ (choose it above)",
                "External microphone",
                "USB lead for wired use and charging",
            ])),
            section("Compatibility", ul([
                "Audi MMI 3G (approx. 2009–2012) and MMI 3G+ (approx. 2012–2016)",
                "A4 (B8), A5 (8T), A6 (C7), A7 (4G), Q5 (8R) and Q7 (4L), depending on the screen fitted",
                "MMI 2G and newer MIB-based Audis need a different kit. Ask us and we'll quote the right one",
                "Send us your reg and a photo of your MMI screen and we'll confirm the fit before you buy",
            ])),
            CTA_HARDWARE,
        ),
        seo_title="Wireless CarPlay for Audi MMI 3G & 3G+ | MG Car Audio",
        seo_description="Wireless Apple CarPlay and Android Auto for Audi MMI 3G and 3G+ screens. Keeps the MMI dial, camera and wheel buttons. Supplied and fitted in Dublin 12.",
        option_name="MMI system",
        variants=[
            ("MMI 3G (approx. 2009–2012)", "279.00", "MG-IF-AUDI-3G"),
            ("MMI 3G+ (approx. 2012–2016)", "279.00", "MG-IF-AUDI-3GP"),
        ],
        images=["audi_carplay"],
        shipping=True, weight_g=450, inventory=10,
        metafields=dict(
            car_make=["Audi"],
            car_model=["A4 (B8)", "A5 (8T)", "A6 (C7)", "A7 (4G)", "Q5 (8R)", "Q7 (4L)"],
            screen_size="",
            fitted_price="€399",
        ),
    ),
    dict(
        handle="wireless-carplay-interface-mercedes-ntg",
        title="Wireless CarPlay & Android Auto Interface – Mercedes-Benz NTG 4.5 / NTG 5",
        type="CarPlay Interface",
        category=CAT_AV,
        tags=["carplay-android-auto", "make:Mercedes-Benz", "type:carplay-interface",
              "wireless-carplay", "android-auto", HARDWARE],
        body=body(
            "<strong>Wireless Apple CarPlay and Android Auto on your Mercedes-Benz factory screen</strong>, "
            "controlled with the COMAND dial or touchpad you already use every day.",
            section("Why drivers choose it", ul([
                "Wireless CarPlay and Android Auto on the original Audio 20 or COMAND Online display",
                "Works with the rotary controller, touchpad and steering wheel buttons",
                "Original Mercedes menus, radio and car settings stay one press away",
                "Keeps your factory reversing camera and parking display",
                "Clear hands-free calls through the car's own speakers",
            ])),
            section("What's included", ul([
                "CarPlay and Android Auto interface module",
                "Plug-in harness for NTG 4.5/4.7 or NTG 5/5.1 (choose it above)",
                "External microphone",
                "USB lead for wired use and charging",
            ])),
            section("Compatibility", ul([
                "Mercedes-Benz NTG 4.5 / 4.7 (approx. 2012–2015) and NTG 5 / 5.1 (approx. 2014–2019)",
                "A-Class (W176), B-Class (W246), C-Class (W204 facelift and W205), CLA (C117), GLA (X156), E-Class (W212), GLC (X253), ML/GLE (W166)",
                "Many NTG 5.5 and MBUX cars already offer smartphone integration. We'll check yours first",
                "Send us your reg and a photo of your screen and we'll confirm the fit before you buy",
            ])),
            CTA_HARDWARE,
        ),
        seo_title="Wireless CarPlay for Mercedes NTG 4.5 & NTG 5 | MG Car Audio",
        seo_description="Wireless Apple CarPlay and Android Auto for Mercedes-Benz NTG 4.5 and NTG 5 screens. Keeps COMAND controls and camera. Supplied and fitted in Dublin 12.",
        option_name="Mercedes system",
        variants=[
            ("NTG 4.5 / 4.7 (approx. 2012–2015)", "279.00", "MG-IF-MB-NTG45"),
            ("NTG 5 / 5.1 (approx. 2014–2019)", "279.00", "MG-IF-MB-NTG5"),
        ],
        images=["android_auto_dash"],
        shipping=True, weight_g=450, inventory=10,
        metafields=dict(
            car_make=["Mercedes-Benz"],
            car_model=["A-Class (W176)", "B-Class (W246)", "C-Class (W204)", "C-Class (W205)",
                       "CLA (C117)", "GLA (X156)", "E-Class (W212)", "GLC (X253)", "ML / GLE (W166)"],
            screen_size="",
            fitted_price="€399",
        ),
    ),
    dict(
        handle="wireless-carplay-interface-vw-mib2",
        title="Wireless CarPlay & Android Auto Interface – Volkswagen MIB2",
        type="CarPlay Interface",
        category=CAT_AV,
        tags=["carplay-android-auto", "make:Volkswagen", "type:carplay-interface",
              "wireless-carplay", "android-auto", HARDWARE],
        body=body(
            "<strong>Cut the cable: wireless Apple CarPlay and Android Auto for Volkswagen MIB2 screens</strong>, "
            "with your touchscreen, steering wheel buttons and reversing camera working as they did from the factory.",
            section("Why drivers choose it", ul([
                "Wireless CarPlay and Android Auto on the original Composition Media or Discover Media screen",
                "Use the touchscreen and steering wheel buttons as normal",
                "Original VW radio, navigation and car settings stay available",
                "Keeps your factory reversing camera and parking display",
            ])),
            section("What's included", ul([
                "CarPlay and Android Auto interface module",
                "Plug-in harness for your MIB2 unit (choose it above)",
                "External microphone",
                "USB lead for wired use and charging",
            ])),
            section("Compatibility", ul([
                "Volkswagen MIB2 Composition Media and Discover Media units (approx. 2015–2020)",
                "Golf (Mk7 / 7.5), Passat (B8), Polo (AW), Tiguan (AD1), Touran (5T) and T-Roc (A1)",
                "Many MIB2 units already have App-Connect (wired CarPlay and Android Auto) or can have it switched on in software. We check your unit first, and if a software activation or a plug-in wireless adapter will do the job, we'll tell you",
                "Send us your reg and a photo of your screen and we'll confirm the fit before you buy",
            ])),
            CTA_HARDWARE,
        ),
        seo_title="Wireless CarPlay for VW MIB2 | MG Car Audio",
        seo_description="Wireless Apple CarPlay and Android Auto for VW MIB2 Composition and Discover Media screens. Keeps touch, camera and wheel controls. Fitted in Dublin 12.",
        option_name="MIB2 unit",
        variants=[
            ("Composition Media", "229.00", "MG-IF-VW-CM"),
            ("Discover Media", "229.00", "MG-IF-VW-DM"),
        ],
        images=["android_auto_dash"],
        shipping=True, weight_g=400, inventory=10,
        metafields=dict(
            car_make=["Volkswagen"],
            car_model=["Golf (Mk7)", "Passat (B8)", "Polo (AW)", "Tiguan (AD1)", "Touran (5T)", "T-Roc (A1)"],
            screen_size="",
            fitted_price="€329",
        ),
    ),
    dict(
        handle="android-screen-upgrade-bmw-f30-10-25",
        title="10.25\" Android Screen Upgrade – BMW 3 Series (F30) & 4 Series (F32)",
        type="Android Screen Upgrade",
        category=CAT_AV,
        tags=["carplay-android-auto", "screen-upgrades", "best-sellers", "make:BMW",
              "type:screen-upgrade", "wireless-carplay", "android-auto", HARDWARE],
        body=body(
            "<strong>Swap the standard iDrive display for a crisp 10.25\" widescreen</strong> with wireless "
            "Apple CarPlay and Android Auto built in, styled to sit exactly where the original screen was.",
            section("Why drivers choose it", ul([
                "10.25\" anti-glare touchscreen in an OEM-style frame",
                "Wireless CarPlay and Android Auto, plus Android apps for music and navigation",
                "Your original iDrive menus and car settings are still there when you need them",
                "Keeps the iDrive controller, steering wheel buttons and factory reversing camera",
            ])),
            section("What's included", ul([
                "10.25\" display unit with mounting bracket",
                "Plug-in harness for your iDrive version (choose it above)",
                "GPS antenna and external microphone",
                "USB lead for wired use and charging",
            ])),
            section("Compatibility", ul([
                "BMW 3 Series (F30/F31/F34) and 4 Series (F32/F33/F36)",
                "Cars with iDrive CIC (approx. 2012–2013), NBT (approx. 2013–2016) or NBT EVO (approx. 2016–2019)",
                "Cars with the small non-navigation screen: ask us, as a different harness may be needed",
                "Send us your reg and a photo of your dash and we'll confirm the fit before you buy",
            ])),
            CTA_HARDWARE,
        ),
        seo_title="BMW F30 10.25\" Android Screen with CarPlay | MG Car Audio",
        seo_description="10.25-inch Android widescreen for BMW 3 Series F30 and 4 Series F32 with wireless CarPlay and Android Auto. Keeps iDrive and camera. Fitted in Dublin 12.",
        option_name="Original iDrive",
        variants=[
            ("CIC (approx. 2012–2013)", "549.00", "MG-SCR-BMW-F30-CIC"),
            ("NBT (approx. 2013–2016)", "549.00", "MG-SCR-BMW-F30-NBT"),
            ("NBT EVO (approx. 2016–2019)", "549.00", "MG-SCR-BMW-F30-EVO"),
        ],
        images=["bmw_carplay"],
        shipping=True, weight_g=1800, inventory=6,
        metafields=dict(
            car_make=["BMW"],
            car_model=["3 Series (F30/F31)", "4 Series (F32/F33/F36)"],
            screen_size="10.25\"",
            fitted_price="€699",
        ),
    ),
    dict(
        handle="android-screen-upgrade-mercedes-w205-12-3",
        title="12.3\" Android Screen Upgrade – Mercedes-Benz C-Class (W205)",
        type="Android Screen Upgrade",
        category=CAT_AV,
        tags=["carplay-android-auto", "screen-upgrades", "make:Mercedes-Benz", "type:screen-upgrade",
              "wireless-carplay", "android-auto", HARDWARE],
        body=body(
            "<strong>Give your C-Class a 12.3\" widescreen</strong> with wireless Apple CarPlay and Android Auto, "
            "finished to look like the premium factory option.",
            section("Why drivers choose it", ul([
                "12.3\" anti-glare touchscreen that fills the dash the way the factory widescreen does",
                "Wireless CarPlay and Android Auto, plus Android apps",
                "Original Mercedes menus and car settings stay one press away",
                "Keeps the rotary controller, touchpad, steering wheel buttons and reversing camera",
            ])),
            section("What's included", ul([
                "12.3\" display unit with mounting bracket",
                "Plug-in harness for NTG 5/5.1 or NTG 5.5 (choose it above)",
                "GPS antenna and external microphone",
                "USB lead for wired use and charging",
            ])),
            section("Compatibility", ul([
                "Mercedes-Benz C-Class W205 saloon, S205 estate, C205 coupé and A205 cabriolet",
                "Cars with NTG 5/5.1 (approx. 2014–2018) or NTG 5.5 (approx. 2018–2021)",
                "Send us your reg and a photo of your dash and we'll confirm the fit before you buy",
            ])),
            CTA_HARDWARE,
        ),
        seo_title="Mercedes W205 12.3\" Android Screen Upgrade | MG Car Audio",
        seo_description="12.3-inch Android widescreen for the Mercedes-Benz C-Class W205 with wireless CarPlay and Android Auto. Keeps factory controls. Fitted in Dublin 12.",
        option_name="Mercedes system",
        variants=[
            ("NTG 5 / 5.1 (approx. 2014–2018)", "699.00", "MG-SCR-MB-W205-NTG5"),
            ("NTG 5.5 (approx. 2018–2021)", "699.00", "MG-SCR-MB-W205-NTG55"),
        ],
        images=["android_auto_dash"],
        shipping=True, weight_g=2000, inventory=6,
        metafields=dict(
            car_make=["Mercedes-Benz"],
            car_model=["C-Class (W205)"],
            screen_size="12.3\"",
            fitted_price="€849",
        ),
    ),
    dict(
        handle="android-double-din-radio-9-inch",
        title="9\" Android Double-DIN Touchscreen Radio",
        type="Android Radio",
        category=CAT_AV,
        tags=["carplay-android-auto", "android-radios", "best-sellers", "make:Universal",
              "type:android-radio", "wireless-carplay", "android-auto", HARDWARE],
        body=body(
            "<strong>A big, bright 9\" touchscreen with wireless Apple CarPlay and Android Auto built in.</strong> "
            "The quickest way to bring a car with a standard double-DIN radio right up to date.",
            section("Why drivers choose it", ul([
                "Wireless Apple CarPlay and Android Auto",
                "Android apps from Google Play for music, podcasts and navigation",
                "Bluetooth calls and music streaming, plus FM radio",
                "Reversing camera input and steering wheel control support (with the right adapter for your car)",
            ])),
            section("What's included", ul([
                "9\" Android head unit",
                "Wiring loom, GPS antenna and external microphone",
                "USB leads",
                "The fascia kit, harness adapter and steering wheel interface are specific to your car and quoted separately",
            ])),
            section("Compatibility", ul([
                "Cars with a double-DIN radio opening, or where a 9\" fascia kit is available",
                "Covers most European, Japanese and Korean cars",
                "Send us your reg and we'll confirm the fascia kit and adapters your car needs",
            ])),
            section("Fitted at our Dublin 12 workshop",
                    "<p>Our Android radio fitting service is <strong>€150</strong> and takes about an hour and a half "
                    "at our workshop in Ballymount, Dublin 12. Book a slot online with a <strong>€50 deposit</strong> "
                    "(it comes off your final bill), or send us your reg on WhatsApp for a full fitted price.</p>"),
        ),
        seo_title="9\" Android Double-DIN Radio with CarPlay | MG Car Audio",
        seo_description="9-inch Android touchscreen radio with wireless Apple CarPlay and Android Auto. Fits double-DIN dashes. Professional fitting in Dublin 12 for €150.",
        option_name="Title",
        variants=[("Default Title", "279.00", "MG-RAD-AND-9")],
        images=["dash_radio"],
        shipping=True, weight_g=1600, inventory=12,
        metafields=dict(
            car_make=["Universal"],
            car_model=[],
            screen_size="9\"",
            fitted_price="€429",
        ),
    ),
    dict(
        handle="wireless-carplay-double-din-radio-7-inch",
        title="7\" Wireless CarPlay & Android Auto Double-DIN Radio",
        type="CarPlay Radio",
        category=CAT_AV,
        tags=["carplay-android-auto", "make:Universal", "type:carplay-radio", "wireless-carplay",
              "android-auto", HARDWARE],
        body=body(
            "<strong>Everything most drivers really use, done well:</strong> maps, music, calls and messages on a "
            "clean 7\" touchscreen with wireless Apple CarPlay and Android Auto.",
            section("Why drivers choose it", ul([
                "Wireless Apple CarPlay and Android Auto",
                "Simple, distraction-free menus that start up quickly",
                "Bluetooth calls and streaming, plus FM radio",
                "Reversing camera input and steering wheel control support (with the right adapter for your car)",
            ])),
            section("What's included", ul([
                "7\" double-DIN head unit with mounting cage",
                "Wiring loom and external microphone",
                "USB lead",
                "The fascia kit, harness adapter and steering wheel interface are specific to your car and quoted separately",
            ])),
            section("Compatibility", ul([
                "Cars with a double-DIN radio opening, or where a double-DIN fascia kit is available",
                "Send us your reg and we'll confirm the fascia kit and adapters your car needs",
            ])),
            section("Fitted at our Dublin 12 workshop",
                    "<p>Our radio fitting service is <strong>€150</strong> at our workshop in Ballymount, Dublin 12. "
                    "Book a slot online with a <strong>€50 deposit</strong> (it comes off your final bill), or send "
                    "us your reg on WhatsApp for a full fitted price.</p>"),
        ),
        seo_title="7\" Wireless CarPlay Double-DIN Radio | MG Car Audio",
        seo_description="7-inch double-DIN radio with wireless Apple CarPlay and Android Auto, Bluetooth and camera input. Supplied and fitted at our Dublin 12 workshop.",
        option_name="Title",
        variants=[("Default Title", "229.00", "MG-RAD-CP-7")],
        images=["dash_radio"],
        shipping=True, weight_g=1400, inventory=12,
        metafields=dict(
            car_make=["Universal"],
            car_model=[],
            screen_size="7\"",
            fitted_price="€379",
        ),
    ),
    dict(
        handle="wireless-carplay-adapter",
        title="Plug-and-Play Wireless CarPlay Adapter",
        type="CarPlay Adapter",
        category=CAT_ELECTRONICS,
        tags=["carplay-android-auto", "accessories", "best-sellers", "make:Universal",
              "type:carplay-adapter", "wireless-carplay", HARDWARE],
        body=body(
            "<strong>Already have wired Apple CarPlay? Go wireless in about a minute.</strong> Plug the adapter "
            "into your car's CarPlay USB port, pair your phone once, and it connects by itself every time you get in.",
            section("Why drivers choose it", ul([
                "No fitting and no tools: it plugs into the USB port your car already uses for CarPlay",
                "Connects automatically a few seconds after you start the car",
                "Leave your phone in your pocket or bag",
                "Choose the CarPlay + Android Auto version if there's more than one phone in the house",
            ])),
            section("What's included", ul([
                "Wireless adapter",
                "USB-A and USB-C leads",
                "Quick-start guide",
            ])),
            section("Compatibility", ul([
                "Cars that already have factory wired Apple CarPlay (most cars from about 2016 onwards)",
                "The Android Auto version also needs factory wired Android Auto",
                "It won't add CarPlay to a car that doesn't have it. For that, see our CarPlay interfaces and screen upgrades",
            ])),
            section("Collect or have it set up in Dublin 12",
                    "<p>Order online and collect from our workshop in Ballymount, Dublin 12, or pop in and we'll "
                    "plug it in and pair your phone with you. Questions? Send us your reg on WhatsApp.</p>"),
        ),
        seo_title="Wireless CarPlay Adapter, Plug and Play | MG Car Audio",
        seo_description="Turn wired Apple CarPlay into wireless in about a minute. Plugs into your car's USB port, no fitting needed. CarPlay or CarPlay + Android Auto versions.",
        option_name="Version",
        variants=[
            ("Apple CarPlay", "79.00", "MG-ADP-CP"),
            ("Apple CarPlay + Android Auto", "99.00", "MG-ADP-CPAA"),
        ],
        images=["showroom"],
        shipping=True, weight_g=80, inventory=20,
        metafields=dict(
            car_make=["Universal"],
            car_model=[],
            screen_size="",
            fitted_price="",
        ),
    ),
    dict(
        handle="oem-style-reverse-camera-kit",
        title="OEM-Style Reverse Camera Kit",
        type="Reverse Camera",
        category=CAT_BACKUP_CAM,
        tags=["reverse-cameras", "make:Universal", "type:reverse-camera", HARDWARE],
        body=body(
            "<strong>A discreet HD reversing camera that switches on the moment you select reverse</strong>, "
            "with parking guidelines on your screen.",
            section("Why drivers choose it", ul([
                "Clear, wide-angle HD picture, day and night",
                "Shows automatically when you select reverse",
                "Static guidelines, or dynamic guidelines that bend as you turn the wheel",
                "Small, colour-matched camera body that looks factory-fitted",
            ])),
            section("What's included", ul([
                "HD reverse camera",
                "Wiring loom and mounting hardware",
                "Where your factory screen needs a video interface, it's car-specific and quoted separately",
            ])),
            section("Compatibility", ul([
                "Aftermarket head units and CarPlay/Android radios with a camera input",
                "Most factory screens, including BMW iDrive and Audi MMI, through a camera interface",
                "Send us your reg and a photo of your dash and we'll confirm what your car needs",
            ])),
            CTA_HARDWARE,
        ),
        seo_title="OEM-Style Reverse Camera Kit | MG Car Audio",
        seo_description="HD reversing camera kit with static or dynamic parking guidelines. Works with factory screens and CarPlay radios. Supplied and fitted in Dublin 12.",
        option_name="Guidelines",
        variants=[
            ("Static guidelines", "129.00", "MG-CAM-STAT"),
            ("Dynamic guidelines", "159.00", "MG-CAM-DYN"),
        ],
        images=["showroom"],
        shipping=True, weight_g=350, inventory=15,
        metafields=dict(
            car_make=["Universal"],
            car_model=[],
            screen_size="",
            fitted_price="€399",
        ),
    ),

    # ---------------- Installation services: MG's real prices ----------------
    dict(
        handle="carplay-installation-bmw",
        title="CarPlay Installation – BMW",
        type="Installation",
        category="",
        tags=["carplay-android-auto", "installation-services", "best-sellers", "make:BMW",
              "type:installation"],
        body=body(
            "<strong>Modernise your BMW with seamless smartphone integration.</strong> We install Apple CarPlay "
            "on your iDrive system so your iPhone works with your dashboard for safer navigation, music control "
            "and hands-free messaging, all with an OEM-style finish.",
            section("Why drivers choose it", ul([
                "Apple Maps, Google Maps and Waze on your factory screen",
                "Spotify, Apple Music and your other music and podcast apps",
                "Hands-free calls and messages, with Siri voice control",
                "Keeps your original iDrive features wherever possible",
            ])),
            section("What's included", ul([
                "Check of your iDrive system and software before we start",
                "Installation and set-up of Apple CarPlay on your iDrive (choose your system above)",
                "Test of calls, audio, microphone, reversing camera and steering wheel controls",
                "Pairing your phone and a quick walkthrough before you leave",
            ])),
            section("Good to know", ul([
                "We confirm the fitting time for your iDrive system when you book",
                "Not sure which iDrive you have? Send us a photo of your screen and we'll tell you",
                "We confirm exactly what your BMW needs, and the price, before you book. No surprises on the day",
                "Want Android Auto on iDrive 7? See Android Auto Installation – BMW iDrive 7 (€299)",
            ])),
            CTA_SERVICE,
        ),
        seo_title="BMW Apple CarPlay Installation Dublin, €350 | MG Car Audio",
        seo_description="Apple CarPlay installed on your BMW iDrive for €350: CIC, NBT, NBT EVO and iDrive 7. OEM-style finish, fitted at our Dublin 12 workshop.",
        option_name="iDrive system",
        variants=[
            ("iDrive CIC", "350.00", "MG-SVC-CP-BMW-CIC"),
            ("iDrive NBT", "350.00", "MG-SVC-CP-BMW-NBT"),
            ("NBT EVO (ID4–ID6)", "350.00", "MG-SVC-CP-BMW-EVO"),
            ("iDrive 7 (ID7)", "350.00", "MG-SVC-CP-BMW-ID7"),
        ],
        images=["bmw_carplay", "showroom"],
        shipping=False, weight_g=None, inventory=None,
        metafields=dict(
            car_make=["BMW"],
            car_model=["1 Series (F20/F21)", "2 Series (F22/F23)", "3 Series (F30/F31)",
                       "4 Series (F32/F33/F36)", "5 Series (F10/F11)", "X1 (F48)", "X3 (F25)", "X5 (F15)"],
            screen_size="",
            fitted_price="€350",
        ),
    ),
    dict(
        handle="android-auto-installation-bmw-id7",
        title="Android Auto Installation – BMW iDrive 7 (ID7)",
        type="Installation",
        category="",
        tags=["carplay-android-auto", "installation-services", "best-sellers", "make:BMW",
              "type:installation", "android-auto"],
        body=body(
            "<strong>Your perfect Android friend on screen.</strong> We enable Android Auto on your BMW's "
            "iDrive 7 system so your Android phone gives you hands-free navigation, music streaming and your "
            "favourite apps, while your BMW keeps its sleek factory look.",
            section("Why drivers choose it", ul([
                "Google Maps and Waze on the factory widescreen",
                "Spotify, YouTube Music and podcasts through your BMW's speakers",
                "Hands-free calls and messages with Google Assistant",
                "Uses the iDrive controller, touchscreen and steering wheel buttons",
            ])),
            section("What's included", ul([
                "Check of your iDrive 7 software version",
                "Android Auto activation and set-up",
                "Test of calls, audio and controls",
                "Pairing your phone before you leave",
            ])),
            section("Good to know", ul([
                "Fitting takes about 1 hour",
                "For BMWs with iDrive 7 (Operating System 7), usually built from 2019, such as the 1 Series (F40), 3 Series (G20/G21), 5 Series (G30/G31), X3 (G01), X5 (G05) and Z4 (G29)",
                "Older iDrive? See CarPlay Installation – BMW, or our wireless CarPlay and Android Auto interfaces",
            ])),
            CTA_SERVICE,
        ),
        seo_title="BMW iDrive 7 Android Auto Installation, €299 | MG Car Audio",
        seo_description="Android Auto enabled on your BMW iDrive 7 (ID7) for €299. Google Maps, music and calls on the factory screen. About an hour at our Dublin 12 workshop.",
        option_name="Title",
        variants=[("Default Title", "299.00", "MG-SVC-AA-BMW-ID7")],
        images=["bmw_android_auto"],
        shipping=False, weight_g=None, inventory=None,
        metafields=dict(
            car_make=["BMW"],
            car_model=["1 Series (F40)", "3 Series (G20/G21)", "5 Series (G30/G31)", "X3 (G01)",
                       "X5 (G05)", "Z4 (G29)"],
            screen_size="",
            fitted_price="€299",
        ),
    ),
    dict(
        handle="android-radio-installation",
        title="Android Radio Installation",
        type="Installation",
        category="",
        tags=["android-radios", "installation-services", "make:Universal", "type:installation"],
        body=body(
            "<strong>Bought an Android touchscreen radio? We'll fit it properly.</strong> Expert installation of "
            "your car radio system at our Dublin 12 workshop, with a clean finish and everything tested.",
            section("What's included", ul([
                "Careful removal of your old radio",
                "Fitting your Android radio into its fascia kit",
                "Connecting power, speakers, aerial, GPS antenna, microphone and USB",
                "Connecting steering wheel controls and a reversing camera where your kit supports them",
                "Set-up, phone pairing and a full test before you leave",
            ])),
            section("Good to know", ul([
                "Fitting takes about 1 hour 30 minutes",
                "This is a fitting-only service: you supply the radio, fascia kit and harness for your car",
                "Don't have a radio yet? Our 9\" Android double-DIN radio is ready to fit",
                "Send us your reg and a photo of your dash and we'll check your parts before you book",
            ])),
            CTA_SERVICE,
        ),
        seo_title="Android Radio Fitting in Dublin, €150 | MG Car Audio",
        seo_description="Professional fitting for your Android touchscreen radio for €150: wiring, steering controls, camera and set-up. About 1.5 hours at our Dublin 12 workshop.",
        option_name="Title",
        variants=[("Default Title", "150.00", "MG-SVC-RADIO")],
        images=["dash_radio", "single_din_radio"],
        shipping=False, weight_g=None, inventory=None,
        metafields=dict(
            car_make=["Universal"],
            car_model=[],
            screen_size="",
            fitted_price="€150",
        ),
    ),
    dict(
        handle="bmw-idrive7-video-in-motion",
        title="BMW iDrive 7 Video in Motion",
        type="Installation",
        category="",
        tags=["installation-services", "make:BMW", "type:installation"],
        body=body(
            "<strong>Unlock your BMW's entertainment system for your passengers.</strong> We enable video "
            "playback on the move on iDrive 7, so the front passenger can enjoy films and clips on long journeys.",
            section("What's included", ul([
                "Check of your iDrive 7 software version",
                "Video in motion enabled on your iDrive 7 system",
                "Test of video playback and all screen functions",
            ])),
            section("Good to know", ul([
                "Done at our Dublin 12 workshop. We confirm the time when you book",
                "For BMWs with iDrive 7 (ID7), usually built from 2019",
                "For passenger use only. The driver must never watch video while driving",
            ])),
            CTA_SERVICE,
        ),
        seo_title="BMW iDrive 7 Video in Motion, €149 | MG Car Audio",
        seo_description="Video in motion for BMW iDrive 7 (ID7) for €149, so passengers can watch on the move. Enabled at our Dublin 12 workshop. Passenger use only.",
        option_name="Title",
        variants=[("Default Title", "149.00", "MG-SVC-VIM-BMW-ID7")],
        images=["bmw_carplay"],
        shipping=False, weight_g=None, inventory=None,
        metafields=dict(
            car_make=["BMW"],
            car_model=["1 Series (F40)", "3 Series (G20/G21)", "5 Series (G30/G31)", "X3 (G01)",
                       "X5 (G05)", "Z4 (G29)"],
            screen_size="",
            fitted_price="€149",
        ),
    ),
    dict(
        handle="bmw-japan-to-europe-conversion",
        title="BMW Japan-to-Europe Conversion",
        type="Installation",
        category="",
        tags=["installation-services", "japan-to-europe", "make:BMW", "type:installation"],
        body=body(
            "<strong>Seamlessly localise your imported BMW's software and navigation.</strong> A professional "
            "conversion for BMWs imported from Japan: we update the infotainment system, re-code the navigation "
            "for European maps and adjust the software settings to local standards.",
            section("What's included", ul([
                "Region coding of your iDrive system to European specification",
                "European navigation maps",
                "English menus and voice guidance",
                "FM radio moved to the European band (87.5–108 MHz)",
                "Local regional settings, plus a check of all iDrive functions",
            ])),
            section("Good to know", ul([
                "Takes about 2 hours",
                "For most Japanese-market BMWs. Send us your reg or VIN and we'll confirm your car is compatible before you book",
            ])),
            CTA_SERVICE,
        ),
        seo_title="BMW Japan-to-Europe Conversion, €450 | MG Car Audio",
        seo_description="Convert your Japanese-import BMW to European spec for €450: maps, English menus, EU radio band and regional settings. About 2 hours in Dublin 12.",
        option_name="Title",
        variants=[("Default Title", "450.00", "MG-SVC-J2E-BMW")],
        images=["bmw_j2e"],
        shipping=False, weight_g=None, inventory=None,
        metafields=dict(car_make=["BMW"], car_model=[], screen_size="", fitted_price="€450"),
    ),
    dict(
        handle="mercedes-japan-to-europe-conversion",
        title="Mercedes-Benz Japan-to-Europe Conversion",
        type="Installation",
        category="",
        tags=["installation-services", "japan-to-europe", "make:Mercedes-Benz", "type:installation"],
        body=body(
            "<strong>Localise your Mercedes infotainment for European standards.</strong> We convert "
            "Japanese-spec head units to European specification, updating the navigation maps, radio frequency "
            "range and system language so your import works perfectly on Irish roads.",
            section("What's included", ul([
                "Conversion of your head unit software to European specification",
                "European navigation maps",
                "English system language",
                "FM radio moved to the European band (87.5–108 MHz)",
            ])),
            section("Good to know", ul([
                "Takes about 2 hours",
                "Your head unit must be compatible with the software update. Send us your reg or VIN and we'll check before you book",
            ])),
            CTA_SERVICE,
        ),
        seo_title="Mercedes Japan-to-Europe Conversion, €450 | MG Car Audio",
        seo_description="Convert your Japanese-import Mercedes-Benz head unit to European spec for €450: maps, English language and EU radio band. At our Dublin 12 workshop.",
        option_name="Title",
        variants=[("Default Title", "450.00", "MG-SVC-J2E-MB")],
        images=["mercedes_j2e"],
        shipping=False, weight_g=None, inventory=None,
        metafields=dict(car_make=["Mercedes-Benz"], car_model=[], screen_size="", fitted_price="€450"),
    ),
    dict(
        handle="vw-japan-to-europe-conversion",
        title="Volkswagen Japan-to-Europe Conversion",
        type="Installation",
        category="",
        tags=["installation-services", "japan-to-europe", "make:Volkswagen", "type:installation"],
        body=body(
            "<strong>Upgrade your VW import to European standards.</strong> An expert conversion for Volkswagens "
            "imported from Japan: we update your head unit, radio frequencies and navigation maps so everything "
            "works as it should here.",
            section("What's included", ul([
                "Head unit software updated to European specification",
                "European navigation maps",
                "English menus",
                "FM radio moved to the European band (87.5–108 MHz)",
            ])),
            section("Good to know", ul([
                "Takes about 2 hours",
                "For MIB head units in 2012–2018 models only",
                "Send us your reg and a photo of your screen and we'll confirm your unit before you book",
            ])),
            CTA_SERVICE,
        ),
        seo_title="VW Japan-to-Europe Conversion, €350 | MG Car Audio",
        seo_description="Convert your Japanese-import Volkswagen MIB head unit (2012–2018) to European spec for €350: maps, English menus and EU radio band. In Dublin 12.",
        option_name="Title",
        variants=[("Default Title", "350.00", "MG-SVC-J2E-VW")],
        images=["vw_j2e"],
        shipping=False, weight_g=None, inventory=None,
        metafields=dict(car_make=["Volkswagen"], car_model=[], screen_size="", fitted_price="€350"),
    ),
    dict(
        handle="radio-frequency-conversion-japan-to-europe",
        title="Radio Frequency Conversion (Japan to Europe)",
        type="Installation",
        category="",
        tags=["installation-services", "japan-to-europe", "make:Toyota", "make:Lexus", "make:Nissan",
              "make:Honda", "make:Mazda", "type:installation"],
        body=body(
            "<strong>Unlock local radio stations in your imported Japanese car.</strong> Japanese radios only "
            "tune 76–90 MHz, so most Irish stations are missing. We modify your radio to receive the full "
            "European FM band (87.5–108 MHz) while keeping the sound quality you'd expect.",
            section("What's included", ul([
                "Conversion of your car radio to the European FM band",
                "Station search and presets set up for your area",
                "Sound check before you leave",
            ])),
            section("Good to know", ul([
                "Takes about 1 hour",
                "For imported Japanese cars such as Toyota, Lexus, Nissan, Honda and Mazda",
                "Also want English menus and European maps? Ask about our full Japan-to-Europe conversions",
            ])),
            CTA_SERVICE,
        ),
        seo_title="Japan-to-Europe Radio Frequency Conversion | MG Car Audio",
        seo_description="Imported Japanese car? We convert your radio to the European FM band (87.5–108 MHz) for €150 so you get every Irish station. About an hour in Dublin 12.",
        option_name="Title",
        variants=[("Default Title", "150.00", "MG-SVC-RF-J2E")],
        images=["radio_frequency"],
        shipping=False, weight_g=None, inventory=None,
        metafields=dict(car_make=["Toyota", "Lexus", "Nissan", "Honda", "Mazda"], car_model=[],
                        screen_size="", fitted_price="€150"),
    ),
    dict(
        handle="reverse-camera-installation",
        title="Reverse Camera Installation",
        type="Installation",
        category="",
        tags=["reverse-cameras", "installation-services", "make:BMW", "make:Audi", "make:Volkswagen",
              "make:Honda", "type:installation"],
        body=body(
            "<strong>Park with confidence.</strong> We supply and install a high-quality reverse camera that "
            "works with your factory or aftermarket screen, giving you a clear view behind the car every time "
            "you select reverse.",
            section("Why drivers choose it", ul([
                "Crystal-clear HD camera image",
                "Switches on automatically when you select reverse",
                "OEM-style integration with compatible factory screens, including BMW iDrive and Audi MMI",
                "Static or dynamic parking guidelines, where supported",
                "Works with Apple CarPlay and Android Auto head units",
            ])),
            section("What's included", ul([
                "HD reverse camera for your car (choose your make above)",
                "Connection to your factory or aftermarket screen",
                "Professional hidden wiring for a factory-style finish",
                "Full test before you leave",
            ])),
            section("Good to know", ul([
                "Prices are supply and fit for BMW, Audi, Volkswagen and Honda",
                "Another make? Send us your reg for a quote",
            ])),
            CTA_SERVICE,
        ),
        seo_title="Reverse Camera Installation Dublin | MG Car Audio",
        seo_description="Reverse camera supplied and fitted with a factory-style finish: BMW €750, Audi €699, VW €650, Honda €399. HD image and hidden wiring. Dublin 12.",
        option_name="Car make",
        variants=[
            ("BMW", "750.00", "MG-SVC-CAM-BMW"),
            ("Audi", "699.00", "MG-SVC-CAM-AUDI"),
            ("Volkswagen", "650.00", "MG-SVC-CAM-VW"),
            ("Honda", "399.00", "MG-SVC-CAM-HONDA"),
        ],
        images=["showroom"],
        shipping=False, weight_g=None, inventory=None,
        metafields=dict(car_make=["BMW", "Audi", "Volkswagen", "Honda"], car_model=[], screen_size="",
                        fitted_price="€399"),
    ),
    dict(
        handle="booking-deposit",
        title="Booking deposit – secures your fitting slot",
        type="Installation",
        category="",
        tags=["booking-deposit"],
        body=body(
            "<strong>Secure your appointment with MG Car Audio.</strong> A €50 booking deposit confirms your "
            "appointment and lets us reserve workshop time for your car, and have any parts or equipment for "
            "your installation ready.",
            section("What's included", ul([
                "A reserved fitting slot at our Dublin 12 workshop",
                "Parts and equipment for your job prepared before you arrive",
                "The full €50 taken off your final invoice on the day",
            ])),
            section("Please note", ul([
                "The €50 deposit is deducted from your final invoice on the day of your appointment",
                "Deposits are non-refundable if you don't attend, or if you cancel with less than 48 hours' notice",
                "Need to reschedule? Contact us at least 48 hours before your appointment and we'll gladly move your deposit to a new date",
                "The balance is payable once the work is complete",
            ])),
            section("Fitted at our Dublin 12 workshop",
                    "<p>After you pay, we'll be in touch to confirm your date and time. Unit 3, Ballymount Business "
                    "Centre, Ballymount Road Lower, Dublin 12, D12 YX27. Mon–Fri 9:30am–7pm, Sat 11am–7pm, "
                    "Sun by appointment.</p>"),
        ),
        seo_title="Booking Deposit, €50 | MG Car Audio",
        seo_description="Secure your fitting slot at MG Car Audio, Dublin 12, with a €50 deposit. It comes off your final bill. Reschedule free with 48 hours' notice.",
        option_name="Title",
        variants=[("Default Title", "50.00", "MG-DEPOSIT-50")],
        images=["showroom"],
        shipping=False, weight_g=None, inventory=None,
        metafields=dict(car_make=[], car_model=[], screen_size="", fitted_price=""),
    ),
]


# ---------------------------------------------------------------------------------------------
# CSV writer
# ---------------------------------------------------------------------------------------------

def product_rows(p, with_metafields=True):
    rows = []
    header = TEMPLATE_HEADER + (list(METAFIELD_COLUMNS.values()) if with_metafields else [])
    is_hardware = HARDWARE in p["tags"]
    images = p["images"]

    for index, (value, price, sku) in enumerate(p["variants"]):
        r = {h: "" for h in header}
        r["URL handle"] = p["handle"]
        if index == 0:
            r["Title"] = p["title"]
            r["Description"] = p["body"]
            r["Vendor"] = "MG Car Audio"
            r["Product category"] = p["category"]
            r["Type"] = p["type"]
            r["Tags"] = ", ".join(p["tags"])
            r["Published on online store"] = "TRUE"
            r["Status"] = "Active"
            r["Option1 name"] = p["option_name"]
            r["Gift card"] = "FALSE"
            r["SEO title"] = p["seo_title"]
            r["SEO description"] = p["seo_description"]
            if is_hardware:
                r["Google Shopping / Condition"] = "New"
                r["Google Shopping / Custom product"] = "TRUE"
            if with_metafields:
                mf = p["metafields"]
                r[METAFIELD_COLUMNS["car_make"]] = "\n".join(mf["car_make"])
                r[METAFIELD_COLUMNS["car_model"]] = "\n".join(mf["car_model"])
                r[METAFIELD_COLUMNS["screen_size"]] = mf["screen_size"]
                r[METAFIELD_COLUMNS["fitted_price"]] = mf["fitted_price"]
        r["SKU"] = sku
        r["Option1 value"] = value
        r["Price"] = price
        r["Charge tax"] = "TRUE"
        if p["shipping"]:
            r["Inventory tracker"] = "shopify"
            r["Inventory quantity"] = str(p["inventory"])
            r["Continue selling when out of stock"] = "DENY"
            r["Weight value (grams)"] = str(p["weight_g"])
            r["Weight unit for display"] = "g"
            r["Requires shipping"] = "TRUE"
        else:
            r["Continue selling when out of stock"] = "CONTINUE"
            r["Requires shipping"] = "FALSE"
        r["Fulfillment service"] = "manual"
        # Images: first image on the first variant row, further images on their own rows below.
        if index == 0 and images:
            r["Product image URL"] = IMG[images[0]]
            r["Image position"] = "1"
            r["Image alt text"] = ALT[images[0]]
        rows.append(r)

    for position, key in enumerate(images[1:], start=2):
        r = {h: "" for h in header}
        r["URL handle"] = p["handle"]
        r["Product image URL"] = IMG[key]
        r["Image position"] = str(position)
        r["Image alt text"] = ALT[key]
        rows.append(r)
    return header, rows


def write(path, with_metafields):
    all_rows = []
    header = None
    for p in PRODUCTS:
        header, rows = product_rows(p, with_metafields)
        all_rows.extend(rows)
    with open(path, "w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=header, quoting=csv.QUOTE_MINIMAL, lineterminator="\n")
        w.writeheader()
        w.writerows(all_rows)
    return len(all_rows)


if __name__ == "__main__":
    n1 = write(os.path.join(HERE, "products.csv"), True)
    n2 = write(os.path.join(HERE, "products-no-metafields.csv"), False)
    print("products.csv: %d products, %d rows" % (len(PRODUCTS), n1))
    print("products-no-metafields.csv: %d rows" % n2)
