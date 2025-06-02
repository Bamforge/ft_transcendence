import chalk from "chalk";
import { DbGestion } from "../../db/dbGestion.js";
import { TournamentEliminationRepository } from "../../repositories/tabsDb/tournament.repository.js";
import { GetTournamentEliminationDataString, GetTournamentsEliminationDataString } from "../../interfaces/tabsDb/tournament.js";

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

		const resSelectById0 = await tabTEGestion.getTEByid(1);
		console.log("getTEByid0 status : " + (resSelectById0.status == "success" ? chalk.green(resSelectById0.status) : chalk.yellow(resSelectById0.status)));
		if (resSelectById0.status == "success")
			return ;

		const resAdd = await tabTEGestion.addTE({nbr_participant: 2});
		console.log("addTE status : " + (resAdd.status == "success" ? chalk.green(resAdd.status) : chalk.red(resAdd.status)));

		const resSelectById = await tabTEGestion.getTEByid(1);
		console.log("getTEByid status : " + (resSelectById.status == "success" ? chalk.green(resSelectById.status) : chalk.yellow(resSelectById.status)));
		if (resSelectById.status != "success")
			return ;
		console.log(GetTournamentEliminationDataString(resSelectById.data));

		const resEnd = await tabTEGestion.updateEndAndWiner(resSelectById.data, {name: "YASSSINE"});
		console.log("resEnd status : " + (resEnd.status == "success" ? chalk.green(resEnd.status) : chalk.yellow(resEnd.status)));
		
		console.log(GetTournamentsEliminationDataString(await tabTEGestion.getAllTEs()));

	} catch (err) {
		console.error(chalk.red(`Erreur test_tab_TE.`));
	}
}
