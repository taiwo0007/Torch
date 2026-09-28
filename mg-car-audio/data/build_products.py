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
`demo-placeholder` is invented for the demo (own-label "MG Select" names, no third-party model numbers).
Products tagged `mg-shop` are MG's real Wix shop listings (real title, price and copy). Installation
services are MG's real prices (see PRICE_SOURCES), except those tagged `demo-price`.
Image sources and credits: see the IMG / UNSPLASH_CREDITS comments and data/PRODUCTS_README.md.
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
CAT_AMP = "Vehicles & Parts > Vehicle Parts & Accessories > Motor Vehicle Electronics > Motor Vehicle Amplifiers"
CAT_SUB = "Vehicles & Parts > Vehicle Parts & Accessories > Motor Vehicle Electronics > Motor Vehicle Subwoofers"
CAT_DSP = "Vehicles & Parts > Vehicle Parts & Accessories > Motor Vehicle Electronics > Motor Vehicle Equalizers & Crossovers > Digital Sound Processors"
CAT_SPK = "Vehicles & Parts > Vehicle Parts & Accessories > Motor Vehicle Electronics > Motor Vehicle Speakers"
CAT_SPK_COAX = CAT_SPK + " > Coaxial Speakers"
CAT_SPK_COMP = CAT_SPK + " > Component Speakers"
CAT_SPK_MID = CAT_SPK + " > Mid-Range Speakers"
CAT_WOOFER = CAT_SPK + " > Woofers"
CAT_PHONE_MOUNT = "Electronics > Communications > Telephony > Mobile & Smart Phone Accessories > Mobile Phone Car Mounts"
CAT_CAR_CHARGER = "Electronics > Electronics Accessories > Power > Power Adapters & Chargers > Car Chargers"
CAT_GIFT = "Gift Cards"

# Image sources (every URL returned HTTP 200 with an image/* type on 28 Sep 2026):
#  1. MG's own images on their current Wix site (static.wixstatic.com/media/c67c38_...), plus the two
#     Unsplash photos MG itself uses on its Wix product pages (Wix "nsplsh_" files = Unsplash library).
#  2. Our Unsplash photos already processed into the theme (docs/IMAGE_CREDITS.md), served publicly from
#     the demo store's theme CDN. THEME_CDN is the published/preview theme's asset base (theme t/3,
#     preview_theme_id=207815147859). Shopify copies the image at import, so the URL only has to
#     work on import day. If the theme is re-uploaded under a new number, update THEME_CDN.
#  3. Extra free Unsplash photos (Unsplash License, checked premium=false and plus=false via Unsplash's
#     own API on 28 Sep 2026), hotlinked from images.unsplash.com. Credits in UNSPLASH_CREDITS below and
#     in data/PRODUCTS_README.md.
# No retailer or manufacturer product photos are used, except the JBL image MG uploaded for its own
# JBL listing.
WIX = "https://static.wixstatic.com/media/"
THEME_CDN = "https://mg-car-audio-q8due7cj.myshopify.com/cdn/shop/t/3/assets/"
UNSPLASH = "https://images.unsplash.com/"
UNSPLASH_Q = "?w=1600&q=80&fm=jpg"

# key: (photo path on images.unsplash.com, unsplash.com photo id, photographer)
UNSPLASH_CREDITS = {
    "us_boot_build": ("photo-1726248985986-20bef82d2b52", "km3i2DsbUd4", "Hoyoun Lee"),
    "us_sub_box_boot": ("photo-1631980048040-0f123527f1b0", "6nv0kWvJXfQ", "Kevin Solbrig"),
    "us_woofers_pair": ("photo-1702746708573-9a9a8ab86679", "mnWMkQXMPOg", "Onno A."),
    "us_sub_floor": ("photo-1643067215158-debf59cb504c", "eRp1ogul_gQ", "ASIDA_"),
    "us_speaker_group": ("photo-1645536729519-134e3b7e9e88", "Wy-Z2wg0fYI", "Steve Pancrate"),
    "us_speaker_bunch": ("photo-1645536729183-33ad0e767aef", "YlSfH5XDAto", "Steve Pancrate"),
    "us_dash_speaker": ("photo-1641264024413-f5e6a9ce2f06", "qYIA0KjNDZs", "D Z"),
    "us_amp_board_hand": ("photo-1563770660941-20978e870e26", "g5f0BJq-FRs", "Blaz Erzetic"),
    "us_circuit_blue": ("photo-1651340765216-ba02df201308", "cA8VTQeHU0c", "Anne Nygård"),
    "us_circuit_green": ("photo-1675602488453-c3897a475af5", "pbKnDOY_pv8", "Bermix Studio"),
    "us_car_interior_doors": ("photo-1546933751-ab7b6e888c66", "-gy2ToQa8u4", "Nazar Sharafutdinov"),
    "us_dashcam_mirror": ("photo-1643686978040-beac9782e58b", "R1gvm6OagZU", "Nicole Logan"),
    "us_dashcam_driving": ("photo-1643686978109-499f1e9d4bd1", "UkPxN57vaDc", "Nicole Logan"),
    "us_windscreen_cam": ("photo-1765959106936-851735565c12", "V3iAg86XwBo", "leoon liang"),
    "us_carplay_nav": ("photo-1604355231395-bf02775c357f", "4IqOnX2sdyM", "Dimitri Karastelev"),
    "us_carplay_dash": ("photo-1684014450269-87cb2823a959", "vjuwXxXpGH0", "Adam Kenton"),
    "us_screen_centre": ("photo-1652509059638-1784b02c40b4", "T8_0GN001j8", "Ivan Kazlouskij"),
    "us_widescreen_nav": ("photo-1708111413184-6e7062038c5d", "cMGQUfvRuQM", "Olga Stenina"),
    "us_screen_touch_media": ("photo-1756387461699-b1b2394fdae2", "dgEUX1GpF9k", "Gavin Phillips"),
    "us_screen_red_trim": ("photo-1758411898032-623df9366b26", "jux_vlSu8wo", "Erik Mclean"),
    "us_nav_screen_dash": ("photo-1695632231361-7468689ed9a4", "DWcgojbxGMY", "Swansway Motor Group"),
    "us_screen_dash_dark": ("photo-1735429934563-ba161723361f", "Ei5H88hmX-Q", "Erik Mclean"),
    "us_headunit_blue": ("photo-1631035012469-751baca1d4a0", "2WpvdL48nso", "Marília Castelli"),
    "us_double_din_dash": ("photo-1631288299421-a22ed1019274", "o2LE7SWjQTw", "Mick Haupt"),
    "us_single_din_dash": ("photo-1523987659364-8ad26ea657ef", "EOG8BeJfz4I", "Frank Albrecht"),
    "us_stereo_blue": ("photo-1470948062737-aeb014e274c2", "KpSdMeuaHRg", "Mpho Mojapelo"),
    "us_phone_mount": ("photo-1764347923709-fc48487f2486", "P85dQzlsPlc", "William Hadley"),
    "us_usbc_ports": ("photo-1752552050371-8360f9c78086", "qUOHOaEfOms", "Obi"),
    "us_usbc_port": ("photo-1750268375449-81b7edb348bf", "UZzcM8NUPLI", "Obi"),
    "us_phone_cable": ("photo-1559232212-9c37e0b94ba7", "j35PCIQ4dSU", "Sinitta Leunen"),
    "us_gift_box": ("photo-1671150590216-f138600130ce", "NrAv5nwdIrw", "Anastasiia Chepinska"),
}

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
    # MG's own product photos from its Wix shop (/category/all-products, 28 Sep 2026).
    "mg_speaker_pair": WIX + "c67c38_5bd4a81395ac4bb39a3e5aeabc54406f~mv2.jpg",
    "mg_door_speaker": WIX + "c67c38_0b96be4f009645aaadd64bbc72e06af2~mv2.jpg",
    "mg_jbl": WIX + "c67c38_19cf0e002cf2435c9ab65bce9c69208c~mv2.png",
    # Unsplash photos MG uses on its Wix reverse camera product pages.
    "mg_vw_reverse_screen": WIX + "nsplsh_52809b6b039d43c89f302c6d7190e338~mv2.jpg",
    "mg_bmw_red": WIX + "nsplsh_78e873c389094e12934d2ecebf4b7123~mv2.jpg",
    "mg_honda_red": WIX + "nsplsh_476749304a316870445059~mv2_d_3784_4730_s_4_2.jpg",
    # Theme assets (Unsplash, docs/IMAGE_CREDITS.md), served from the store's theme CDN.
    "th_hero_1": THEME_CDN + "mg-img-hero-1.webp",
    "th_hero_2": THEME_CDN + "mg-img-hero-2.webp",
    "th_hero_3": THEME_CDN + "mg-img-hero-3.webp",
    "th_carplay": THEME_CDN + "mg-img-sys-carplay.webp",
    "th_screens": THEME_CDN + "mg-img-sys-screens.webp",
    "th_android_radio": THEME_CDN + "mg-img-sys-android-radio.webp",
    "th_subs_amps": THEME_CDN + "mg-img-sys-subs-amps.webp",
    "th_dashcam": THEME_CDN + "mg-img-sys-dashcam.webp",
    "th_reverse_camera": THEME_CDN + "mg-img-sys-reverse-camera.webp",
    "th_speakers": THEME_CDN + "mg-img-sys-speakers.webp",
    "th_workshop": THEME_CDN + "mg-img-panel-workshop.webp",
    "th_wiring": THEME_CDN + "mg-img-panel-promise.webp",
    "th_door_grille": THEME_CDN + "mg-img-gallery-2.webp",
}
IMG.update({k: UNSPLASH + v[0] + UNSPLASH_Q for k, v in UNSPLASH_CREDITS.items()})

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
    "mg_speaker_pair": "Pair of black coaxial car speakers on a white background",
    "mg_door_speaker": "Car door speaker cone lit in a dark door panel",
    "mg_jbl": "JBL logo, for the JBL Stadium speaker range MG Car Audio supplies and fits",
    "mg_vw_reverse_screen": "Reversing camera picture with parking guidelines on a Volkswagen dashboard screen",
    "mg_bmw_red": "Red BMW coupé parked in a showroom",
    "mg_honda_red": "Red Honda hatchback seen from the front",
    "th_hero_1": "Apple CarPlay Now Playing screen on an in-dash display",
    "th_hero_2": "Widescreen dashboard display with a split-screen CarPlay layout under a starry sky",
    "th_hero_3": "Large widescreen head unit glowing in a dark car interior at night",
    "th_carplay": "Apple CarPlay navigation on an in-dash screen with a phone cable plugged in",
    "th_screens": "Widescreen infotainment display showing a map in a dark cabin",
    "th_android_radio": "Aftermarket double-DIN touchscreen radio glowing in a dark dashboard",
    "th_subs_amps": "Subwoofer installed in a car boot with blue LED lighting",
    "th_dashcam": "Dash camera mounted on the windscreen at dusk, with traffic lights beyond",
    "th_reverse_camera": "Reversing camera view with parking guidelines on the dashboard screen",
    "th_speakers": "Close-up of a car speaker cone and tweeter in warm light",
    "th_workshop": "Car on stands in a workshop with the bonnet up",
    "th_wiring": "Technician's hands routing wiring in a car",
    "th_door_grille": "Door speaker grille with red ambient lighting in a car door",
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
    # MG's real Wix shop products (mgcaraudio.ie/category/all-products, product JSON-LD, 28 Sep 2026)
    "jbl-stadium-52cf-speakers-set": "€189, mgcaraudio.ie/product-page/jbl-stadium-52cf-speakers-set",
    "coaxial-speaker-pair": "€90, mgcaraudio.ie/product-page/coaxial-speaker-pair",
    "compact-single-din": "€199, mgcaraudio.ie/product-page/compact-single-din",
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
        images=["th_hero_1", "bmw_carplay"],
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
        images=["th_hero_2", "android_auto_dash"],
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
        images=[("us_carplay_nav", "Apple CarPlay turn-by-turn navigation on a car's centre screen")],
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
        tags=["screen-upgrades", "best-sellers", "make:BMW",
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
        images=["th_screens", "bmw_carplay"],
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
        tags=["screen-upgrades", "make:Mercedes-Benz", "type:screen-upgrade",
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
        images=[("us_widescreen_nav", "Widescreen navigation display across a dark dashboard")],
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
        tags=["android-radios", "best-sellers", "make:Universal",
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
        option_name="Fitting",
        variants=[("Product only", "279.00", "MG-RAD-AND-9"),
                  ("Supplied & fitted", "429.00", "MG-RAD-AND-9-FIT")],
        images=["th_android_radio", "dash_radio"],
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
        option_name="Fitting",
        variants=[("Product only", "229.00", "MG-RAD-CP-7"),
                  ("Supplied & fitted", "379.00", "MG-RAD-CP-7-FIT")],
        images=[("us_carplay_dash", "Apple CarPlay home screen on a touchscreen radio in a car dashboard")],
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
        images=["th_carplay"],
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
        images=["th_reverse_camera"],
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
        tags=["carplay-android-auto", "installation-services", "make:BMW",
              "type:installation", "android-auto", "badge:Fitted in 1 hr"],
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
        images=[("us_screen_touch_media", "Passenger's hand selecting a video app on a car's infotainment screen")],
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
              "make:Honda", "make:Mazda", "type:installation", "badge:Fitted in 1 hr"],
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
        tags=["reverse-cameras", "installation-services", "best-sellers", "make:BMW", "make:Audi",
              "make:Volkswagen", "make:Honda", "type:installation"],
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
            section("Models we fit", ul([
                "BMW: 1, 2, 3, 4, 5, 6, 7 and 8 Series, X1 to X7, Z4 and M models",
                "Audi: A1, A3, A4, A5, A6, A7, A8, Q2, Q3, Q5, Q7, Q8, TT and e-tron",
                "Volkswagen: Golf (including GTI and R), Passat, Polo, Tiguan, T-Roc, Touran, Caddy, Transporter, Amarok, Arteon and Taigo",
                "Honda: Civic, Jazz, Accord, CR-V, HR-V, e:Ny1, Insight and CR-Z",
            ])),
            section("Good to know", ul([
                "Prices are supply and fit for BMW, Audi, Volkswagen and Honda",
                "Whether your car has no camera or you're replacing a faulty one, we'll quote before you book",
                "Another make? Send us your reg for a free quote",
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
        images=["mg_vw_reverse_screen", "showroom"],
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
# Catalogue expansion (28 Sep 2026): MG's real Wix shop products + own-label demo stock so every
# collection shows 4-8 products. Variant tuples: (value, price, sku) or (value, price, sku, compare_at).
# ---------------------------------------------------------------------------------------------

MG_SHOP = "mg-shop"          # hardware MG really sells on its current Wix shop (real title and price)
DEMO_PRICE = "demo-price"    # installation service whose price is a placeholder (not on MG's site)
BADGE_1HR = "badge:Fitted in 1 hr"

CTA_FIT_OPTION = section(
    "Fitted at our Dublin 12 workshop",
    "<p>Choose <strong>Supplied &amp; fitted</strong> above and our technicians fit it at our workshop in "
    "Ballymount, Dublin 12, with hidden wiring and everything tested before you drive away. Book a slot with a "
    "<strong>€50 deposit</strong> (it comes off your final bill), or send us your reg on WhatsApp and we'll "
    "confirm it suits your car first.</p>",
)

CTA_COLLECT = section(
    "Collect or have it fitted in Dublin 12",
    "<p>Order online and collect from our workshop in Ballymount, Dublin 12, or we deliver across Ireland. "
    "Want it fitted? Add it to any fitting booking and we'll install it while your car is with us.</p>",
)


def fit(sku, price, fitted, compare=None, compare_fitted=None):
    """'Product only' / 'Supplied & fitted' variants, so the product page shows the fitting choice."""
    return [("Product only", price, sku) + ((compare,) if compare else ()),
            ("Supplied & fitted", fitted, sku + "-FIT") + ((compare_fitted,) if compare_fitted else ())]


def mf(make=("Universal",), models=(), screen="", fitted=""):
    return dict(car_make=list(make), car_model=list(models), screen_size=screen, fitted_price=fitted)


PRODUCTS += [
    # ================= MG's real Wix shop products =================
    dict(
        handle="jbl-stadium-52cf-speakers-set",
        title="JBL Stadium 52CF Speakers Set",
        vendor="JBL",
        type="Speakers",
        category=CAT_SPK_COMP,
        tags=["speakers", "best-sellers", "make:Universal", "type:speakers", MG_SHOP],
        body=body(
            "<strong>Iconic JBL sound, built on a 75-year pedigree of audio excellence, for virtually any car "
            "on the road.</strong> The Stadium Series brings high-output bass and crisp, detailed highs to a "
            "factory speaker upgrade.",
            section("Why drivers choose it", ul([
                "Plus One™ fibreglass woofers for high-output, deep and robust bass",
                "High-resolution ¾\" edge-driven textile dome tweeters with highs up to 40kHz",
                "Power handling 80W RMS, 240W peak",
                "Sensitivity 93dB (@ 2.83V), frequency response 55Hz–40kHz, impedance 3.0 ohms",
            ])),
            section("What's included", ul([
                "JBL Stadium 52CF speaker set",
                "Mounting hardware as supplied by JBL",
            ])),
            section("Good to know", ul([
                "The Stadium Series comes in 2\", 3\", 5¼\", 6½\", 6\" x 8\", 4\" x 6\", 6\" x 9\" and ¾\" sizes. Ask us which suits your doors",
                "Some cars need speaker adapters or a wiring harness, which we can supply",
                "Send us your reg and we'll confirm the fit before you buy",
            ])),
            section("Fitted at our Dublin 12 workshop",
                    "<p>Want them fitted? Our Speaker Fitting service is available at our workshop in Ballymount, "
                    "Dublin 12. Book a slot with a <strong>€50 deposit</strong>, or send us your reg on WhatsApp "
                    "for a fitted price.</p>"),
        ),
        seo_title="JBL Stadium 52CF Speakers Set, €189 | MG Car Audio",
        seo_description="JBL Stadium 52CF car speaker set: Plus One fibreglass woofers, ¾\" textile dome tweeters, 80W RMS. Supplied and fitted at our Dublin 12 workshop.",
        option_name="Title",
        variants=[("Default Title", "189.00", "MG-SPK-JBL-52CF")],
        images=["mg_jbl"],
        shipping=True, weight_g=2200, inventory=8,
        metafields=mf(),
    ),
    dict(
        handle="coaxial-speaker-pair",
        title="Coaxial Speaker Pair",
        type="Speakers",
        category=CAT_SPK_COAX,
        tags=["speakers", "make:Universal", "type:speakers", MG_SHOP],
        body=body(
            "<strong>A pair of quality coaxial car speakers</strong> integrating both woofer and tweeter into a "
            "single unit, designed for easy installation and balanced, full-range sound across the frequency "
            "spectrum.",
            section("Why drivers choose it", ul([
                "Woofer and tweeter in one unit: a simple swap for tired factory speakers",
                "Clearer vocals and fuller sound than most standard door speakers",
                "Easy installation in factory speaker positions",
            ])),
            section("What's included", ul([
                "Pair of coaxial speakers",
                "Grilles and mounting hardware",
            ])),
            section("Good to know", ul([
                "Tell us your car and we'll confirm the size for your doors or rear shelf",
                "Some cars need speaker adapters or a wiring harness, which we can supply",
            ])),
            section("Fitted at our Dublin 12 workshop",
                    "<p>Want them fitted? Book our Speaker Fitting service at our workshop in Ballymount, Dublin 12, "
                    "or send us your reg on WhatsApp for a fitted price.</p>"),
        ),
        seo_title="Coaxial Car Speaker Pair, €90 | MG Car Audio",
        seo_description="A pair of full-range coaxial car speakers with built-in tweeters, an easy upgrade from factory speakers. Supplied and fitted in Dublin 12.",
        option_name="Title",
        variants=[("Default Title", "90.00", "MG-SPK-COAX-PAIR")],
        images=["mg_speaker_pair"],
        shipping=True, weight_g=1400, inventory=12,
        metafields=mf(),
    ),
    dict(
        handle="compact-single-din",
        title="Compact Single-DIN Car Stereo",
        type="Car Stereo",
        category=CAT_AV,
        tags=["android-radios", "make:Universal", "type:car-stereo", MG_SHOP],
        body=body(
            "<strong>A versatile single-DIN car stereo</strong> with a detachable faceplate for security, AM/FM "
            "radio, and USB and auxiliary inputs for flexible playback from your phone or music stick.",
            section("Why drivers choose it", ul([
                "Detachable faceplate: take it with you and leave nothing to steal",
                "AM/FM radio tuner",
                "USB and auxiliary (3.5mm) inputs",
                "Fits the standard single-DIN opening found in many older cars",
            ])),
            section("What's included", ul([
                "Single-DIN head unit with detachable faceplate and case",
                "Mounting cage and wiring loom",
                "The fascia and harness adapter for your car are quoted separately",
            ])),
            section("Compatibility", ul([
                "Cars with a single-DIN radio opening, or a double-DIN opening with a pocket kit",
                "Send us your reg and we'll confirm the adapters your car needs",
            ])),
            section("Fitted at our Dublin 12 workshop",
                    "<p>Want it fitted? We fit radios at our workshop in Ballymount, Dublin 12. Book a slot with a "
                    "<strong>€50 deposit</strong>, or send us your reg on WhatsApp for a fitted price.</p>"),
        ),
        seo_title="Compact Single-DIN Car Stereo, €199 | MG Car Audio",
        seo_description="Single-DIN car stereo with detachable faceplate, AM/FM radio, USB and Aux inputs. Supplied and fitted at our Dublin 12 workshop.",
        option_name="Title",
        variants=[("Default Title", "199.00", "MG-RAD-SDIN")],
        images=["single_din_radio"],
        shipping=True, weight_g=1300, inventory=6,
        metafields=mf(),
    ),

    # ================= Android radios (demo) =================
    dict(
        handle="mg-select-10in-android-radio-wireless-carplay",
        title="MG Select 10.1\" Android Radio, Wireless CarPlay",
        type="Android Radio",
        category=CAT_AV,
        tags=["android-radios", "make:Universal", "type:android-radio", "wireless-carplay", "android-auto",
              HARDWARE],
        body=body(
            "<strong>Our biggest universal screen: a 10.1\" HD touchscreen</strong> with wireless Apple CarPlay "
            "and Android Auto, for cars with a double-DIN opening or a 10\" fascia kit.",
            section("Why drivers choose it", ul([
                "10.1\" HD IPS touchscreen, bright enough for sunny days",
                "Wireless Apple CarPlay and Android Auto",
                "4GB RAM / 64GB storage, with Android apps from Google Play",
                "Bluetooth calls and streaming, FM radio and a 32-band equaliser",
                "Reversing camera input and steering wheel control support (with the right adapter for your car)",
            ])),
            section("What's included", ul([
                "10.1\" Android head unit",
                "Wiring loom, GPS antenna and external microphone",
                "USB leads",
                "The fascia kit, harness adapter and steering wheel interface are specific to your car and quoted separately",
            ])),
            section("Compatibility", ul([
                "Cars with a double-DIN opening, or where a 10\" fascia kit is available",
                "Send us your reg and we'll confirm the fascia kit your car needs",
            ])),
            CTA_FIT_OPTION,
        ),
        seo_title="10.1\" Android Radio with Wireless CarPlay | MG Car Audio",
        seo_description="10.1-inch Android touchscreen radio with wireless CarPlay and Android Auto, 4GB/64GB. Supplied and fitted at our Dublin 12 workshop.",
        option_name="Fitting",
        variants=fit("MG-RAD-AND-10", "329.00", "479.00"),
        images=[("us_screen_red_trim", "Large touchscreen radio in a modern dashboard with red trim")],
        shipping=True, weight_g=1900, inventory=8,
        metafields=mf(screen="10.1\"", fitted="€479"),
    ),
    dict(
        handle="mg-select-7in-android-radio",
        title="MG Select 7\" Android Radio, Wired CarPlay & Android Auto",
        type="Android Radio",
        category=CAT_AV,
        tags=["android-radios", "make:Universal", "type:android-radio", "android-auto", HARDWARE],
        body=body(
            "<strong>The budget-friendly way to get maps, music and calls on a touchscreen.</strong> A 7\" "
            "double-DIN Android radio with wired Apple CarPlay and Android Auto.",
            section("Why drivers choose it", ul([
                "7\" touchscreen with wired Apple CarPlay and Android Auto",
                "2GB RAM / 32GB storage, with Android apps",
                "Bluetooth calls and streaming, plus FM radio",
                "Reversing camera input",
            ])),
            section("What's included", ul([
                "7\" double-DIN Android head unit",
                "Wiring loom, GPS antenna and microphone",
                "The fascia kit and harness adapter for your car are quoted separately",
            ])),
            section("Compatibility", ul([
                "Cars with a double-DIN radio opening, or where a double-DIN fascia kit is available",
                "Send us your reg and we'll confirm what your car needs",
            ])),
            CTA_FIT_OPTION,
        ),
        seo_title="7\" Android Radio with CarPlay & Android Auto | MG Car Audio",
        seo_description="Budget 7-inch double-DIN Android radio with wired CarPlay, Android Auto, Bluetooth and camera input. Supplied and fitted in Dublin 12.",
        option_name="Fitting",
        variants=fit("MG-RAD-AND-7", "179.00", "329.00"),
        images=[("us_headunit_blue", "Touchscreen car radio showing the time in a dark dashboard")],
        shipping=True, weight_g=1300, inventory=12,
        metafields=mf(screen="7\"", fitted="€329"),
    ),
    dict(
        handle="mg-select-9in-android-radio-kit-vw-golf-mk6",
        title="MG Select 9\" Android Radio Kit – VW Golf Mk6, Passat B6/B7 & Tiguan",
        type="Android Radio",
        category=CAT_AV,
        tags=["android-radios", "make:Volkswagen", "type:android-radio", "wireless-carplay", "android-auto",
              HARDWARE],
        body=body(
            "<strong>A complete, car-specific kit for older Volkswagens:</strong> a 9\" Android touchscreen with "
            "wireless CarPlay and Android Auto, plus the fascia and plug-in harness to make it look factory-fitted.",
            section("Why drivers choose it", ul([
                "9\" touchscreen in a VW-matched fascia, no gaps and no cutting",
                "Wireless Apple CarPlay and Android Auto",
                "Keeps steering wheel controls and the factory parking sensor display (where fitted)",
                "Bluetooth calls, FM radio and reversing camera input",
            ])),
            section("What's included", ul([
                "9\" Android head unit",
                "VW fascia kit and plug-in CAN-bus harness",
                "GPS antenna and external microphone",
            ])),
            section("Compatibility", ul([
                "Volkswagen Golf Mk6 (2008–2012), Passat B6/B7 (2005–2014), Tiguan (2007–2016), Touran and Caddy with RCD or RNS radios",
                "Send us your reg and a photo of your radio and we'll confirm the fit",
            ])),
            CTA_FIT_OPTION,
        ),
        seo_title="VW Golf Mk6 9\" Android Radio Kit, CarPlay | MG Car Audio",
        seo_description="9-inch Android radio kit for VW Golf Mk6, Passat B6/B7 and Tiguan with wireless CarPlay, fascia and harness. Fitted in Dublin 12.",
        option_name="Fitting",
        variants=fit("MG-RAD-VW-9", "349.00", "499.00"),
        images=[("us_double_din_dash", "Double-DIN touchscreen radio fitted in a car's centre console")],
        shipping=True, weight_g=2000, inventory=6,
        metafields=mf(make=["Volkswagen"], models=["Golf (Mk6)", "Passat (B6/B7)", "Tiguan (5N)"],
                      screen="9\"", fitted="€499"),
    ),

    # ================= Screen upgrades (demo) =================
    dict(
        handle="android-screen-upgrade-bmw-f10-10-25",
        title="10.25\" Android Screen Upgrade – BMW 5 Series (F10/F11)",
        type="Android Screen Upgrade",
        category=CAT_AV,
        tags=["screen-upgrades", "make:BMW", "type:screen-upgrade", "wireless-carplay", "android-auto",
              HARDWARE],
        body=body(
            "<strong>A 10.25\" widescreen for the F10 5 Series</strong> with wireless Apple CarPlay and Android "
            "Auto, sitting in the original screen position with an OEM-style frame.",
            section("Why drivers choose it", ul([
                "10.25\" anti-glare touchscreen",
                "Wireless CarPlay and Android Auto, plus Android apps",
                "Original iDrive menus and car settings one press away",
                "Keeps the iDrive controller, steering wheel buttons and factory reversing camera",
            ])),
            section("What's included", ul([
                "10.25\" display unit with mounting bracket",
                "Plug-in harness for your iDrive version (choose it above)",
                "GPS antenna and external microphone",
            ])),
            section("Compatibility", ul([
                "BMW 5 Series F10 saloon and F11 touring (approx. 2010–2017)",
                "Cars with iDrive CIC or NBT",
                "Send us your reg and a photo of your dash and we'll confirm the fit",
            ])),
            CTA_HARDWARE,
        ),
        seo_title="BMW F10 10.25\" Android Screen with CarPlay | MG Car Audio",
        seo_description="10.25-inch Android widescreen for the BMW 5 Series F10/F11 with wireless CarPlay and Android Auto. Keeps iDrive. Fitted in Dublin 12.",
        option_name="Original iDrive",
        variants=[("CIC (approx. 2010–2013)", "599.00", "MG-SCR-BMW-F10-CIC"),
                  ("NBT (approx. 2013–2017)", "599.00", "MG-SCR-BMW-F10-NBT")],
        images=["th_hero_3"],
        shipping=True, weight_g=1800, inventory=5,
        metafields=mf(make=["BMW"], models=["5 Series (F10/F11)"], screen="10.25\"", fitted="€749"),
    ),
    dict(
        handle="bmw-e90-8-8-android-screen-upgrade",
        title="8.8\" Android Screen Upgrade – BMW 3 Series (E90/E91/E92)",
        type="Android Screen Upgrade",
        category=CAT_AV,
        tags=["screen-upgrades", "make:BMW", "type:screen-upgrade", "wireless-carplay", "android-auto",
              HARDWARE],
        body=body(
            "<strong>Bring the E90 up to date:</strong> an 8.8\" widescreen with wireless Apple CarPlay and "
            "Android Auto that sits neatly in the dash, with no loose tablets or suction mounts.",
            section("Why drivers choose it", ul([
                "8.8\" touchscreen in an OEM-style housing",
                "Wireless CarPlay and Android Auto",
                "Works with the iDrive controller where fitted, and the steering wheel buttons",
                "Reversing camera input",
            ])),
            section("What's included", ul([
                "8.8\" display unit with mounting bracket",
                "Plug-in harness (choose Product only or Supplied & fitted above)",
                "GPS antenna and external microphone",
            ])),
            section("Compatibility", ul([
                "BMW 3 Series E90 saloon, E91 touring and E92/E93 coupé and convertible (approx. 2005–2012)",
                "With or without factory navigation. Send us a photo of your dash and we'll confirm the kit",
            ])),
            CTA_FIT_OPTION,
        ),
        seo_title="BMW E90 8.8\" Android Screen with CarPlay | MG Car Audio",
        seo_description="8.8-inch Android widescreen for BMW 3 Series E90, E91 and E92 with wireless CarPlay and Android Auto. Supplied and fitted in Dublin 12.",
        option_name="Fitting",
        variants=fit("MG-SCR-BMW-E90", "449.00", "599.00", compare="499.00", compare_fitted="649.00"),
        images=[("us_screen_dash_dark", "Widescreen display in a dark dashboard with the air vents below")],
        shipping=True, weight_g=1600, inventory=5,
        metafields=mf(make=["BMW"], models=["3 Series (E90/E91)", "3 Series (E92/E93)"], screen="8.8\"",
                      fitted="€599"),
    ),
    dict(
        handle="android-screen-upgrade-audi-a4-b8-10-25",
        title="10.25\" Android Screen Upgrade – Audi A4 (B8) & A5 (8T)",
        type="Android Screen Upgrade",
        category=CAT_AV,
        tags=["screen-upgrades", "make:Audi", "type:screen-upgrade", "wireless-carplay", "android-auto",
              HARDWARE],
        body=body(
            "<strong>Replace the small MMI display with a 10.25\" widescreen</strong> with wireless Apple CarPlay "
            "and Android Auto, finished to match your Audi's dash.",
            section("Why drivers choose it", ul([
                "10.25\" anti-glare touchscreen in an Audi-style frame",
                "Wireless CarPlay and Android Auto",
                "Original MMI radio and car settings stay available",
                "Keeps the MMI dial, steering wheel buttons and factory camera where fitted",
            ])),
            section("What's included", ul([
                "10.25\" display unit with mounting bracket",
                "Plug-in harness for MMI 3G, 3G+ or Concert/Symphony",
                "GPS antenna and external microphone",
            ])),
            section("Compatibility", ul([
                "Audi A4 (B8, approx. 2008–2016) and A5 (8T, approx. 2007–2016)",
                "Send us your reg and a photo of your MMI screen and we'll confirm the fit",
            ])),
            CTA_FIT_OPTION,
        ),
        seo_title="Audi A4 B8 10.25\" Android Screen with CarPlay | MG Car Audio",
        seo_description="10.25-inch Android widescreen for Audi A4 B8 and A5 8T with wireless CarPlay and Android Auto. Keeps MMI. Supplied and fitted in Dublin 12.",
        option_name="Fitting",
        variants=fit("MG-SCR-AUDI-B8", "579.00", "729.00"),
        images=[("us_screen_centre", "Widescreen navigation display mounted above the centre console of an Audi-style dash")],
        shipping=True, weight_g=1800, inventory=5,
        metafields=mf(make=["Audi"], models=["A4 (B8)", "A5 (8T)"], screen="10.25\"", fitted="€729"),
    ),
    dict(
        handle="android-screen-upgrade-mercedes-a-class-w176",
        title="10.25\" Android Screen Upgrade – Mercedes-Benz A-Class (W176), CLA & GLA",
        type="Android Screen Upgrade",
        category=CAT_AV,
        tags=["screen-upgrades", "make:Mercedes-Benz", "type:screen-upgrade", "wireless-carplay",
              "android-auto", HARDWARE],
        body=body(
            "<strong>A 10.25\" widescreen for the compact Mercedes range</strong> with wireless Apple CarPlay and "
            "Android Auto, replacing the original tablet-style display.",
            section("Why drivers choose it", ul([
                "10.25\" anti-glare touchscreen that fits the original screen mount",
                "Wireless CarPlay and Android Auto",
                "Original Mercedes menus stay one press away",
                "Keeps the rotary controller, steering wheel buttons and reversing camera",
            ])),
            section("What's included", ul([
                "10.25\" display unit",
                "Plug-in harness for NTG 4.5 or NTG 5",
                "GPS antenna and external microphone",
            ])),
            section("Compatibility", ul([
                "Mercedes-Benz A-Class (W176), CLA (C117), GLA (X156) and B-Class (W246), approx. 2012–2019",
                "Send us your reg and a photo of your dash and we'll confirm the fit",
            ])),
            CTA_FIT_OPTION,
        ),
        seo_title="Mercedes A-Class W176 Android Screen, CarPlay | MG Car Audio",
        seo_description="10.25-inch Android widescreen for Mercedes A-Class W176, CLA, GLA and B-Class with wireless CarPlay. Supplied and fitted in Dublin 12.",
        option_name="Fitting",
        variants=fit("MG-SCR-MB-W176", "549.00", "699.00"),
        images=[("us_nav_screen_dash", "Touchscreen navigation display in a modern car dashboard")],
        shipping=True, weight_g=1700, inventory=5,
        metafields=mf(make=["Mercedes-Benz"], models=["A-Class (W176)", "CLA (C117)", "GLA (X156)", "B-Class (W246)"],
                      screen="10.25\"", fitted="€699"),
    ),

    # ================= Speakers (demo) =================
    dict(
        handle="mg-select-6-5in-component-speakers",
        title="MG Select 6.5\" Component Speaker Set",
        type="Speakers",
        category=CAT_SPK_COMP,
        tags=["speakers", "make:Universal", "type:speakers", HARDWARE],
        body=body(
            "<strong>The single biggest improvement you can make to a factory system.</strong> Separate 6.5\" "
            "woofers and silk-dome tweeters put the sound up at ear level, with clearer vocals and tighter bass.",
            section("Why drivers choose it", ul([
                "6.5\" (165mm) woofers with separate 25mm silk-dome tweeters",
                "Passive crossovers for a smooth, natural sound",
                "Runs well on a factory radio and sounds even better with an amplifier",
                "70W RMS per side, 4 ohms",
            ])),
            section("What's included", ul([
                "Pair of 6.5\" woofers and pair of tweeters",
                "Crossovers, tweeter mounts and grilles",
            ])),
            section("Compatibility", ul([
                "Front doors of most cars with a 6.5\" (165mm) speaker, using car-specific adapters where needed",
                "Send us your reg and we'll confirm the adapters for your car",
            ])),
            CTA_FIT_OPTION,
        ),
        seo_title="6.5\" Component Car Speakers, Supplied & Fitted | MG Car Audio",
        seo_description="6.5-inch component speaker set with silk-dome tweeters and crossovers. Clearer vocals, tighter bass. Supplied and fitted at our Dublin 12 workshop.",
        option_name="Fitting",
        variants=fit("MG-SPK-COMP-65", "149.00", "228.00"),
        images=[("us_speaker_group", "Assortment of car speakers, woofers and tweeters on a dark background")],
        shipping=True, weight_g=2400, inventory=10,
        metafields=mf(fitted="€228"),
    ),
    dict(
        handle="mg-select-6x9-coaxial-speakers",
        title="MG Select 6x9\" 3-Way Coaxial Speakers",
        type="Speakers",
        category=CAT_SPK_COAX,
        tags=["speakers", "make:Universal", "type:speakers", HARDWARE],
        body=body(
            "<strong>Big oval speakers for the rear shelf or doors</strong>, with a 3-way design that fills the "
            "car with sound.",
            section("Why drivers choose it", ul([
                "6x9\" 3-way design: woofer, midrange and tweeter",
                "80W RMS, 4 ohms",
                "Deeper bass than standard round speakers",
            ])),
            section("What's included", ul([
                "Pair of 6x9\" speakers with grilles",
                "Mounting hardware",
            ])),
            section("Compatibility", ul([
                "Cars with 6x9\" rear shelf or door positions, including many Ford, Toyota and Nissan models",
                "Send us your reg and we'll confirm the fit",
            ])),
            CTA_FIT_OPTION,
        ),
        seo_title="6x9\" 3-Way Car Speakers, Supplied & Fitted | MG Car Audio",
        seo_description="6x9-inch 3-way coaxial car speakers, 80W RMS, for rear shelves and doors. Supplied and fitted at our Dublin 12 workshop.",
        option_name="Fitting",
        variants=fit("MG-SPK-6X9", "99.00", "158.00"),
        images=[("us_speaker_bunch", "Car speakers of different sizes laid out together")],
        shipping=True, weight_g=2600, inventory=10,
        metafields=mf(fitted="€158"),
    ),
    dict(
        handle="mg-select-3-5in-dash-speakers",
        title="MG Select 3.5\" Dash Speaker Pair",
        type="Speakers",
        category=CAT_SPK_MID,
        tags=["speakers", "make:Universal", "type:speakers", HARDWARE],
        body=body(
            "<strong>Replace the tinny factory dash speakers</strong> with a 3.5\" pair that brings vocals up to "
            "ear level.",
            section("Why drivers choose it", ul([
                "3.5\" (87mm) full-range drivers",
                "Clear, detailed midrange for vocals and podcasts",
                "Shallow mounting depth for dash and pillar positions",
            ])),
            section("What's included", ul([
                "Pair of 3.5\" speakers",
                "Mounting hardware",
            ])),
            section("Compatibility", ul([
                "Dash top and A-pillar positions in many VW, Audi, Skoda, SEAT and Toyota models",
                "Send us your reg and we'll confirm the fit",
            ])),
            CTA_FIT_OPTION,
        ),
        seo_title="3.5\" Dash Speaker Pair, Supplied & Fitted | MG Car Audio",
        seo_description="3.5-inch full-range dash speakers for clearer vocals at ear level. Shallow fit for dash and pillar positions. Fitted in Dublin 12.",
        option_name="Fitting",
        variants=fit("MG-SPK-DASH-35", "69.00", "118.00"),
        images=[("us_dash_speaker", "Speaker grille on top of a car dashboard")],
        shipping=True, weight_g=600, inventory=12,
        metafields=mf(fitted="€118"),
    ),
    dict(
        handle="bmw-speaker-upgrade-kit-f-series",
        title="BMW Plug-and-Play Speaker Upgrade Kit – F-Series",
        type="Speakers",
        category=CAT_SPK,
        tags=["speakers", "make:BMW", "type:speakers", HARDWARE],
        body=body(
            "<strong>A direct-fit upgrade for BMW's standard hi-fi:</strong> 4\" midrange door speakers and 8\" "
            "under-seat woofers that plug straight into the factory connectors.",
            section("Why drivers choose it", ul([
                "8\" under-seat woofers for noticeably deeper bass",
                "4\" midrange door speakers for clearer vocals",
                "Plug-and-play: no cutting of factory wiring",
                "Works with the factory radio, CarPlay interfaces and screen upgrades",
            ])),
            section("What's included", ul([
                "Pair of 8\" under-seat woofers",
                "Pair of 4\" door midrange speakers",
                "Plug-in adapters",
            ])),
            section("Compatibility", ul([
                "BMW F-series with under-seat woofers: 1 Series (F20/F21), 2 Series (F22), 3 Series (F30/F31), 4 Series (F32/F36), X1 (F48)",
                "Send us your reg and we'll confirm your car's speaker layout",
            ])),
            CTA_FIT_OPTION,
        ),
        seo_title="BMW F-Series Speaker Upgrade Kit, Plug and Play | MG Car Audio",
        seo_description="Plug-and-play speaker upgrade for BMW F-series: 8\" under-seat woofers and 4\" door speakers, no cutting. Supplied and fitted in Dublin 12.",
        option_name="Fitting",
        variants=fit("MG-SPK-BMW-F", "299.00", "399.00"),
        images=["th_door_grille"],
        shipping=True, weight_g=4200, inventory=6,
        metafields=mf(make=["BMW"], models=["1 Series (F20/F21)", "2 Series (F22/F23)", "3 Series (F30/F31)",
                                            "4 Series (F32/F33/F36)", "X1 (F48)"], fitted="€399"),
    ),
    dict(
        handle="speaker-fitting",
        title="Speaker Fitting (per pair)",
        type="Installation",
        category="",
        tags=["speakers", "make:Universal", "type:installation", DEMO_PRICE, BADGE_1HR],
        body=body(
            "<strong>Speakers you bought elsewhere, or from us, fitted properly.</strong> We fit door, dash and "
            "rear speakers with the right adapters so they sound as good as they should.",
            section("What's included", ul([
                "Removal of door cards or trim and the old speakers",
                "Fitting your new speakers with adapters and sound-deadening pads",
                "Tweeter and crossover mounting for component sets",
                "Sound check before you leave",
            ])),
            section("Good to know", ul([
                "About 1 hour per pair on most cars",
                "Price is per pair. Car-specific adapters or harnesses are extra if your car needs them",
                "Send us your reg and we'll confirm the price before you book",
            ])),
            CTA_SERVICE,
        ),
        seo_title="Car Speaker Fitting in Dublin | MG Car Audio",
        seo_description="Professional car speaker fitting per pair: doors, dash and rear shelf, with adapters and a sound check. About an hour at our Dublin 12 workshop.",
        option_name="Title",
        variants=[("Default Title", "79.00", "MG-SVC-SPK-FIT")],
        images=["mg_door_speaker"],
        shipping=False, weight_g=None, inventory=None,
        metafields=mf(fitted="€79"),
    ),

    # ================= Subwoofers (demo) =================
    dict(
        handle="mg-select-10in-underseat-active-subwoofer",
        title="MG Select 10\" Compact Active Subwoofer",
        type="Subwoofer",
        category=CAT_SUB,
        tags=["subwoofers", "make:Universal", "type:subwoofer", HARDWARE],
        body=body(
            "<strong>Real bass without losing your boot.</strong> A compact powered subwoofer with its own "
            "built-in amplifier, small enough to fit under a seat or in the spare wheel well.",
            section("Why drivers choose it", ul([
                "10\" driver in a slim aluminium enclosure",
                "Built-in 150W RMS amplifier",
                "Remote bass level control",
                "Works with factory radios through high-level inputs",
            ])),
            section("What's included", ul([
                "Active subwoofer with built-in amplifier",
                "Wiring kit and bass remote",
            ])),
            section("Compatibility", ul([
                "Most cars with space under the front seat or in the boot",
                "Send us your reg and we'll confirm where it will fit",
            ])),
            CTA_FIT_OPTION,
        ),
        seo_title="10\" Compact Active Car Subwoofer | MG Car Audio",
        seo_description="Compact 10-inch powered subwoofer with built-in 150W amp, fits under a seat. Works with factory radios. Supplied and fitted in Dublin 12.",
        option_name="Fitting",
        variants=fit("MG-SUB-ACT-10", "179.00", "279.00"),
        images=[("us_sub_floor", "Compact subwoofer enclosure standing on a wooden floor")],
        shipping=True, weight_g=5500, inventory=8,
        metafields=mf(fitted="€279"),
    ),
    dict(
        handle="mg-select-10in-slim-active-subwoofer-enclosure",
        title="MG Select 10\" Active Subwoofer Enclosure, 300W",
        type="Subwoofer",
        category=CAT_SUB,
        tags=["subwoofers", "make:Universal", "type:subwoofer", HARDWARE],
        body=body(
            "<strong>Plug-in bass for any car.</strong> A 10\" subwoofer in a sealed boot enclosure with a "
            "300W amplifier built in, so there's no separate amp to fit.",
            section("Why drivers choose it", ul([
                "10\" subwoofer in a sealed, carpeted enclosure",
                "Built-in 300W RMS amplifier",
                "High-level inputs for factory radios, RCA inputs for aftermarket radios",
            ])),
            section("What's included", ul([
                "Active subwoofer enclosure",
                "Wiring kit and bass remote",
            ])),
            section("Compatibility", ul([
                "Most hatchbacks, saloons and estates",
                "Send us your reg and we'll confirm the fit",
            ])),
            CTA_FIT_OPTION,
        ),
        seo_title="10\" Active Subwoofer Enclosure 300W | MG Car Audio",
        seo_description="10-inch active subwoofer enclosure with a built-in 300W amplifier. Works with factory and aftermarket radios. Supplied and fitted in Dublin 12.",
        option_name="Fitting",
        variants=fit("MG-SUB-ENC-10A", "249.00", "349.00"),
        images=["th_subs_amps"],
        shipping=True, weight_g=11000, inventory=6,
        metafields=mf(fitted="€349"),
    ),
    dict(
        handle="mg-select-12in-subwoofer-ported-enclosure",
        title="MG Select 12\" Subwoofer in Ported Enclosure",
        type="Subwoofer",
        category=CAT_SUB,
        tags=["subwoofers", "make:Universal", "type:subwoofer", HARDWARE],
        body=body(
            "<strong>Deep, loud bass you can feel.</strong> A 12\" subwoofer in a tuned ported enclosure, ready to "
            "pair with a mono amplifier.",
            section("Why drivers choose it", ul([
                "12\" subwoofer, 400W RMS",
                "Ported enclosure tuned for deep, punchy bass",
                "Carpeted finish to match most boots",
            ])),
            section("What's included", ul([
                "12\" subwoofer fitted in a ported enclosure",
                "Needs an amplifier: see our Mono Sub Amplifier or the Bass Package",
            ])),
            section("Compatibility", ul([
                "Most hatchbacks, saloons and estates with boot space for a 12\" enclosure",
                "Send us your reg and we'll confirm the fit",
            ])),
            CTA_FIT_OPTION,
        ),
        seo_title="12\" Car Subwoofer in Ported Enclosure | MG Car Audio",
        seo_description="12-inch 400W car subwoofer in a tuned ported enclosure for deep, punchy bass. Supplied and fitted at our Dublin 12 workshop.",
        option_name="Fitting",
        variants=fit("MG-SUB-ENC-12P", "229.00", "319.00"),
        images=[("us_sub_box_boot", "Subwoofer enclosure fitted in the boot of a hatchback")],
        shipping=True, weight_g=16000, inventory=4,
        metafields=mf(fitted="€319"),
    ),
    dict(
        handle="mg-select-12in-subwoofer-driver",
        title="MG Select 12\" Subwoofer Driver, Dual Voice Coil",
        type="Subwoofer",
        category=CAT_WOOFER,
        tags=["subwoofers", "make:Universal", "type:subwoofer", HARDWARE],
        body=body(
            "<strong>For custom builds and enclosure upgrades:</strong> a 12\" dual voice coil subwoofer driver "
            "with plenty of power handling.",
            section("Why drivers choose it", ul([
                "12\" driver, 500W RMS",
                "Dual 2-ohm voice coils for flexible wiring",
                "Suits sealed or ported enclosures",
            ])),
            section("What's included", ul([
                "12\" subwoofer driver",
                "Enclosure and amplifier are not included",
            ])),
            section("Good to know", ul([
                "We build and fit custom enclosures. Ask us for a quote",
                "Pairs well with our Mono Sub Amplifier",
            ])),
            CTA_COLLECT,
        ),
        seo_title="12\" Dual Voice Coil Subwoofer Driver | MG Car Audio",
        seo_description="12-inch dual voice coil car subwoofer driver, 500W RMS, for sealed or ported enclosures. Collect or have it fitted in Dublin 12.",
        option_name="Title",
        variants=[("Default Title", "99.00", "MG-SUB-DRV-12")],
        images=[("us_woofers_pair", "Pair of subwoofer drivers with blue cones on a black background")],
        shipping=True, weight_g=6500, inventory=6,
        metafields=mf(),
    ),
    dict(
        handle="bass-package-12in-subwoofer-amplifier",
        title="Bass Package: 12\" Subwoofer, Mono Amplifier & Wiring Kit",
        type="Subwoofer",
        category=CAT_SUB,
        tags=["subwoofers", "amplifiers", "make:Universal", "type:subwoofer", HARDWARE],
        body=body(
            "<strong>Everything you need for proper bass, in one box.</strong> A 12\" ported subwoofer, a matched "
            "mono amplifier and a full wiring kit.",
            section("Why drivers choose it", ul([
                "12\" subwoofer in a ported enclosure, 400W RMS",
                "Matched Class-D mono amplifier with bass remote",
                "Works with factory radios through high-level inputs",
                "Save compared with buying each part separately",
            ])),
            section("What's included", ul([
                "12\" subwoofer in ported enclosure",
                "Mono Class-D amplifier",
                "4 AWG wiring kit with fuse holder",
            ])),
            section("Compatibility", ul([
                "Most hatchbacks, saloons and estates",
                "Send us your reg and we'll confirm the fit",
            ])),
            CTA_FIT_OPTION,
        ),
        seo_title="Car Bass Package: 12\" Sub, Amp & Wiring Kit | MG Car Audio",
        seo_description="12-inch subwoofer, matched mono amplifier and wiring kit in one package. Works with factory radios. Supplied and fitted in Dublin 12.",
        option_name="Fitting",
        variants=fit("MG-SUB-PKG-12", "449.00", "599.00", compare="529.00", compare_fitted="689.00"),
        images=[("us_boot_build", "Custom subwoofer and amplifier build in a car boot with green lighting")],
        shipping=True, weight_g=21000, inventory=4,
        metafields=mf(fitted="€599"),
    ),
    dict(
        handle="subwoofer-amplifier-installation",
        title="Subwoofer & Amplifier Installation",
        type="Installation",
        category="",
        tags=["subwoofers", "amplifiers", "make:Universal", "type:installation", DEMO_PRICE],
        body=body(
            "<strong>Bought a sub and amp? We'll fit them safely and neatly.</strong> A proper power cable from "
            "the battery, hidden wiring and the amp set up so the bass is deep and clean.",
            section("What's included", ul([
                "Power cable from the battery with an inline fuse",
                "Hidden signal and remote wiring",
                "Mounting the amplifier and securing the subwoofer",
                "Gain and crossover set-up, plus a sound check",
            ])),
            section("Good to know", ul([
                "About 2 to 3 hours on most cars",
                "Price is for fitting only. Wiring kit extra if you don't have one",
                "Send us your reg and we'll confirm the price before you book",
            ])),
            CTA_SERVICE,
        ),
        seo_title="Subwoofer & Amplifier Installation, Dublin | MG Car Audio",
        seo_description="Professional subwoofer and amplifier installation: fused power cable, hidden wiring and amp set-up. At our Dublin 12 workshop.",
        option_name="Title",
        variants=[("Default Title", "149.00", "MG-SVC-SUB-AMP")],
        images=["th_workshop"],
        shipping=False, weight_g=None, inventory=None,
        metafields=mf(fitted="€149"),
    ),

    # ================= Amplifiers (demo) =================
    dict(
        handle="mg-select-4-channel-amplifier",
        title="MG Select 4-Channel Class-D Amplifier, 4 x 80W",
        type="Amplifier",
        category=CAT_AMP,
        tags=["amplifiers", "make:Universal", "type:amplifier", HARDWARE],
        body=body(
            "<strong>Clean power for your speakers.</strong> A compact 4-channel Class-D amplifier that makes "
            "upgraded speakers come alive, even with a factory radio.",
            section("Why drivers choose it", ul([
                "4 x 80W RMS at 4 ohms, bridgeable to 2 x 200W",
                "Class-D design runs cool and fits under a seat",
                "High-level inputs for factory radios",
                "Adjustable high- and low-pass crossovers",
            ])),
            section("What's included", ul([
                "4-channel amplifier",
                "Mounting screws and speaker terminal plugs",
                "Wiring kit sold separately",
            ])),
            section("Compatibility", ul([
                "Works with factory and aftermarket radios",
                "Send us your reg and we'll recommend the right set-up",
            ])),
            CTA_FIT_OPTION,
        ),
        seo_title="4-Channel Car Amplifier 4 x 80W | MG Car Audio",
        seo_description="Compact 4-channel Class-D car amplifier, 4 x 80W RMS, with high-level inputs for factory radios. Supplied and fitted in Dublin 12.",
        option_name="Fitting",
        variants=fit("MG-AMP-4CH-80", "199.00", "319.00"),
        images=[("us_amp_board_hand", "Technician working on an amplifier circuit board with a screwdriver")],
        shipping=True, weight_g=2100, inventory=6,
        metafields=mf(fitted="€319"),
    ),
    dict(
        handle="mg-select-mono-sub-amplifier",
        title="MG Select Mono Sub Amplifier, 1 x 500W",
        type="Amplifier",
        category=CAT_AMP,
        tags=["amplifiers", "make:Universal", "type:amplifier", HARDWARE],
        body=body(
            "<strong>Built to drive a subwoofer.</strong> A monoblock Class-D amplifier with bass boost and a "
            "remote level control.",
            section("Why drivers choose it", ul([
                "1 x 500W RMS at 2 ohms",
                "Variable low-pass filter and subsonic filter",
                "Remote bass level knob",
                "High-level inputs for factory radios",
            ])),
            section("What's included", ul([
                "Mono amplifier and bass remote",
                "Wiring kit sold separately",
            ])),
            section("Compatibility", ul([
                "Pairs with our 12\" subwoofer driver and enclosures",
                "Works with factory and aftermarket radios",
            ])),
            CTA_FIT_OPTION,
        ),
        seo_title="Mono Subwoofer Amplifier 500W | MG Car Audio",
        seo_description="Class-D mono subwoofer amplifier, 500W RMS at 2 ohms, with bass remote and high-level inputs. Supplied and fitted in Dublin 12.",
        option_name="Fitting",
        variants=fit("MG-AMP-MONO-500", "179.00", "299.00"),
        images=[("us_circuit_blue", "Close-up of an amplifier circuit board with electronic components")],
        shipping=True, weight_g=2400, inventory=6,
        metafields=mf(fitted="€299"),
    ),
    dict(
        handle="mg-select-micro-4-channel-amplifier",
        title="MG Select Micro 4-Channel Amplifier, Behind-the-Radio",
        type="Amplifier",
        category=CAT_AMP,
        tags=["amplifiers", "make:Universal", "type:amplifier", HARDWARE],
        body=body(
            "<strong>Small enough to hide behind the radio.</strong> A micro amplifier that doubles the power to "
            "your speakers without taking up any space.",
            section("Why drivers choose it", ul([
                "4 x 50W RMS in a palm-sized case",
                "Fits behind the radio or dash",
                "Ideal for CarPlay interfaces and screen upgrades",
            ])),
            section("What's included", ul([
                "Micro 4-channel amplifier",
                "Plug-in harness adapters are car-specific and quoted separately",
            ])),
            section("Compatibility", ul([
                "Most factory and aftermarket radios",
                "Send us your reg and we'll confirm the harness your car needs",
            ])),
            CTA_FIT_OPTION,
        ),
        seo_title="Micro 4-Channel Car Amplifier | MG Car Audio",
        seo_description="Palm-sized 4-channel car amplifier, 4 x 50W, that fits behind the radio. Ideal with CarPlay upgrades. Supplied and fitted in Dublin 12.",
        option_name="Fitting",
        variants=fit("MG-AMP-MICRO-4", "149.00", "249.00"),
        images=[("us_circuit_green", "Close-up of a green circuit board with capacitors and resistors")],
        shipping=True, weight_g=700, inventory=8,
        metafields=mf(fitted="€249"),
    ),
    dict(
        handle="bmw-plug-and-play-dsp-amplifier",
        title="BMW Plug-and-Play 8-Channel DSP Amplifier",
        type="Amplifier",
        category=CAT_DSP,
        tags=["amplifiers", "make:BMW", "type:amplifier", HARDWARE],
        body=body(
            "<strong>The upgrade that makes BMW's standard audio sound premium.</strong> An 8-channel DSP amplifier "
            "that plugs into the factory harness and is tuned to your car.",
            section("Why drivers choose it", ul([
                "8-channel amplifier with built-in digital sound processor",
                "Plug-and-play into the factory BMW harness, no cutting",
                "Custom tuning for your car's speakers and cabin",
                "Pairs perfectly with our BMW speaker upgrade kit",
            ])),
            section("What's included", ul([
                "8-channel DSP amplifier",
                "BMW plug-in harness",
                "Tuning when supplied and fitted",
            ])),
            section("Compatibility", ul([
                "BMW F-series and G-series with standard or hi-fi audio",
                "Send us your reg and we'll confirm the harness for your car",
            ])),
            CTA_FIT_OPTION,
        ),
        seo_title="BMW Plug-and-Play DSP Amplifier | MG Car Audio",
        seo_description="8-channel DSP amplifier for BMW F and G-series that plugs into the factory harness, tuned to your car. Supplied and fitted in Dublin 12.",
        option_name="Fitting",
        variants=fit("MG-AMP-BMW-DSP", "399.00", "549.00"),
        images=[("us_car_interior_doors", "Car interior seen through the open door, with door speakers")],
        shipping=True, weight_g=1200, inventory=4,
        metafields=mf(make=["BMW"], models=["1 Series (F20/F21)", "3 Series (F30/F31)", "4 Series (F32/F33/F36)",
                                            "3 Series (G20/G21)", "5 Series (G30/G31)"], fitted="€549"),
    ),
    dict(
        handle="amplifier-wiring-kit-4awg",
        title="4 AWG Amplifier Wiring Kit",
        type="Accessory",
        category=CAT_ELECTRONICS,
        tags=["amplifiers", "accessories", "make:Universal", "type:accessory", HARDWARE],
        body=body(
            "<strong>Everything you need to power an amplifier safely.</strong> The same kit we use in our own "
            "installs.",
            section("What's included", ul([
                "5m 4 AWG power cable and 1m earth cable",
                "Inline fuse holder and 80A fuse",
                "5m twin RCA lead and remote wire",
                "Ring terminals and cable ties",
            ])),
            section("Good to know", ul([
                "Suits amplifiers up to about 800W RMS",
                "Included at no extra cost when you choose Supplied & fitted on any of our amplifiers",
            ])),
            CTA_COLLECT,
        ),
        seo_title="4 AWG Car Amplifier Wiring Kit | MG Car Audio",
        seo_description="Complete 4 AWG amplifier wiring kit with fuse holder, RCA lead and remote wire. Collect from our Dublin 12 workshop or have it fitted.",
        option_name="Title",
        variants=[("Default Title", "59.00", "MG-ACC-AMPKIT-4")],
        images=["th_wiring"],
        shipping=True, weight_g=1800, inventory=15,
        metafields=mf(),
    ),

    # ================= Dashcams (demo) =================
    dict(
        handle="mg-select-2k-front-dash-cam",
        title="MG Select 2K Front Dash Cam, Wi-Fi & GPS",
        type="Dash Cam",
        category=CAT_ELECTRONICS,
        tags=["dashcams", "make:Universal", "type:dashcam", HARDWARE],
        body=body(
            "<strong>A small, discreet dash cam that records every drive in sharp 2K.</strong> Tucks behind the "
            "mirror so you barely see it.",
            section("Why drivers choose it", ul([
                "2K (1440p) front recording with wide-angle lens",
                "Wi-Fi app to view and save clips on your phone",
                "GPS speed and location on your footage",
                "Automatic incident recording when a bump is detected",
            ])),
            section("What's included", ul([
                "Front dash cam with adhesive mount",
                "32GB microSD card",
                "12V power lead (hard-wire kit available)",
            ])),
            section("Compatibility", ul([
                "Fits any car",
                "Parking mode needs our Dash Cam Hard-Wire Kit",
            ])),
            CTA_FIT_OPTION,
        ),
        seo_title="2K Front Dash Cam with Wi-Fi & GPS | MG Car Audio",
        seo_description="Discreet 2K front dash cam with Wi-Fi app, GPS and incident recording. Supplied, or hard-wired with no trailing cables in Dublin 12.",
        option_name="Fitting",
        variants=fit("MG-CAM-DASH-2K", "119.00", "198.00"),
        images=[("us_dashcam_mirror", "Dash cam mounted behind the rear-view mirror")],
        shipping=True, weight_g=300, inventory=12,
        metafields=mf(fitted="€198"),
    ),
    dict(
        handle="mg-select-front-rear-dash-cam",
        title="MG Select Front & Rear Dash Cam, 2K + 1080p",
        type="Dash Cam",
        category=CAT_ELECTRONICS,
        tags=["dashcams", "best-sellers", "make:Universal", "type:dashcam", HARDWARE],
        body=body(
            "<strong>Cover both ends of the car.</strong> 2K at the front and Full HD at the back, hard-wired so "
            "there are no cables across your dash.",
            section("Why drivers choose it", ul([
                "2K front and 1080p rear cameras",
                "Wi-Fi app and GPS",
                "Parking mode when hard-wired",
                "Loop recording with automatic incident protection",
            ])),
            section("What's included", ul([
                "Front and rear cameras with mounts",
                "Rear camera cable and 64GB microSD card",
                "12V power lead",
            ])),
            section("Compatibility", ul([
                "Fits most cars, vans and SUVs",
                "Supplied & fitted includes hard-wiring and parking mode set-up",
            ])),
            CTA_FIT_OPTION,
        ),
        seo_title="Front & Rear Dash Cam 2K, Hard-Wired | MG Car Audio",
        seo_description="Front and rear dash cam, 2K + 1080p, with Wi-Fi, GPS and parking mode. Supplied, or hard-wired with no trailing cables in Dublin 12.",
        option_name="Fitting",
        variants=fit("MG-CAM-DASH-FR", "179.00", "288.00"),
        images=[("us_dashcam_driving", "Driver's view of a dash cam on the windscreen while driving on a motorway")],
        shipping=True, weight_g=500, inventory=10,
        metafields=mf(fitted="€288"),
    ),
    dict(
        handle="mg-select-4k-front-rear-dash-cam",
        title="MG Select 4K Front & Rear Dash Cam with Parking Mode",
        type="Dash Cam",
        category=CAT_ELECTRONICS,
        tags=["dashcams", "make:Universal", "type:dashcam", HARDWARE],
        body=body(
            "<strong>Our best dash cam:</strong> 4K front recording for reading number plates, 2K at the rear and "
            "24-hour parking mode.",
            section("Why drivers choose it", ul([
                "4K front and 2K rear recording",
                "Night vision sensor for clear footage after dark",
                "24-hour parking mode with low-voltage protection",
                "5GHz Wi-Fi for fast clip downloads, plus GPS",
            ])),
            section("What's included", ul([
                "Front and rear cameras with mounts",
                "128GB microSD card",
                "Hard-wire kit",
            ])),
            section("Compatibility", ul([
                "Fits most cars, vans and SUVs",
                "Supplied & fitted includes hard-wiring and set-up on your phone",
            ])),
            CTA_FIT_OPTION,
        ),
        seo_title="4K Front & Rear Dash Cam with Parking Mode | MG Car Audio",
        seo_description="4K front and 2K rear dash cam with night vision, 24-hour parking mode, Wi-Fi and GPS. Supplied and hard-wired at our Dublin 12 workshop.",
        option_name="Fitting",
        variants=fit("MG-CAM-DASH-4K", "249.00", "358.00", compare="289.00", compare_fitted="398.00"),
        images=["th_dashcam"],
        shipping=True, weight_g=600, inventory=6,
        metafields=mf(fitted="€358"),
    ),
    dict(
        handle="dash-cam-hardwire-kit",
        title="Dash Cam Hard-Wire Kit with Parking Mode",
        type="Accessory",
        category=CAT_ELECTRONICS,
        tags=["dashcams", "accessories", "make:Universal", "type:accessory", HARDWARE],
        body=body(
            "<strong>Power your dash cam from the fuse box</strong> for a clean install with no cable in the "
            "12V socket, and parking mode that protects your battery.",
            section("What's included", ul([
                "Hard-wire cable with low-voltage cut-off",
                "Add-a-fuse taps (mini, micro and standard)",
                "USB-C and mini-USB connectors",
            ])),
            section("Good to know", ul([
                "Low-voltage cut-off at 11.8V or 12.2V, so your car always starts",
                "Included free with any dash cam you choose Supplied & fitted",
            ])),
            CTA_COLLECT,
        ),
        seo_title="Dash Cam Hard-Wire Kit, Parking Mode | MG Car Audio",
        seo_description="Hard-wire kit for dash cams with low-voltage cut-off and fuse taps, for parking mode without a flat battery. Collect in Dublin 12.",
        option_name="Title",
        variants=[("Default Title", "29.00", "MG-ACC-DASH-HW")],
        images=[("us_usbc_port", "Close-up of a USB-C socket in a car interior")],
        shipping=True, weight_g=150, inventory=20,
        metafields=mf(),
    ),
    dict(
        handle="dash-cam-installation",
        title="Dash Cam Hard-Wiring Installation",
        type="Installation",
        category="",
        tags=["dashcams", "make:Universal", "type:installation", DEMO_PRICE, BADGE_1HR],
        body=body(
            "<strong>No trailing cables, no 12V socket taken up.</strong> We hard-wire your front or front-and-rear "
            "dash cam into the fuse box, with the cables hidden in the headliner and trim.",
            section("What's included", ul([
                "Hard-wiring to the fuse box with a low-voltage cut-off",
                "Cables hidden in the headliner and pillar trim",
                "Rear camera cable routed to the rear screen (front and rear cams)",
                "Parking mode and app set-up on your phone",
            ])),
            section("Good to know", ul([
                "About 1 hour for a front camera, a little longer for front and rear",
                "Bring your own dash cam, or buy one from us Supplied & fitted",
                "Hard-wire kit included",
            ])),
            CTA_SERVICE,
        ),
        seo_title="Dash Cam Hard-Wiring Installation, Dublin | MG Car Audio",
        seo_description="Dash cam hard-wired to your fuse box with hidden cables and parking mode set up. About an hour at our Dublin 12 workshop.",
        option_name="Dash cam",
        variants=[("Front camera", "79.00", "MG-SVC-DASH-F"), ("Front & rear cameras", "109.00", "MG-SVC-DASH-FR")],
        images=[("us_windscreen_cam", "Camera mounted on a car windscreen at sunset")],
        shipping=False, weight_g=None, inventory=None,
        metafields=mf(fitted="€79"),
    ),

    # ================= Reverse cameras (demo) =================
    dict(
        handle="mg-select-number-plate-reverse-camera",
        title="MG Select Number-Plate Reverse Camera",
        type="Reverse Camera",
        category=CAT_BACKUP_CAM,
        tags=["reverse-cameras", "make:Universal", "type:reverse-camera", HARDWARE],
        body=body(
            "<strong>A reversing camera hidden in the number-plate light</strong>, so nobody can tell it's "
            "aftermarket.",
            section("Why drivers choose it", ul([
                "HD wide-angle camera in a number-plate light housing",
                "Night vision for clear pictures after dark",
                "Switchable parking guidelines",
                "Waterproof to IP68",
            ])),
            section("What's included", ul([
                "Number-plate light camera",
                "6m video cable and reverse-light trigger wire",
            ])),
            section("Compatibility", ul([
                "Aftermarket radios and Android screens with a camera input",
                "Factory screens need a camera interface: see our BMW iDrive camera interface",
                "Send us your reg and we'll confirm the housing for your car",
            ])),
            CTA_FIT_OPTION,
        ),
        seo_title="Number-Plate Reverse Camera, HD Night Vision | MG Car Audio",
        seo_description="HD reverse camera hidden in the number-plate light, with night vision and guidelines. Supplied and fitted at our Dublin 12 workshop.",
        option_name="Fitting",
        variants=fit("MG-CAM-REV-NP", "79.00", "229.00"),
        images=["mg_honda_red"],
        shipping=True, weight_g=250, inventory=12,
        metafields=mf(fitted="€229"),
    ),
    dict(
        handle="bmw-idrive-reverse-camera-interface",
        title="Reverse Camera Interface – BMW iDrive (CIC / NBT)",
        type="Reverse Camera",
        category=CAT_BACKUP_CAM,
        tags=["reverse-cameras", "make:BMW", "type:reverse-camera", HARDWARE],
        body=body(
            "<strong>Show a reversing camera on your BMW's own iDrive screen.</strong> The interface switches the "
            "screen to the camera automatically when you select reverse.",
            section("Why drivers choose it", ul([
                "Camera picture on the factory iDrive display",
                "Switches automatically in reverse",
                "Dynamic guidelines that move with the steering",
                "Plug-in harness, no cutting of factory wiring",
            ])),
            section("What's included", ul([
                "Camera interface with plug-in harness",
                "Camera sold separately, or choose our Reverse Camera Installation for supply and fit",
            ])),
            section("Compatibility", ul([
                "BMW iDrive CIC (approx. 2008–2013) and NBT (approx. 2013–2016) with the factory navigation screen",
                "Send us a photo of your screen and we'll confirm your iDrive version",
            ])),
            CTA_HARDWARE,
        ),
        seo_title="BMW iDrive Reverse Camera Interface | MG Car Audio",
        seo_description="Show a reverse camera on your BMW's factory iDrive screen, with dynamic guidelines and a plug-in harness. Supplied and fitted in Dublin 12.",
        option_name="iDrive system",
        variants=[("CIC (approx. 2008–2013)", "189.00", "MG-CAM-IF-BMW-CIC"),
                  ("NBT (approx. 2013–2016)", "189.00", "MG-CAM-IF-BMW-NBT")],
        images=["mg_bmw_red"],
        shipping=True, weight_g=300, inventory=6,
        metafields=mf(make=["BMW"], models=["1 Series (F20/F21)", "3 Series (F30/F31)", "5 Series (F10/F11)",
                                            "X1 (E84)", "X3 (F25)"], fitted="€750"),
    ),

    # ================= Accessories (demo) =================
    dict(
        handle="magnetic-phone-mount",
        title="Magnetic Phone Mount, Air Vent & Dash",
        type="Accessory",
        category=CAT_PHONE_MOUNT,
        tags=["accessories", "make:Universal", "type:accessory", HARDWARE],
        body=body(
            "<strong>Keep your phone in view and within reach</strong> with a strong magnetic mount that clips to "
            "an air vent or sticks to the dash.",
            section("What's included", ul([
                "Magnetic mount with air vent clip and dash base",
                "Two metal plates for phones and cases",
            ])),
            section("Good to know", ul([
                "Works with MagSafe iPhones without a plate",
                "One-hand on and off, and holds firm over bumps",
            ])),
            CTA_COLLECT,
        ),
        seo_title="Magnetic Car Phone Mount, Vent & Dash | MG Car Audio",
        seo_description="Strong magnetic car phone mount for the air vent or dash, MagSafe compatible. Collect from our Dublin 12 workshop or delivered across Ireland.",
        option_name="Title",
        variants=[("Default Title", "24.00", "MG-ACC-MOUNT-MAG")],
        images=[("us_phone_mount", "Smartphone showing a navigation route in a mount on a car dashboard")],
        shipping=True, weight_g=120, inventory=25,
        metafields=mf(),
    ),
    dict(
        handle="usb-c-fast-car-charger",
        title="Dual USB-C Fast Car Charger, 45W",
        type="Accessory",
        category=CAT_CAR_CHARGER,
        tags=["accessories", "make:Universal", "type:accessory", HARDWARE],
        body=body(
            "<strong>Fast-charge two phones at once</strong> from your car's 12V socket.",
            section("What's included", ul([
                "Dual USB-C car charger, 45W total",
            ])),
            section("Good to know", ul([
                "USB Power Delivery: up to 30W on one port",
                "Fits 12V and 24V sockets",
                "Compact and sits almost flush with the socket",
            ])),
            CTA_COLLECT,
        ),
        seo_title="Dual USB-C Fast Car Charger 45W | MG Car Audio",
        seo_description="Dual USB-C fast car charger, 45W with Power Delivery, charges two phones at once. Collect from our Dublin 12 workshop.",
        option_name="Title",
        variants=[("Default Title", "19.00", "MG-ACC-CHG-USBC")],
        images=[("us_usbc_ports", "Pair of USB-C charging ports in a car centre console")],
        shipping=True, weight_g=60, inventory=30,
        metafields=mf(),
    ),
    dict(
        handle="carplay-android-auto-usb-cable",
        title="CarPlay & Android Auto Data Cable, 1m",
        type="Accessory",
        category=CAT_ELECTRONICS,
        tags=["accessories", "make:Universal", "type:accessory", HARDWARE],
        body=body(
            "<strong>Dropping out of CarPlay or Android Auto?</strong> A worn cable is the most common cause. Our "
            "braided data cables are made for in-car use.",
            section("What's included", ul([
                "1m braided data and charging cable (choose the connector above)",
            ])),
            section("Good to know", ul([
                "Full data support for wired CarPlay and Android Auto",
                "Braided jacket and strain relief for daily use",
            ])),
            CTA_COLLECT,
        ),
        seo_title="CarPlay & Android Auto USB Cable 1m | MG Car Audio",
        seo_description="Braided 1m data cable for wired CarPlay and Android Auto, USB-A or USB-C to Lightning or USB-C. Collect in Dublin 12.",
        option_name="Connector",
        variants=[("USB-A to Lightning", "15.00", "MG-ACC-CBL-AL"),
                  ("USB-C to Lightning", "15.00", "MG-ACC-CBL-CL"),
                  ("USB-A to USB-C", "15.00", "MG-ACC-CBL-AC"),
                  ("USB-C to USB-C", "15.00", "MG-ACC-CBL-CC")],
        images=[("us_phone_cable", "iPhone plugged in and charging inside a car")],
        shipping=True, weight_g=50, inventory=40,
        metafields=mf(),
    ),
    dict(
        handle="steering-wheel-control-interface",
        title="Steering Wheel Control Interface",
        type="Accessory",
        category=CAT_ELECTRONICS,
        tags=["accessories", "android-radios", "make:Universal", "type:accessory", HARDWARE],
        body=body(
            "<strong>Keep your steering wheel buttons working</strong> when you fit a new radio.",
            section("What's included", ul([
                "Steering wheel control interface with car-specific lead",
            ])),
            section("Compatibility", ul([
                "Most cars with steering wheel audio buttons",
                "Works with Android radios and most aftermarket head units",
                "Send us your reg and we'll supply the right lead",
            ])),
            CTA_COLLECT,
        ),
        seo_title="Steering Wheel Control Interface | MG Car Audio",
        seo_description="Keep your steering wheel audio buttons working with a new radio. Car-specific lead included. Collect or have it fitted in Dublin 12.",
        option_name="Title",
        variants=[("Default Title", "69.00", "MG-ACC-SWC")],
        images=[("us_stereo_blue", "Car stereo with blue illuminated buttons in a dark dashboard")],
        shipping=True, weight_g=150, inventory=12,
        metafields=mf(),
    ),
    dict(
        handle="double-din-fascia-kit",
        title="Double-DIN Fascia Kit & Harness Adapter",
        type="Accessory",
        category=CAT_ELECTRONICS,
        tags=["accessories", "make:Universal", "type:accessory", HARDWARE],
        body=body(
            "<strong>The parts that make a new radio look factory-fitted:</strong> a colour-matched fascia and a "
            "plug-in harness for your car.",
            section("What's included", ul([
                "Car-specific double-DIN fascia",
                "ISO harness adapter and aerial adapter",
            ])),
            section("Compatibility", ul([
                "We stock kits for most European, Japanese and Korean cars",
                "Send us your reg and we'll pick the right kit before we ship",
            ])),
            CTA_COLLECT,
        ),
        seo_title="Double-DIN Fascia Kit & Harness Adapter | MG Car Audio",
        seo_description="Car-specific double-DIN fascia kit with ISO harness and aerial adapter for a factory-look radio fit. Collect or fitted in Dublin 12.",
        option_name="Title",
        variants=[("Default Title", "49.00", "MG-ACC-FASCIA-2DIN")],
        images=[("us_single_din_dash", "Radio fitted in a car dashboard between the air vents")],
        shipping=True, weight_g=500, inventory=15,
        metafields=mf(),
    ),

    # ================= Gift vouchers (demo) =================
    dict(
        handle="mg-car-audio-gift-voucher",
        title="MG Car Audio Gift Voucher",
        type="Gift Card",
        category=CAT_GIFT,
        gift_card=True,
        tags=["gift-vouchers", HARDWARE],
        body=body(
            "<strong>Give the gift of a better drive.</strong> Our gift vouchers can be spent on anything in store, "
            "from speakers and dash cams to CarPlay fitting.",
            section("What's included", ul([
                "A digital gift voucher sent by email",
                "Spend it online or at our workshop",
            ])),
            section("Good to know", ul([
                "Valid for 5 years from purchase",
                "Can be used across more than one order",
            ])),
            section("Spend it at our Dublin 12 workshop",
                    "<p>Redeem online at checkout or in person at Unit 3, Ballymount Business Centre, Dublin 12.</p>"),
        ),
        seo_title="Gift Vouchers | MG Car Audio",
        seo_description="MG Car Audio gift vouchers from €50, spendable on products and fitting online or at our Dublin 12 workshop.",
        option_name="Denomination",
        variants=[("€50", "50.00", "MG-GIFT-50"), ("€100", "100.00", "MG-GIFT-100"),
                  ("€250", "250.00", "MG-GIFT-250")],
        images=[("us_gift_box", "White gift box with a red ribbon bow on a red background")],
        shipping=False, weight_g=None, inventory=None,
        metafields=mf(make=()),
    ),
]


# ---------------------------------------------------------------------------------------------
# CSV writer
# ---------------------------------------------------------------------------------------------

def image_list(p):
    """[(url, alt)] for a product. Entries are an IMG key, or (IMG key, product-specific alt text)."""
    out = []
    for entry in p["images"]:
        key, alt = entry if isinstance(entry, tuple) else (entry, ALT[entry])
        out.append((IMG[key], alt))
    return out


def product_rows(p, with_metafields=True):
    rows = []
    header = TEMPLATE_HEADER + (list(METAFIELD_COLUMNS.values()) if with_metafields else [])
    is_hardware = HARDWARE in p["tags"] or MG_SHOP in p["tags"]
    gift_card = p.get("gift_card", False)
    images = image_list(p)

    for index, variant in enumerate(p["variants"]):
        value, price, sku = variant[:3]
        compare_at = variant[3] if len(variant) > 3 else ""
        r = {h: "" for h in header}
        r["URL handle"] = p["handle"]
        if index == 0:
            r["Title"] = p["title"]
            r["Description"] = p["body"]
            r["Vendor"] = p.get("vendor", "MG Car Audio")
            r["Product category"] = p["category"]
            r["Type"] = p["type"]
            r["Tags"] = ", ".join(p["tags"])
            r["Published on online store"] = "TRUE"
            r["Status"] = "Active"
            r["Option1 name"] = p["option_name"]
            r["Gift card"] = "TRUE" if gift_card else "FALSE"
            r["SEO title"] = p["seo_title"]
            r["SEO description"] = p["seo_description"]
            if is_hardware and not gift_card:
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
        r["Compare-at price"] = compare_at
        r["Charge tax"] = "FALSE" if gift_card else "TRUE"
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
            r["Product image URL"], r["Image alt text"] = images[0]
            r["Image position"] = "1"
        rows.append(r)

    for position, (url, alt) in enumerate(images[1:], start=2):
        r = {h: "" for h in header}
        r["URL handle"] = p["handle"]
        r["Product image URL"] = url
        r["Image position"] = str(position)
        r["Image alt text"] = alt
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
