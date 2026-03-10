
mod common;
use common::common::{get_linux_distro};


// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}
#[tauri::command]
fn distro() -> String {
    let distro = get_linux_distro();
    println!("Detected Distro: {}", distro);
    distro
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            distro,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
