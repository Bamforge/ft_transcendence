UPDATE tournament_elimination_players
SET round = ?
WHERE tournament_elimination_id = ? AND user_id = ? AND is_eliminated = 0;
