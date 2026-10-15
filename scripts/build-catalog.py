#!/usr/bin/env python3
"""Generate site/data/catalog.json and site/data/index.json from configs/."""

from __future__ import annotations

import json
import re
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONFIGS = ROOT / "configs"
OUT_DIR = ROOT / "site" / "data"


def title_from_name(name: str) -> str:
    base = re.sub(r"\.(ya?ml)$", "", name, flags=re.I)
    base = re.sub(r"^\.?", "", base)
    base = re.sub(r"^(coderabbit[-_]?)", "", base, flags=re.I)
    base = base.replace("-", " ").replace("_", " ").strip()
    return base.title() if base else name


def summarize(text: str, category: str) -> str:
    for line in text.splitlines():
        s = line.strip()
        if not s.startswith("#"):
            continue
        if "schema" in s.lower() or "docs.coderabbit" in s.lower():
            continue
        if "configure-coderabbit" in s.lower():
            continue
        comment = s.lstrip("#").strip()
        if 20 <= len(comment) <= 160:
            return comment

    match = re.search(r"tone_instructions:\s*[>|]?\s*[\"']?(.+)", text)
    if match:
        tone = match.group(1).strip().strip("\"'")
        if tone:
            return tone[:140] + ("…" if len(tone) > 140 else "")

    return f"CodeRabbit configuration for {category}."


def kind_for(category: str) -> str:
    if category == "custom-recipes":
        return "recipe"
    if category == "pre-mergechecks":
        return "pre-merge"
    if category == "starter":
        return "starter"
    return "config"


def collect() -> dict:
    items: list[dict] = []

    for path in sorted(CONFIGS.rglob("*")):
        if path.suffix.lower() not in {".yaml", ".yml"}:
            continue
        if not path.is_file():
            continue

        rel = path.relative_to(CONFIGS).as_posix()
        category = rel.split("/", 1)[0]
        text = path.read_text(encoding="utf-8", errors="replace")

        profile_match = re.search(r"profile:\s*[\"']?(\w+)", text)
        language_match = re.search(r"^language:\s*[\"']?([\w-]+)", text, re.M)

        items.append(
            {
                "id": rel.replace("/", "--").replace(".", "-"),
                "path": f"configs/{rel}",
                "name": path.name,
                "title": title_from_name(path.name),
                "category": category,
                "kind": kind_for(category),
                "profile": profile_match.group(1) if profile_match else None,
                "language": language_match.group(1) if language_match else None,
                "summary": summarize(text, category),
                "bytes": path.stat().st_size,
                "lines": len(text.splitlines()),
                "content": text,
            }
        )

    return {
        "generatedAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "source": "configs/",
        "count": len(items),
        "categories": sorted({item["category"] for item in items}),
        "kinds": sorted({item["kind"] for item in items}),
        "configs": items,
    }


def main() -> None:
    catalog = collect()
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    catalog_path = OUT_DIR / "catalog.json"
    catalog_path.write_text(
        json.dumps(catalog, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    slim = {
        **catalog,
        "configs": [
            {key: value for key, value in item.items() if key != "content"}
            for item in catalog["configs"]
        ],
    }
    index_path = OUT_DIR / "index.json"
    index_path.write_text(
        json.dumps(slim, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    print(f"Wrote {catalog_path} ({catalog['count']} configs)")
    print(f"Wrote {index_path}")


if __name__ == "__main__":
    main()
