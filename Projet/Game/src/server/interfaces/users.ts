export interface addUser
{
	username : string;
	password ?: string;
	is_guest ?: boolean;
	is_bot ?: boolean;
}

export interface User
{
	id : number;
	username : string;
	password : string;
	is_guest : boolean;
	is_bot : boolean;
	create_at : string;
}

import chalk from 'chalk';

export function GetUserDataString(user : User | undefined): string
{
	if (user == undefined)
		return chalk.red("Aucune donnée de user: c'est indéfini.");
	const data_str : string = `
{
	${chalk.blue('id')} : ${chalk.green(user.id)};
	${chalk.blue('username')} : \"${chalk.green(user.username)}\";
	${chalk.blue('password')} : ${user.password == '' ? chalk.yellow("null") : chalk.white("\"") + chalk.green(user.password) + chalk.white("\"")};
	${chalk.blue('is_guest')} : ${chalk.green(user.is_guest)};
	${chalk.blue('is_bot')} : ${chalk.green(user.is_bot)};
	${chalk.blue('create_at')} : ${chalk.green(user.create_at)};
}
`;
	return (data_str);
}

export function isSameUser(user1 : User | undefined, user2 : User | undefined): boolean
{
	if (user1 == undefined || user2 == undefined)
		return (false);
	return (
		user1.id == user2.id &&
		user1.create_at == user2.create_at &&
		user1.is_bot == user2.is_bot &&
		user1.is_guest == user2.is_guest &&
		user1.password == user2.password &&
		user1.username == user2.username
	)
}

export function GetUsersDataString(users: Array<User>): string {
	if (!Array.isArray(users) || users.length === 0)
		return chalk.red("Aucune donnée du tableaux users : tableau vide ou invalide.");
	return users.map(GetUserDataString).join();
}
