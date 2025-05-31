import chalk from "chalk";
import { DbGestion } from "../db/dbGestion.js";
import { TransandanceRepository } from "../repositories/transandance.repository.js";
import { addUser } from "../interfaces/tabsDb/users.js";

export default async function test_transandance(db: DbGestion)
{
	try {
		console.log(chalk.magentaBright("-----------------"));
		console.log(chalk.cyanBright("TEST- Transandance manip"));
		console.log(chalk.magentaBright("-----------------\n"));

		const t = new TransandanceRepository(db);

		// crée un tournoi
		const listOfUser: addUser[] = [
			{username: "A", is_guest: true},// 1
			{username: "B", is_guest: true},// 2
			{username: "D", is_guest: true},// 3
			{username: "E", is_guest: true},// 4
		]
		const res_crea = await t.creationTournamentElimination(listOfUser);
		console.log(res_crea.status);
		if (res_crea.status != "success") return ;
	} catch (err) {
		console.error(chalk.red(`Erreur Transandance.`));
	}
}
