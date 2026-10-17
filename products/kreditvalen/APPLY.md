# Apply this pack to the kreditvalen.se repo

This folder is the bridge between Awesome CodeRabbit and the Kreditvalen product.

## Targets

1. Preferred: your private **kreditvalen.se** GitHub repo (add it to the Cloud Agent environment).
2. Fallback public stub: [`zerostrat/lendo-klar-inspired`](https://github.com/zerostrat/lendo-klar-inspired).

## Files

| File | Destination in product repo |
| --- | --- |
| `.coderabbit.yaml` | repo root |
| `data/lenders.json` | `data/lenders.json` |
| `README.md` | merge or replace product README |
| `docs/using-catalog-for-product-sites.md` | `docs/` |

## One-liner (from this repo)

```bash
PRODUCT_ROOT=../lendo-klar-inspired  # or path to kreditvalen.se clone
cp products/kreditvalen/.coderabbit.yaml "$PRODUCT_ROOT/.coderabbit.yaml"
mkdir -p "$PRODUCT_ROOT/data" "$PRODUCT_ROOT/docs"
cp products/kreditvalen/data/lenders.json "$PRODUCT_ROOT/data/"
cp products/kreditvalen/docs/using-catalog-for-product-sites.md "$PRODUCT_ROOT/docs/"
```

Then enable CodeRabbit on the product GitHub repo and open a PR.
