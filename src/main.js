const TAB_METADATA = {
  dashboard: {
    title: "Dashboard",
    subtitle: "View recent activity and system status.",
  },
  packages: {
    title: "Packages",
    subtitle: "Easily manage your packages.",
  },
  services: {
    title: "Services",
    subtitle: "Inspect and manage system services.",
  },
  system: {
    title: "System Info",
    subtitle: "View information about the system, hardware, and this software.",
  },
  scripts: {
    title: "Scripts",
    subtitle: "Run and organize your custom workflows.",
  },
  settings: {
    title: "Settings",
    subtitle: "Configure dex to match your environment.",
  },
};

const TAB_PARTIALS = {
  dashboard: "tabs/dashboard.html",
  packages: "tabs/packages.html",
  services: "tabs/services.html",
  system: "tabs/system.html",
  scripts: "tabs/scripts.html",
  settings: "tabs/settings.html",
};

window.addEventListener("DOMContentLoaded", () => {
  const navButtons = Array.from(document.querySelectorAll(".nav-item"));
  const views = Array.from(document.querySelectorAll(".tab-view"));
  const titleEl = document.getElementById("main-title");
  const subtitleEl = document.getElementById("main-subtitle");
  const loadedTabs = new Set();

  async function loadTabContent(tabName) {
    if (loadedTabs.has(tabName)) return;
    const view = views.find((v) => v.dataset.tabView === tabName);
    const partialPath = TAB_PARTIALS[tabName];
    if (!view || !partialPath) return;

    try {
      const res = await fetch(partialPath);
      if (!res.ok) throw new Error(`Failed to load ${partialPath}`);
      view.innerHTML = await res.text();
      loadedTabs.add(tabName);
    } catch (_e) {
      view.innerHTML =
        '<div class="panel"><p>Failed to load view.</p></div>';
    }
  }

  function activateTab(tabName) {
    // lazy-load HTML for this tab
    loadTabContent(tabName);

    // Nav active state
    navButtons.forEach((btn) => {
      const isActive = btn.dataset.tab === tabName;
      btn.classList.toggle("nav-item--active", isActive);
    });

    // View visibility
    views.forEach((view) => {
      const isActive = view.dataset.tabView === tabName;
      view.classList.toggle("tab-view--active", isActive);
    });

    // Header content
    const meta = TAB_METADATA[tabName];
    if (meta && titleEl && subtitleEl) {
      titleEl.textContent = meta.title;
      subtitleEl.textContent = meta.subtitle;
    }
  }

  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabName = btn.dataset.tab;
      if (!tabName) return;
      activateTab(tabName);
    });
  });

  // load initial dashboard
  activateTab("dashboard");
});

