export interface addMatch
{
	player_1_id : number;
	player_2_id : number;
}

export interface Match
{
	id : number;
	player_1_id : number;
	player_2_id : number;
	player_1_score : number;
	player_2_score : number;
	start_at : string;
	is_end : boolean;
	end_at ?: string;
}

import chalk from 'chalk';

export function GetMatchDataString(match : Match | undefined): string
{
	if (match == undefined)
		return chalk.red("Aucune donnée de match : c'est indéfini.");
	const data_str : string = `
{
	${chalk.blue('id')} : ${chalk.green(match.id)};
	${chalk.blue('player_1_id')} : ${chalk.green(match.player_1_id)};
	${chalk.blue('player_2_id')} : ${chalk.green(match.player_2_id)};
	${chalk.blue('player_1_score')} : ${chalk.green(match.player_1_score)};
	${chalk.blue('player_2_score')} : ${chalk.green(match.player_2_score)};
	${chalk.blue('is_end')} : ${chalk.green(match.is_end)};
	${chalk.blue('end_at')} : ${chalk.green(match.end_at)};
}
`;
	return (data_str);
}

export function isSameMatch(match1 : Match | undefined, match2 : Match | undefined): boolean
{
	if (match1 == undefined || match2 == undefined)
		return (false);
	return (
	match1.id == match2.id &&
	match1.player_1_id == match2.player_1_id &&
	match1.player_2_id == match2.player_2_id &&
	match1.player_1_score == match2.player_1_score &&
	match1.player_2_score == match2.player_2_score &&
	match1.start_at == match2.start_at &&
	match1.is_end == match2.is_end &&
	match1.end_at == match2.end_at
	)
}

export function GetMatchsDataString(matchs: Array<Match>): string {
	if (!Array.isArray(matchs) || matchs.length === 0)
		return chalk.red("Aucune donnée du tableaux matchs : tableau vide ou invalide.");
	return matchs.map(GetMatchDataString).join();
}
