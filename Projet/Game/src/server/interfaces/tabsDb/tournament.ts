export interface addTournamentElimination
{
	nbr_participant : number;
}

export interface TournamentElimination
{
	id : number;
	winner_pseudo ?: string;
	winner_id : number,
	nbr_participant : number;
	max_round : number;
	start_at : string;
	is_end : boolean;
	end_at ?: string;
}

import chalk from 'chalk';

export function GetTournamentEliminationDataString(tournament : TournamentElimination | undefined): string
{
	if (tournament == undefined)
		return chalk.red("Aucune donnée du tournoi : c'est indéfini.");
	const data_str : string = `
{
	${chalk.blue('id')} : ${chalk.green(tournament.id)};
	${chalk.blue('winner_pseudo')} : ${tournament.winner_pseudo == '' ? chalk.yellow("null") : chalk.white("\"") + chalk.green(tournament.winner_pseudo) + chalk.white("\"")};
	${chalk.blue('winner_id')} : ${tournament.winner_pseudo == '' ? chalk.yellow("null") : chalk.green(tournament.winner_id)};
	${chalk.blue('nbr_participant')} : ${chalk.green(tournament.nbr_participant)};
	${chalk.blue('max_round')} : ${chalk.green(tournament.max_round)};
	${chalk.blue('start_at')} : ${chalk.green(tournament.start_at)};
	${chalk.blue('is_end')} : ${chalk.green(tournament.is_end)};
	${chalk.blue('end_at')} : ${tournament.end_at == '' ? chalk.yellow("null") : chalk.white("\"") + chalk.green(tournament.end_at) + chalk.white("\"")};
}
`;
	return (data_str);
}

// export function isSameTournamentElimination(tournament1 : TournamentElimination | undefined, tournament2 : TournamentElimination | undefined): boolean
// {
// 	if (tournament1 == undefined || tournament2 == undefined)
// 		return (false);
// 	return (
// 	tournament1.id == tournament2.id &&
// 	tournament1.max_round == tournament2.max_round &&
// 	tournament1.nbr_participant == tournament2.nbr_participant &&
// 	tournament1.winner_pseudo == tournament2.winner_pseudo &&
// 	tournament1.start_at == tournament2.start_at &&
// 	tournament1.is_end == tournament2.is_end &&
// 	tournament1.end_at == tournament2.end_at
// 	)
// }

export function isSameTournamentElimination(tournament1 : TournamentElimination | undefined, tournament2 : TournamentElimination | undefined): boolean
{	if (tournament1 === undefined || tournament2 === undefined) {
		console.log("❌ tournament1 ou tournament2 est undefined");
		return false;
	}

	if (tournament1.id !== tournament2.id) {
		console.log("❌ id différent :", tournament1.id, tournament2.id);
		return false;
	}
	if (tournament1.max_round !== tournament2.max_round) {
		console.log("❌ max_round différent :", tournament1.max_round, tournament2.max_round);
		return false;
	}
	if (tournament1.nbr_participant !== tournament2.nbr_participant) {
		console.log("❌ nbr_participant différent :", tournament1.nbr_participant, tournament2.nbr_participant);
		return false;
	}
	if (tournament1.winner_pseudo !== tournament2.winner_pseudo) {
		console.log("❌ winner_pseudo différent :", tournament1.winner_pseudo, tournament2.winner_pseudo);
		return false;
	}
	if (tournament1.start_at !== tournament2.start_at) {
		console.log("❌ start_at différent :", tournament1.start_at, tournament2.start_at);
		return false;
	}
	if (tournament1.is_end !== tournament2.is_end) {
		console.log("❌ is_end différent :", tournament1.is_end, tournament2.is_end);
		return false;
	}
	if (tournament1.end_at !== tournament2.end_at) {
		console.log("❌ end_at différent :", tournament1.end_at, tournament2.end_at);
		return false;
	}

	return true;
}


export function GetTournamentsEliminationDataString(tournaments: Array<TournamentElimination>): string {
	if (!Array.isArray(tournaments) || tournaments.length === 0)
		return chalk.red("Aucune donnée du tableaux tournaments : tableau vide ou invalide.");
	return tournaments.map(GetTournamentEliminationDataString).join();
}
