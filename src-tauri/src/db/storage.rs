use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use std::sync::Mutex;
use tauri::{AppHandle, Manager};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SavedConnection {
    pub id: String,
    pub name: String,
    pub db_type: String,
    pub details: serde_json::Value,
}

pub struct StorageState {
    pub connections: Mutex<Vec<SavedConnection>>,
    pub file_path: PathBuf,
}

impl StorageState {
    pub fn new(app_handle: &AppHandle) -> Self {
        let app_dir = app_handle.path().app_data_dir().expect("failed to get app data dir");
        // Ensure directory exists
        if !app_dir.exists() {
            fs::create_dir_all(&app_dir).expect("failed to create app data dir");
        }
        let file_path = app_dir.join("connections.json");
        
        let connections = if file_path.exists() {
            let content = fs::read_to_string(&file_path).unwrap_or_else(|_| "[]".to_string());
            serde_json::from_str(&content).unwrap_or_else(|_| Vec::new())
        } else {
            Vec::new()
        };

        Self {
            connections: Mutex::new(connections),
            file_path,
        }
    }

    pub fn save(&self) -> Result<(), String> {
        let connections = self.connections.lock().unwrap();
        let content = serde_json::to_string_pretty(&*connections).map_err(|e| e.to_string())?;
        fs::write(&self.file_path, content).map_err(|e| e.to_string())?;
        Ok(())
    }
}

// ... commands ...

#[tauri::command]
pub async fn save_connection(
    app_handle: AppHandle,
    connection: SavedConnection
) -> Result<String, String> {
    let state = app_handle.state::<StorageState>();
    {
        let mut connections = state.connections.lock().unwrap();
        // Check if exists and update, or push new
        if let Some(pos) = connections.iter().position(|c| c.id == connection.id) {
            connections[pos] = connection;
        } else {
            connections.push(connection);
        }
    } // Unlock before saving
    
    state.save()?;
    Ok("Connection saved successfully".to_string())
}

#[tauri::command]
pub async fn get_connections(
    app_handle: AppHandle
) -> Result<Vec<SavedConnection>, String> {
    let state = app_handle.state::<StorageState>();
    let connections = state.connections.lock().unwrap();
    Ok(connections.clone())
}

#[tauri::command]
pub async fn delete_connection(
    app_handle: AppHandle,
    id: String
) -> Result<String, String> {
    let state = app_handle.state::<StorageState>();
    {
        let mut connections = state.connections.lock().unwrap();
        if let Some(pos) = connections.iter().position(|c| c.id == id) {
            connections.remove(pos);
        } else {
            return Err("Connection not found".to_string());
        }
    }
    state.save()?;
    Ok("Connection deleted".to_string())
}
