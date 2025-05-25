UPDATE matchs
SET is_end = 1, end_at = CURRENT_TIMESTAMP 
WHERE id = ? AND is_end = 0;;
