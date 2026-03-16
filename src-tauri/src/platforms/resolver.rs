use crate::common::common_dashboard::get_linux_distro;
use crate::platforms::arch::Arch;
use serde::Serialize;

/// Information about a Linux distribution
#[derive(Serialize)]
pub struct DistroInfo {
    pub name: String,
    pub de_env: String,
    pub package_manager: Vec<String>,
}

/// Implement this trait for each distro
pub trait Distro {
    fn get_info(&self) -> DistroInfo;
}

pub fn resolve_distro() -> Box<dyn Distro> {
    match get_linux_distro().as_str() {
        "Arch Linux" => Box::new(Arch),
        _ => panic!("Unsupported distro"),
    }
}
