# Car make entry: Mercedes-Benz (Phase 2)

Values for the **Mercedes-Benz** entry of the `car_make` metaobject, its four `faq` entries and its page. Same steps as BMW (`docs/SETUP.md` §7–8, `car-make-bmw.md`).

> **PLACEHOLDERS, confirm with MG before publishing.** MG's current site has no Mercedes CarPlay or screen prices, so those are invented for the demo (marked *placeholder*) and match the placeholder products in `data/products.csv`. Prices taken from MG's own service pages (checked 25 September 2026): Mercedes Japanese-to-European conversion €450 (2 hours) and radio frequency conversion €150. The build spec lists both as "price on request", so **ask MG to confirm them**.

---

## 1. FAQ entries

### FAQ 1

- **question:** Can you add Apple CarPlay to my Mercedes' original screen?
- **answer:**

```
On most Mercedes-Benz models with NTG 4.5, 4.7, 5 or 5.1, yes. We fit a wireless CarPlay and Android Auto interface behind the dash, so you keep the factory screen, the COMAND controller or touchpad and your steering wheel buttons.
```

### FAQ 2

- **question:** Which Mercedes system do I have?
- **answer:**

```
Send us your reg and a photo of your screen on WhatsApp and we'll tell you. As a rough guide, NTG 4.5 and 4.7 are found on many models from about 2012 to 2015, NTG 5 and 5.1 from about 2014 to 2019, and NTG 5.5 on the later C-Class W205. Many NTG 5.5 and MBUX cars can already run smartphone integration, so we'll check yours first.
```

### FAQ 3

- **question:** Can you fit a bigger screen to my C-Class?
- **answer:**

```
Yes. Our 12.3-inch Android widescreen for the C-Class W205 gives you wireless CarPlay and Android Auto on a display that fills the dash like the factory widescreen option, and it keeps your original controls and reversing camera.
```

### FAQ 4

- **question:** My Mercedes is a Japanese import. Can you convert it?
- **answer:**

```
Yes, if your head unit is compatible with the software update. Our Mercedes Japanese-to-European conversion updates the navigation maps, radio frequency range and system language, and takes about two hours. Send us your reg or VIN and we'll check compatibility before you book.
```

---

## 2. The Mercedes-Benz `car_make` entry

| Field (key) | Value |
|---|---|
| `name` | `Mercedes-Benz` |
| `headline` | `Mercedes-Benz CarPlay & Screen Upgrades in Dublin` |
| `intro` | See below |
| `hero_image` | Upload MG's Android Auto dashboard picture: https://static.wixstatic.com/media/c67c38_025ff690eb284fd08df1b0ac249caa62~mv2.png (same as theme asset `mg-android-auto-dash.webp`). *Placeholder*: replace with a real photo of a Mercedes fitting when MG has one |
| `systems` | See below |
| `models` | See below |
| `from_price` | `€399` *placeholder* |
| `services` | See below |
| `faqs` | The 4 Mercedes-Benz FAQ entries, in order |
| `seo_title` | `Mercedes-Benz CarPlay & Screen Upgrades in Dublin \| MG Car Audio` (type a plain `\|`) |
| `seo_description` | See below (144 characters) |

### intro

```
Add wireless Apple CarPlay and Android Auto to your Mercedes-Benz factory screen, or upgrade your C-Class to a 12.3-inch widescreen. We fit NTG 4.5, 4.7, 5 and 5.1 cars and convert Japanese imports to European spec at our Dublin 12 workshop.

Your COMAND controller, steering wheel buttons and reversing camera keep working wherever possible, and we confirm exactly what suits your car before you book.
```

### systems

```
NTG 4.5 / 4.7
NTG 5 / 5.1
NTG 5.5
Audio 20 / COMAND Online
```

### models

```
A-Class (W176, 2012–2018)
B-Class (W246, 2011–2018)
C-Class (W204, 2007–2014)
C-Class (W205, 2014–2021)
CLA (C117, 2013–2019)
E-Class (W212, 2009–2016)
GLA (X156, 2013–2019)
GLC (X253, 2015–2022)
ML / GLE (W166, 2011–2019)
```

### services

```
Wireless CarPlay & Android Auto for NTG 4.5 / 5 | From €399 | /products/wireless-carplay-interface-mercedes-ntg
12.3" Android widescreen for C-Class W205 | From €849 | /products/android-screen-upgrade-mercedes-w205-12-3
Japanese-to-European conversion | €450 | /products/mercedes-japan-to-europe-conversion
Radio frequency conversion (Japan to Europe) | €150 | /products/radio-frequency-conversion-japan-to-europe
Reverse camera, supplied and fitted | | /pages/get-a-quote
```

"From €399" and "From €849" are *placeholders*. €450 and €150 are from MG's service pages (confirm). The reverse camera line has no price because MG hasn't published one for Mercedes.

### seo_description

```
Wireless CarPlay and Android Auto for Mercedes-Benz NTG screens, 12.3" widescreen upgrades and Japan-to-Europe conversions, fitted in Dublin 12.
```

---

## 3. The page

| Setting | Value |
|---|---|
| Title | `Mercedes-Benz CarPlay & Screen Upgrades` (first word must be `Mercedes-Benz`) |
| Theme template | `page.car-make` |
| URL handle | `mercedes-benz-carplay` (the home page car-make tile links here by default) |
| Metafield **Car make** | the **Mercedes-Benz** entry |
| Search engine listing | same title and description as the entry's SEO fields |
