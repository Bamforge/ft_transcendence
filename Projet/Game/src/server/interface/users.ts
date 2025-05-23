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