#!/usr/bin/env node
// Usage: node tools/preview/render.mjs [template ...] [options]
//   node tools/preview/render.mjs page.service
//   node tools/preview/render.mjs index page.car-make
//   node tools/preview/render.mjs --all
//   node tools/preview/render.mjs index --home-fallback
//   node tools/preview/render.mjs --sections mg-faq,mg-reviews --name faq-reviews
// Writes tools/preview/out/<template>.html (+ <template>.report.json) and prints a summary.

import path from 'node:path';
import { renderTemplate, formatReport, DEFAULT_TEMPLATES, listTemplates, OUT_DIR } from './lib/theme.mjs';

export function parseArgs(argv) {
  const opts = { templates: [], homeFallback: false, sections: null, name: null, designMode: false, presetBlocks: true, all: false, strict: false, outDir: OUT_DIR };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--all') opts.all = true;
    else if (a === '--home-fallback' || a === '--presets') opts.homeFallback = true;
    else if (a === '--design-mode') opts.designMode = true;
    else if (a === '--no-preset-blocks') opts.presetBlocks = false;
    else if (a === '--strict') opts.strict = true;
    else if (a === '--sections') opts.sections = argv[++i].split(',').map((s) => s.trim()).filter(Boolean);
    else if (a === '--name') opts.name = argv[++i];
    else if (a === '--out') opts.outDir = path.resolve(argv[++i]);
    else if (a === '-h' || a === '--help') opts.help = true;
    else if (a.startsWith('--')) throw new Error(`unknown option ${a}`);
    else opts.templates.push(a.replace(/\.json$/, '').replace(/^templates\//, ''));
  }
  if (opts.all) opts.templates = listTemplates();
  if (opts.sections) {
    // Pseudo page made of the given sections (preset defaults), rendered in the context of
    // the first named template (default: index). Output: out/<--name or "sections">.html
    opts.templates = [opts.templates[0] || 'index'];
    opts.outputName = opts.name || 'sections';
  }
  if (!opts.templates.length) opts.templates = [...DEFAULT_TEMPLATES];
  return opts;
}

export async function renderMany(opts) {
  const reports = [];
  for (const t of opts.templates) {
    const report = await renderTemplate(t, {
      outDir: opts.outDir,
      homeFallback: opts.homeFallback,
      designMode: opts.designMode,
      presetBlocks: opts.presetBlocks,
      sections: opts.sections,
      outputName: opts.outputName,
    });
    reports.push(report);
  }
  return reports;
}

const USAGE = `Usage: node tools/preview/render.mjs [template ...] [--all] [--home-fallback] [--sections a,b --name x] [--design-mode] [--no-preset-blocks] [--out dir] [--strict]
Default templates: ${DEFAULT_TEMPLATES.join(', ')}`;

async function main() {
  let opts;
  try {
    opts = parseArgs(process.argv.slice(2));
  } catch (e) {
    console.error(e.message + '\n' + USAGE);
    process.exit(2);
  }
  if (opts.help) {
    console.log(USAGE);
    return;
  }
  const rel = (p) => path.relative(process.cwd(), p) || p;
  const reports = await renderMany(opts);
  for (const r of reports) console.log(formatReport(r, rel) + '\n');
  const errors = reports.reduce((n, r) => n + [...r.sections, ...r.footer].filter((s) => s.status === 'error').length, 0);
  console.log(`${reports.length} template(s) rendered, ${errors} section error(s).`);
  if (opts.strict && errors) process.exit(1);
}

if (process.argv[1] && path.resolve(process.argv[1]) === new URL(import.meta.url).pathname) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
