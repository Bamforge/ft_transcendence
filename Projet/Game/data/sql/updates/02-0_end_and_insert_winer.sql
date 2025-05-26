UPDATE tournament_elimination
SET is_end = 1, end_at = CURRENT_TIMESTAMP 
WHERE id = ?;
