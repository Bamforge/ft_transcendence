UPDATE matchs
SET player_1_score = ?, player_2_score = ?, is_end = 1, end_at = CURRENT_TIMESTAMP 
WHERE id = ? AND is_end = 0;;
