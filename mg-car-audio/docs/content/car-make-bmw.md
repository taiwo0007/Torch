# Car make entry: BMW (Phase 1)

Exact values for the **BMW** entry of the `car_make` metaobject, plus its four `faq` entries and the page that uses it. Enter them in Shopify admin as described in `docs/SETUP.md` §7–8.

Every price here is MG's real price, from mgcaraudio.ie/book-online and MG's reverse camera listing (checked 25 September 2026). Fitting times are only the ones MG publishes (Android Auto on iDrive 7: 1 hour; Japan-to-Europe: 2 hours); MG gives no time for BMW Apple CarPlay, so none is stated. Nothing in this file is a placeholder except where it says so.

---

## 1. FAQ entries (create these first)

Admin: **Content → Metaobjects → FAQ → Add entry**. Create four entries. The handle is set automatically from the question; you don't need to change it.

### FAQ 1

- **question:** Can you add Apple CarPlay to my BMW's original screen?
- **answer:**

```
In most cases, yes. We add Apple CarPlay to the factory iDrive screen, so you keep the original look, the iDrive controller and your steering wheel buttons. Depending on your iDrive version, that's a software activation or a small interface fitted behind the dash. BMW Apple CarPlay installation is €350, and we'll confirm the fitting time for your iDrive system when you book.
```

### FAQ 2

- **question:** Which iDrive system does my BMW have?
- **answer:**

```
The quickest way to find out is to send us a photo of your screen and the iDrive controller on WhatsApp, and we'll tell you in minutes. As a rough guide: CIC is found on many BMWs up to about 2013, NBT on many cars from about 2013 to 2016, NBT EVO (ID4 to ID6) from about 2016 to 2019, and iDrive 7 on most BMWs built from 2019.
```

### FAQ 3

- **question:** Can you add Android Auto to a BMW with iDrive 7?
- **answer:**

```
Yes. We enable Android Auto on iDrive 7 (ID7) for €299. It takes about an hour, and you get Google Maps, Waze, Spotify, calls and messages on the factory screen, controlled with the iDrive controller, touchscreen and steering wheel buttons.
```

### FAQ 4

- **question:** My BMW is a Japanese import. Can you convert it to European spec?
- **answer:**

```
Yes. Our BMW Japan-to-Europe conversion is €450 and takes about two hours. We region-code the iDrive system, install European navigation maps, switch the menus and voice guidance to English, move the FM radio to the European band and set local regional settings. Send us your reg or VIN first and we'll confirm your car is compatible.
```

---

## 2. The BMW `car_make` entry

Admin: **Content → Metaobjects → Car make → Add entry**.

| Field (key) | Type | Value to enter |
|---|---|---|
| `name` | Single line text | `BMW` |
| `headline` | Single line text | `BMW CarPlay & Screen Upgrades in Dublin` |
| `intro` | Multi-line text | See below (two paragraphs, blank line between them) |
| `hero_image` | File (image) | Upload `mg-bmw-carplay-screen` (see note below) |
| `systems` | List of single line text | 4 items, see below |
| `models` | List of single line text | 12 items, see below |
| `from_price` | Single line text | `€299` |
| `services` | List of single line text | 6 items, see below |
| `faqs` | List of metaobject references (FAQ) | The 4 FAQ entries above, in order 1–4 |
| `seo_title` | Single line text | `BMW CarPlay & Screen Upgrades in Dublin \| MG Car Audio` |
| `seo_description` | Multi-line text | See below (140 characters) |

Note on `seo_title`: type it with a plain `|`. The backslash above is only there to stop the Markdown table breaking.

### intro

```
Add Apple CarPlay and Android Auto to your BMW's factory iDrive screen, or upgrade to a widescreen display that looks like it left the factory that way. We work on CIC, NBT, NBT EVO and iDrive 7 cars at our Dublin 12 workshop.

Your steering wheel buttons, iDrive controller and reversing camera keep working wherever possible, and we confirm exactly what suits your car before you book. BMW Apple CarPlay is €350 fitted, and Android Auto on iDrive 7 is €299.
```

### systems (one item per line, click "Add item" for each)

```
iDrive CIC
iDrive NBT
NBT EVO (ID4–ID6)
iDrive 7 (ID7)
```

### models (one item per line)

```
1 Series (F20/F21, 2011–2019)
2 Series (F22/F23, 2014–2021)
3 Series (F30/F31, 2012–2019)
3 Series (G20/G21, 2019 on)
4 Series (F32/F33/F36, 2013–2020)
5 Series (F10/F11, 2010–2017)
5 Series (G30/G31, 2017–2023)
X1 (F48, 2015–2022)
X3 (F25, 2010–2017)
X3 (G01, 2017–2024)
X5 (F15, 2013–2018)
X5 (G05, 2018 on)
```

The year ranges are the usual production years for each chassis. Which iDrive a particular car has depends on its build date and options, which is why the FAQ asks for a photo.

### services (one item per line, format `Service name | Price | /link`)

```
Apple CarPlay for iDrive | €350 | /products/carplay-installation-bmw
Android Auto for iDrive 7 (ID7) | €299 | /products/android-auto-installation-bmw-id7
iDrive 7 video in motion | €149 | /products/bmw-idrive7-video-in-motion
Japanese-to-European conversion | €450 | /products/bmw-japan-to-europe-conversion
Reverse camera, supplied and fitted | €750 | /products/reverse-camera-installation
Widescreen Android display upgrade | | /collections/screen-upgrades
```

The last line has no price on purpose: the only BMW screen in the demo catalogue has a placeholder price, so the card sends people to the Screen Upgrades collection instead of quoting a number.

### seo_description

```
Apple CarPlay for BMW iDrive from €350, Android Auto on iDrive 7 for €299 and Japan-to-Europe conversions. Fitted at our Dublin 12 workshop.
```

### hero_image

The file field can't pick a theme asset, so upload the image to **Content → Files** first:

1. Download MG's BMW CarPlay picture: https://static.wixstatic.com/media/c67c38_a37dca29310e41c9a3845bd6232bfa53~mv2.png (it's the same picture as the theme's `mg-bmw-carplay-screen.webp`).
2. **Content → Files → Upload files**, then set its alt text to `BMW widescreen iDrive display showing Apple CarPlay`.
3. In the entry, click **hero_image → Select file** and choose it.

If you skip this, the car make page falls back to the built-in BMW photo, so the page still looks finished.

---

## 3. The page

Admin: **Online Store → Pages → Add page**.

| Setting | Value |
|---|---|
| Title | `BMW CarPlay & Screen Upgrades` (the first word must be the make) |
| Content | Leave empty (the entry's `intro` is used) |
| Theme template | `page.car-make` (shown as **car-make** in the dropdown) |
| Search engine listing: page title | `BMW CarPlay & Screen Upgrades in Dublin \| MG Car Audio` (use a plain `\|`) |
| Search engine listing: meta description | Same text as `seo_description` above |
| URL handle | `bmw-carplay` |
| Metafield **Car make** (`custom.car_make`) | Select the **BMW** entry |
| Visibility | Visible |

The theme reads the entry's `seo_title` and `seo_description` for the page's `<title>` and meta description; filling in the page's own search listing as well keeps things consistent if the entry is ever unlinked.
