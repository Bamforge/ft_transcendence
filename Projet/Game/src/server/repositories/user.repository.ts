import { DbGestion } from "../db/dbGestion.js";
import { addUser, isSameUser, User } from "../interfaces/users.js";
import sqlite3 from 'sqlite3';
import { ISqlite } from 'sqlite';

const pData = "./../../../data/sql/"

// Variables I recommend storing in environment variables for later use.

const dSelect = "select/"
const SelectSql = [
	pData + dSelect + "00-0_users_by_username.sql",
	pData + dSelect + "00-1_1_by_username.sql",
	pData + dSelect + "00-2_user_by_id.sql",
	pData + dSelect + "00-3_all_users.sql"
]

const dInsert = "insert/"
const InsertSql = [
	pData + dInsert + "00-1_users.sql",
]

const dUpdate = "updates/"
const UpdateSql = [
	pData + dUpdate + "00-0_user_name_password_bot_guest_by_id.sql",
]


export class UserRepository {
	constructor(private db: DbGestion) {}

	public async getUserByUsername(username: string) : Promise<User | undefined>{
		const res : User | undefined = await this.db.getSecur(SelectSql[0], username);
		return (res);
	}

	public async isUsernameAlreadyExist(username: string) : Promise<boolean>{
		const res = await this.db.getSecur(SelectSql[1], username);
		return (res != undefined);
	}


	public async getUserById(id: number) : Promise<User | undefined>{
		const res : User | undefined = await this.db.getSecur(SelectSql[2], id);
		return (res);
	}

	public async getAllUsers() : Promise<User[]> {
		const res : User[] = await this.db.getSecur(SelectSql[3]);
		return (res);
	}

	public async addUser(newUser: addUser): Promise<ISqlite.RunResult<sqlite3.Statement> | null | undefined> {
		const {
			username,
			password = '',
			is_guest = false,
			is_bot = false
		} = newUser;

		if (await this.isUsernameAlreadyExist(username))
			return (null);

		const res = await this.db.runSecur(InsertSql[0], username, password, is_guest, is_bot);
		return (res);
	}

	public async updateUser(oldDataUser: User, newDataUser : addUser) : Promise<ISqlite.RunResult<sqlite3.Statement> | undefined> {
		const {
			username = oldDataUser.username,
			password = oldDataUser.password,
			is_guest = oldDataUser.is_guest,
			is_bot = oldDataUser.is_bot
		} = newDataUser;
		const verifUser = await this.getUserById(oldDataUser.id)
		if (verifUser == undefined || false == isSameUser(verifUser, oldDataUser))
			return ;
		return (await this.db.runSecur(UpdateSql[0], username, password, is_guest, is_bot, oldDataUser.id));
	}
}