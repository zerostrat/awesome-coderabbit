# Kreditvalen

Svensk låne- och kreditjämförelse (produktrepo). Inspired by services like Lendo / Klaralån — built to ship as **kreditvalen.se**.

## CodeRabbit

This repo is wired to the Awesome CodeRabbit loan-comparison starter:

- Local config: [`.coderabbit.yaml`](.coderabbit.yaml)
- Upstream starter: [`zerostrat/awesome-coderabbit` → `configs/fintech/coderabbit-loan-comparison.yaml`](https://github.com/zerostrat/awesome-coderabbit/blob/main/configs/fintech/coderabbit-loan-comparison.yaml)
- Playbook: [`docs/using-catalog-for-product-sites.md`](docs/using-catalog-for-product-sites.md)
- Browsable catalog: [zerostrat.github.io/awesome-coderabbit](https://zerostrat.github.io/awesome-coderabbit/)

Reviews focus on calculator math, affiliate disclosure, Swedish UX copy, and lead/PII flows. Pair with the [fintech pre-merge pack](https://github.com/zerostrat/awesome-coderabbit/blob/main/configs/pre-mergechecks/.coderabbit-fintech.yaml) when you add payment-like side effects.

## Data-driven pages

Keep lenders/offers in `data/` (single source of truth). Render cards/tables from that data only — same pattern as the config catalog and Luvent.

```text
data/lenders.json   # offers & partner metadata
.coderabbit.yaml    # PR review rules
docs/               # how we use the catalog
```

## Next

1. Enable CodeRabbit on this GitHub repo.
2. Fill `data/lenders.json` and build the comparison UI.
3. Start custom pre-merge checks in `warning` mode, then tighten.
