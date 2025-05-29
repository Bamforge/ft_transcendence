import sqlite3 from 'sqlite3';
import { ISqlite } from 'sqlite';

export default function handleUpdateResult(res: ISqlite.RunResult<sqlite3.Statement> | undefined, onZeroChange: any)
: any {
	if (res === undefined) return { status: "error" };
	if (res.changes === 0) return onZeroChange;
	return { status: "success", data: res };
}
