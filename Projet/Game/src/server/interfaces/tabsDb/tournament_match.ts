export interface TEMatch
{
	tournament_elimination_id : number;
	order_match : number;
	match_id ?: number;
	winner_id ?: number;
}

import chalk from 'chalk';

export function GetTEMatchDataString(match : TEMatch | undefined): string
{
	if (match == undefined)
		return chalk.red("Aucune donnée de TEMatch: c'est indéfini.");
	const data_str : string = `
{
	${chalk.blue('tournament_elimination_id')} : ${chalk.green(match.tournament_elimination_id)};
	${chalk.blue('order_match')} : ${chalk.green(match.order_match)};
	${chalk.blue('match_id')} : ${chalk.green(match.match_id)};
	${chalk.blue('winner_id')} : ${chalk.green(match.winner_id)};
}
`;
	return (data_str);
}

export function isSameTEMatch(match1 : TEMatch | undefined, match2 : TEMatch | undefined): boolean
{
	if (match1 == undefined || match2 == undefined)
		return (false);
	return (
		match1.tournament_elimination_id == match2.tournament_elimination_id &&
		match1.order_match == match2.order_match &&
		match1.match_id == match2.match_id &&
		match1.winner_id == match2.winner_id
	)
}

export function GetTEMatchsDataString(matchs: Array<TEMatch>): string {
	if (!Array.isArray(matchs) || matchs.length === 0)
		return chalk.red("Aucune donnée du tableaux matchs : tableau vide ou invalide.");
	return matchs.map(GetTEMatchDataString).join();
}
