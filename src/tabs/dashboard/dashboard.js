const invoke = window.__TAURI__.core.invoke;

async function get_info_dashboard() {
    // GET DISTRO NAME
    const distro = await invoke("distro");
    document.querySelector('.distro__name').textContent = distro;

    // GET DISTRO LOGO
    const iconMap = {
        "Arch Linux": "/assets/arch_linux.svg",
    };

    const logoDiv = document.querySelector(".distro__logo");
    if (logoDiv) {
        const iconPath = iconMap[distro] || "/assets/default.svg";
        logoDiv.innerHTML = `<img src="${iconPath}" alt="${distro} logo" style="width: 100%; height: 100%; border-radius: 50%;">`;
    }
}

get_info_dashboard();
