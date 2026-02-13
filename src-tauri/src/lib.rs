// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

mod db;
mod menu;

use tauri::Manager;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            app.manage(db::mongodb::DbState::default());
            app.manage(db::storage::StorageState::new(app.handle()));

            let menu = menu::create_menu(&app.handle())?;
            app.set_menu(menu)?;

            Ok(())
        })
        .on_menu_event(|_app, event| match event.id().as_ref() {
            "about" => {
                println!("About clicked");
            }
            _ => {}
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            db::mongodb::test_mongodb_connection,
            db::mongodb::connect_to_db,
            db::storage::save_connection,
            db::storage::get_connections,
            db::storage::delete_connection
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
