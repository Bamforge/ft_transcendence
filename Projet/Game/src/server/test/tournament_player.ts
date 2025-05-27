import chalk from "chalk";
import { DbGestion } from "../db/dbGestion.js";
import { TournamentEliminationRepository } from "../repositories/tournament.repository.js";
import { GetTournamentEliminationDataString, GetTournamentsEliminationDataString } from "../interfaces/tournament.js";
import { UserRepository } from "../repositories/user.repository.js";
import { TEPlayerRepository } from "../repositories/tournament_player.repository.js";
import { GeTEPlayersDataString, GetTEPlayerDataString } from "../interfaces/tournament_player.js";

/**
 *
 */
export default async function test_tab_TEPlayer(db: DbGestion)
{
	try {
		console.log(chalk.magentaBright("-----------------"));
		console.log(chalk.cyanBright("TEST- Tournament Players manip"));
		console.log(chalk.magentaBright("-----------------\n"));
		
		const UserGestion = new UserRepository(db);
		const TEPlayerGestion = new TEPlayerRepository(db);

		const List_of_id_user =  await UserGestion.getAllIdUsers();
		if (List_of_id_user.length <= 1)
		{
			console.log("Pas assez de Joueur il en faut 2 minimum.");
			return ;
		}
		const resAdds = await TEPlayerGestion.addTEPlayersFromIDUser(1, List_of_id_user);
		console.log("Ajoue de plusier TEPlayer status : " + resAdds.status);
// selecte
		const resSelect = await TEPlayerGestion.getTEPlayerByTEidAndIdInTE(1, 1);
		console.log("Get de TEPlayer status : " + resSelect.status);
		if (resSelect.status != "success")
			return ;
		console.log(GetTEPlayerDataString(resSelect.data));
	// update
		const resupdtae = await TEPlayerGestion.updateRound(resSelect.data, resSelect.data.round - 1);
		console.log("Update TEPlayer status : " + resupdtae.status);

// afifiche tout
		console.log(GeTEPlayersDataString(await TEPlayerGestion.getAllTEPlayersByTEid(1)));
	} catch (err) {
		console.error(chalk.red(`Erreur test_tab_TEPlayer.`));
	}
}