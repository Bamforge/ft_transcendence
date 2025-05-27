export interface addTEPlayer
{
	tournament_elimination_id : number;
	user_id : number;
	round : number;
}

export interface TEPlayer
{
	tournament_elimination_id : number;
	user_id : number;
	id_in_tournament_elimination : number;
	round : number;
	is_eliminated: boolean;
	is_winner : boolean;
}

import chalk from 'chalk';

export function GetTEPlayerDataString(user : TEPlayer | undefined): string
{
	if (user == undefined)
		return chalk.red("Aucune donnée de TEPlayer: c'est indéfini.");
	const data_str : string = `
{
	${chalk.blue('tournament_elimination_id')} : ${chalk.green(user.tournament_elimination_id)};
	${chalk.blue('user_id')} : ${chalk.green(user.user_id)};
	${chalk.blue('id_in_tournament_elimination')} : ${chalk.green(user.id_in_tournament_elimination)};
	${chalk.blue('round')} : ${chalk.green(user.round)};
	${chalk.blue('is_eliminated')} : ${chalk.green(user.is_eliminated)};
	${chalk.blue('is_winner')} : ${chalk.green(user.is_winner)};
}
`;
	return (data_str);
}

export function isSameTEPlayer(user1 : TEPlayer | undefined, user2 : TEPlayer | undefined): boolean
{
	if (user1 == undefined || user2 == undefined)
		return (false);
	return (
		user1.tournament_elimination_id == user2.tournament_elimination_id &&
		user1.user_id == user2.user_id &&
		user1.id_in_tournament_elimination == user2.id_in_tournament_elimination &&
		user1.round == user2.round &&
		user1.is_eliminated == user2.is_eliminated &&
		user1.is_winner == user2.is_winner
	)
}

export function GeTEPlayersDataString(users: Array<TEPlayer>): string {
	if (!Array.isArray(users) || users.length === 0)
		return chalk.red("Aucune donnée du tableaux users : tableau vide ou invalide.");
	return users.map(GetTEPlayerDataString).join();
}
