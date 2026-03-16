const invoke = window.__TAURI__.core.invoke;

// Fetch and parse distro information from Rust backend
const distro_json = await invoke("dashboard_info_static");
const distro = JSON.parse(distro_json);

// FOR DEBUGGING PURPOSES, TO PRINT IN TERMINAL
// REPLACEMENT FOR console.log()
async function debug_log(message) {
    await invoke("debug_info", { message });
}


async function get_dashboard_sysinfo() {

    // GET DISTRO NAME
    document.querySelector('.distro__name').textContent = distro.name;

    // GET DISTRO LOGO FOR SPECIFIC DISTRO DETECTED
    const iconMap = {
        "Arch Linux": "/assets/arch_linux.svg",
    };

    const logoDiv = document.querySelector(".distro__logo");
    if (logoDiv) {
        const iconPath = iconMap[distro.name] || "/assets/default.svg";
        logoDiv.innerHTML = `<img src="${iconPath}" alt="${distro.name} logo" style="width: 100%; height: 100%; border-radius: 50%;">`;
    }

    // GET PACKAGE MANAGER
    document.querySelector('.distro__package-manager').textContent = distro.package_manager.join(","); 

    // GET DESKTOP ENVIRONMENT
    document.querySelector('.desktop__env-value').textContent = distro.de_env;
    debug_log("get_dashboard_sysinfo test");
}

async function get_dashboard_resourceinfo() {
    const resource_info = await invoke("dashboard_info_dynamic");
    const [cpu_info, memory_info, swap_info] = JSON.parse(resource_info);

    function formatBytes(kb) {
        if (kb >= 1024 * 1024) return (kb / (1024 * 1024)).toFixed(2) + "TB";
        if (kb >= 1024) return (kb / 1024).toFixed(2) + "GB";
        return kb + "MB";
    }

    const systemStats = {
        cpu: {
            brand: cpu_info[0],
            usage: (parseFloat(cpu_info[1] ?? 0)).toFixed(2) + "%"
        },
        memory: {
            used: formatBytes(parseInt(memory_info[0] ?? 0)),
            total: formatBytes(parseInt(memory_info[1] ?? 0)),
            usagePercent: ((parseInt(memory_info[0] ?? 0) / parseInt(memory_info[1] ?? 1)) * 100).toFixed(2) + "%"
        },
        swap: {
            used: formatBytes(parseInt(swap_info[0] ?? 0)),
            total: formatBytes(parseInt(swap_info[1] ?? 0)),
            usagePercent: ((parseInt(swap_info[0] ?? 0) / parseInt(swap_info[1] ?? 1)) * 100).toFixed(2) + "%"
        }
    };

    function setText(selector, text) {
        const el = document.querySelector(selector);
        if (el) el.textContent = text;
    }

    // Update DOM
    setText('.cpu-brand', `CPU: ${systemStats.cpu.brand}`);
    setText('.cpu-usage', systemStats.cpu.usage);
    setText('.memory-usage', `${systemStats.memory.used} / ${systemStats.memory.total} (${systemStats.memory.usagePercent})`);
    setText('.swap-usage', `${systemStats.swap.used} / ${systemStats.swap.total} (${systemStats.swap.usagePercent})`);


        function setBar(selector, style) {
        const el = document.querySelector(selector);
        if (el) el.style = style;
    }
    // Update bars
    setBar('.stat__bar-fill--cpu', `width: ${systemStats.cpu.usage}`);
    setBar('.stat__bar-fill--mem', `width: ${systemStats.memory.usagePercent}`);
    setBar('.stat__bar-fill--swap', `width: ${systemStats.swap.usagePercent}`);
    
    // Debug
    await debug_log("get_dashboard_resourceinfo test");
    await debug_log(JSON.stringify(systemStats));
}

async function start_dashboard() {
    // One-time updates for static info
    await get_dashboard_sysinfo();

    // Live refresh for dynamic resource stats
    async function refreshResources() {
        try {
            await get_dashboard_resourceinfo();
        } catch (err) {
            debug_log("Resource panel update failed:", err);
        }
    }

    // First call immediately
    refreshResources();

    // Repeat every 2 second
    setInterval(refreshResources, 2000);
}

// Start everything
start_dashboard();