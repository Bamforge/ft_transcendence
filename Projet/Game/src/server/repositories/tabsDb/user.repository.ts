import { DbGestion } from "../../db/dbGestion.js";
import { AddUser, isSameUser, User } from "../../interfaces/tabsDb/users.js";
import sqlite3 from 'sqlite3';
import { ISqlite } from 'sqlite';

const pData = "./../../../data/sql/"

// Variables I recommend storing in environment variables for later use.

const dCount = "count/"
const CountSql = [
	pData + dCount + "00-0_nbr_of_user.sql",
]

const dSelect = "select/"
const SelectSql = [
	pData + dSelect + "00-0_users_by_username.sql",
	pData + dSelect + "00-1_1_by_username.sql",
	pData + dSelect + "00-2_user_by_id.sql",
	pData + dSelect + "00-3_all_users.sql",
	pData + dSelect + "00-4_all_id_users.sql",
	pData + dSelect + "00-5_1_by_id.sql",
	pData + dSelect + "00-6_select_rows_with_offset.sql"
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
	| { status: "invalid_param"}
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

	/**
	 * Fetches a user by their username.
	 * @param username - The username to look up.
	 * @returns A result object with status and user data or error.
	 */
	public async getUserByUsername(username: string) : Promise<GetUserResult>{
		const res : User | undefined = await this.db.getSecur(SelectSql[0], username);
		return (res == undefined ? {status : "error"} : {status : "success", data : res});
	}

	/**
	 * Checks if a username already exists in the database.
	 * @param username - The username to check.
	 * @returns True if username exists, false otherwise.
	 */
	public async isUsernameAlreadyExist(username: string) : Promise<boolean>{
		const res = await this.db.getSecur(SelectSql[1], username);
		return (res != undefined);
	}

	/**
	 * Fetches a user by their ID.
	 * @param id - The user ID.
	 * @returns A result object with status and user data or error.
	 */
	public async getUserById(id: number) :Promise<GetUserResult>{
		const res : User | undefined = await this.db.getSecur(SelectSql[2], id);
		return (res == undefined ? {status : "error"} : {status : "success", data : res});
	}

	/**
	 * Retrieves all users from the database.
	 * @returns An array of all User objects.
	 */
	public async getAllUsers() : Promise<Array<User>> {
		const res : Array<User> = await this.db.allSecur(SelectSql[3]);
		return (res);
	}

	/**
	 * Retrieves IDs of all users.
	 * @returns An array of user IDs.
	 */
	public async getAllIdUsers() : Promise<number[]> {
		const rows: { id: number }[] = await this.db.allSecur(SelectSql[4]);
		const res = rows.map(row => row.id);
		return (res);
	}

	/**
	 * Checks if a user ID exists.
	 * @param id - The user ID to check.
	 * @returns True if the ID exists, false otherwise.
	 */
	public async isIdAlreadyExist(id: number) : Promise<boolean> {
		const res = await this.db.getSecur(SelectSql[5], id);
		return (res != undefined);
	}

	/**
	 * Checks if all given user IDs exist.
	 * @param ids - Array of user IDs to check.
	 * @returns True if all IDs exist, false if at least one does not.
	 *          Returns false if input array is empty.
	 */
	public async isIdAlreadyExists(ids: number[]) : Promise<boolean> {
		if (ids.length <= 0) return false;
		const tabExist = await this.db.prepareSecur(SelectSql[5], ids, "Get");
		if (tabExist == undefined) return false;
		for (const exist of tabExist) {
			if (exist == undefined || exist == false) return (false);
		}
		return (true);
	}

	/**
	 * Get a number of User from a begin.
	 * @param nbrOfLigne number of User you want
	 * @param begin where is the begining
	 * @returns array of User
	 */
	public async getUsersSlice(nbrOfLigne : number, begin: number) : Promise<User []>{
		const res = await this.db.allSecur(SelectSql[6], nbrOfLigne, begin);
		return (res)
	}

	/**
	 * Returns the total number of Users in the table.
	 * @returns The number of Users.
	 */
	public async getNbrOfUsers(): Promise<number | undefined>
	{
		const res : number | undefined = await this.db.getSecur(CountSql[0]);
		return (res);
	}
	/**
	 * Adds a new user to the database.
	 * 
	 * @param newUser - An object containing the user's information (username, password, etc.).
	 * @returns A result indicating success with data, or an appropriate error status.
	 * 
	 * - Returns `{ status: "already_exists", name: [username] }` if the username is already taken.
	 * - Returns `{ status: "error" }` if the database operation fails.
	 * - Returns `{ status: "success", data: result }` if the user is successfully inserted.
	 */
	public async addUser(newUser: AddUser): Promise<AddUserResult> {
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

	/**
	 * Adds multiple users to the database.
	 * 
	 * @param newUsers - An array of user objects to be added.
	 * @returns A result indicating success with inserted data, or an appropriate error status.
	 * 
	 * - Returns `{ status: "invalid_param" }` if the input array is empty or undefined.
	 * - Returns `{ status: "already_exists", name: [...] }` if any of the usernames already exist.
	 * - Returns `{ status: "error" }` if the database operation fails.
	 * - Returns `{ status: "allSuccess", data: result[] }` if all users are successfully inserted.
	 */
	public async addUsers(newUsers: AddUser[]): Promise<AddUserResult> {
		if (!newUsers || newUsers.length === 0)
			return { status: "invalid_param" };
	
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
			user.password ?? '',
			user.is_guest ?? false,
			user.is_bot ?? false
		]);

		const res = await this.db.prepareSecur(InsertSql[0], paramList, "Run");

		if (res === undefined)
			return { status: "error" };
		return { status: "allSuccess", data: res };
	}

	/**
	 * Updates an existing user's data in the database.
	 * 
	 * @param controlDataUser - The current user data used for verification (must include valid ID).
	 * @param newDataUser - The new user data to update; if a field is missing, the existing value will be kept.
	 * @returns A promise resolving to an UpdateUserResult indicating success, error, or specific failure reason.
	 */
	public async updateUser(controlDataUser: User, newDataUser : AddUser) : Promise<UpdateUserResult> {
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