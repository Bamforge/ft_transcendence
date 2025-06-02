import chalk from "chalk";
import { DbGestion } from "../db/dbGestion.js";
import { BaseResult, tabsDBName, TransandanceRepository } from "../repositories/transandance.repository.js";
import { AddUser } from "../interfaces/tabsDb/users.js";

function showRes(msg: string, res :BaseResult): boolean {
	if (res.status == "error")
	{
		console.log(msg, res.error);
		return true;
	}
	console.log(msg, res.status);
	return (false);
}

function showData(msg: string, res :BaseResult): boolean {
	if (res.status == "error")
	{
		console.log(msg, res.error);
		return true;
	}
	console.log(msg, res.data);
	return (false);
}

export default async function test_transandance(db: DbGestion)
{
	try {
		console.log(chalk.magentaBright("-----------------"));
		console.log(chalk.cyanBright("TEST- Transandance manip"));
		console.log(chalk.magentaBright("-----------------\n"));

		const t = new TransandanceRepository(db);

		// ajoue des utilsateur et du tournoi
		// crée un tournoi
		const listOfUser: AddUser[] = [
			{username: "A", is_guest: true},// 1
			{username: "B", is_guest: true},// 2
			{username: "D", is_guest: true},// 3
			{username: "E", is_guest: true},// 4
		]
		let nbrMatch = listOfUser.length - 1;
		let nbrMatch2 = listOfUser.length - 1;
		let idMatch = 1;
		const res_crea : BaseResult = await t.creationTournamentElimination(listOfUser);
		if (showRes("Creation du tournoi : ", res_crea)) return ;

		// Commencée les match

		let resStartTeMatch = await t.startTEMatch(1, nbrMatch);
		if (showRes(("Debut du Te Match idMatch(" + nbrMatch + ") : "), resStartTeMatch)) return ;
		nbrMatch--;
		resStartTeMatch = await t.startTEMatch(1, nbrMatch);
		if (showRes(("Debut du Te Match idMatch(" + nbrMatch + ") : "), resStartTeMatch)) return ;
		nbrMatch--;

		// fin des match
		let resEndMatch : BaseResult = await t.endMatch(idMatch, 10, 2);
		if (showRes(("Fin d'un match : "), resEndMatch)) return ;
		idMatch++;
		resEndMatch = await t.endMatch(idMatch, 5, 4);
		if (showRes(("Fin d'un match : "), resEndMatch)) return ;
		idMatch++;

		// inseret le score aux tournoi next
		let resEndTEMatch : BaseResult = await t.endTEMatch(1, nbrMatch2);
		if (showRes(("FIN du Te Match idMatch(" + nbrMatch2 + ") : "), resEndTEMatch)) return ;
		nbrMatch2--;
		resEndTEMatch = await t.endTEMatch(1, nbrMatch2);
		if (showRes(("FIN du Te Match idMatch(" + nbrMatch2 + ") : "), resEndTEMatch)) return ;
		nbrMatch2--;

		// Commencée les match

		resStartTeMatch = await t.startTEMatch(1, nbrMatch);
		if (showRes(("Debut du Te Match idMatch(" + nbrMatch + ") : "), resStartTeMatch)) return ;
		nbrMatch--;
		// fin des match
		resEndMatch = await t.endMatch(idMatch, 10, 2);
		if (showRes(("Fin d'un match : "), resEndMatch)) return ;
		idMatch++;
		// inseret le score aux tournoi next
		resEndTEMatch = await t.endTEMatch(1, nbrMatch2);
		if (showRes(("FIN du Te Match idMatch(" + nbrMatch2 + ") : "), resEndTEMatch)) return ;
		nbrMatch2--;

		console.log(chalk.magentaBright("\n-----------------"));
		console.log(chalk.cyanBright("TEST - Méthodes de lecture"));
		console.log(chalk.magentaBright("-----------------\n"));

		const tables: tabsDBName[] = ["User", "Match", "TE", "TEPlayer", "TEMatch"];

		for (const tab of tables) {
			const resNbr = await t.getNbrOfLigne(tab);
			if (showData(`Nombre de lignes dans ${tab}`, resNbr)) return;

			const resSlice = await t.getSlice(tab, 2, 1); // récupère les 10 premières lignes
			if (showData(`Slice dans ${tab}`, resSlice)) return;

			// Test du get (uniquement pour 1 ou 2 tables, sinon il faut plus d’infos que juste id = 1)
			if (tab === "User") {
				const resGet = await t.get({ name: "User", pm: { id: 1 } });
				if (showData(`Get User id=1`, resGet)) return;
			} else if (tab === "TEMatch") {
				const resGet = await t.get({ name: "TEMatch", pm: { idTE: 1, order: 1 } });
				if (showData(`Get TEMatch idTE=1, order=1`, resGet)) return;
			}
		}
	} catch (err) {
		console.error(chalk.red(`Erreur Transandance.`));
	}
}
