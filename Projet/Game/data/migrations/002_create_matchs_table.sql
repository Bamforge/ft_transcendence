CREATE TABLE IF NOT EXISTS matchs (
	id INTEGER PRIMARY KEY AUTOINCREMENT ,
	player_1_id INTEGER,
	player_2_id INTEGER,
	player_1_score INTEGER,
	player_2_score INTEGER,
	played_at DATETIME DEFAULT CURRENT_TIMESTAMP,

	FOREIGN KEY (player_1_id) REFERENCES users(id),
	FOREIGN KEY (player_2_id) REFERENCES users(id),

	CHECK (player_1_id != player_2_id)
)