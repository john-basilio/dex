use std::fs;
use sysinfo::{System};



pub fn get_linux_distro() -> String {
    let distro = fs::read_to_string("/etc/os-release").unwrap_or_default();
    
    for line in distro.lines() {
        if line.starts_with("NAME=") {
            return line.split("=").nth(1).unwrap_or("").trim_matches('"').to_string();
        }
    }
    "Unknown".to_string()
}

pub fn get_desktop_environment() -> String {
    let desktop = std::env::var("XDG_CURRENT_DESKTOP").unwrap_or_default();
    if desktop.is_empty() {
        return "Unknown".to_string();
    }
    desktop
}

pub fn get_package_manager(candidate: Vec<&str>) -> Vec<String> {
    let mut result = Vec::new();
    for pm in candidate {
        if let Ok(output) = std::process::Command::new("which").arg(pm).output() {
            if output.status.success() {
                result.push(pm.to_string());
            }
        }
    }
    result
}

pub fn get_resource_stats() -> Vec<Vec<String>> {
    let mut result = Vec::new();
    let mut sys = System::new();

    sys.refresh_cpu_usage();
    sys.refresh_memory();
    
    // CPU information
    let cpu_stats = vec![
        sys.cpus()[0].brand().to_string(),
        sys.global_cpu_usage().to_string()
    ];
    result.push(cpu_stats);
    
    // RAM information
    let ram_stats = vec![
        (sys.used_memory() / 1_048_576).to_string(),
        (sys.total_memory() / 1_048_576).to_string()
    ];
    result.push(ram_stats);
    
    // Swap information
    if sys.total_swap() > 0 {
        let swap_stats = vec![
            (sys.used_swap() / 1_048_576).to_string(),
            (sys.total_swap() / 1_048_576).to_string()
        ];
        result.push(swap_stats);
    } else {
        result.push(vec!["NONE".to_string(), "NONE".to_string()]);
    }
    println!("rust = {:?}", result);
    result
}