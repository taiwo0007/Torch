#!/usr/bin/env python3
"""Validate the MG Car Audio theme's JSON templates, section groups and schemas.

`shopify theme check` does not look inside JSON templates for bad setting
values, so this script does. It checks:

* templates/*.json and sections/*-group.json (the leading /* */ comment is
  stripped): every section type exists; the section is allowed on that
  template type / group (enabled_on / disabled_on); every setting id exists in
  the section's {% schema %} (or the theme block's schema for theme blocks);
  select/radio values are valid options; range values are within min/max and
  on a step; checkbox/number types; block types are allowed by the parent
  (local blocks, or theme blocks via @theme / named types, private `_` blocks
  only when named); block_order / order only reference existing keys and every
  non-static block is ordered; max_blocks / limit.
* sections/*.liquid and blocks/*.liquid: the schema parses as JSON, setting ids
  are unique, defaults match their type/options/range, presets only use valid
  block types and setting ids (recursively for nested theme blocks).
* extra house rules for mg-* files: no `t:` translation keys, every section has
  presets, url defaults only /collections or /collections/all, local and
  @theme blocks are not mixed.

Issues in untouched Horizon files (sections/blocks whose name does not start
with `mg-`) are reported separately as baseline and do not fail the run unless
--strict is passed.

Usage: python3 tools/validate_templates.py [--theme PATH] [--strict] [--quiet]
Exit code: 0 when there are no errors or warnings in scope, 1 otherwise.
"""

from __future__ import annotations

import argparse
import glob
import json
import os
import re
import sys
from dataclasses import dataclass, field

SCHEMA_RE = re.compile(r"{%-?\s*schema\s*-?%}(.*?){%-?\s*endschema\s*-?%}", re.S)
LEADING_COMMENT_RE = re.compile(r"^\s*/\*.*?\*/", re.S)

STRING_TYPES = {
    "text", "textarea", "richtext", "inline_richtext", "html", "liquid", "url",
    "video_url", "image_picker", "video", "color", "color_background",
    "font_picker", "collection", "product", "page", "blog", "article",
    "link_list", "color_scheme", "metaobject", "text_alignment",
}
LIST_TYPES = {"collection_list", "product_list", "metaobject_list"}
NO_ID_TYPES = {"header", "paragraph"}
TEXT_ALIGNMENT = {"left", "center", "right"}
URL_DEFAULTS_OK = {"/collections", "/collections/all"}
MAX_SECTIONS_PER_TEMPLATE = 25
DEFAULT_MAX_BLOCKS = 50


@dataclass
class Issue:
    level: str  # ERROR | WARN
    file: str
    where: str
    msg: str
    baseline: bool = False


@dataclass
class Schema:
    kind: str  # section | block
    name: str  # type name
    path: str
    data: dict
    settings: dict = field(default_factory=dict)  # id -> setting def
    local_blocks: dict = field(default_factory=dict)  # type -> block def
    theme_refs: set = field(default_factory=set)  # named theme block types
    accepts_theme: bool = False
    accepts_app: bool = False


class Validator:
    def __init__(self, theme: str):
        self.theme = theme
        self.issues: list[Issue] = []
        self.sections: dict[str, Schema] = {}
        self.blocks: dict[str, Schema] = {}
        self.bad_schema_files: set[str] = set()
        self.color_schemes: set[str] = set()
        self.files_checked = 0

    # ------------------------------------------------------------------ utils
    def rel(self, path: str) -> str:
        return os.path.relpath(path, self.theme)

    @staticmethod
    def is_mg(path: str) -> bool:
        return os.path.basename(path).startswith("mg-")

    def is_baseline(self, path: str) -> bool:
        rel = self.rel(path)
        if rel.startswith("templates/") or rel.endswith("-group.json"):
            return False
        return not self.is_mg(path)

    def add(self, level: str, path: str, where: str, msg: str) -> None:
        self.issues.append(Issue(level, self.rel(path), where, msg, self.is_baseline(path)))

    # ---------------------------------------------------------------- loading
    def load_schemas(self) -> None:
        for kind, folder, store in (
            ("section", "sections", self.sections),
            ("block", "blocks", self.blocks),
        ):
            for path in sorted(glob.glob(os.path.join(self.theme, folder, "*.liquid"))):
                self.files_checked += 1
                name = os.path.basename(path)[: -len(".liquid")]
                text = open(path, encoding="utf-8").read()
                matches = SCHEMA_RE.findall(text)
                if not matches:
                    data: dict = {}
                    if kind == "section":
                        self.add("WARN", path, "schema", "no {% schema %} tag")
                else:
                    if len(matches) > 1:
                        self.add("ERROR", path, "schema", "more than one {% schema %} tag")
                    try:
                        data = json.loads(matches[0])
                    except json.JSONDecodeError as exc:
                        self.add("ERROR", path, "schema", f"schema is not valid JSON: {exc}")
                        self.bad_schema_files.add(path)
                        data = {}
                if not isinstance(data, dict):
                    self.add("ERROR", path, "schema", "schema must be a JSON object")
                    data = {}
                store[name] = self.build_schema(kind, name, path, data)

    def build_schema(self, kind: str, name: str, path: str, data: dict) -> Schema:
        sch = Schema(kind, name, path, data)
        sch.settings = self.index_settings(path, "settings", data.get("settings", []))
        for i, bdef in enumerate(data.get("blocks", []) or []):
            if not isinstance(bdef, dict) or "type" not in bdef:
                self.add("ERROR", path, f"blocks[{i}]", "block entry needs a type")
                continue
            btype = bdef["type"]
            if btype == "@theme":
                sch.accepts_theme = True
            elif btype == "@app":
                sch.accepts_app = True
            elif kind == "section" and "name" in bdef:
                if btype in sch.local_blocks:
                    self.add("ERROR", path, f"blocks[{i}]", f"duplicate local block type '{btype}'")
                bdef = dict(bdef)
                bdef["_settings"] = self.index_settings(
                    path, f"blocks.{btype}.settings", bdef.get("settings", [])
                )
                sch.local_blocks[btype] = bdef
            else:
                sch.theme_refs.add(btype)
        return sch

    def index_settings(self, path: str, where: str, settings) -> dict:
        out: dict = {}
        if not isinstance(settings, list):
            self.add("ERROR", path, where, "settings must be a list")
            return out
        for i, s in enumerate(settings):
            if not isinstance(s, dict) or "type" not in s:
                self.add("ERROR", path, f"{where}[{i}]", "setting needs a type")
                continue
            if s["type"] in NO_ID_TYPES:
                continue
            sid = s.get("id")
            if not sid:
                self.add("ERROR", path, f"{where}[{i}]", f"{s['type']} setting has no id")
                continue
            if sid in out:
                self.add("ERROR", path, f"{where}.{sid}", "duplicate setting id")
            out[sid] = s
        return out

    def load_color_schemes(self) -> None:
        path = os.path.join(self.theme, "config", "settings_data.json")
        try:
            data = json.loads(LEADING_COMMENT_RE.sub("", open(path, encoding="utf-8").read(), count=1))
            cur = data.get("current", {})
            if isinstance(cur, str):
                cur = data.get("presets", {}).get(cur, {})
            self.color_schemes = set((cur.get("color_schemes") or {}).keys())
        except Exception:  # noqa: BLE001 - schemes are optional context
            self.color_schemes = set()

    # ------------------------------------------------------------ value check
    def check_value(self, path: str, where: str, sdef: dict, value, *, is_default: bool = False) -> None:
        stype = sdef.get("type")
        if isinstance(value, str) and value.startswith("t:"):
            return  # translation key, resolved from locales/*.schema.json
        if isinstance(value, str) and "{{" in value and stype not in ("richtext", "inline_richtext", "text", "textarea", "html", "liquid"):
            return  # dynamic source, resolved at render time
        if stype == "checkbox":
            if not isinstance(value, bool):
                self.add("ERROR", path, where, f"checkbox value must be true/false, got {value!r}")
        elif stype in ("range", "number"):
            if isinstance(value, bool) or not isinstance(value, (int, float)):
                if stype == "number" and value in ("", None):
                    return
                self.add("ERROR", path, where, f"{stype} value must be a number, got {value!r}")
                return
            if stype == "range":
                lo, hi, step = sdef.get("min"), sdef.get("max"), sdef.get("step", 1)
                if lo is not None and value < lo:
                    self.add("ERROR", path, where, f"range value {value} below min {lo}")
                if hi is not None and value > hi:
                    self.add("ERROR", path, where, f"range value {value} above max {hi}")
                if lo is not None and step:
                    n = (value - lo) / step
                    if abs(n - round(n)) > 1e-6:
                        self.add("ERROR", path, where, f"range value {value} not on step {step} from {lo}")
        elif stype in ("select", "radio"):
            opts = [o.get("value") for o in sdef.get("options", []) if isinstance(o, dict)]
            if value not in opts:
                self.add("ERROR", path, where, f"{value!r} is not an option ({', '.join(map(str, opts))})")
        elif stype == "text_alignment":
            if value not in TEXT_ALIGNMENT:
                self.add("ERROR", path, where, f"text_alignment {value!r} not left/center/right")
        elif stype == "color_scheme":
            if not isinstance(value, str):
                self.add("ERROR", path, where, f"color_scheme must be a string, got {value!r}")
            elif self.color_schemes and value and value not in self.color_schemes:
                self.add("ERROR", path, where, f"color scheme {value!r} is not defined in settings_data.json")
        elif stype in LIST_TYPES:
            if not isinstance(value, (list, str)):
                self.add("ERROR", path, where, f"{stype} value must be a list, got {value!r}")
        elif stype in STRING_TYPES:
            if not isinstance(value, str):
                self.add("ERROR", path, where, f"{stype} value must be a string, got {value!r}")
                return
            if stype == "richtext" and value.strip() and "{{" not in value:
                if not re.match(r"^\s*<(p|ul|ol|h[1-6])[\s>]", value):
                    self.add("WARN", path, where, "richtext should start with <p>, <ul>, <ol> or <h1-6>")
            if stype == "inline_richtext" and re.search(r"<(p|div|ul|ol|h[1-6])[\s>]", value):
                self.add("WARN", path, where, "inline_richtext must not contain block tags (<p>, <ul>, ...)")
            if stype == "url" and is_default and value not in URL_DEFAULTS_OK:
                self.add("ERROR", path, where, f"url default {value!r} is not allowed (only /collections or /collections/all)")
            if stype == "video_url" and value and not re.search(r"(youtube\.com|youtu\.be|vimeo\.com)", value):
                self.add("ERROR", path, where, f"video_url {value!r} is not a YouTube/Vimeo URL")
            if stype == "color" and value and "{{" not in value:
                if not re.match(r"^(#[0-9a-fA-F]{3,8}|rgba?\([^)]*\)|transparent)$", value):
                    self.add("WARN", path, where, f"colour value {value!r} does not look like a colour")
        # unknown types: nothing to check

    def check_settings(self, path: str, where: str, allowed: dict, settings, owner: str) -> None:
        if settings is None:
            return
        if not isinstance(settings, dict):
            self.add("ERROR", path, where, "settings must be an object")
            return
        for key, value in settings.items():
            if key not in allowed:
                self.add("ERROR", path, f"{where}.{key}", f"setting '{key}' does not exist in {owner}")
                continue
            self.check_value(path, f"{where}.{key}", allowed[key], value)

    # ------------------------------------------------------- block validation
    def parent_allows(self, parent: Schema, btype: str) -> tuple[bool, str]:
        if btype.startswith("shopify://apps/") or btype == "@app":
            return parent.accepts_app, "app blocks"
        if btype in parent.local_blocks:
            return True, ""
        if btype in parent.theme_refs:
            return btype in self.blocks, f"named theme block '{btype}' has no blocks/{btype}.liquid"
        if parent.accepts_theme and btype in self.blocks and not btype.startswith("_"):
            return True, ""
        if btype.startswith("_") and btype in self.blocks:
            return False, f"private theme block '{btype}' is not named in {parent.kind} '{parent.name}' schema"
        if btype in self.blocks:
            return False, f"{parent.kind} '{parent.name}' does not accept theme block '{btype}' (no @theme and not named)"
        return False, f"unknown block type '{btype}'"

    def check_block_map(self, path: str, where: str, parent: Schema, blocks, order, *, preset: bool) -> None:
        """Validate a dict of blocks (template style or dict-style preset)."""
        if blocks is None:
            blocks = {}
        if not isinstance(blocks, dict):
            self.add("ERROR", path, where, "blocks must be an object keyed by block id")
            return
        order = order if order is not None else []
        if not isinstance(order, list):
            self.add("ERROR", path, f"{where}.block_order", "block_order must be a list")
            order = []
        for key in order:
            if key not in blocks:
                self.add("ERROR", path, f"{where}.block_order", f"block_order references missing block '{key}'")
        if len(order) != len(set(order)):
            self.add("ERROR", path, f"{where}.block_order", "block_order has duplicate ids")
        counts: dict[str, int] = {}
        for bid, block in blocks.items():
            bwhere = f"{where}.blocks.{bid}"
            if not isinstance(block, dict) or "type" not in block:
                self.add("ERROR", path, bwhere, "block needs a type")
                continue
            btype = block["type"]
            static = bool(block.get("static"))
            if not static and bid not in order and not block.get("disabled"):
                level = "WARN" if preset else "ERROR"
                self.add(level, path, bwhere, "block is not listed in block_order (it will not render)")
            if static and bid in order:
                self.add("WARN", path, bwhere, "static block should not be in block_order")
            self.check_block(path, bwhere, parent, block, static=static, preset=preset)
            if not static:
                counts[btype] = counts.get(btype, 0) + 1
        self.check_counts(path, where, parent, counts, sum(counts.values()))

    def check_block_list(self, path: str, where: str, parent: Schema, blocks) -> None:
        """Validate a list-style preset block list."""
        counts: dict[str, int] = {}
        for i, block in enumerate(blocks or []):
            bwhere = f"{where}.blocks[{i}]"
            if not isinstance(block, dict) or "type" not in block:
                self.add("ERROR", path, bwhere, "block needs a type")
                continue
            static = bool(block.get("static"))
            self.check_block(path, bwhere, parent, block, static=static, preset=True)
            if not static:
                counts[block["type"]] = counts.get(block["type"], 0) + 1
        self.check_counts(path, where, parent, counts, sum(counts.values()))

    def check_counts(self, path: str, where: str, parent: Schema, counts: dict, total: int) -> None:
        max_blocks = parent.data.get("max_blocks", DEFAULT_MAX_BLOCKS)
        if total > max_blocks:
            self.add("ERROR", path, where, f"{total} blocks exceeds max_blocks {max_blocks} of '{parent.name}'")
        for btype, n in counts.items():
            bdef = parent.local_blocks.get(btype)
            if bdef and "limit" in bdef and n > bdef["limit"]:
                self.add("ERROR", path, where, f"{n} '{btype}' blocks exceeds limit {bdef['limit']}")

    def check_block(self, path: str, where: str, parent: Schema, block: dict, *, static: bool, preset: bool) -> None:
        btype = block["type"]
        if btype.startswith("shopify://apps/"):
            if not parent.accepts_app:
                self.add("ERROR", path, where, f"'{parent.name}' does not accept app blocks")
            return
        local = parent.local_blocks.get(btype) if parent.kind == "section" else None
        if local is not None:
            self.check_settings(path, where + ".settings", local["_settings"], block.get("settings"),
                                f"block '{btype}' of section '{parent.name}'")
            if block.get("blocks"):
                self.add("ERROR", path, where, "section-defined (local) blocks cannot have nested blocks")
            return
        if static:
            if btype not in self.blocks:
                self.add("ERROR", path, where, f"static block type '{btype}' has no blocks/{btype}.liquid")
                return
        else:
            ok, why = self.parent_allows(parent, btype)
            if not ok:
                self.add("ERROR", path, where, why)
                if btype not in self.blocks:
                    return
        if parent.local_blocks and btype in self.blocks and not static:
            self.add("ERROR", path, where, f"'{parent.name}' uses local blocks, so theme block '{btype}' cannot be added")
        sch = self.blocks.get(btype)
        if sch is None:
            return
        self.check_settings(path, where + ".settings", sch.settings, block.get("settings"), f"theme block '{btype}'")
        nested = block.get("blocks")
        if isinstance(nested, list):
            self.check_block_list(path, where, sch, nested)
        elif nested:
            self.check_block_map(path, where, sch, nested, block.get("block_order"), preset=preset)
        elif block.get("block_order"):
            self.check_block_map(path, where, sch, {}, block.get("block_order"), preset=preset)

    # ------------------------------------------------------ schema validation
    def check_schema(self, sch: Schema) -> None:
        path, data = sch.path, sch.data
        if path in self.bad_schema_files:
            return
        mg = self.is_mg(path)
        for sid, sdef in sch.settings.items():
            self.check_setting_def(path, f"settings.{sid}", sdef)
        for btype, bdef in sch.local_blocks.items():
            for sid, sdef in bdef["_settings"].items():
                self.check_setting_def(path, f"blocks.{btype}.settings.{sid}", sdef)
        for ref in sch.theme_refs:
            if ref not in self.blocks:
                self.add("ERROR", path, "blocks", f"named theme block '{ref}' has no blocks/{ref}.liquid")
        if sch.local_blocks and (sch.accepts_theme or sch.theme_refs):
            self.add("ERROR" if mg else "WARN", path, "blocks", "mixes local blocks with @theme/theme blocks")
        if mg:
            if sch.kind == "section" and not data.get("presets") and "enabled_on" not in data:
                self.add("ERROR", path, "presets", "mg section has no presets")
            elif sch.kind == "section" and not data.get("presets"):
                self.add("WARN", path, "presets", "mg section has no presets")
            for m in re.finditer(r'"(t:[a-z_.]+)"', json.dumps(data)):
                self.add("ERROR", path, "labels", f"uses translation key {m.group(1)} (spec: plain English)")
                break
        n_settings = len(sch.settings)
        if n_settings > 40:
            self.add("WARN", path, "settings", f"{n_settings} settings (theme check limit is 40)")
        for i, preset in enumerate(data.get("presets", []) or []):
            where = f"presets[{i}] '{preset.get('name', '?')}'"
            self.check_settings(path, where + ".settings", sch.settings, preset.get("settings"),
                                f"{sch.kind} '{sch.name}'")
            blocks = preset.get("blocks")
            if isinstance(blocks, list):
                self.check_block_list(path, where, sch, blocks)
            elif isinstance(blocks, dict):
                self.check_block_map(path, where, sch, blocks, preset.get("block_order"), preset=True)
        default = data.get("default")
        if isinstance(default, dict):
            self.check_settings(path, "default.settings", sch.settings, default.get("settings"), sch.name)
            if isinstance(default.get("blocks"), list):
                self.check_block_list(path, "default", sch, default["blocks"])

    def check_setting_def(self, path: str, where: str, sdef: dict) -> None:
        stype = sdef.get("type")
        if stype in ("select", "radio"):
            opts = sdef.get("options")
            if not opts:
                self.add("ERROR", path, where, f"{stype} has no options")
                return
            values = [o.get("value") for o in opts]
            if len(values) != len(set(values)):
                self.add("ERROR", path, where, "duplicate option values")
        if stype == "range":
            for k in ("min", "max", "default"):
                if k not in sdef:
                    self.add("ERROR", path, where, f"range setting missing '{k}'")
            lo, hi, step = sdef.get("min"), sdef.get("max"), sdef.get("step", 1)
            if isinstance(lo, (int, float)) and isinstance(hi, (int, float)) and step:
                if (hi - lo) / step > 101:
                    self.add("ERROR", path, where, "range has more than 101 steps")
        if "default" in sdef:
            if stype in ("text", "textarea", "richtext", "inline_richtext", "html") and sdef["default"] == "":
                self.add("WARN", path, where, "empty-string default (omit the default instead)")
            if stype == "image_picker":
                self.add("ERROR", path, where, "image_picker settings cannot have a default")
            self.check_value(path, where + ".default", sdef, sdef["default"], is_default=True)

    # ---------------------------------------------------- template validation
    def check_json_file(self, path: str) -> None:
        self.files_checked += 1
        raw = open(path, encoding="utf-8").read()
        body = LEADING_COMMENT_RE.sub("", raw, count=1)
        try:
            data = json.loads(body)
        except json.JSONDecodeError as exc:
            self.add("ERROR", path, "json", f"not valid JSON: {exc}")
            return
        rel = self.rel(path)
        is_group = rel.endswith("-group.json")
        if is_group:
            ctx_kind = "group"
            ctx = data.get("type", "")
            if not ctx:
                self.add("ERROR", path, "type", "section group has no type")
        else:
            ctx_kind = "template"
            ctx = os.path.basename(path).split(".")[0]
        sections = data.get("sections")
        order = data.get("order", [])
        if not isinstance(sections, dict):
            self.add("ERROR", path, "sections", "missing 'sections' object")
            return
        if not isinstance(order, list):
            self.add("ERROR", path, "order", "order must be a list")
            order = []
        for key in order:
            if key not in sections:
                self.add("ERROR", path, "order", f"order references missing section '{key}'")
        if len(order) != len(set(order)):
            self.add("ERROR", path, "order", "order has duplicate ids")
        if len(sections) > MAX_SECTIONS_PER_TEMPLATE:
            self.add("ERROR", path, "sections", f"{len(sections)} sections (max {MAX_SECTIONS_PER_TEMPLATE})")
        for sid, sec in sections.items():
            where = f"sections.{sid}"
            if not isinstance(sec, dict) or "type" not in sec:
                self.add("ERROR", path, where, "section needs a type")
                continue
            if sid not in order and not sec.get("disabled"):
                self.add("ERROR", path, where, "section is not listed in order")
            stype = sec["type"]
            if stype.startswith("shopify://apps/"):
                continue
            sch = self.sections.get(stype)
            if sch is None:
                self.add("ERROR", path, where, f"section type '{stype}' has no sections/{stype}.liquid")
                continue
            self.check_enabled(path, where, sch, ctx_kind, ctx)
            self.check_settings(path, where + ".settings", sch.settings, sec.get("settings"), f"section '{stype}'")
            self.check_block_map(path, where, sch, sec.get("blocks"), sec.get("block_order"), preset=False)

    def check_enabled(self, path: str, where: str, sch: Schema, ctx_kind: str, ctx: str) -> None:
        en, dis = sch.data.get("enabled_on"), sch.data.get("disabled_on")
        key = "templates" if ctx_kind == "template" else "groups"

        def matches(lst) -> bool:
            if lst is None:
                return False
            return "*" in lst or ctx in lst or (ctx_kind == "group" and ctx.startswith("custom.") and "custom.*" in lst)

        if en is not None:
            lst = en.get(key)
            if lst is None or not matches(lst):
                self.add("ERROR", path, where, f"section '{sch.name}' is not enabled on {ctx_kind} '{ctx}' (enabled_on {en})")
        if dis is not None and matches(dis.get(key)):
            self.add("ERROR", path, where, f"section '{sch.name}' is disabled on {ctx_kind} '{ctx}' (disabled_on {dis})")

    # -------------------------------------------------------------------- run
    def run(self) -> None:
        self.load_color_schemes()
        self.load_schemas()
        for sch in list(self.sections.values()) + list(self.blocks.values()):
            self.check_schema(sch)
        files = sorted(glob.glob(os.path.join(self.theme, "templates", "*.json")))
        files += sorted(glob.glob(os.path.join(self.theme, "sections", "*-group.json")))
        for path in files:
            self.check_json_file(path)


def main() -> int:
    here = os.path.dirname(os.path.abspath(__file__))
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--theme", default=os.path.join(here, "..", "theme"))
    ap.add_argument("--strict", action="store_true", help="fail on Horizon baseline issues too")
    ap.add_argument("--quiet", action="store_true", help="hide baseline issues")
    args = ap.parse_args()
    theme = os.path.abspath(args.theme)
    v = Validator(theme)
    v.run()

    scoped = [i for i in v.issues if not i.baseline]
    base = [i for i in v.issues if i.baseline]

    def show(title: str, items: list[Issue]) -> None:
        print(f"\n== {title} ==")
        if not items:
            print("  none")
            return
        cur = None
        for i in sorted(items, key=lambda x: (x.file, x.level != "ERROR", x.where)):
            if i.file != cur:
                cur = i.file
                print(f"  {cur}")
            print(f"    [{i.level}] {i.where}: {i.msg}")

    n_tpl = len(glob.glob(os.path.join(theme, "templates", "*.json"))) + len(
        glob.glob(os.path.join(theme, "sections", "*-group.json")))
    print(f"MG template validator: {theme}")
    print(f"Checked {len(v.sections)} section schemas, {len(v.blocks)} block schemas, {n_tpl} JSON templates/groups.")
    show("Templates, groups and mg-* files", scoped)
    if not args.quiet:
        show("Horizon baseline (untouched Horizon files, informational)", base)

    s_err = sum(1 for i in scoped if i.level == "ERROR")
    s_warn = sum(1 for i in scoped if i.level == "WARN")
    b_err = sum(1 for i in base if i.level == "ERROR")
    b_warn = sum(1 for i in base if i.level == "WARN")
    print(f"\nSummary: {s_err} errors, {s_warn} warnings in scope; "
          f"{b_err} errors, {b_warn} warnings in Horizon baseline.")
    failed = s_err > 0 or s_warn > 0 or (args.strict and (b_err > 0))
    print("RESULT: FAIL" if failed else "RESULT: OK")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
