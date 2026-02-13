use mongodb::{Client, options::ClientOptions};
use std::sync::Mutex;
use tauri::Manager;

pub struct DbState {
    pub client: Mutex<Option<Client>>,
    pub db_name: Mutex<Option<String>>,
}

impl Default for DbState {
    fn default() -> Self {
        Self {
            client: Mutex::new(None),
            db_name: Mutex::new(None),
        }
    }
}

#[tauri::command]
pub async fn test_mongodb_connection(connection_string: String) -> Result<String, String> {
    let client_options = ClientOptions::parse(connection_string).await.map_err(|e| e.to_string())?;
    let client = Client::with_options(client_options).map_err(|e| e.to_string())?;

    // Ping the server to verify connection
    client
        .database("admin")
        .run_command(mongodb::bson::doc! {"ping": 1})
        .await
        .map_err(|e| e.to_string())?;

    println!("Connected successfully to MongoDB!");

    Ok("Connected successfully to MongoDB!".to_string())
}

#[tauri::command]
pub async fn connect_to_db(
    app_handle: tauri::AppHandle,
    connection_string: String,
    db_name: String
) -> Result<String, String> {
    let client_options = ClientOptions::parse(&connection_string).await.map_err(|e| e.to_string())?;
    let client = Client::with_options(client_options).map_err(|e| e.to_string())?;

    // Verify connection
    client
        .database("admin")
        .run_command(mongodb::bson::doc! {"ping": 1})
        .await
        .map_err(|e| e.to_string())?;

    let state = app_handle.state::<DbState>();
    
    *state.client.lock().unwrap() = Some(client);
    *state.db_name.lock().unwrap() = Some(db_name);

    Ok("Connected and state updated".to_string())
}
