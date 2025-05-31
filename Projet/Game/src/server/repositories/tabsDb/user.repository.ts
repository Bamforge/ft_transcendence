import { DbGestion } from "../../db/dbGestion.js";
import { addUser, isSameUser, User } from "../../interfaces/tabsDb/users.js";
import sqlite3 from 'sqlite3';
import { ISqlite } from 'sqlite';

const pData = "./../../../data/sql/"

// Variables I recommend storing in environment variables for later use.

const dSelect = "select/"
const SelectSql = [
	pData + dSelect + "00-0_users_by_username.sql",
	pData + dSelect + "00-1_1_by_username.sql",
	pData + dSelect + "00-2_user_by_id.sql",
	pData + dSelect + "00-3_all_users.sql",
	pData + dSelect + "00-4_all_id_users.sql",
	pData + dSelect + "00-5_1_by_id.sql"
]

const dInsert = "insert/"
const InsertSql = [
	pData + dInsert + "00-0_users.sql",
]

const dUpdate = "updates/"
const UpdateSql = [
	pData + dUpdate + "00-0_user_name_password_bot_guest_by_id.sql",
]

export type AddUserResult =
	| { status: "success", data: ISqlite.RunResult<sqlite3.Statement> }
	| { status: "allSuccess", data: ISqlite.RunResult<sqlite3.Statement>[]}
	| { status: "invalide_param"}
	| { status: "already_exists", name : string[] }
	| { status: "error" };

export type UpdateUserResult =
	| { status: "success"; data: ISqlite.RunResult<sqlite3.Statement> }
	| { status: "invalid_user" }
	| { status: "username_exists" }
	| { status: "error" };

export type GetUserResult =
	| { status: "success"; data: User }
	| { status: "error" };

export class UserRepository {
	constructor(private db: DbGestion) {}

	public async getUserByUsername(username: string) : Promise<GetUserResult>{
		const res : User | undefined = await this.db.getSecur(SelectSql[0], username);
		return (res == undefined ? {status : "error"} : {status : "success", data : res});
	}

	public async isUsernameAlreadyExist(username: string) : Promise<boolean>{
		const res = await this.db.getSecur(SelectSql[1], username);
		return (res != undefined);
	}

	public async getUserById(id: number) :Promise<GetUserResult>{
		const res : User | undefined = await this.db.getSecur(SelectSql[2], id);
		return (res == undefined ? {status : "error"} : {status : "success", data : res});
	}

	public async getAllUsers() : Promise<Array<User>> {
		const res : Array<User> = await this.db.allSecur(SelectSql[3]);
		return (res);
	}

	public async getAllIdUsers() : Promise<number[]> {
		const rows: { id: number }[] = await this.db.allSecur(SelectSql[4]);
		const res = rows.map(row => row.id);
		return (res);
	}

	public async isIdAlreadyExist(id: number) : Promise<boolean> {
		const res = await this.db.getSecur(SelectSql[5], id);
		return (res != undefined);
	}

	public async isIdAlreadyExists(ids: number[]) : Promise<boolean | undefined> {
		if (ids.length <= 0) return ;
		const tabExist = await this.db.prepareSecur(SelectSql[5], ids, "Get");
		if (tabExist == undefined) return tabExist;
		// On crée un Set des IDs présents dans la BDD
		for (const exist of tabExist) {
			if (exist == undefined || exist == false)
				return (false);
		}
		return (true);
	}

	public async addUser(newUser: addUser): Promise<AddUserResult> {
		const {
			username,
			password = '',
			is_guest = false,
			is_bot = false
		} = newUser;

		if (await this.isUsernameAlreadyExist(username))
			return ({status: "already_exists", name: [username] });

		const res = await this.db.runSecur(InsertSql[0], username, password, is_guest, is_bot);
		return (res == undefined ? { status: "error" } : {status: "success", data: res});
	}

	public async addUsers(newUsers: addUser[]): Promise<AddUserResult> {
		if (!newUsers || newUsers.length === 0)
			return { status: "invalide_param" };
	
		const existingUsernames: string[] = [];

		for (const user of newUsers) {
			const exists = await this.isUsernameAlreadyExist(user.username);
			if (exists)
				existingUsernames.push(user.username);
		}

		if (existingUsernames.length > 0) {
			return {
				status: "already_exists",
				name: existingUsernames
			};
		}
		const paramList: any[][] = newUsers.map((user) => [
			user.username,
			user.password == undefined ? '' : user.password,
			user.is_guest == undefined ? false : user.is_guest,
			user.is_bot == undefined ? false : user.is_bot
		]);

		const res = await this.db.prepareSecur(InsertSql[0], paramList, "Run");

		if (res === undefined)
			return { status: "error" };
		return { status: "allSuccess", data: res };
	}

	public async updateUser(controlDataUser: User, newDataUser : addUser) : Promise<UpdateUserResult> {
		const {
			username = controlDataUser.username,
			password = controlDataUser.password,
			is_guest = controlDataUser.is_guest,
			is_bot = controlDataUser.is_bot
		} = newDataUser;
		const verifUser : GetUserResult = await this.getUserById(controlDataUser.id)
		if (verifUser.status == "error" || false == isSameUser(verifUser.data, controlDataUser))
			return ({status: "invalid_user"});
		else if (await this.isUsernameAlreadyExist(username))
			return ({status: "username_exists"});
		const res = await this.db.runSecur(UpdateSql[0], username, password, is_guest, is_bot, controlDataUser.id);
		return (res == undefined ? {status:"error"} : {status: "success", data : res});
	}
}