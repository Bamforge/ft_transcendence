import path from 'path';
import sqlite3, { Database } from 'sqlite3';
import fs from 'fs';

// Database setup
export default function GetDatabase(): sqlite3.Database {
	// 1. Compute an absolute path for your DB file
	const dbFile = path.resolve(__dirname, '../../db/data.sqlite');

	// 2. Make sure the parent directory exists
	const dir = path.dirname(dbFile);
	if (!fs.existsSync(dir)) {
	  fs.mkdirSync(dir, { recursive: true });
	}

	// 3. Open the database
	const db = new sqlite3.Database(dbFile, (err) => {
		if (err) {
			console.error('Failed to open database', err);
			process.exit(1);
		}
		console.log('Connected to SQLite database');
	});

	return db;
}

export async function InitDatabase(db: sqlite3.Database)
{
	// 4. Initialize schema if needed
	await db.exec(`
		CREATE TABLE IF NOT EXISTS visits (
		  id INTEGER PRIMARY KEY AUTOINCREMENT,
		  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
		)`);
}
