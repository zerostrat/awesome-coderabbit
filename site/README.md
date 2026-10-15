# Config catalog site

Static browse/copy UI for every YAML file under `configs/`.

## Local development

```bash
python3 scripts/build-catalog.py
cd site && python3 -m http.server 4173
```

Open `http://localhost:4173`.

## Data files

| File | Purpose |
|---|---|
| `data/catalog.json` | Full catalog including YAML bodies (used by the UI) |
| `data/index.json` | Slim machine-readable index without file bodies |

Regenerate both after adding or editing configs:

```bash
python3 scripts/build-catalog.py
```

## Deploy

GitHub Actions (`.github/workflows/pages.yml`) rebuilds the catalog and publishes
the `site/` directory to GitHub Pages on pushes to `main`.
