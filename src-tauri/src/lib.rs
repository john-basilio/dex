// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

mod common;
mod platforms;

// use common::common::{get_linux_distro};
use platforms::resolver::resolve_distro;
use common::common_dashboard::get_resource_stats;

//
// JS-exposed commands here
//

/// Debug logging function, replacement for console.log()
#[tauri::command]
fn debug_info(message: String) {
    println!("[JS DEBUG] {}", message);
}

#[tauri::command]
fn dashboard_info_static() -> String {
    let distro = resolve_distro();
    let info = distro.get_info();
    serde_json::to_string(&info).unwrap()
}

#[tauri::command]
fn dashboard_info_dynamic() -> String {
    let stats = get_resource_stats();
    serde_json::to_string(&stats).unwrap()
}


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            debug_info,
            dashboard_info_static,
            dashboard_info_dynamic,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
