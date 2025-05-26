CREATE TABLE IF NOT EXISTS matchs (
	id INTEGER PRIMARY KEY AUTOINCREMENT ,
	player_1_id INTEGER NOT NULL,
	player_2_id INTEGER NOT NULL,
	player_1_score INTEGER DEFAULT 0,
	player_2_score INTEGER DEFAULT 0,
	start_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	is_end BOOLEAN DEFAULT 0,
	end_at DATETIME,

	FOREIGN KEY (player_1_id) REFERENCES users(id),
	FOREIGN KEY (player_2_id) REFERENCES users(id),

	CHECK (player_1_id != player_2_id)
)