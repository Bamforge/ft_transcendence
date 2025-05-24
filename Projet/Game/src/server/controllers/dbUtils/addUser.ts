import path, { dirname } from 'path';
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import fs from 'fs';
import { addUser } from '../../interface/users';
import { fileURLToPath } from 'url';

/**
 *
 */
// Get __dirname equivalent in ES modules
const  __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sqlFileAddUser = './../../../../data/insert/001_insert_users_table.sql'
const sqlFileSelectUserByUsername = './../../../../data/select/001_select_users_table_by_username.sql'

export default async function addUserInDb(db: Database<sqlite3.Database, sqlite3.Statement>, newUser: addUser) {
	const {
		username,
		password = '',
		is_guest = false,
		is_bot = false
	} = newUser;

	const scriptSqlS = fs.readFileSync(path.resolve(__dirname, sqlFileSelectUserByUsername), 'utf-8');
	try {
		const res = await db.get(scriptSqlS, username);
		// console.log('Résultat SELECT user:', res);
		if (res != undefined)
		{
			console.log(`Attention le username: \'${username}\' existe deja on ne peut pas le rajouter.`);
			return ;
		}
		console.log(`Ajoue du username: \'${username}\' dans le tableaux users.`);

	} catch (err) {
		console.error(`Erreur lors de select users by username.`);
		console.error(err);
	}

	const scriptSql = fs.readFileSync(path.resolve(__dirname, sqlFileAddUser), 'utf-8');
	try {
		await db.run(scriptSql, username, password, is_guest, is_bot);
	} catch (err) {
		console.error(`Erreur lors de l\'ajoue d'un user dans le tableaux \'users\'.
			Cela peut etre du :
			1. L'instance db
			2. aux atribut de user
			3. aux script d'implementation`);
		console.error(err);
	}
}
