UPDATE tournament_elimination_players
SET is_winner = 1
WHERE tournament_elimination_id = ? AND user_id = ? AND is_eliminated == 0;
