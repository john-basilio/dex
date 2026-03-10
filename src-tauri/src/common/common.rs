use std::fs;

pub fn get_linux_distro() -> String {
    let distro = fs::read_to_string("/etc/os-release").unwrap_or_default();
    
    for line in distro.lines() {
        if line.starts_with("NAME=") {
            return line.split("=").nth(1).unwrap_or("").trim_matches('"').to_string();
        }
    }
    "Unknown".to_string()
}
