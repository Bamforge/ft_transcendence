-- A tournament_elimination has:
-- - number of matches = nbr_participant - 1
-- - number of rounds = ceil(log2(nbr_participant))
CREATE TABLE IF NOT EXISTS tournament_elimination (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	winner_pseudo TEXT DEFAULT NULL,
	winner_id INTEGER DEFAULT NULL,
	nbr_participant INTEGER DEFAULT 0 NOT NULL,
	max_round INTEGER DEFAULT 0 NOT NULL,
	start_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	is_end BOOLEAN DEFAULT 0,
	end_at DATETIME DEFAULT NULL,
	-- For future use (e.g., hosting info, etc.)
	-- host_id INTEGER NOT NULL,
	-- FOREIGN KEY (host_id) REFERENCES users(id)
	FOREIGN KEY (winner_id) REFERENCES users(id)

);

-- Participants in the tournament_elimination
-- Think of it as a triangle structure:
-- - 'id_in_tournament_elimination' is the X-axis position (e.g., 1st, 2nd, etc.)
-- - 'round' is the Y-axis position (depth)
CREATE TABLE IF NOT EXISTS tournament_elimination_participants (
	tournament_elimination_id INTEGER,
	user_id INTEGER,
	id_in_tournament_elimination INTEGER,
	round INTEGER,
	is_eliminated BOOLEAN DEFAULT 0,
	is_winner BOOLEAN DEFAULT 0,
	PRIMARY KEY (tournament_elimination_id, user_id),
	FOREIGN KEY (tournament_elimination_id) REFERENCES tournament_elimination(id),
	FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Matches structure follows a binary heap layout
-- - left child  = order_match * 2
-- - right child = order_match * 2 + 1
-- - parent      = floor(order_match / 2)
CREATE TABLE IF NOT EXISTS tournament_elimination_matchs (
	tournament_elimination_id INTEGER,
	match_id INTEGER,

	order_match INTEGER NOT NULL,	-- Match number in heap order
	next_match_order INTEGER,		-- The match the winner advances to
	round INTEGER,					-- Match depth (1 = first round)
	winner_id INTEGER,				-- The winner of the match
	PRIMARY KEY (tournament_elimination_id, match_id),
	FOREIGN KEY (tournament_elimination_id) REFERENCES tournament_elimination(id),
	FOREIGN KEY (match_id) REFERENCES matchs(id),
	FOREIGN KEY (winner_id) REFERENCES users(id)
);