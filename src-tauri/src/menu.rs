use tauri::{AppHandle, Runtime};
use tauri::menu::{Menu, MenuItem};

pub fn create_menu<R: Runtime>(app: &AppHandle<R>) -> tauri::Result<Menu<R>> {
    let quit = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;

    let menu = Menu::with_items(app, &[&quit])?;

    Ok(menu)
}
