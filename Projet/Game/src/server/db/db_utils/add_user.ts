import path from 'path';
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import fs from 'fs';
import { addUser } from '../../interface/users';

const sqlFileAddUser = './../../../../data/insert/001_insert_users_table.sql'

export async function addUserInDb(db: Database<sqlite3.Database, sqlite3.Statement>, newUser: addUser) {
	const {
		username,
		password = '',
		is_guest = false,
		is_bot = false
	} = newUser;

	const scriptSql = fs.readFileSync(path.resolve(__dirname, sqlFileAddUser), 'utf-8');// script sql qui ajoutrea les atribut de newUser dans le tableaux.
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
