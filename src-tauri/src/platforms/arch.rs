use crate::platforms::resolver::{Distro, DistroInfo};
use crate::common::common_dashboard::*;
pub struct Arch;

impl Distro for Arch {
    fn get_info(&self) -> DistroInfo {
        DistroInfo {
            name: get_linux_distro().to_string(),
            de_env: get_desktop_environment().to_string(),
            package_manager: get_package_manager(vec!["pacman","yay","paru"]),
        }
    }
}