import chalk from "chalk";
import sqlite3 from 'sqlite3';
import { open, Database, ISqlite } from 'sqlite';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fs from 'fs';
import isValidSqlFile from "../utils/isValidSqlFile.js";

/**
 *
 */
// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Variables I recommend storing in environment variables for later use.

const pathDirData = "./../../../data/"

const nameDb = "database.sqlite3"

const pathOfScriptWhoCreateTabs = pathDirData + "sql/create/"

const listOfCreationTabs = [
	'00_users_table.sql',
	'01_matchs_tables.sql',
	'02_tournament_elimination.sql'
]

export class DbGestion {
	private db!: Database<sqlite3.Database, sqlite3.Statement>;

	constructor() {
		console.log(chalk.magenta("Creation du la class DbGestion."));
	}

	/**
	 * Initializes the project's SQLite database.
	 * Creates or opens the database and sets up the necessary tables using SQL migration scripts.
	 * 
	 */
	public async init(){
		const dbFile = path.resolve(__dirname, pathDirData + nameDb);
	
		const dir = path.dirname(dbFile);
		if (!fs.existsSync(dir))
			fs.mkdirSync(dir, { recursive: true });
	
		this.db = await open({
			filename: dbFile,
			driver: sqlite3.Database
		});
	
		for (let index = 0; index < listOfCreationTabs.length; index++) {
			const scriptSql = pathOfScriptWhoCreateTabs + listOfCreationTabs[index];
			await this.execSecur(scriptSql);
		}
	}

	public async getSecur(relativePath: string, ...params: any[]) : Promise<any>{
		try {
			const fullPath : string | null = isValidSqlFile(relativePath);

			if (fullPath == null)
				return;

			const scriptSql = fs.readFileSync(fullPath, 'utf-8');
			if (scriptSql == "")
			{
				console.error(chalk.red(`Erreur ATTENTION Fichier sql vide :`) + chalk.yellow(`\'${relativePath}\'`));
				return;
			}
			return (await this.db.get(scriptSql, params));
		} catch (err) {
			console.error(chalk.red(`Erreur lors du get de ce script sql :`) + chalk.yellow(`\'${relativePath}\'`));
			console.error(err);
		}
		return (undefined);
	}

	public async allSecur(relativePath: string, ...params: any[]) : Promise<any[]>{
		try {
			const fullPath : string | null = isValidSqlFile(relativePath);

			if (fullPath == null)
				return ([]);

			const scriptSql = fs.readFileSync(fullPath, 'utf-8');
			if (scriptSql == "")
			{
				console.error(chalk.red(`Erreur ATTENTION Fichier sql vide :`) + chalk.yellow(`\'${relativePath}\'`));
				return ([]);
			}
			return (await this.db.all(scriptSql, params));
		} catch (err) {
			console.error(chalk.red(`Erreur lors du all de ce script sql :`) + chalk.yellow(`\'${relativePath}\'`));
			console.error(err);
		}
		return ([]);
	}

	/**
	 * Executes an SQL script on the given database.
	 * 
	 * @param db The database on which the script will be applied
	 * @param relativePath Path to the SQL script (relative to __dirname) to execute
	 */
	public async execSecur(relativePath: string) : Promise<void>{
		try {
			const fullPath = isValidSqlFile(relativePath);

			if (fullPath == null)
				return;

			const scriptSql = fs.readFileSync(fullPath, 'utf-8');
			if (scriptSql == "")
			{
				console.error(chalk.red(`Erreur ATTENTION Fichier sql vide :`) + chalk.yellow(`\'${relativePath}\'`));
				return ;
			}
			await this.db.exec(scriptSql);
		} catch (err) {
			console.error(chalk.red(`Erreur lors de l'execution de ce script sql :`) + chalk.yellow(`\'${relativePath}\'`));
			console.error(err);
		}
	}

	public async runSecur(relativePath: string, ...params: any[]) : Promise<ISqlite.RunResult<sqlite3.Statement> | undefined>{
		try {
			const fullPath : string | null = isValidSqlFile(relativePath);

			if (fullPath == null)
				return;

			const scriptSql = fs.readFileSync(fullPath, 'utf-8');
			if (scriptSql == "")
			{
				console.error(chalk.red(`Erreur ATTENTION Fichier sql vide :`) + chalk.yellow(`\'${relativePath}\'`));
				return (undefined);
			}
			const res = await this.db.run(scriptSql, params);
			return (res);
		} catch (err) {
			console.error(chalk.red(`Erreur lors du run de ce script sql :`) + chalk.yellow(`\'${relativePath}\'`));
			console.error(err);
		}
		return (undefined);
	}

	public async closeSecur(): Promise<void> {
		return (await this.db.close());
	}

	public async prepareSecur(relativePath: string, params: any[][] | any[]): Promise<ISqlite.RunResult<sqlite3.Statement>[] | undefined> {
		try {
			const fullPath: string | null = isValidSqlFile(relativePath);

			if (fullPath == null) return;

			const scriptSql = fs.readFileSync(fullPath, 'utf-8');
			if (scriptSql === "") {
				console.error(chalk.red(`Erreur ATTENTION Fichier sql vide :`) + chalk.yellow(`\'${relativePath}\'`));
				return;
			}

			const stmt = await this.db.prepare(scriptSql);
			const results: ISqlite.RunResult<sqlite3.Statement>[] = [];

			if (Array.isArray(params) && Array.isArray(params[0]))
			{
				for (const paramSet of params) {
					results.push(await stmt.run(...paramSet));
				}
			}
			else
				results.push(await stmt.run(params));

			await stmt.finalize();
			return results;

		} catch (err) {
			console.error(chalk.red(`Erreur lors du prepare+run multiple de ce script sql :`) + chalk.yellow(`\'${relativePath}\'`));
			console.error(err);
		}
	}
}