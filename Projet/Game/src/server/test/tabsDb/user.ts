import chalk from "chalk";
import { DbGestion } from "../../db/dbGestion.js";
import { GetUserResult, UserRepository } from "../../repositories/tabsDb/user.repository.js";
import { GetUserDataString, GetUsersDataString } from "../../interfaces/tabsDb/users.js";

/**
 *
 */
export default async function test_tab_user(db: DbGestion)
{
	try {
		console.log(chalk.magentaBright("-----------------"));
		console.log(chalk.cyanBright("TEST- User tab manip"));
		console.log(chalk.magentaBright("-----------------\n"));
		
		const tabUserGestion = new UserRepository(db);
		const testname = "BOB";
		
		if (await tabUserGestion.addUser({ username: testname, password : "a" }) == null)
			console.log(chalk.yellow(`⚠️  Attention, le username : '${testname}' existe déjà, on ne peut pas le rajouter.`));
		else
			console.log(chalk.green(`✅ Ajout du username : '${testname}' dans le tableau users.`));
	
		const user: GetUserResult = await tabUserGestion.getUserById(1);
		if (user.status == "success")
		{
			console.log(`Le user à id 1 dans la Db : ${GetUserDataString(user.data)}`);
			const res_update = await tabUserGestion.updateUser(user.data, {username:"Alice", password:"NON", is_bot:false});

			if (res_update.status != "success")
				console.log(chalk.yellow(`⚠️  Attention, Impossible de update faire, raison : ${res_update}`));
			else
			console.log(chalk.green(`✅ Update ${res_update}`));
		}
		else
			console.log(`Pas de user à id 1`);

		console.log(GetUsersDataString(await tabUserGestion.getAllUsers()));
	} catch (err) {
		console.error(chalk.red(`Erreur test_tab_user.`));
	}
}
