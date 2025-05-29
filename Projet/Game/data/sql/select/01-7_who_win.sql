SELECT
	CASE
		WHEN player_1_score > player_2_score THEN player_1_id
		WHEN player_2_score > player_1_score THEN player_2_id
		ELSE NULL
	END AS winner_id
FROM matchs
WHERE id = ? AND is_end = 1;