UPDATE tournament_elimination_matchs
SET winner_id = ?
WHERE tournament_elimination_id = ? AND order_match = ?;