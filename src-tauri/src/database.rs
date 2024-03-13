use rusqlite::{Connection};
use tauri::AppHandle;
use std::fs;

use serde::{Serialize};


// program in DB upgrades later: https://github.com/RandomEngy/tauri-sqlite/blob/main/src-tauri/src/database.rs
const CURRENT_DB_VERSION: u32 = 1;

pub fn initialize_database(app_handle: &AppHandle) -> Result<Connection, rusqlite::Error> {
    let app_dir = app_handle.path_resolver().app_data_dir().expect("The app data directory should exist.");
    fs::create_dir_all(&app_dir).expect("The app data directory should be created.");
    let sqlite_path = app_dir.join("data.db");

    println!("Database Stored at {}", sqlite_path.display());

    let mut db = Connection::open(sqlite_path)?;
    let tx = db.transaction()?;
    tx.execute_batch(
      "CREATE TABLE IF NOT EXISTS todos (id TEXT, finished INTEGER, task TEXT, date INTEGER);
      CREATE TABLE IF NOT EXISTS goals (
          id TEXT,
          goal TEXT,
          onePointRequirement TEXT,
          twoPointRequirement TEXT,
          threePointRequirement TEXT,
          pointsCompletedToday INTEGER,
          lastCompleted INTEGER
      );
      CREATE TABLE IF NOT EXISTS progressPerDay (
            date TEXT UNIQUE,
            pointsCompleted INTEGER
        );"
    )?;

    tx.commit()?;

    let mut user_pragma = db.prepare("PRAGMA user_version")?;
    let existing_user_version: u32 = user_pragma.query_row([], |row| { Ok(row.get(0)?) })?;
    drop(user_pragma);

    Ok(db)
}

#[derive(Serialize)]
pub struct TodoItem {
  id: String,
  finished: i64,
  task: String,
  date: i64
}

pub fn _get_todo_items(db: &Connection) -> Result<Vec<TodoItem>, rusqlite::Error> {
    let mut statement = db.prepare("SELECT * FROM todos;")?;
    let mut rows = statement.query([])?;
    let mut items = Vec::new();
    while let Some(row) = rows.next()? {
        let id = row.get("id")?;
        let finished = row.get("finished")?;
        let task = row.get("task")?;
        let date = row.get("date")?;

        let dat = TodoItem {id: id, finished:finished, task:task, date:date};
        items.push(dat);
    }

    Ok(items)
}


#[derive(Serialize)]
pub struct Goal {
  id: String,
  goal: String,
  onePointRequirement: String,
  twoPointRequirement: String,
  threePointRequirement: String,
  pointsCompletedToday: i64,
  lastCompleted: i64
}

pub fn _get_goals(db: &Connection) -> Result<Vec<Goal>, rusqlite::Error> {
    let mut statement = db.prepare("SELECT * FROM goals;")?;
    let mut rows = statement.query([])?;
    let mut items = Vec::new();
    while let Some(row) = rows.next()? {
        let id = row.get("id")?;
        let goal = row.get("goal")?;
        let onePointRequirement = row.get("onePointRequirement")?;
        let twoPointRequirement = row.get("twoPointRequirement")?;
        let threePointRequirement = row.get("threePointRequirement")?;
        let pointsCompletedToday = row.get("pointsCompletedToday")?;
        let lastCompleted = row.get("lastCompleted")?;

        let dat = Goal {id: id, goal: goal, onePointRequirement: onePointRequirement, twoPointRequirement: twoPointRequirement, threePointRequirement: threePointRequirement, pointsCompletedToday: pointsCompletedToday, lastCompleted: lastCompleted};
        items.push(dat);
    }

    Ok(items)
}

#[derive(Serialize)]
pub struct Day {
  date: String,
  pointsCompleted: i64
}

pub fn _get_days(db: &Connection) -> Result<Vec<Day>, rusqlite::Error> {
    let mut statement = db.prepare("SELECT * FROM progressPerDay;")?;
    let mut rows = statement.query([])?;
    let mut items = Vec::new();
    while let Some(row) = rows.next()? {
        let date = row.get("date")?;
        let pointsCompleted = row.get("pointsCompleted")?;

        let dat = Day {date: date, pointsCompleted: pointsCompleted};
        items.push(dat);
    }

    Ok(items)
}
