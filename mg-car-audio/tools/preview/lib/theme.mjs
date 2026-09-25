// Renders a Shopify JSON template from the theme into a standalone HTML page that approximates
// the storefront for our custom mg-* sections. Everything is read from disk at render time.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Liquid } from 'liquidjs';
import {
  ColorDrop,
  FontDrop,
  ImageDrop,
  StringDrop,
  LookupDrop,
  makePalette,
  createFilters,
  registerShopifyTags,
  escapeHtml,
} from './shopify.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const PREVIEW_DIR = path.resolve(HERE, '..');
export const REPO_DIR = path.resolve(PREVIEW_DIR, '..', '..');
export const THEME_DIR = process.env.MG_THEME_DIR ? path.resolve(process.env.MG_THEME_DIR) : path.join(REPO_DIR, 'theme');
export const OUT_DIR = path.join(PREVIEW_DIR, 'out');

export const DEFAULT_TEMPLATES = ['index', 'page.service', 'page.car-make', 'page.quote', 'page.contact'];
export const HOME_FALLBACK_SECTIONS = [
  'mg-hero',
  'mg-trust-bar',
  'mg-car-makes',
  'mg-services-grid',
  'mg-how-it-works',
  'mg-gallery',
  'mg-reviews',
  'mg-faq',
  'mg-contact-map',
];

const ORIGIN = 'https://mg-car-audio.example';

/* ------------------------------------------------------------------ */
/* File helpers                                                         */
/* ------------------------------------------------------------------ */

/** Removes /* *\/ and // comments outside of strings (Shopify JSON files start with a comment header). */
export function stripJsonComments(text) {
  let out = '';
  let inStr = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const n = text[i + 1];
    if (inStr) {
      out += c;
      if (c === '\\') out += text[++i] ?? '';
      else if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') {
      inStr = true;
      out += c;
    } else if (c === '/' && n === '*') {
      const end = text.indexOf('*/', i + 2);
      i = end < 0 ? text.length : end + 1;
    } else if (c === '/' && n === '/') {
      const end = text.indexOf('\n', i);
      i = end < 0 ? text.length : end - 1;
    } else out += c;
  }
  return out;
}

export function readJsonc(file) {
  return JSON.parse(stripJsonComments(fs.readFileSync(file, 'utf8')));
}

const blockRe = (name) => new RegExp(`\\{%-?\\s*${name}\\s*-?%\\}([\\s\\S]*?)\\{%-?\\s*end${name}\\s*-?%\\}`, 'g');
const keepLines = (s) => '\n'.repeat((s.match(/\n/g) || []).length); // keeps error line numbers right

/** Splits a section/snippet/block file into renderable Liquid + schema + stylesheet/javascript bodies. */
export function preprocessLiquid(src) {
  const out = { schema: null, schemaError: null, css: [], js: [] };
  let body = src.replace(blockRe('schema'), (m, json) => {
    try {
      out.schema = JSON.parse(json);
    } catch (e) {
      out.schemaError = e.message;
    }
    return keepLines(m);
  });
  body = body.replace(blockRe('stylesheet'), (m, css) => (out.css.push(css), keepLines(m)));
  body = body.replace(blockRe('javascript'), (m, js) => (out.js.push(js), keepLines(m)));
  body = body.replace(blockRe('doc'), (m) => keepLines(m));
  out.body = body;
  return out;
}

const toPosix = (p) => p.split(path.sep).join('/');

/* ------------------------------------------------------------------ */
/* Settings                                                             */
/* ------------------------------------------------------------------ */

function shopifyUrl(v) {
  if (typeof v !== 'string') return v;
  const m = v.match(/^shopify:\/\/(collections|products|pages|blogs|articles|policies)\/(.+)$/);
  if (m) return `/${m[1]}/${m[2]}`;
  if (v === 'shopify://collections') return '/collections';
  return v;
}

function makeCollection(data = {}) {
  const handle = data.handle || 'all';
  return {
    id: 1,
    handle,
    title: data.title || handle.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    description: data.description ?? '',
    url: `/collections/${handle}`,
    products_count: data.products_count ?? 0,
    all_products_count: data.all_products_count ?? data.products_count ?? 0,
    products: [],
    filters: [],
    image: data.image ? new ImageDrop({ filename: data.image }) : undefined,
    featured_image: undefined,
    metafields: data.metafields || {},
    sort_options: [],
    ...Object.fromEntries(Object.entries(data).filter(([k]) => !['image', 'metafields'].includes(k))),
  };
}

function makePage(data = {}) {
  const handle = data.handle || 'page';
  return {
    id: 1,
    handle,
    title: data.title || handle,
    content: data.content ?? '',
    url: `/pages/${handle}`,
    author: 'MG Car Audio',
    template_suffix: data.template_suffix,
    published_at: '2026-01-01T09:00:00Z',
    metafields: data.metafields || {},
  };
}

function makeProduct(data = {}) {
  const handle = data.handle || 'product';
  return {
    id: 1,
    handle,
    title: data.title || handle,
    url: `/products/${handle}`,
    price: data.price ?? 0,
    available: true,
    vendor: 'MG Car Audio',
    type: '',
    tags: [],
    variants: [],
    media: [],
    images: [],
    featured_image: undefined,
    featured_media: undefined,
    metafields: data.metafields || {},
    ...data,
  };
}

function makeMenu(handle) {
  const links = [
    ['Home', '/'],
    ['Services', '/collections/installation-services'],
    ['Car makes', '/pages/car-makes'],
    ['Shop', '/collections/all'],
    ['Contact', '/pages/contact'],
  ].map(([title, url]) => ({ title, url, handle: title.toLowerCase(), links: [], active: false, current: false, levels: 0, type: 'http_link' }));
  return { handle, title: handle, links, levels: 1 };
}

function imageFromSetting(v) {
  if (v instanceof ImageDrop) return v;
  if (typeof v === 'string' && v.startsWith('shopify://shop_images/')) {
    const filename = v.slice('shopify://shop_images/'.length);
    return new ImageDrop({ filename, alt: filename });
  }
  return undefined;
}

function coerceValue(def, value) {
  const type = def?.type;
  if (value === undefined || value === null) return type === 'checkbox' ? false : undefined;
  switch (type) {
    case 'checkbox':
      return value === true || value === 'true';
    case 'range':
    case 'number':
      return value === '' ? undefined : Number(value);
    case 'color': {
      if (value === '') return undefined;
      return ColorDrop.parse(value) ?? value;
    }
    case 'color_palette':
      return makePalette(value);
    case 'font_picker':
      return new FontDrop(value);
    case 'image_picker':
      return imageFromSetting(value);
    case 'video':
    case 'video_url':
      return value ? { id: 'preview', type: 'youtube', url: String(value), alt: 'video' } : undefined;
    case 'url':
      return shopifyUrl(value);
    case 'collection':
      return value ? makeCollection({ handle: String(value) }) : undefined;
    case 'product':
      return value ? makeProduct({ handle: String(value) }) : undefined;
    case 'page':
      return value ? makePage({ handle: String(value) }) : undefined;
    case 'link_list':
      return value ? makeMenu(String(value)) : undefined;
    case 'collection_list':
      return Array.isArray(value) ? value.map((h) => makeCollection({ handle: h })) : [];
    case 'product_list':
      return [];
    case 'metaobject':
    case 'metaobject_list':
      return undefined;
    default:
      return value;
  }
}

/** Schema defaults overlaid with explicit values; `{{ ... }}` dynamic values are rendered against `globals`. */
function buildSettings(defList, ...layers) {
  const defs = {};
  const raw = {};
  for (const d of defList || []) {
    if (!d.id) continue;
    defs[d.id] = d;
    if (d.default !== undefined) raw[d.id] = d.default;
  }
  for (const layer of layers) if (layer) Object.assign(raw, layer);
  return { defs, raw };
}

function resolveSettings(liquid, { defs, raw }, globals) {
  const out = {};
  const dynamic = [];
  for (const [id, v] of Object.entries(raw)) {
    if (typeof v === 'string' && v.includes('{{')) dynamic.push(id);
    else out[id] = coerceValue(defs[id], v);
  }
  for (const id of dynamic) {
    let v = raw[id];
    try {
      const g = { ...globals, settings: globals.settings || out };
      for (let i = 0; i < 3 && typeof v === 'string' && v.includes('{{'); i++) v = liquid.parseAndRenderSync(v, {}, { globals: g });
    } catch {
      /* keep raw */
    }
    out[id] = coerceValue(defs[id], v);
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Runtime / engine                                                     */
/* ------------------------------------------------------------------ */

function createRuntime(themeDir, outDir) {
  const warnings = new Map();
  const rt = {
    themeDir,
    assetBase: toPosix(path.relative(outDir, path.join(themeDir, 'assets'))) || '.',
    where: 'layout',
    usedFonts: new Set(),
    jsByFile: new Map(),
    warnings,
    warn(msg) {
      const key = `${msg}  (${rt.where})`;
      warnings.set(key, (warnings.get(key) || 0) + 1);
    },
    locale: {},
    schemaLocale: {},
    translate(key, vars = {}) {
      const isSchema = key.startsWith('t:');
      const k = key.replace(/^t:/, '');
      const lookup = (src) => k.split('.').reduce((o, p) => (o && typeof o === 'object' ? o[p] : undefined), src);
      let v = lookup(isSchema ? rt.schemaLocale : rt.locale) ?? lookup(isSchema ? rt.locale : rt.schemaLocale);
      if (v && typeof v === 'object') v = Number(vars.count) === 1 ? v.one ?? v.other : v.other ?? v.one;
      if (typeof v !== 'string') {
        rt.warn(`t: missing translation "${key}"`);
        return key;
      }
      return v.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, n) => (vars[n] === undefined ? '' : String(vars[n])));
    },
  };
  for (const [file, target] of [
    ['en.default.json', 'locale'],
    ['en.default.schema.json', 'schemaLocale'],
  ]) {
    try {
      rt[target] = readJsonc(path.join(themeDir, 'locales', file));
    } catch {
      /* optional */
    }
  }
  return rt;
}

function createEngine(rt) {
  const snippetsDir = path.join(rt.themeDir, 'snippets');
  const MISSING = '/__preview_missing_snippet__/';
  const read = (p) => {
    if (p.startsWith(MISSING)) {
      const name = p.slice(MISSING.length);
      rt.warn(`render: snippet "${name}" not found`);
      return `<!-- preview: missing snippet ${escapeHtml(name)} -->`;
    }
    const pre = preprocessLiquid(fs.readFileSync(p, 'utf8'));
    const rel = toPosix(path.relative(rt.themeDir, p));
    if (pre.js.length && !rt.jsByFile.has(rel)) rt.jsByFile.set(rel, pre.js);
    return pre.body;
  };
  const liquidFs = {
    exists: async (p) => p.startsWith(MISSING) || fs.existsSync(p),
    existsSync: (p) => p.startsWith(MISSING) || fs.existsSync(p),
    readFile: async (p) => read(p),
    readFileSync: (p) => read(p),
    resolve: (root, file, ext) => path.resolve(root, path.extname(file) ? file : file + ext),
    fallback: (file) => MISSING + file,
    contains: async () => true,
    containsSync: () => true,
    dirname: (p) => path.dirname(p),
    sep: path.sep,
  };
  const liquid = new Liquid({
    root: [snippetsDir],
    partials: [snippetsDir],
    layouts: [snippetsDir],
    extname: '.liquid',
    fs: liquidFs,
    relativeReference: false,
    dynamicPartials: true,
    strictFilters: false,
    strictVariables: false,
    lenientIf: true,
    cache: true,
  });
  for (const [name, fn] of Object.entries(createFilters(rt))) liquid.registerFilter(name, fn);
  registerShopifyTags(liquid, rt);

  // Unknown filters: warn once per place and pass the value through instead of failing.
  const passthrough = (v) => v;
  const known = liquid.filters;
  liquid.filters = new Proxy(known, {
    get(target, prop) {
      if (typeof prop === 'string' && !(prop in target) && /^[a-z_]\w*$/i.test(prop)) {
        rt.warn(`unknown filter "${prop}" (value passed through)`);
        return passthrough;
      }
      return target[prop];
    },
  });
  return liquid;
}

/* ------------------------------------------------------------------ */
/* Globals (shop, request, page, ...)                                   */
/* ------------------------------------------------------------------ */

function loadFixtures() {
  const file = path.join(PREVIEW_DIR, 'fixtures.json');
  try {
    return readJsonc(file);
  } catch (e) {
    if (fs.existsSync(file)) console.warn(`[preview] fixtures.json is invalid: ${e.message}`);
    return {};
  }
}

function buildGlobals(templateName, settings, fixtures, opts) {
  const [type, ...rest] = templateName.split('.');
  const suffix = rest.length ? rest.join('.') : undefined;
  let page;
  let collection;
  let product;
  let reqPath = '/';
  if (type === 'page') {
    const fx = fixtures.pages?.[templateName] ?? fixtures.pages?.page ?? { title: suffix || 'Page', handle: suffix || 'page' };
    page = makePage({ template_suffix: suffix, ...fx });
    reqPath = page.url;
  } else if (type === 'collection') {
    collection = makeCollection(fixtures.collections?.[templateName] ?? fixtures.collections?.collection ?? {});
    reqPath = collection.url;
  } else if (type === 'product') {
    product = makeProduct(fixtures.products?.[templateName] ?? fixtures.products?.product ?? {});
    reqPath = product.url;
  }
  const shop = {
    name: 'MG Car Audio',
    url: ORIGIN,
    secure_url: ORIGIN,
    domain: 'mg-car-audio.example',
    permanent_domain: 'mg-car-audio.myshopify.com',
    email: 'info@mg-car-audio.example',
    currency: 'EUR',
    money_format: '€{{amount}}',
    locale: 'en',
    description: "Ireland's CarPlay & Car Audio Specialist",
    privacy_policy: { url: '/policies/privacy-policy', title: 'Privacy policy' },
    refund_policy: { url: '/policies/refund-policy', title: 'Refund policy' },
    terms_of_service: { url: '/policies/terms-of-service', title: 'Terms of service' },
    shipping_policy: { url: '/policies/shipping-policy', title: 'Shipping policy' },
    policies: [],
    brand: {},
    metafields: {},
    ...(fixtures.shop || {}),
  };
  const locale = { iso_code: 'en', name: 'English', endonym_name: 'English', primary: true, root_url: '/', direction: 'ltr' };
  const routes = {
    root_url: '/',
    account_url: '/account',
    account_login_url: '/account/login',
    account_logout_url: '/account/logout',
    account_register_url: '/account/register',
    account_addresses_url: '/account/addresses',
    cart_url: '/cart',
    cart_add_url: '/cart/add',
    cart_change_url: '/cart/change',
    cart_clear_url: '/cart/clear',
    cart_update_url: '/cart/update',
    collections_url: '/collections',
    all_products_collection_url: '/collections/all',
    search_url: '/search',
    predictive_search_url: '/search/suggest',
    product_recommendations_url: '/recommendations/products',
  };
  const title = page?.title || collection?.title || product?.title || shop.name;
  return {
    settings,
    shop,
    request: {
      origin: ORIGIN,
      host: 'mg-car-audio.example',
      path: reqPath,
      page_type: type,
      design_mode: Boolean(opts.designMode),
      visual_preview_mode: false,
      locale,
    },
    template: new StringDrop(templateName, { name: type, suffix, directory: undefined }),
    page,
    collection,
    product,
    closest: { page, product, collection },
    routes,
    localization: {
      language: locale,
      country: { iso_code: 'IE', name: 'Ireland', currency: { iso_code: 'EUR', symbol: '€', name: 'Euro' } },
      available_languages: [locale],
      available_countries: [],
    },
    customer: undefined,
    cart: { item_count: 0, items: [], total_price: 0, original_total_price: 0, note: '', attributes: {}, currency: { iso_code: 'EUR' } },
    canonical_url: ORIGIN + reqPath,
    page_title: title,
    page_description: shop.description,
    handle: page?.handle || collection?.handle || product?.handle,
    content_for_header: '',
    powered_by_link: '<a href="https://www.shopify.com" rel="nofollow">Powered by Shopify</a>',
    collections: new LookupDrop((h) => makeCollection({ handle: h })),
    pages: new LookupDrop((h) => makePage({ handle: h })),
    products: new LookupDrop(() => undefined),
    all_products: new LookupDrop(() => undefined),
    linklists: new LookupDrop((h) => makeMenu(h)),
    metaobjects: new LookupDrop(() => undefined),
    images: new LookupDrop((n) => new ImageDrop({ filename: n })),
    blogs: new LookupDrop(() => undefined),
    articles: new LookupDrop(() => undefined),
  };
}

/* ------------------------------------------------------------------ */
/* Sections                                                             */
/* ------------------------------------------------------------------ */

function normalizePresetBlocks(preset) {
  if (!preset?.blocks) return [];
  if (Array.isArray(preset.blocks)) return preset.blocks.map((b, i) => ({ id: `preset_${b.type}_${i + 1}`, ...b }));
  const order = preset.block_order || Object.keys(preset.blocks);
  return order.filter((id) => preset.blocks[id]).map((id) => ({ id, ...preset.blocks[id] }));
}

function sectionPlaceholder(id, type, note, entry) {
  const blockTypes = Object.values(entry?.blocks || {}).map((b) => b.type);
  const summary = blockTypes.length ? `<span class="pv-placeholder__meta">blocks: ${escapeHtml([...new Set(blockTypes)].join(', '))}</span>` : '';
  return `<div id="shopify-section-${escapeHtml(id)}" class="shopify-section pv-placeholder-section" data-preview-placeholder="${escapeHtml(type)}"><div class="pv-placeholder"><span class="pv-placeholder__type">${escapeHtml(type)}</span><span class="pv-placeholder__note">${escapeHtml(note)}</span>${summary}</div></div>`;
}

function sectionError(id, type, key, err) {
  const msg = String(err?.message || err).split('\n').slice(0, 12).join('\n');
  return `<div id="shopify-section-${escapeHtml(id)}" class="shopify-section pv-error-section"><div class="pv-error" role="alert"><strong>Render error in section "${escapeHtml(key)}" (${escapeHtml(type)})</strong><pre>${escapeHtml(msg)}</pre></div></div>`;
}

class PageRenderer {
  constructor(templateName, opts) {
    this.templateName = templateName;
    this.opts = opts;
    this.themeDir = opts.themeDir || THEME_DIR;
    this.outDir = opts.outDir || OUT_DIR;
    this.rt = createRuntime(this.themeDir, this.outDir);
    this.rt.renderStaticSection = (name) => this.renderSection({ key: name, entry: { type: name }, index: 1, location: 'static' }).then((r) => r.html);
    this.liquid = createEngine(this.rt);
    this.report = { template: templateName, sections: [], footer: [], notes: [] };
  }

  loadGlobalSettings() {
    const schemaFile = path.join(this.themeDir, 'config', 'settings_schema.json');
    const dataFile = path.join(this.themeDir, 'config', 'settings_data.json');
    const schema = readJsonc(schemaFile);
    const defList = schema.flatMap((g) => g.settings || []);
    let current = {};
    try {
      const data = readJsonc(dataFile);
      current = typeof data.current === 'string' ? data.presets?.[data.current] || {} : data.current || {};
    } catch (e) {
      this.report.notes.push(`settings_data.json could not be read: ${e.message}`);
    }
    return resolveSettings(this.liquid, buildSettings(defList, current), {});
  }

  isPreviewable(type) {
    if (this.opts.extraSections?.includes(type)) return true;
    return /^mg-/.test(type);
  }

  buildBlocks(schema, entry, key) {
    const local = Object.fromEntries((schema.blocks || []).filter((b) => b.type && !b.type.startsWith('@')).map((b) => [b.type, b]));
    const acceptsThemeBlocks = (schema.blocks || []).some((b) => b.type === '@theme');
    let list;
    const hasBlocks = entry.blocks && Object.keys(entry.blocks).length > 0;
    if (hasBlocks) {
      const order = entry.block_order || Object.keys(entry.blocks);
      list = order.filter((id) => entry.blocks[id]).map((id) => ({ id, ...entry.blocks[id] }));
    } else if (Object.keys(local).length && this.opts.presetBlocks !== false) {
      list = normalizePresetBlocks(schema.presets?.[0]);
      if (list.length) this.report.notes.push(`section "${key}" (${entry.type}): template has no blocks, using the first preset's ${list.length} blocks`);
    } else list = [];
    const blocks = [];
    for (const b of list) {
      if (b.disabled) continue;
      const def = local[b.type];
      if (!def) {
        this.rt.warn(`block type "${b.type}" is not defined in the section schema${acceptsThemeBlocks ? ' (theme block, skipped)' : ' (skipped)'}`);
        continue;
      }
      blocks.push({
        id: b.id,
        type: b.type,
        name: def.name,
        settings: resolveSettings(this.liquid, buildSettings(def.settings, b.settings), this.globals),
        shopify_attributes: '',
        static: Boolean(b.static),
        blocks: [],
      });
    }
    return blocks;
  }

  async renderSection({ key, entry, index, location, group, presetSettings }) {
    const type = entry.type;
    const id = location === 'template' ? `template--1001__${key}` : location === 'static' ? key : `sections--1002__${key}`;
    const result = { key, type, id, status: 'ok' };
    const started = Date.now();
    const file = path.join(this.themeDir, 'sections', `${type}.liquid`);
    const label = `${location === 'template' ? '' : location + ' '}section "${key}" (${type})`;
    this.rt.where = label;
    try {
      if (!this.isPreviewable(type)) {
        result.status = 'placeholder';
        result.html = sectionPlaceholder(id, type, `Horizon ${location === 'footer' ? 'footer ' : ''}section (not previewed)`, entry);
        return result;
      }
      if (!fs.existsSync(file)) {
        result.status = 'placeholder';
        result.html = sectionPlaceholder(id, type, `sections/${type}.liquid not found`, entry);
        this.rt.warn(`section file sections/${type}.liquid not found`);
        return result;
      }
      const pre = preprocessLiquid(fs.readFileSync(file, 'utf8'));
      if (pre.schemaError) this.rt.warn(`{% schema %} JSON did not parse: ${pre.schemaError}`);
      const schema = pre.schema || {};
      if (pre.js.length) this.rt.jsByFile.set(`sections/${type}.liquid`, pre.js);
      const settings = resolveSettings(this.liquid, buildSettings(schema.settings, presetSettings, entry.settings), this.globals);
      const blocks = this.buildBlocks(schema, entry, key);
      const section = { id, type, settings, blocks, block_order: blocks.map((b) => b.id), index, index0: index - 1, location };
      const tpl = this.liquid.parse(pre.body, file);
      const html = await this.liquid.render(tpl, { section }, { globals: this.globals });
      const tag = schema.tag || 'div';
      const classes = ['shopify-section', group ? `shopify-section-group-${group}` : '', schema.class || ''].filter(Boolean).join(' ');
      result.html = `<${tag} id="shopify-section-${escapeHtml(id)}" class="${escapeHtml(classes)}">${html}</${tag}>`;
      return result;
    } catch (err) {
      const message = String(err?.message || err).split(this.themeDir + path.sep).join('');
      result.status = 'error';
      result.error = message.split('\n')[0];
      result.html = sectionError(id, type, key, message);
      return result;
    } finally {
      result.ms = Date.now() - started;
      this.rt.where = 'layout';
    }
  }

  async renderSnippetSafe(name, fallbackHtml = '') {
    const prev = this.rt.where;
    this.rt.where = `snippet ${name}`;
    try {
      return await this.liquid.parseAndRender(`{% render '${name}' %}`, {}, { globals: this.globals });
    } catch (err) {
      this.report.notes.push(`snippet ${name} failed: ${String(err.message).split('\n')[0]}`);
      this.rt.warn(`snippet ${name} failed to render: ${String(err.message).split('\n')[0]}`);
      return fallbackHtml;
    } finally {
      this.rt.where = prev;
    }
  }

  /** Which sections make up the page: template JSON, or preset fallbacks. */
  resolveTemplateSections() {
    const name = this.templateName;
    const file = path.join(this.themeDir, 'templates', `${name}.json`);
    if (this.opts.sections?.length) {
      this.report.source = `--sections ${this.opts.sections.join(',')} (preset defaults)`;
      return this.opts.sections.map((type, i) => ({ key: `${type.replace(/^mg-/, '').replace(/-/g, '_')}_${i + 1}`, entry: { type }, usePreset: true }));
    }
    const useHomeFallback = name === 'index' && (this.opts.homeFallback || !fs.existsSync(file));
    if (useHomeFallback) {
      this.report.source = `home fallback: ${HOME_FALLBACK_SECTIONS.join(', ')} (preset defaults)`;
      return HOME_FALLBACK_SECTIONS.map((type) => ({ key: type.replace(/^mg-/, '').replace(/-/g, '_'), entry: { type }, usePreset: true }));
    }
    if (!fs.existsSync(file)) {
      if (fs.existsSync(path.join(this.themeDir, 'templates', `${name}.liquid`))) throw new Error(`templates/${name}.liquid is a Liquid template; only JSON templates are supported`);
      throw new Error(`templates/${name}.json not found`);
    }
    const json = readJsonc(file);
    this.report.source = `templates/${name}.json`;
    const order = json.order || Object.keys(json.sections || {});
    return order
      .filter((k) => json.sections?.[k])
      .filter((k) => !json.sections[k].disabled)
      .map((key) => ({ key, entry: json.sections[key] }));
  }

  presetSettingsFor(type) {
    try {
      const pre = preprocessLiquid(fs.readFileSync(path.join(this.themeDir, 'sections', `${type}.liquid`), 'utf8'));
      return pre.schema?.presets?.[0]?.settings;
    } catch {
      return undefined;
    }
  }

  async renderGroup(groupName, location) {
    const file = path.join(this.themeDir, 'sections', `${groupName}.json`);
    if (!fs.existsSync(file)) return { html: '', results: [] };
    let json;
    try {
      json = readJsonc(file);
    } catch (e) {
      this.report.notes.push(`${groupName}.json could not be parsed: ${e.message}`);
      return { html: '', results: [] };
    }
    const results = [];
    const order = (json.order || Object.keys(json.sections || {})).filter((k) => json.sections?.[k] && !json.sections[k].disabled);
    let i = 0;
    for (const key of order) {
      results.push(await this.renderSection({ key, entry: json.sections[key], index: ++i, location, group: groupName }));
    }
    return { html: results.map((r) => r.html).join('\n'), results, types: order.map((k) => json.sections[k].type) };
  }

  collectStylesheetTags() {
    // Shopify bundles every {% stylesheet %} in the theme into one file loaded on all pages.
    const chunks = [];
    for (const dir of ['snippets', 'blocks', 'sections']) {
      const abs = path.join(this.themeDir, dir);
      if (!fs.existsSync(abs)) continue;
      for (const f of fs.readdirSync(abs).filter((x) => x.endsWith('.liquid')).sort()) {
        const pre = preprocessLiquid(fs.readFileSync(path.join(abs, f), 'utf8'));
        for (const css of pre.css) if (css.trim()) chunks.push(`/* ${dir}/${f} */\n${css.trim()}`);
      }
    }
    return chunks.join('\n\n');
  }

  googleFontLinks(settings) {
    const fams = new Map();
    const add = (font) => {
      if (!(font instanceof FontDrop) || font['system?']) return;
      const set = fams.get(font.family) || new Set();
      set.add(`${font.style === 'normal' ? 0 : 1},${font.weight}`);
      set.add('0,400');
      set.add('0,700');
      fams.set(font.family, set);
    };
    for (const k of ['type_body_font', 'type_subheading_font', 'type_heading_font', 'type_accent_font']) add(settings[k]);
    for (const entry of this.rt.usedFonts) {
      const [family, style, weight] = entry.split('|');
      const set = fams.get(family) || new Set();
      set.add(`${style === 'normal' ? 0 : 1},${weight}`);
      fams.set(family, set);
    }
    const links = [];
    for (const [family, set] of fams) {
      const tuples = [...set].sort((a, b) => {
        const [ia, wa] = a.split(',').map(Number);
        const [ib, wb] = b.split(',').map(Number);
        return ia - ib || wa - wb;
      });
      const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replace(/%20/g, '+')}:ital,wght@${tuples.join(';')}&display=swap`;
      links.push(`<link rel="stylesheet" href="${escapeHtml(url)}" data-preview-font>`);
    }
    return links.length ? `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n${links.join('\n')}` : '';
  }

  async render() {
    const started = Date.now();
    const settings = this.loadGlobalSettings();
    const fixtures = loadFixtures();
    this.globals = buildGlobals(this.templateName, settings, fixtures, this.opts);

    // Main content
    const results = [];
    let entries;
    try {
      entries = this.resolveTemplateSections();
    } catch (err) {
      entries = [];
      results.push({ key: '(template)', type: this.templateName, status: 'error', error: err.message, html: sectionError('template', this.templateName, 'template', err) });
    }
    let index = 0;
    for (const { key, entry, usePreset } of entries) {
      index++;
      const presetSettings = usePreset ? this.presetSettingsFor(entry.type) : undefined;
      results.push(await this.renderSection({ key, entry, index, location: 'template', presetSettings }));
    }
    this.report.sections = results.map(({ html, ...r }) => r);

    // Header (fake) and footer group (mg-* sections real, the rest placeholders)
    let headerTypes = [];
    try {
      const hg = readJsonc(path.join(this.themeDir, 'sections', 'header-group.json'));
      headerTypes = (hg.order || []).map((k) => hg.sections?.[k]?.type).filter(Boolean);
    } catch {
      /* optional */
    }
    const footer = await this.renderGroup('footer-group', 'footer');
    this.report.footer = footer.results.map(({ html, ...r }) => r);

    // Layout pieces (same order as layout/theme.liquid)
    const assets = this.rt.assetBase;
    const stylesheets = await this.renderSnippetSafe(
      'stylesheets',
      `<link href="${assets}/base.css" rel="stylesheet"><link href="${assets}/mg-theme.css" rel="stylesheet">`
    );
    const styleVars = await this.renderSnippetSafe('theme-styles-variables');
    const palette = await this.renderSnippetSafe('color-palette');
    const localBusiness = await this.renderSnippetSafe('mg-local-business-schema');
    const whatsapp = await this.renderSnippetSafe('mg-whatsapp-button');
    const css = this.collectStylesheetTags();
    const js = [...this.rt.jsByFile.entries()]
      .map(([file, parts]) => parts.map((p) => `/* ${file} */\ntry {\n(function () {\n${p}\n})();\n} catch (e) { console.error('[preview] {% javascript %} in ${file} threw', e); }`).join('\n'))
      .join('\n\n');

    const page = this.globals.page;
    const title = `${page?.title || this.globals.page_title} (preview: ${this.templateName})`;
    const html = `<!doctype html>
<html lang="en" dir="ltr" data-preview-template="${escapeHtml(this.templateName)}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <title>${escapeHtml(title)}</title>
    <meta name="generator" content="mg-theme-preview: local approximation of Shopify rendering">
    ${this.googleFontLinks(settings)}
    <style id="preview-fallback-vars">${fallbackVars(settings)}</style>
    ${stylesheets}
    ${styleVars}
    ${palette}
    ${localBusiness}
    <script>window.Shopify = window.Shopify || { designMode: ${Boolean(this.opts.designMode)}, locale: 'en', country: 'IE', currency: { active: 'EUR', rate: '1.0' }, routes: { root: '/' }, shop: 'mg-car-audio.myshopify.com' };</script>
    <style id="preview-stylesheet-tags">
${css}
    </style>
    <style id="preview-chrome">${CHROME_CSS}</style>
  </head>
  <body class="page-width-${escapeHtml(settings.page_width || 'narrow')} card-hover-effect-${escapeHtml(settings.card_hover_effect || 'none')}">
    <div class="page-wrapper">
      <div id="header-group">
        ${fakeHeader(headerTypes)}
      </div>
      <main id="MainContent" class="content-for-layout" role="main" data-template="${escapeHtml(this.templateName)}">
${results.map((r) => r.html).join('\n')}
      </main>
      <footer>
${footer.html}
      </footer>
    </div>
    ${whatsapp}
    <script id="preview-javascript-tags">
${js}
    </script>
  </body>
</html>
`;
    this.report.warnings = [...this.rt.warnings.entries()].map(([message, count]) => ({ message, count }));
    this.report.ms = Date.now() - started;
    return { html, report: this.report };
  }
}

/* ------------------------------------------------------------------ */
/* Static page chrome                                                   */
/* ------------------------------------------------------------------ */

function fallbackVars(settings) {
  // Minimal Horizon variables in case theme-styles-variables / color-palette fail to render.
  const bg = settings.color_palette?.background || '#0b0d10';
  const fg = settings.color_palette?.foreground || '#f2f4f7';
  const c = (v) => ColorDrop.parse(v) || new ColorDrop(0, 0, 0);
  const font = (k, dflt) => (settings[k] instanceof FontDrop ? settings[k] : new FontDrop(dflt));
  const body = font('type_body_font', 'inter_n4');
  const sub = font('type_subheading_font', 'inter_n6');
  const head = font('type_heading_font', 'inter_n8');
  const acc = font('type_accent_font', 'inter_n7');
  const fam = (f) => `${JSON.stringify(f.family)}, ${f.fallback_families}`;
  return `:root {
      --color-background: ${c(bg)}; --color-background-rgb: ${c(bg).rgb};
      --color-foreground: ${c(fg)}; --color-foreground-rgb: ${c(fg).rgb};
      --color-border: ${c(fg)}; --color-border-rgb: ${c(fg).rgb};
      --font-body--family: ${fam(body)}; --font-body--weight: ${body.weight}; --font-body--style: ${body.style};
      --font-subheading--family: ${fam(sub)}; --font-subheading--weight: ${sub.weight}; --font-subheading--style: ${sub.style};
      --font-heading--family: ${fam(head)}; --font-heading--weight: ${head.weight}; --font-heading--style: ${head.style};
      --font-accent--family: ${fam(acc)}; --font-accent--weight: ${acc.weight}; --font-accent--style: ${acc.style};
      --font-paragraph--family: var(--font-body--family); --font-paragraph--weight: var(--font-body--weight);
      --font-paragraph--size: ${Number(settings.type_size_paragraph || 16) / 16}rem; --font-paragraph--line-height: 1.6;
      --opacity-5: 0.05; --opacity-10: 0.1; --opacity-15: 0.15; --opacity-20: 0.2; --opacity-40: 0.4; --opacity-50: 0.5;
    }
    body { color: var(--color-foreground); background-color: var(--color-background); font-family: var(--font-body--family); }`;
}

function fakeHeader(types) {
  const label = `Horizon header (not previewed)${types.length ? ': ' + types.join(', ') : ''}`;
  return `<div class="shopify-section header-section pv-header-section">
          <header class="pv-header" id="preview-fake-header">
            <a class="pv-header__logo" href="/">MG <span>Car Audio</span></a>
            <nav class="pv-header__nav" aria-label="Preview navigation"><a href="/">Home</a><a href="/collections/installation-services">Services</a><a href="/pages/car-makes">Car makes</a><a href="/collections/all">Shop</a><a href="/pages/contact">Contact</a></nav>
            <span class="pv-tag">${escapeHtml(label)}</span>
            <span class="pv-header__menu" aria-hidden="true"><i></i><i></i><i></i></span>
          </header>
        </div>`;
}

const CHROME_CSS = `
  .pv-header { position: relative; z-index: 20; display: flex; align-items: center; gap: 12px 28px; flex-wrap: wrap;
    padding: 14px clamp(16px, 4vw, 40px); background: #0b0d10; color: #f2f4f7; border-bottom: 1px solid #2a3039;
    font-family: var(--font-body--family, system-ui, sans-serif); }
  .pv-header a { color: inherit; text-decoration: none; }
  .pv-header__logo { font-weight: 800; font-size: 18px; letter-spacing: 0.06em; text-transform: uppercase; }
  .pv-header__logo span { color: #e4002b; }
  .pv-header__nav { display: none; gap: 22px; font-size: 14px; color: #aab3c0; }
  .pv-header__menu { display: inline-grid; gap: 4px; margin-left: auto; }
  .pv-header__menu i { display: block; width: 20px; height: 2px; background: #f2f4f7; }
  .pv-tag { order: 10; flex-basis: 100%; font: 600 10px/1.3 ui-monospace, SFMono-Regular, Menlo, monospace; color: #7d8796;
    border: 1px dashed #3a424e; border-radius: 4px; padding: 3px 8px; }
  @media (min-width: 990px) {
    .pv-header__nav { display: flex; }
    .pv-header__menu { display: none; }
    .pv-tag { order: 0; flex-basis: auto; margin-left: auto; }
  }
  .pv-placeholder-section { padding: 24px clamp(16px, 4vw, 40px); background: #0b0d10; }
  .pv-placeholder { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px;
    max-width: 1320px; min-height: 160px; margin: 0 auto; padding: 24px; text-align: center; border: 2px dashed #3a424e;
    border-radius: 10px; color: #aab3c0; background: repeating-linear-gradient(135deg, #11151a 0 12px, #0d1014 12px 24px);
    font: 500 14px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace; }
  .pv-placeholder__type { font-size: 16px; font-weight: 700; color: #f2f4f7; }
  .pv-placeholder__meta { font-size: 12px; color: #7d8796; }
  .pv-error-section { padding: 24px clamp(16px, 4vw, 40px); background: #0b0d10; }
  .pv-error { max-width: 1320px; margin: 0 auto; padding: 16px 20px; border: 2px solid #ff3b3b; border-radius: 10px;
    background: #2a0a0f; color: #ffd7d7; font: 14px/1.45 ui-monospace, SFMono-Regular, Menlo, monospace; }
  .pv-error strong { display: block; margin-bottom: 8px; color: #fff; }
  .pv-error pre { margin: 0; white-space: pre-wrap; word-break: break-word; }
`;

/* ------------------------------------------------------------------ */
/* Public API                                                           */
/* ------------------------------------------------------------------ */

export function outputBaseName(templateName) {
  return templateName.replace(/[\\/]/g, '__');
}

/**
 * Renders one template to <outDir>/<template>.html (+ .report.json).
 * @param {string} templateName e.g. 'index', 'page.service'
 * @param {object} [opts] { outDir, themeDir, homeFallback, sections: string[], designMode, presetBlocks }
 */
export async function renderTemplate(templateName, opts = {}) {
  const outDir = opts.outDir || OUT_DIR;
  fs.mkdirSync(outDir, { recursive: true });
  const renderer = new PageRenderer(templateName, { ...opts, outDir });
  const { html, report } = await renderer.render();
  const base = opts.outputName || outputBaseName(templateName);
  const htmlPath = path.join(outDir, `${base}.html`);
  fs.writeFileSync(htmlPath, html);
  report.output = htmlPath;
  fs.writeFileSync(path.join(outDir, `${base}.report.json`), JSON.stringify(report, null, 2));
  return report;
}

export function listTemplates(themeDir = THEME_DIR) {
  return fs
    .readdirSync(path.join(themeDir, 'templates'))
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace(/\.json$/, ''))
    .sort();
}

/** Human-readable summary lines for a report. */
export function formatReport(report, rel = (p) => p) {
  const lines = [];
  const all = [...report.sections, ...report.footer];
  const count = (s) => all.filter((r) => r.status === s).length;
  lines.push(
    `[${report.template}] ${rel(report.output)}  (${report.sections.length} sections + ${report.footer.length} footer: ${count('ok')} rendered, ${count('placeholder')} placeholder, ${count('error')} error; ${report.ms} ms)`
  );
  lines.push(`  source: ${report.source || '(none)'}`);
  for (const r of report.sections) lines.push(`  ${r.status === 'ok' ? 'ok   ' : r.status === 'error' ? 'ERROR' : 'stub '} ${r.key} (${r.type})${r.error ? ' - ' + r.error : ''}`);
  for (const r of report.footer) lines.push(`  ${r.status === 'ok' ? 'ok   ' : r.status === 'error' ? 'ERROR' : 'stub '} footer:${r.key} (${r.type})${r.error ? ' - ' + r.error : ''}`);
  for (const n of report.notes) lines.push(`  note  ${n}`);
  for (const w of report.warnings) lines.push(`  warn  ${w.message}${w.count > 1 ? ` x${w.count}` : ''}`);
  return lines.join('\n');
}
