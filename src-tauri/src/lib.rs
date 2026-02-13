// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

mod menu;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
    .setup(|app| {
        let menu = menu::create_menu(&app.handle())?;
        app.set_menu(menu)?;
        Ok(())
    })
       .on_menu_event(|_app, event| {
            match event.id().as_ref() {
                "about" => {
                    println!("About clicked");
                }
                _ => {}
            }
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
