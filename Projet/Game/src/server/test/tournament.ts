import chalk from "chalk";
import { DbGestion } from "../db/dbGestion.js";
import { TournamentEliminationRepository } from "../repositories/tournament.repository.js";
import { GetTournamentEliminationDataString, GetTournamentsEliminationDataString } from "../interfaces/tournament.js";

/**
 *
 */
export default async function test_tab_TE(db: DbGestion)
{
	try {
		console.log(chalk.magentaBright("-----------------"));
		console.log(chalk.cyanBright("TEST- Tournament tab manip"));
		console.log(chalk.magentaBright("-----------------\n"));
		
		const tabTEGestion = new TournamentEliminationRepository(db);

		const resAdd = await tabTEGestion.addTE({nbr_participant: 2});
		console.log("addTE status : " + (resAdd.status == "success" ? chalk.green(resAdd.status) : chalk.red(resAdd.status)));

		const resSelectById = await tabTEGestion.getTEByid(1);
		console.log("getTEByid status : " + (resSelectById.status == "success" ? chalk.green(resSelectById.status) : chalk.yellow(resSelectById.status)));
		if (resSelectById.status != "success")
			return ;
		console.log(GetTournamentEliminationDataString(resSelectById.data));

		const putWinner = {... resSelectById.data};
		putWinner.winner_pseudo = "YASSSSINE";
		const resEnd = await tabTEGestion.updateEndAndWiner(resSelectById.data, putWinner);
		console.log("resEnd status : " + (resEnd.status == "success" ? chalk.green(resEnd.status) : chalk.yellow(resEnd.status)));
		
		console.log(GetTournamentsEliminationDataString(await tabTEGestion.getAllTEs()));

	} catch (err) {
		console.error(chalk.red(`Erreur test_tab_TE.`));
	}
}
