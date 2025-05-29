CREATE TABLE IF NOT EXISTS users (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	username TEXT UNIQUE,
	password TEXT DEFAULT NULL,
	is_guest BOOLEAN DEFAULT 0,
	is_bot BOOLEAN DEFAULT 0,
	create_at DATETIME DEFAULT CURRENT_TIMESTAMP
-- crée un is occuperd si le joueu est en train de jouer ou est dans un tournoi
);

PRAGMA foreign_keys = ON;