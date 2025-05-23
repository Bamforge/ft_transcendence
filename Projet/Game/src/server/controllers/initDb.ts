import path, { dirname } from 'path';
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Variables I recommend storing in environment variables for later use.

const pathDirData = "./../../../data/"

const nameDb = "database.sqlite3"

const pathOfScriptWhoCreateTabs = pathDirData + "migrations/"

const listOfCreationTabs = [
	'001_create_users_table.sql',
	'002_create_matchs_table.sql',
	'003_create_tournament.sql'
]

/**
 * Executes an SQL script on the given database.
 * 
 * @param db The database on which the script will be applied
 * @param relativePath Path to the SQL script (relative to __dirname) to execute
 */
async function execFileScriptSql(db: Database<sqlite3.Database, sqlite3.Statement>, relativePath: string) {
	try {
		const scriptSql = fs.readFileSync(path.resolve(__dirname, relativePath), 'utf-8');
		// console.log(scriptSql);
		await db.exec(scriptSql);
	} catch (err) {
		console.error(`Erreur lors de l\'exécution du script SQL : \''${relativePath}'\' :`);
		console.error(err);
	}
}

/**
 * Initializes the project's SQLite database.
 * Creates or opens the database and sets up the necessary tables using SQL migration scripts.
 * 
 * @returns A SQLite3 database instance
 */
async function initDataBase(): Promise<Database<sqlite3.Database, sqlite3.Statement>> {
	const dbFile = path.resolve(__dirname, pathDirData + nameDb);

	const dir = path.dirname(dbFile);
	if (!fs.existsSync(dir))
		fs.mkdirSync(dir, { recursive: true });

	const db = await open({
		filename: dbFile,
		driver: sqlite3.Database
	});

	for (let index = 0; index < listOfCreationTabs.length; index++) {
		const scriptSql = pathOfScriptWhoCreateTabs + listOfCreationTabs[index];
		// later put the secuirty
		await execFileScriptSql(db, scriptSql);
	}

	return db;
}

/**
 * database instance
 */
const db = initDataBase();

/**
 * Returns the project's SQLite3 database instance.
 * 
 * @returns The SQLite3 database instance
 */
export default async function getDbAsync() : Promise<Database<sqlite3.Database, sqlite3.Statement>>
{
	return (db);
}