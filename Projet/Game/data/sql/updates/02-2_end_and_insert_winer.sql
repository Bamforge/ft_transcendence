UPDATE tournament_elimination
SET winner_pseudo = ?, winner_id = ?, is_end = 1, end_at = CURRENT_TIMESTAMP
WHERE id = ?;
