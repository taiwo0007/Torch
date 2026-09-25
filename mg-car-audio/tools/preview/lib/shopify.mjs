// Shopify-flavoured Liquid objects ("drops"), filters and tags for LiquidJS.
// This is an approximation for local previews, not a reimplementation of Shopify.

import fs from 'node:fs';
import path from 'node:path';
import { Drop, Tag, Tokenizer, Hash, evalToken, toValue } from 'liquidjs';

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const str = (v) => {
  v = toValue(v);
  return v === undefined || v === null ? '' : String(v);
};
export const escapeHtml = (s) =>
  str(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

/** Named filter args arrive from LiquidJS as [key, value] pairs. Split them from positional args. */
// LiquidJS passes `key: value` filter args as 2-element [key, value] arrays.
// (A genuine 2-element array argument is very rare in themes, so this heuristic is fine.)
function splitArgs(args) {
  const positional = [];
  const named = {};
  for (const a of args) {
    if (Array.isArray(a) && a.length === 2 && typeof a[0] === 'string' && /^[a-z_][\w-]*$/i.test(a[0])) {
      named[a[0]] = toValue(a[1]);
    } else positional.push(toValue(a));
  }
  return { positional, named };
}

/* ------------------------------------------------------------------ */
/* Colors                                                               */
/* ------------------------------------------------------------------ */

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  return [h, s * 100, l * 100];
}

function hslToRgb(h, s, l) {
  h = ((h % 360) + 360) % 360; s = clamp(s, 0, 100) / 100; l = clamp(l, 0, 100) / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let [r, g, b] = [0, 0, 0];
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
}

export class ColorDrop extends Drop {
  constructor(r, g, b, a = 1) {
    super();
    this.r = Math.round(clamp(r, 0, 255));
    this.g = Math.round(clamp(g, 0, 255));
    this.b = Math.round(clamp(b, 0, 255));
    this.a = clamp(Number.isFinite(a) ? a : 1, 0, 1);
  }

  static parse(input) {
    if (input instanceof ColorDrop) return input;
    const s = str(input).trim().toLowerCase();
    if (!s) return null;
    if (s === 'transparent') return new ColorDrop(0, 0, 0, 0);
    let m = s.match(/^#([0-9a-f]{3,8})$/);
    if (m) {
      let h = m[1];
      if (h.length === 3 || h.length === 4) h = h.split('').map((c) => c + c).join('');
      if (h.length !== 6 && h.length !== 8) return null;
      const n = (i) => parseInt(h.slice(i, i + 2), 16);
      return new ColorDrop(n(0), n(2), n(4), h.length === 8 ? n(6) / 255 : 1);
    }
    m = s.match(/^rgba?\(([^)]+)\)$/);
    if (m) {
      const p = m[1].split(/[\s,/]+/).filter(Boolean);
      const num = (x, scale) => (x.endsWith('%') ? (parseFloat(x) / 100) * scale : parseFloat(x));
      const [r, g, b] = p.slice(0, 3).map((x) => num(x, 255));
      const a = p[3] !== undefined ? num(p[3], 1) : 1;
      if ([r, g, b, a].some((x) => Number.isNaN(x))) return null;
      return new ColorDrop(r, g, b, a);
    }
    m = s.match(/^hsla?\(([^)]+)\)$/);
    if (m) {
      const p = m[1].split(/[\s,/]+/).filter(Boolean);
      const [h, sat, l] = p.slice(0, 3).map((x) => parseFloat(x));
      const a = p[3] !== undefined ? (p[3].endsWith('%') ? parseFloat(p[3]) / 100 : parseFloat(p[3])) : 1;
      return new ColorDrop(...hslToRgb(h, sat, l), a);
    }
    return null;
  }

  get red() { return this.r; }
  get green() { return this.g; }
  get blue() { return this.b; }
  get alpha() { return Math.round(this.a * 1000) / 1000; }
  get rgb() { return `${this.r} ${this.g} ${this.b}`; }
  get rgba() { return `${this.r} ${this.g} ${this.b} / ${this.alpha}`; }
  get hsl() { return rgbToHsl(this.r, this.g, this.b); }
  get hue() { return Math.round(this.hsl[0]); }
  get saturation() { return Math.round(this.hsl[1]); }
  get lightness() { return Math.round(this.hsl[2]); }
  get brightness() { return Math.round(((this.r * 299 + this.g * 587 + this.b * 114) / 1000) * 10) / 10; }
  get hex() {
    return '#' + [this.r, this.g, this.b].map((x) => x.toString(16).padStart(2, '0')).join('');
  }
  valueOf() {
    return this.a >= 1 ? this.hex : `rgba(${this.r},${this.g},${this.b},${this.alpha})`;
  }
  toString() { return this.valueOf(); }
  toJSON() { return this.valueOf(); }
  luminance() {
    const c = [this.r, this.g, this.b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }
  withHsl(h, s, l) {
    return new ColorDrop(...hslToRgb(h, s, l), this.a);
  }
}

/** settings.color_palette: iterable list of colors that also exposes named keys (background, foreground, ...). */
export function makePalette(obj) {
  const arr = [];
  for (const [k, v] of Object.entries(obj || {})) {
    const c = ColorDrop.parse(v) ?? v;
    arr.push(c);
    arr[k] = c;
  }
  return arr;
}

/* ------------------------------------------------------------------ */
/* Fonts                                                                */
/* ------------------------------------------------------------------ */

const SYSTEM_FONTS = new Set(['sans-serif', 'serif', 'monospace', 'system', 'system_ui', 'helvetica', 'arial', 'times_new_roman', 'courier_new', 'georgia', 'garamond', 'palatino', 'lucida_grande', 'verdana', 'trebuchet_ms', 'tahoma', 'monaco']);
const UPPER_WORDS = new Set(['dm', 'ibm', 'pt', 'eb', 'im', 'ms', 'bj', 'gfs', 'jp', 'kr', 'sc', 'tc', 'hk']);

export class FontDrop extends Drop {
  constructor(handle) {
    super();
    this.handle = str(handle) || 'sans-serif_n4';
    const m = this.handle.match(/^(.*)_([nio])(\d)$/);
    this.slug = m ? m[1] : this.handle;
    this.style = m ? { n: 'normal', i: 'italic', o: 'oblique' }[m[2]] : 'normal';
    this.weight = m ? Number(m[3]) * 100 : 400;
    this.family = this.slug
      .split(/[_-]/)
      .map((w) => (UPPER_WORDS.has(w) ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)))
      .join(' ');
    if (this.slug === 'sans-serif' || this.slug === 'serif' || this.slug === 'monospace') this.family = this.slug;
    const s = this.slug;
    this.fallback_families = /mono|code|courier|anonymous/.test(s) ? 'monospace' : /serif|garamond|times|georgia|playfair|lora|merriweather/.test(s) && !/sans/.test(s) ? 'serif' : 'sans-serif';
    this['system?'] = SYSTEM_FONTS.has(s);
    this.baseline_ratio = 0.8;
  }
  get variants() { return []; }
  modify(prop, value) {
    const weightOf = () => {
      if (value === 'bold') return 700;
      if (value === 'normal') return 400;
      if (value === 'bolder') return Math.min(900, this.weight + 100);
      if (value === 'lighter') return Math.max(100, this.weight - 100);
      if (/^[+-]\d+$/.test(String(value))) return clamp(this.weight + Number(value), 100, 900);
      return clamp(Number(value) || this.weight, 100, 900);
    };
    let weight = this.weight;
    let style = this.style;
    if (prop === 'weight') weight = weightOf();
    if (prop === 'style') style = value === 'italic' ? 'italic' : value === 'oblique' ? 'oblique' : 'normal';
    return new FontDrop(`${this.slug}_${style[0]}${Math.round(weight / 100)}`);
  }
  valueOf() { return this.handle; }
  toString() { return this.handle; }
  toJSON() { return this.handle; }
}

/* ------------------------------------------------------------------ */
/* Images and misc drops                                                */
/* ------------------------------------------------------------------ */

export function placeholderDataUri(label = 'image', w = 1600, h = 1000) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="100%" height="100%" fill="#2a3039"/><path d="M0 0L${w} ${h}M${w} 0L0 ${h}" stroke="#3a424e" stroke-width="3"/><text x="50%" y="50%" fill="#aab3c0" font-family="sans-serif" font-size="${Math.round(h / 16)}" text-anchor="middle" dominant-baseline="middle">${escapeHtml(label)}</text></svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

export class ImageDrop extends Drop {
  constructor({ src, alt = '', width = 1600, height = 1000, filename = 'image' } = {}) {
    super();
    this.src = src || placeholderDataUri(filename, width, height);
    this.url = this.src;
    this.alt = alt;
    this.width = width;
    this.height = height;
    this.filename = filename;
    this.id = 1;
    this.media_type = 'image';
    this.presentation = { focal_point: '50% 50%' };
    this.preview_image = this;
  }
  get aspect_ratio() { return this.width / this.height; }
  valueOf() { return this.src; }
  toString() { return this.src; }
  toJSON() { return this.src; }
}

/** Result of image_url: behaves as a URL string, remembers the image for image_tag. */
export class ImageUrlDrop extends Drop {
  constructor(url, image) {
    super();
    this.url = url;
    this.image = image;
  }
  valueOf() { return this.url; }
  toString() { return this.url; }
  toJSON() { return this.url; }
}

/** Plain value that prints as a string but exposes properties (e.g. `template`). */
export class StringDrop extends Drop {
  constructor(value, props = {}) {
    super();
    this.__value = value;
    Object.assign(this, props);
  }
  valueOf() { return this.__value; }
  toString() { return this.__value; }
  toJSON() { return this.__value; }
}

/** `collections`, `pages`, `products`, `metaobjects`...: any handle lookup returns a stub (or nil). */
export class LookupDrop extends Drop {
  constructor(factory) {
    super();
    this.factory = factory;
  }
  liquidMethodMissing(key) {
    return this.factory(String(key));
  }
}

/* ------------------------------------------------------------------ */
/* Filters                                                              */
/* ------------------------------------------------------------------ */

/**
 * @param rt runtime state: { themeDir, assetBase, warn(msg), locale, usedFonts:Set }
 */
export function createFilters(rt) {
  const assetsDir = path.join(rt.themeDir, 'assets');
  const assetUrl = (name) => {
    const n = str(name);
    if (!n) return '';
    if (!fs.existsSync(path.join(assetsDir, n))) rt.warn(`asset_url: missing asset "${n}" in theme/assets`);
    return `${rt.assetBase}/${n}`;
  };
  const color = (v) => ColorDrop.parse(v);
  const colorOr = (v, fn) => {
    const c = color(v);
    if (!c) {
      if (str(v)) rt.warn(`color filter: could not parse color "${str(v)}"`);
      return v;
    }
    return fn(c);
  };
  const toImage = (input) => {
    if (input instanceof ImageDrop) return input;
    if (input instanceof ImageUrlDrop) return input.image;
    if (input && typeof input === 'object' && (input.preview_image || input.featured_image || input.image)) {
      return toImage(input.preview_image || input.featured_image || input.image);
    }
    return null;
  };

  const f = {
    /* ---------- URLs & assets ---------- */
    asset_url: assetUrl,
    asset_img_url: assetUrl,
    shopify_asset_url: (n) => `https://cdn.shopify.com/shopifycloud/storefront/${str(n)}`,
    file_url: (n) => placeholderDataUri(str(n)),
    file_img_url: (n) => placeholderDataUri(str(n)),
    inline_asset_content: (n) => {
      const p = path.join(assetsDir, str(n));
      if (!fs.existsSync(p)) {
        rt.warn(`inline_asset_content: missing asset "${str(n)}"`);
        return '';
      }
      return fs.readFileSync(p, 'utf8');
    },
    global_asset_url: (n) => `https://cdn.shopify.com/s/global/${str(n)}`,
    within: (url) => url,
    url_for_type: (t) => `/collections/types?q=${encodeURIComponent(str(t))}`,
    url_for_vendor: (t) => `/collections/vendors?q=${encodeURIComponent(str(t))}`,
    link_to: (text, url, title) => `<a href="${escapeHtml(url)}"${title ? ` title="${escapeHtml(title)}"` : ''}>${str(text)}</a>`,
    link_to_type: (t) => `<a href="/collections/types?q=${encodeURIComponent(str(t))}">${str(t)}</a>`,
    link_to_vendor: (t) => `<a href="/collections/vendors?q=${encodeURIComponent(str(t))}">${str(t)}</a>`,
    link_to_tag: (text, tag) => `<a href="#${escapeHtml(tag)}">${str(text)}</a>`,
    link_to_add_tag: (text) => str(text),
    link_to_remove_tag: (text) => str(text),
    customer_login_link: (t) => `<a href="/account/login">${str(t)}</a>`,
    customer_logout_link: (t) => `<a href="/account/logout">${str(t)}</a>`,
    customer_register_link: (t) => `<a href="/account/register">${str(t)}</a>`,
    stylesheet_tag: (url, ...args) => {
      const u = str(url);
      if (!u) return '';
      const { named } = splitArgs(args);
      return `<link href="${escapeHtml(u)}" rel="stylesheet" type="text/css" media="${escapeHtml(named.media || 'all')}">`;
    },
    script_tag: (url) => (str(url) ? `<script src="${escapeHtml(url)}" type="text/javascript"></script>` : ''),
    preload_tag: (url, ...args) => {
      const u = str(url);
      if (!u) return '';
      const { named } = splitArgs(args);
      const attrs = Object.entries(named).map(([k, v]) => ` ${k}="${escapeHtml(v)}"`).join('');
      return `<link href="${escapeHtml(u)}" rel="preload"${attrs}>`;
    },

    /* ---------- Images & media ---------- */
    image_url: (input, ...args) => {
      const raw = toValue(input);
      const img = toImage(input);
      if (img) return new ImageUrlDrop(img.src, img);
      const s = str(raw);
      if (!s) {
        rt.warn('image_url: called on a blank image (rendered nothing)');
        return '';
      }
      if (/^shopify:\/\//.test(s)) {
        const image = new ImageDrop({ filename: s.split('/').pop() });
        return new ImageUrlDrop(image.src, image);
      }
      return s; // already a URL (e.g. from asset_url)
    },
    img_url: (input, ...args) => f.image_url(input, ...args),
    image_tag: (input, ...args) => {
      const src = str(input);
      if (!src) {
        rt.warn('image_tag: called on a blank image (rendered nothing)');
        return '';
      }
      const img = input instanceof ImageUrlDrop ? input.image : input instanceof ImageDrop ? input : null;
      const { named } = splitArgs(args);
      const attrs = { src, alt: img?.alt ?? '' };
      if (img?.width) attrs.width = img.width;
      if (img?.height) attrs.height = img.height;
      for (const [k, v] of Object.entries(named)) {
        if (k === 'widths' || k === 'preload') continue;
        if (v === false || v === null || v === undefined) continue;
        attrs[k] = v;
      }
      if (named.alt === undefined && img?.alt) attrs.alt = img.alt;
      return `<img ${Object.entries(attrs).map(([k, v]) => (v === true ? k : `${k}="${escapeHtml(v)}"`)).join(' ')}>`;
    },
    placeholder_svg_tag: (name, cls) =>
      `<svg class="${escapeHtml(cls || 'placeholder-svg')}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 525 525" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${escapeHtml(name)}"><rect width="525" height="525" fill="#2a3039"/><text x="262" y="262" fill="#aab3c0" font-family="sans-serif" font-size="22" text-anchor="middle" dominant-baseline="middle">${escapeHtml(name || 'placeholder')}</text></svg>`,
    video_tag: (v) => {
      if (!str(v) && !v) return '';
      return `<img src="${placeholderDataUri('video', 1600, 900)}" alt="video placeholder">`;
    },
    external_video_tag: () => `<img src="${placeholderDataUri('external video', 1600, 900)}" alt="video placeholder">`,
    external_video_url: (v) => str(v),
    media_tag: () => `<img src="${placeholderDataUri('media', 1600, 1000)}" alt="media placeholder">`,
    model_viewer_tag: () => '',
    payment_type_svg_tag: () => '',
    payment_type_img_url: () => '',
    payment_button: () => '',
    payment_terms: () => '',
    structured_data: () => '',
    metafield_tag: (m) => str(m && typeof m === 'object' && 'value' in m ? m.value : m),
    metafield_text: (m) => str(m && typeof m === 'object' && 'value' in m ? m.value : m),
    format_address: () => '',
    highlight: (v) => v,
    highlight_active_tag: (v) => v,
    default_pagination: () => '',
    time_tag: (v) => `<time>${str(v)}</time>`,
    placeholder_img_url: () => placeholderDataUri('placeholder'),

    /* ---------- Money ---------- */
    money: (v) => `€${(Number(toValue(v)) / 100 || 0).toFixed(2)}`,
    money_with_currency: (v) => `€${(Number(toValue(v)) / 100 || 0).toFixed(2)} EUR`,
    money_without_currency: (v) => (Number(toValue(v)) / 100 || 0).toFixed(2),
    money_without_trailing_zeros: (v) => `€${(Number(toValue(v)) / 100 || 0).toFixed(2).replace(/\.00$/, '')}`,

    /* ---------- Strings ---------- */
    handleize: (v) => str(v).toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/['"]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
    handle: (v) => f.handleize(v),
    camelize: (v) => str(v).replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : '')),
    pluralize: (n, one, many) => (Number(toValue(n)) === 1 ? one : many),
    md5: (v) => str(v),
    sha1: (v) => str(v),
    hmac_sha1: (v) => str(v),
    hmac_sha256: (v) => str(v),
    json: (v, space) => {
      const out = JSON.stringify(toValue(v) === undefined ? null : v, (k, x) => (x instanceof Drop && typeof x.toJSON === 'function' ? x.toJSON() : x), space ? Number(space) : undefined);
      // Shopify escapes these so JSON is safe inside <script>
      return (out ?? 'null').replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
    },
    default_errors: (errors) => {
      const e = toValue(errors);
      if (!e || (Array.isArray(e) && !e.length)) return '';
      const list = Array.isArray(e) ? e : Object.keys(e);
      return `<ul class="errors">${list.map((x) => `<li>${escapeHtml(x)}</li>`).join('')}</ul>`;
    },
    t: (key, ...args) => {
      const { named } = splitArgs(args);
      return rt.translate(str(key), named);
    },
    translate: (key, ...args) => f.t(key, ...args),
    weight_with_unit: (v) => `${(Number(toValue(v)) / 1000 || 0).toFixed(1)} kg`,
    item_count_for_variant: () => 0,
    line_items_for: () => [],
    sort_by: (v) => v,
    find_index: function (arr, prop, value) {
      arr = toValue(arr);
      if (!Array.isArray(arr)) return undefined;
      if (arguments.length <= 2) {
        const i = arr.findIndex((x) => str(x) === str(prop));
        return i < 0 ? undefined : i;
      }
      const i = arr.findIndex((x) => x && str(x[prop]) === str(value));
      return i < 0 ? undefined : i;
    },

    /* ---------- Colors ---------- */
    color_to_rgb: (v) => colorOr(v, (c) => (c.a < 1 ? `rgba(${c.r}, ${c.g}, ${c.b}, ${c.alpha})` : `rgb(${c.r}, ${c.g}, ${c.b})`)),
    color_to_hex: (v) => colorOr(v, (c) => c.hex),
    color_to_hsl: (v) => colorOr(v, (c) => {
      const [h, s, l] = c.hsl;
      return c.a < 1 ? `hsla(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%, ${c.alpha})` : `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`;
    }),
    color_to_oklch: (v) => v,
    color_extract: (v, comp) => colorOr(v, (c) => c[comp]),
    color_brightness: (v) => colorOr(v, (c) => c.brightness),
    color_contrast: (a, b) => {
      const c1 = color(a), c2 = color(b);
      if (!c1 || !c2) return 0;
      const [l1, l2] = [c1.luminance(), c2.luminance()].sort((x, y) => y - x);
      return Math.round(((l1 + 0.05) / (l2 + 0.05)) * 10) / 10;
    },
    color_difference: (a, b) => {
      const c1 = color(a), c2 = color(b);
      if (!c1 || !c2) return 0;
      return Math.abs(c1.r - c2.r) + Math.abs(c1.g - c2.g) + Math.abs(c1.b - c2.b);
    },
    brightness_difference: (a, b) => {
      const c1 = color(a), c2 = color(b);
      if (!c1 || !c2) return 0;
      return Math.round(Math.abs(c1.brightness - c2.brightness));
    },
    color_lighten: (v, n) => colorOr(v, (c) => { const [h, s, l] = c.hsl; return c.withHsl(h, s, l + Number(n)); }),
    color_darken: (v, n) => colorOr(v, (c) => { const [h, s, l] = c.hsl; return c.withHsl(h, s, l - Number(n)); }),
    color_saturate: (v, n) => colorOr(v, (c) => { const [h, s, l] = c.hsl; return c.withHsl(h, s + Number(n), l); }),
    color_desaturate: (v, n) => colorOr(v, (c) => { const [h, s, l] = c.hsl; return c.withHsl(h, s - Number(n), l); }),
    color_modify: (v, prop, value) => colorOr(v, (c) => {
      const n = Number(toValue(value));
      const [h, s, l] = c.hsl;
      switch (prop) {
        case 'red': return new ColorDrop(n, c.g, c.b, c.a);
        case 'green': return new ColorDrop(c.r, n, c.b, c.a);
        case 'blue': return new ColorDrop(c.r, c.g, n, c.a);
        case 'alpha': return new ColorDrop(c.r, c.g, c.b, n);
        case 'hue': return c.withHsl(n, s, l);
        case 'saturation': return c.withHsl(h, n, l);
        case 'lightness': return c.withHsl(h, s, n);
        default: return c;
      }
    }),
    color_mix: (a, b, weight) => {
      const c1 = color(a), c2 = color(b);
      if (!c1 || !c2) return a;
      const w = clamp(Number(toValue(weight)) / 100, 0, 1);
      return new ColorDrop(c1.r * w + c2.r * (1 - w), c1.g * w + c2.g * (1 - w), c1.b * w + c2.b * (1 - w), c1.a * w + c2.a * (1 - w));
    },

    /* ---------- Fonts ---------- */
    font_modify: (font, prop, value) => {
      const fd = font instanceof FontDrop ? font : new FontDrop(str(font));
      return fd.modify(prop, value);
    },
    font_face: (font) => {
      const fd = font instanceof FontDrop ? font : str(font) ? new FontDrop(str(font)) : null;
      if (fd && !fd['system?']) rt.usedFonts.add(`${fd.family}|${fd.style}|${fd.weight}`);
      return ''; // real @font-face comes from Google Fonts in the preview <head>
    },
    font_url: () => '',
  };
  return f;
}

/* ------------------------------------------------------------------ */
/* Tags                                                                 */
/* ------------------------------------------------------------------ */

/** Block tag whose body is dropped without being rendered ({% schema %}, {% doc %} ...). */
function skipBlockTag(endName) {
  return class extends Tag {
    constructor(token, remainTokens, liquid) {
      super(token, remainTokens, liquid);
      while (remainTokens.length) {
        const t = remainTokens.shift();
        if (t.name === endName) return;
      }
      throw new Error(`tag ${token.getText()} not closed`);
    }
    *render() {}
  };
}

function blockTemplates(tag, token, remainTokens, parser, endName) {
  tag.templates = [];
  const stream = parser
    .parseStream(remainTokens)
    .on(`tag:${endName}`, () => stream.stop())
    .on('template', (tpl) => tag.templates.push(tpl))
    .on('end', () => {
      throw new Error(`tag ${token.getText()} not closed`);
    });
  stream.start();
}

/** Parses `'type', [positional], key: value, ...` */
function parseTagArgs(token, liquid) {
  const tk = new Tokenizer(token.args, liquid.options.operators, token.file);
  const first = tk.readValue();
  const positional = [];
  for (;;) {
    const save = tk.p;
    tk.skipBlank();
    if (tk.peek() === ',') tk.p++;
    tk.skipBlank();
    if (tk.end()) {
      tk.p = save;
      break;
    }
    // An identifier followed by ':' starts the key/value hash.
    const probe = tk.p;
    const id = tk.readIdentifier();
    tk.skipBlank();
    const isHash = Boolean(id.content) && tk.peek() === ':';
    tk.p = probe;
    if (isHash) {
      tk.p = save;
      break;
    }
    const v = tk.readValue();
    if (!v) {
      tk.p = save;
      break;
    }
    positional.push(v);
  }
  const hash = new Hash(tk, liquid.options.keyValueSeparator);
  return { first, positional, hash };
}

export function registerShopifyTags(liquid, rt) {
  for (const name of ['schema', 'stylesheet', 'javascript', 'doc']) liquid.registerTag(name, skipBlockTag(`end${name}`));

  // {% style %} ... {% endstyle %}  ->  <style data-shopify>...</style>
  liquid.registerTag(
    'style',
    class extends Tag {
      constructor(token, remainTokens, liquid, parser) {
        super(token, remainTokens, liquid);
        blockTemplates(this, token, remainTokens, parser, 'endstyle');
      }
      *render(ctx, emitter) {
        emitter.write('<style data-shopify>');
        yield this.liquid.renderer.renderTemplates(this.templates, ctx, emitter);
        emitter.write('</style>');
      }
    }
  );

  // {% form 'contact', id: 'x', class: 'y' %} ... {% endform %}
  liquid.registerTag(
    'form',
    class extends Tag {
      constructor(token, remainTokens, liquid, parser) {
        super(token, remainTokens, liquid);
        this.args = parseTagArgs(token, liquid);
        blockTemplates(this, token, remainTokens, parser, 'endform');
      }
      *render(ctx, emitter) {
        const type = str(yield evalToken(this.args.first, ctx));
        const hash = yield this.args.hash.render(ctx);
        const actions = { contact: '/contact', customer: '/contact', product: '/cart/add', new_comment: '/blogs/comments', customer_login: '/account/login', create_customer: '/account', localization: '/localization', cart: '/cart' };
        const id = hash.id ? str(hash.id) : `${type.replace(/_/g, '-')}-form`;
        const attrs = { method: 'post', action: `${actions[type] || '/' + type}#${id}`, id, 'accept-charset': 'UTF-8' };
        for (const [k, v] of Object.entries(hash)) {
          if (k === 'id' || k === 'return_to') continue;
          attrs[k] = str(v);
        }
        if (type === 'contact' || type === 'customer') attrs.class = [attrs.class, 'contact-form'].filter(Boolean).join(' ');
        emitter.write(`<form ${Object.entries(attrs).map(([k, v]) => `${k}="${escapeHtml(v)}"`).join(' ')}>`);
        emitter.write(`<input type="hidden" name="form_type" value="${escapeHtml(type)}"><input type="hidden" name="utf8" value="✓">`);
        const form = {
          id: '',
          errors: null,
          'posted_successfully?': false,
          posted_successfully: false,
          body: '',
          email: '',
          name: '',
          phone: '',
          author: '',
          elements: [],
        };
        ctx.push({ form });
        yield this.liquid.renderer.renderTemplates(this.templates, ctx, emitter);
        ctx.pop();
        emitter.write('</form>');
      }
    }
  );

  // {% paginate collection.products by 12 %} ... {% endpaginate %}
  liquid.registerTag(
    'paginate',
    class extends Tag {
      constructor(token, remainTokens, liquid, parser) {
        super(token, remainTokens, liquid);
        blockTemplates(this, token, remainTokens, parser, 'endpaginate');
      }
      *render(ctx, emitter) {
        ctx.push({ paginate: { current_page: 1, pages: 1, items: 0, parts: [], previous: null, next: null, page_size: 12, current_offset: 0 } });
        yield this.liquid.renderer.renderTemplates(this.templates, ctx, emitter);
        ctx.pop();
      }
    }
  );

  // Horizon theme-block plumbing: not previewed.
  liquid.registerTag(
    'content_for',
    class extends Tag {
      *render(ctx, emitter) {
        rt.warn(`{% content_for ${this.token.args.trim()} %} is not supported (theme blocks are skipped)`);
        emitter.write(`<!-- preview: content_for ${escapeHtml(this.token.args.trim())} skipped -->`);
      }
    }
  );
  liquid.registerTag(
    'sections',
    class extends Tag {
      *render(ctx, emitter) {
        emitter.write(`<!-- preview: sections ${escapeHtml(this.token.args.trim())} skipped -->`);
      }
    }
  );
  liquid.registerTag(
    'section',
    class extends Tag {
      *render(ctx, emitter) {
        const name = this.token.args.trim().replace(/^['"]|['"]$/g, '');
        const html = yield rt.renderStaticSection(name);
        emitter.write(html);
      }
    }
  );
  liquid.registerTag(
    'layout',
    class extends Tag {
      *render() {}
    }
  );
}
