import chalk from "chalk";
import { GetMatchDataString, GetMatchsDataString } from "../interfaces/match.js";
import { GetUserResult, UserRepository } from "../repositories/user.repository.js";
import { MatchRepository } from "../repositories/match.repository.js";
import { DbGestion } from "../db/dbGestion.js";

/**
 *
 */
export default async function test_tab_match(db: DbGestion)
{
	try {
		
		console.log(chalk.magentaBright("-----------------"));
		console.log(chalk.cyanBright("TEST- Match tab manip"));
		console.log(chalk.magentaBright("-----------------\n"));
		
		const tabMatchGestion = new MatchRepository(db);
		const tabUserGestion = new UserRepository(db);
		
		const p1: GetUserResult = await tabUserGestion.getUserById(1);
		const p2: GetUserResult = await tabUserGestion.getUserById(2);
		if (p1.status == "error" ||p2.status == "error")
		{
			console.log(chalk.red(`Il n'y a pas 2 utilisateur on ne peut pas crée de match.`));
			return ;
		}

		const statu =  await tabMatchGestion.addMatch({player_1_id: p1.data.id, player_2_id: p2.data.id});
		const msgAddMatchStatu = `Statut de add match :`;
		if (statu.status == "error")
			console.log(msgAddMatchStatu + chalk.red(statu.status));
		else if (statu.status == "Player 1 or/and 2 currently playing")
			console.log(msgAddMatchStatu + chalk.yellow(statu.status));
		else 
			console.log(msgAddMatchStatu + chalk.green(statu.status));
		
		/////////////////////
		const match1 = await tabMatchGestion.getMatchById(1);
		if (match1.status == 'success')
			console.log(GetMatchDataString(match1.data))
		else
			console.log(match1.status + chalk.red(" Select match id 1."));
	
		if (match1.status == 'success'){
			const statu2 = await tabMatchGestion.updateEndMatchAndScores(match1.data, 3, 0);
			const msgAddMatchStatu2 = `Statut de update end match and score:` + statu2.status;
			console.log(msgAddMatchStatu2);
		}
		
		console.log(GetMatchsDataString(await tabMatchGestion.getAllMatchs()));
	} catch (err) {
		console.error(chalk.red(`Erreur test_tab_match.`));
	}
}
