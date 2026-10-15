const state = {
  catalog: null,
  query: "",
  category: "all",
  kind: "all",
  activeId: null,
};

const els = {
  grid: document.querySelector("#config-grid"),
  count: document.querySelector("#result-count"),
  search: document.querySelector("#search"),
  categoryFilters: document.querySelector("#category-filters"),
  kindFilters: document.querySelector("#kind-filters"),
  drawer: document.querySelector("#drawer"),
  backdrop: document.querySelector("#drawer-backdrop"),
  drawerTitle: document.querySelector("#drawer-title"),
  drawerPath: document.querySelector("#drawer-path"),
  drawerCode: document.querySelector("#drawer-code"),
  copyBtn: document.querySelector("#copy-btn"),
  rawLink: document.querySelector("#raw-link"),
  closeBtn: document.querySelector("#close-drawer"),
  totalBadge: document.querySelector("#total-count"),
};

function normalize(value) {
  return String(value || "").toLowerCase();
}

function filteredConfigs() {
  const configs = state.catalog?.configs || [];
  const q = normalize(state.query).trim();

  return configs.filter((item) => {
    if (state.category !== "all" && item.category !== state.category) return false;
    if (state.kind !== "all" && item.kind !== state.kind) return false;
    if (!q) return true;
    const hay = [item.title, item.name, item.category, item.kind, item.summary, item.path]
      .map(normalize)
      .join(" ");
    return hay.includes(q);
  });
}

function renderFilters() {
  const categories = state.catalog.categories;
  const kinds = state.catalog.kinds;

  els.categoryFilters.innerHTML = ["all", ...categories]
    .map(
      (category) => `
      <button
        class="chip"
        type="button"
        data-filter="category"
        data-value="${category}"
        aria-pressed="${state.category === category}"
      >
        ${category === "all" ? "All categories" : category}
      </button>`
    )
    .join("");

  els.kindFilters.innerHTML = ["all", ...kinds]
    .map(
      (kind) => `
      <button
        class="chip"
        type="button"
        data-filter="kind"
        data-value="${kind}"
        aria-pressed="${state.kind === kind}"
      >
        ${kind === "all" ? "All types" : kind}
      </button>`
    )
    .join("");
}

function renderGrid() {
  const items = filteredConfigs();
  els.count.textContent = `${items.length} shown`;
  if (els.totalBadge) {
    els.totalBadge.textContent = String(state.catalog.count);
  }

  if (!items.length) {
    els.grid.innerHTML = `<p class="empty">No configs match that filter.</p>`;
    return;
  }

  els.grid.innerHTML = items
    .map(
      (item, index) => `
      <button
        class="config-item"
        type="button"
        data-id="${item.id}"
        style="animation-delay: ${Math.min(index, 12) * 28}ms"
      >
        <div class="eyebrow">
          <span>${item.category}</span>
          <span>${item.kind}</span>
        </div>
        <h3>${item.title}</h3>
        <p>${item.summary}</p>
      </button>`
    )
    .join("");
}

function openDrawer(id) {
  const item = state.catalog.configs.find((config) => config.id === id);
  if (!item) return;

  state.activeId = id;
  els.drawerTitle.textContent = item.title;
  els.drawerPath.textContent = item.path;
  els.drawerCode.textContent = item.content;
  els.rawLink.href = `https://github.com/zerostrat/awesome-coderabbit/blob/main/${item.path}`;
  els.drawer.classList.add("open");
  els.backdrop.classList.add("open");
  els.drawer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeDrawer() {
  state.activeId = null;
  els.drawer.classList.remove("open");
  els.backdrop.classList.remove("open");
  els.drawer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

async function copyActive() {
  const item = state.catalog.configs.find((config) => config.id === state.activeId);
  if (!item) return;

  try {
    await navigator.clipboard.writeText(item.content);
    const previous = els.copyBtn.textContent;
    els.copyBtn.textContent = "Copied";
    window.setTimeout(() => {
      els.copyBtn.textContent = previous;
    }, 1400);
  } catch {
    els.copyBtn.textContent = "Copy failed";
  }
}

function bindEvents() {
  els.search.addEventListener("input", (event) => {
    state.query = event.target.value;
    renderGrid();
  });

  document.addEventListener("click", (event) => {
    const chip = event.target.closest("[data-filter]");
    if (chip) {
      const filter = chip.dataset.filter;
      const value = chip.dataset.value;
      state[filter] = value;
      renderFilters();
      renderGrid();
      return;
    }

    const card = event.target.closest(".config-item");
    if (card) {
      openDrawer(card.dataset.id);
    }
  });

  els.closeBtn.addEventListener("click", closeDrawer);
  els.backdrop.addEventListener("click", closeDrawer);
  els.copyBtn.addEventListener("click", copyActive);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeDrawer();
  });
}

async function boot() {
  const response = await fetch("./data/catalog.json");
  if (!response.ok) {
    els.grid.innerHTML = `<p class="empty">Could not load catalog.json. Run <code>python3 scripts/build-catalog.py</code>.</p>`;
    return;
  }

  state.catalog = await response.json();
  renderFilters();
  renderGrid();
  bindEvents();
}

boot();
