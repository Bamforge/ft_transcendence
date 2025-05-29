import chalk from "chalk";
import { DbGestion } from "../../db/dbGestion.js";
import { TEMatchRepository } from "../../repositories/tabsDb/tournament_match.repository copy.js";
import { MatchRepository } from "../../repositories/tabsDb/match.repository.js";
import { TournamentEliminationRepository } from "../../repositories/tabsDb/tournament.repository.js";
import { GetTEMatchDataString, GetTEMatchsDataString } from "../../interfaces/tabsDb/tournament_match.js";

/**
 *
 */
export default async function test_tab_TEMatch(db: DbGestion)
{
	try {
		console.log(chalk.magentaBright("-----------------"));
		console.log(chalk.cyanBright("TEST- Tournament Match manip"));
		console.log(chalk.magentaBright("-----------------\n"));
		
		const TEGestion = new TournamentEliminationRepository(db);
		const TEMatchGestion = new TEMatchRepository(db);
		const MatchGestion = new MatchRepository(db);


		// Si on as deja fais les teste on skip
		if ((await TEMatchGestion.getAllTEMatchByTEid(1)).length != 0)
			console.log("LeS TEMATCH DEJA CREE ET TESTE");
		else
		{
			// Cree un TEMatch
			const getTE1 = await TEGestion.getTEByid(1);
			console.log("Get du TE 1 status : " + getTE1.status);
			if (getTE1.status == "error")
				return ;
			const resAdd = await TEMatchGestion.addTEMatchsFromTE(getTE1.data);
			console.log("Add des TEMatch status : " + resAdd.status);
			if (resAdd.status != "allSuccess")
				return;
		}

		// Associer l'id du match et recuper le id du gagant
		const  getTEMatchs = await TEMatchGestion.getAllTEMatchByTEid(1);
		if (getTEMatchs.length == 0)
		{
			console.log("PAS de TEMATCH ERROR");
			return;
		}
		getTEMatchs.map((v, i) => {console.log(i + GetTEMatchDataString(v))})

		const idMatch = await MatchGestion.getMatchById(1);
		console.log("GET id Match de status : " + idMatch.status);
		if (idMatch.status == "error")
		{
			console.log("PAS de Winner encore ERROR");
			return;
		}
		const resUpdateMatchId = await TEMatchGestion.updateMatchid(getTEMatchs[0], 1);
		console.log("UPDATE de TEMatch matchId status : " + resUpdateMatchId.status);

		getTEMatchs[0].match_id = 1;
		
		const idWinner = await MatchGestion.getWinner(1);
		console.log("ID DU WINNER = ", idWinner);
		if (idWinner == undefined)
		{
			console.log("PAS de Winner encore ERROR");
			return;
		}
		const resUpdateWinner = await TEMatchGestion.markWinner(getTEMatchs[0], idWinner);
		console.log("UPDATE de Winner status : " + resUpdateWinner.status);

		// Tout afficher

		console.log(GetTEMatchsDataString(await TEMatchGestion.getAllTEMatchByTEid(1)));
	} catch (err) {
		console.error(chalk.red(`Erreur test_tab_TEMatch.`));
	}
}