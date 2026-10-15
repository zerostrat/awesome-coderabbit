# Using the config catalog for product sites (e.g. Kreditvalen)

The catalog at `site/` is not only a browser for YAML — it is a **reusable playbook** for shipping a comparison product faster and safer.

## Why this helps a loan/credit site

| Lever | How you use it | Outcome |
| --- | --- | --- |
| **Fintech pre-merge pack** | Copy checks from `configs/pre-mergechecks/.coderabbit-fintech.yaml` | Catches float money bugs, duplicate charges, leaked secrets before merge |
| **Loan comparison starter** | Drop in `configs/fintech/coderabbit-loan-comparison.yaml` as `.coderabbit.yaml` | Reviews focus on calculators, affiliate disclosure, Swedish copy, lead/PII |
| **Catalog data pattern** | Mirror `site/data/*.json` + a tiny build step | Lenders/offers become data, pages stay consistent (same idea as Luvent) |
| **Machine-readable index** | Consume `site/data/index.json` | Internal tools or another site can list/filter starters without scraping README |

## Recommended drop-in for Kreditvalen-style repos

1. Copy the loan starter into the product repo root:

```bash
curl -fsSL \
  https://raw.githubusercontent.com/zerostrat/awesome-coderabbit/main/configs/fintech/coderabbit-loan-comparison.yaml \
  -o .coderabbit.yaml
```

2. Merge in the monetary checks you care about from
   `configs/pre-mergechecks/.coderabbit-fintech.yaml` under
   `reviews.pre_merge_checks.custom_checks` (start in `warning` mode).

3. Structure product content like the catalog:

```text
data/lenders.json   # single source of truth
site/ or app/       # render cards/tables from data only
.coderabbit.yaml    # review rules above
```

4. Let CodeRabbit own PR quality; let CI own build/test. Do not duplicate
   calculator unit tests as review comments — keep them in the test suite.

## “Advantage” checklist

- **Fewer compliance regressions** — disclosure + exact math checked on every PR  
- **Faster content ops** — edit JSON, rebuild pages (phone-friendly, like Luvent)  
- **Shared standards** — one YAML starter across Kreditvalen, experiments, and forks  
- **Public social proof** — catalog page shows you ship with review discipline  

When the product repo is available in the Cloud Agent environment, apply the
starter there directly and wire Pages/CI the same way as `site/` in this repo.
