// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod state;
mod database;

use serde_json::json;
use database::{TodoItem, Goal, Day};
use rusqlite::{Connection, named_params};
use state::{AppState, ServiceAccess};
use tauri::{State, Manager, AppHandle};

#[macro_use]
extern crate serde_json;

fn main() {
    std::env::set_var("RUST_BACKTRACE", "1");

  tauri::Builder::default()
  .manage(AppState { db: Default::default() })
  .setup( |app| {
      let handle = app.handle();
      let app_state: State<AppState> = handle.state();
      let db = database::initialize_database(&handle).expect("Database initialize should succeed");
      *app_state.db.lock().unwrap() = Some(db);

      Ok(())
  })
  .invoke_handler(tauri::generate_handler![
      greet,
      add_todo_item,
      remove_todo_item,
      get_todo_items,
      add_goal,
      update_goal,
      get_goals,
      remove_goal,
      set_daily_points,
      get_days
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[tauri::command]
fn greet(name: &str) -> String {
   format!("Hello, {}!", name)
}

#[tauri::command]
fn add_todo_item(app_handle: AppHandle, id: &str, finished: i32, task: &str, date: i64) {
    app_handle.db(|db| {
        let statement = db.prepare("INSERT INTO todos (id, finished, task, date) VALUES (@id, @finished, @task, @date);");
        let _ = statement.expect("REASON").execute(named_params! {"@id": id, "@finished": finished, "@date": date, "@task": task});
    });
}

#[tauri::command]
fn remove_todo_item(app_handle: AppHandle, id: &str) {
    app_handle.db(|db| {
        let statement = db.prepare("DELETE FROM todos WHERE id=@id");
        let _ = statement.expect("REASON").execute(named_params! {"@id": id});
    });
}

#[tauri::command]
fn get_todo_items(app_handle: AppHandle) -> Vec<TodoItem> {

    let items = app_handle.db(|db| database::_get_todo_items(db)).unwrap();

    return items;
}



#[tauri::command]
fn add_goal(app_handle: AppHandle, id: &str, goal: &str, onePointrequirement: &str, twoPointRequirement: &str, threePointRequirement: &str, pointsCompletedToday: i64, lastCompleted: i64) {
    app_handle.db(|db| {
        let statement = db.prepare("INSERT INTO goals (id, goal, onePointRequirement, twoPointRequirement, threePointRequirement, pointsCompletedToday, lastCompleted) VALUES (@id, @goal, @onePointRequirement, @twoPointRequirement, @threePointRequirement, @pointsCompletedToday, @lastCompleted);");
        let _ = statement.expect("REASON").execute(named_params! {"@id": id, "@goal": goal, "@onePointRequirement": onePointrequirement, "@twoPointRequirement": twoPointRequirement, "@threePointRequirement": threePointRequirement, "@pointsCompletedToday": pointsCompletedToday, "@lastCompleted": lastCompleted, });
    });
}

#[tauri::command]
fn update_goal(app_handle: AppHandle, id: &str, pointsCompletedToday: i64, lastCompleted: i64) {
    app_handle.db(|db| {
        let statement = db.prepare("UPDATE goals SET pointsCompletedToday = @pointsCompletedToday, lastCompleted = @lastCompleted WHERE id=@id;");
        let _ = statement.expect("REASON").execute(named_params! {"@id": id, "@pointsCompletedToday":pointsCompletedToday, "@lastCompleted": lastCompleted});
    });
}

#[tauri::command]
fn get_goals(app_handle: AppHandle) -> Vec<Goal> {
    return app_handle.db(|db| database::_get_goals(db)).unwrap();
}

#[tauri::command]
fn remove_goal(app_handle: AppHandle, id: &str) {
    app_handle.db(|db| {
        let statement = db.prepare("DELETE FROM goals WHERE id=@id;");
        let _ = statement.expect("REASON").execute(named_params! {"@id": id,});
    });
}

#[tauri::command]
fn set_daily_points(app_handle: AppHandle, date: i64, pointsCompleted: i64) {
    app_handle.db(|db| {
        let statement = db.prepare("INSERT OR REPLACE INTO progressPerDay VALUES (@date, @pointsCompleted)");
        let _ = statement.expect("REASON").execute(named_params! {"@date": date, "@pointsCompleted": pointsCompleted});
    });
}

#[tauri::command]
fn get_days(app_handle: AppHandle) -> Vec<Day> {
    return app_handle.db(|db| database::_get_days(db)).unwrap();
}
