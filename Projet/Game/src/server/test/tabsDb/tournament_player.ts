import chalk from "chalk";
import { DbGestion } from "../../db/dbGestion.js";
import { UserRepository } from "../../repositories/tabsDb/user.repository.js";
import { TEPlayerRepository } from "../../repositories/tabsDb/tournament_player.repository.js";
import { GeTEPlayersDataString, GetTEPlayerDataString } from "../../interfaces/tabsDb/tournament_player.js";

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
		const resSelect1 = await TEPlayerGestion.getTEPlayerByTEidAndIdInTE(1, 1);
		console.log("Get de TEPlayer id user 1 status : " + resSelect1.status);
		if (resSelect1.status != "success")
			return ;
		console.log(GetTEPlayerDataString(resSelect1.data));
		const resSelect2 = await TEPlayerGestion.getTEPlayerByTEidAndIdInTE(1, 2);
		console.log("Get de TEPlayer id user 2 status : " + resSelect2.status);
		if (resSelect2.status != "success")
			return ;

	// update
		const resupdateOver = await TEPlayerGestion.markEliminated(resSelect1.data);
		console.log("Update Eliminated TEPlayer status : " + resupdateOver.status);

		const resupdateWiner = await TEPlayerGestion.markWinner(resSelect2.data);
		console.log("Update Winner TEPlayer status : " + resupdateWiner.status);

		resSelect1.data.is_eliminated = true;
		resSelect2.data.is_winner = true;

		const resupdateRound1 = await TEPlayerGestion.updateRound(resSelect1.data, resSelect1.data.round - 1);
		console.log("Update Round id user 1 TEPlayer status : " + resupdateRound1.status);
		const resupdateRound2 = await TEPlayerGestion.updateRound(resSelect2.data, resSelect2.data.round - 1);
		console.log("Update Round id user 2 TEPlayer status : " + resupdateRound2.status);

// afifiche tout
		console.log(GeTEPlayersDataString(await TEPlayerGestion.getAllTEPlayersByTEid(1)));
	} catch (err) {
		console.error(chalk.red(`Erreur test_tab_TEPlayer.`));
	}
}