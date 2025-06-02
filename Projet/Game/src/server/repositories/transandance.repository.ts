import { DbGestion } from "../db/dbGestion.js";
import { AddUser, User } from "../interfaces/tabsDb/users.js";
import { AddMatchResult, GetMatchResult, MatchRepository, UpdateMatchStatus } from "./tabsDb/match.repository.js";
import { AddTournamentEliminationResult, GetTournamentEliminationResult, TournamentEliminationRepository } from "./tabsDb/tournament.repository.js";
import { AddTEMatchResult, GetTEMatchResult, TEMatchRepository, UpdateTEMatchResult } from "./tabsDb/tournament_match.repository.js";
import { AddTEPlayerResult, GetTEPlayerResult, TEPlayerRepository, UpdateTEPlayerResult } from "./tabsDb/tournament_player.repository.js";
import { AddUserResult, GetUserResult, UserRepository } from "./tabsDb/user.repository.js";
import sqlite3 from 'sqlite3';
import { ISqlite } from 'sqlite';
import { isAddUser, isUser } from "../utils/isType.js";
import { addTEPlayer, TEPlayer } from "../interfaces/tabsDb/tournament_player.js";
import { getMaxRounds } from "../utils/math.js";
import { TournamentElimination } from "../interfaces/tabsDb/tournament.js";
import { mapAddUserResultToBaseResult, mapAddMatchResultToBaseResult, mapAddTournamentEliminationResultToBaseResult, mapGenericAddResultToBaseResult, mapUpdateMatchStatusToBaseResult, mapUpdateTEMatchResultToBaseResult, mapUpdateTEPlayerResultToBaseResult } from "../utils/convertisseur.js";

/**
 * Les differente tableaux de la db
 */
export type tabsDBName = "User" | "Match" | "TE" | "TEPlayer" | "TEMatch";

/**
 * Les nom des tableaux avec les clés primaire et plus tard les autre moyenn possible daccede à une ligne
 */
export type pmTabsDB =
	| {name : "User" , pm : {id : number}}
	| {name : "Match" , pm : {id : number}}
	| {name : "TE" , pm : {id : number}}
	| {name : "TEPlayer" , pm : {idTE : number, idUser: number }}
	| {name : "TEMatch" , pm : {idTE : number, order: number }}


//////////////////////////////////////////////
//          TYPE RETURN METHOD              //
//////////////////////////////////////////////

export type BaseResult<T = unknown> = 
	| { status: "success"; data: T }
	| { status: "error"; error: ErrorCode; details?: any };

export type ErrorCode =
	| "invalid_param"
	| "not_found"
	| "invalid_user"
	| "already_exists"
	| "already_ended"
	| "no_change"
	| "match_in_progress"
	| "user_already_playing"
	| "username_exists"
	| "no_winner_yet"
	| "conflict"
	| "empty"
	| "unexpected_error";

//////////////////////////////////////////////
//                  CLASS                   //
//////////////////////////////////////////////

export class TransandanceRepository
{
	private _userTab: UserRepository;
	private _matchTab: MatchRepository;
	private _teTab: TournamentEliminationRepository;
	private _tePlayerTab: TEPlayerRepository;
	private _teMatchTab : TEMatchRepository;

	constructor(private db: DbGestion) {
		this._userTab = new UserRepository(db);
		this._matchTab = new MatchRepository(db);
		this._teTab = new TournamentEliminationRepository(db);
		this._tePlayerTab = new TEPlayerRepository(db);
		this._teMatchTab = new TEMatchRepository(db);
	}

	/**
	 * Adds a new user by delegating to the underlying _userTab service,
	 * then maps the specific AddUserResult to a generic BaseResult.
	 * 
	 * @param newUser - The user data to add.
	 * @returns A promise resolving to a BaseResult indicating success or error.
	 */
	public async AddUser(newUser: AddUser): Promise<BaseResult<ISqlite.RunResult<sqlite3.Statement>>>
	{
		const rawResult : AddUserResult = await this._userTab.addUser(newUser);
		return mapAddUserResultToBaseResult(rawResult);
	}

	/**
	 * Adds a new match between two players and starts it.
	 * First verifies that both player IDs exist.
	 *
	 * @param idJ1 - ID of player 1 from tab user
	 * @param idJ2 - ID of player 2 from tab user
	 * @returns A Promise resolving to a BaseResult indicating success or error.
	 */
	public async addAndStartMatch(idJ1 : number, idJ2: number): Promise<BaseResult<ISqlite.RunResult<sqlite3.Statement>>>
	{
		if (await this._userTab.isIdAlreadyExist(idJ1) == false || await this._userTab.isIdAlreadyExist(idJ2) == false)
			return ({status: "error", error: "not_found"});
		const resAddUser : AddMatchResult = await this._matchTab.addMatch({player_1_id: idJ1, player_2_id: idJ2});
		return (mapAddMatchResultToBaseResult(resAddUser));
	}

	/**
	 * End a match and put the score.
	 * 
	 * @param idMatch - ID of Match from tab matchs
	 * @param scoreJ1 - Score of player 1 - ID of player 1 from tab user
	 * @param scoreJ2 - Score of player 2 - ID of player 2 from tab user
	 * @returns  A Promise resolving to a BaseResult indicating success or error.
	 */
	public async endMatch(idMatch : number, scoreJ1 : number, scoreJ2 : number): Promise<BaseResult<ISqlite.RunResult<sqlite3.Statement>> | BaseResult<null> >
	{
		const matchData: GetMatchResult = await this._matchTab.getMatchById(idMatch);

		if (matchData.status === "error")
			return ({status: "error", error: "not_found"});

		const actualMatch = matchData.data;

		const result: UpdateMatchStatus = await this._matchTab.updateEndMatchAndScores(actualMatch, scoreJ1, scoreJ2);

		return (mapUpdateMatchStatusToBaseResult(result));
	}

/**
 * Validates the input player data and returns a list of user IDs.
 *
 * Accepts the following input types:
 * - An array of user IDs (`number[]`)
 * - An array of `User` objects (`User[]`)
 * - An array of new users to be added (`AddUser[]`)
 *
 * Behavior:
 * - If any user does not exist or is already participating in a match, an error is returned.
 * - If the input consists of `AddUser[]`, the users are added using `_userTab.addUsers`.
 *
 * @param allPlayer - The list of users (as IDs, `User` objects, or `AddUser` objects).
 * @returns A list of user IDs ready to be used, or a `BaseResult` containing an error.
*/
private async validateAndExtractUserIds(
	allPlayer: number[] | User[] | AddUser[]
): Promise<BaseResult | number[]> {
		// TO DO : verifer aussi que le joueur n'est pas deja dans un tournoi
		if (allPlayer.length <= 1)
			return ({status: "error", error: "invalid_param", details : "Il faut plus de 1 user pour faire un tournoi."});

		if (allPlayer.every(p => typeof p === "number") || allPlayer.every(p => isUser(p)))
		{
			let ids: number[] | undefined;

			if (allPlayer.every(p => typeof p === "number"))
				ids = allPlayer as number[];
			else if (allPlayer.every(p => isUser(p)))
				ids = (allPlayer as User[]).map(p => p.id);
			else
			return ({status: "error", error: "invalid_param", details : "Mauvais type donnée en entré."});

			const someoneDontExist = await this._userTab.isIdAlreadyExists(ids);
			if (someoneDontExist == undefined || someoneDontExist == false)
			return ({status: "error", error: "invalid_param", details : "Des utilisateurs n'existe pas."});

			const listeOfPerssoneAlreadyPlaying = await this._matchTab.isPlayersCurrently(ids)
			if (listeOfPerssoneAlreadyPlaying == undefined)
				return ({status: "error", error: "unexpected_error"});
			else if (listeOfPerssoneAlreadyPlaying.length != 0)
				return ({status: "error", error: "user_already_playing", details: listeOfPerssoneAlreadyPlaying });
		}
		else if (isAddUser(allPlayer[0]))
		{
			const resAddUsers: AddUserResult = await this._userTab.addUsers(allPlayer);
			if (resAddUsers.status != "allSuccess") return mapAddUserResultToBaseResult(resAddUsers);
		}

		if (allPlayer.every(p => typeof p === "number"))
			return (allPlayer as number[]);
		else if (allPlayer.every(p => isUser(p)))
			return ((allPlayer as User[]).map(p => p.id));
		else if (allPlayer.every(p => isAddUser(p)))
			return (await this._userTab.getAllIdUsers());
		return ({status: "error", error: "invalid_param", details : "Mauvais type donnée en entré."});
	}

/**
 * Creates a new elimination tournament and registers the specified users as participants.
 *
 * Accepts a list of users in one of the following formats:
 * - An array of user IDs (`number[]`)
 * - An array of `User` objects
 * - An array of `AddUser` objects (new users to be added)
 *
 * The method performs the following steps:
 * 1. Validates and extracts user IDs using `validateAndExtractUserIds`.
 * 2. Creates a new tournament elimination record.
 * 3. Fetches the created tournament data.
 * 4. Prepares and adds participants to the tournament.
 * 5. Generates and stores initial tournament matches.
 *
 * If any step fails, an appropriate `BaseResult` with error details is returned.
 *
 * @param allPlayer - The list of users participating in the tournament.
 * @returns A `BaseResult` indicating success or failure of the tournament creation process.
 */
	public async creationTournamentElimination(allPlayer: number[] | User[] | AddUser[]): Promise<BaseResult<ISqlite.RunResult<sqlite3.Statement>[]> | BaseResult<ISqlite.RunResult<sqlite3.Statement>>>
	{
		const listIdUser : BaseResult<any> | number[] = await this.validateAndExtractUserIds(allPlayer);
		if (Array.isArray(listIdUser) == false) return listIdUser;

		const resCreatTE : AddTournamentEliminationResult = await this._teTab.addTE({nbr_participant: listIdUser.length});
		if (resCreatTE.status != "success" ) return mapAddTournamentEliminationResultToBaseResult(resCreatTE);
		else if (resCreatTE.data.lastID == undefined) return ({status: "error", error: "unexpected_error"});

		const resGetTE: GetTournamentEliminationResult =  await this._teTab.getTEByid(resCreatTE.data.lastID);
		if (resGetTE.status != "success" ) return ({status: "error", error: "unexpected_error"});

		const te : TournamentElimination = resGetTE.data;
		const paramList: addTEPlayer[] = listIdUser.map((idU, _) =>
			{
				return {
					tournament_elimination_id :te.id,
					user_id: idU,
					maxRound: getMaxRounds(listIdUser.length)
				}
			}
		);

		const resAddPlayers: AddTEPlayerResult = await this._tePlayerTab.addTEPlayers(paramList);
		if (resAddPlayers.status != "allSuccess") return mapGenericAddResultToBaseResult(resAddPlayers);
		const resAddTEMatch : AddTEMatchResult = await this._teMatchTab.addTEMatchsFromTE(te);

		return (mapGenericAddResultToBaseResult(resAddTEMatch));
	}

/**
 * Retrieves the two players (left and right) participating in a given match of a tournament elimination bracket.
 *
 * The tournament is structured as a binary tree, where matches are ordered from the bottom leaves (first round)
 * to the top final match. This function navigates the tree structure to identify the players for a given match index.
 *
 * @param te - The tournament elimination data (number of participants, id, etc.).
 * @param matchIndex - The index of the match (starting from the final match as index 1, down to leaves).
 * @returns A BaseResult containing the left and right players (jL and jR), or an error if something fails.
 */
	private async getTEMatchPlayers(te: TournamentElimination, matchIndex: number): Promise<BaseResult<{jL: TEPlayer, jR: TEPlayer }>>
	{
		const totalMatches : number = te.nbr_participant-1;
		if (matchIndex <= 0 || matchIndex > totalMatches)
			return ({status: "error", error: "invalid_param"});

		const leafCount : number = Math.floor(te.nbr_participant / 2);
		const firstLeafMatch = totalMatches - leafCount + 1;
		const leafIdx = matchIndex - firstLeafMatch;

		// recuperer enfant de gauche
		let jl : TEPlayer;
		const matchIndexLeft = matchIndex * 2;
		if (matchIndexLeft > totalMatches) {
			const leftPlayerNumber  = leafIdx * 2  + 1;

			const resGetPlayerL : GetTEPlayerResult = await this._tePlayerTab.getTEPlayerByTEidAndIdInTE(te.id, leftPlayerNumber);
			if (resGetPlayerL.status != "success" ) return ({status: "error", error: "unexpected_error"});
			
			jl = resGetPlayerL.data;
		}
		else
		{
			const resGetTEMatchL : GetTEMatchResult = await this._teMatchTab.getTEMatchByTEidAndOrder(te.id, matchIndexLeft);
			if (resGetTEMatchL.status != "success" ) return ({status: "error", error: "unexpected_error"});
			else if (resGetTEMatchL.data.winner_id == undefined) return ({status: "error", error: "no_winner_yet"});
			
			const resGetPlayerL : GetTEPlayerResult = await this._tePlayerTab.getTEPlayerByTEidAndUserid(te.id, resGetTEMatchL.data.winner_id);
			if (resGetPlayerL.status != "success" ) return ({status: "error", error: "unexpected_error"});
			
			jl = resGetPlayerL.data;
		}
		// recuperer enfant de droite
		
		let jr : TEPlayer;
		const matchIndexRight = matchIndexLeft + 1;
		if (matchIndexRight > totalMatches) {// alors y a pas de match à droite
			const rightPlayerNumber  = leafIdx * 2  + 1 + 1;
			const resGetPlayerR : GetTEPlayerResult = await this._tePlayerTab.getTEPlayerByTEidAndIdInTE(te.id, rightPlayerNumber);
			if (resGetPlayerR.status != "success" ) return ({status: "error", error: "unexpected_error"});
		
			jr = resGetPlayerR.data;
		}
		else
		{
			const resGetTEMatchR : GetTEMatchResult = await this._teMatchTab.getTEMatchByTEidAndOrder(te.id, matchIndexRight);
			if (resGetTEMatchR.status != "success" ) return ({status: "error", error: "unexpected_error"});
			else if (resGetTEMatchR.data.winner_id == undefined) return ({status: "error", error: "no_winner_yet"});
			
			const resGetPlayerR : GetTEPlayerResult = await this._tePlayerTab.getTEPlayerByTEidAndUserid(te.id, resGetTEMatchR.data.winner_id);
			if (resGetPlayerR.status != "success" ) return ({status: "error", error: "unexpected_error"});
			
			jr = resGetPlayerR.data;
		}

		return {status : "success", data: {jL: jl, jR: jr}};
	}

/**
 * Starts a match in a tournament elimination bracket.
 *
 * This method retrieves the tournament elimination data and the players involved in a specific match.
 * It then starts a new match between these two players, links it to the tournament structure,
 * and updates the tournament match record with the new match ID.
 *
 * @param idTE - The ID of the tournament elimination.
 * @param matchIndexInTournament - The index of the match in the tournament tree (1 = final, goes down to leaves).
 * @returns A result indicating success or an appropriate error.
 */
	public async startTEMatch(idTE: number, matchIndexInTournament : number): Promise<BaseResult<ISqlite.RunResult<sqlite3.Statement>[]> | BaseResult<ISqlite.RunResult<sqlite3.Statement>>>
	{
		const resGetTE: GetTournamentEliminationResult =  await this._teTab.getTEByid(idTE);
		if (resGetTE.status != "success" ) return ({status: "error", error: "unexpected_error"});

		const te = resGetTE.data;

		const resGetJlAndJR : BaseResult<{jL: TEPlayer;jR: TEPlayer;}>= await this.getTEMatchPlayers(te, matchIndexInTournament);
		if (resGetJlAndJR.status != "success") return ({status: "error", error: "unexpected_error"});;

		const resAddAndStartMatch : BaseResult<ISqlite.RunResult<sqlite3.Statement>> = await this.addAndStartMatch(resGetJlAndJR.data.jL.user_id, resGetJlAndJR.data.jR.user_id);
		if (resAddAndStartMatch.status != "success") return (resAddAndStartMatch);
		else if (resAddAndStartMatch.data.lastID == undefined)  return ({status: "error", error: "unexpected_error"});

		const idMatch = resAddAndStartMatch.data.lastID;
		const resGetTEMatchL : GetTEMatchResult = await this._teMatchTab.getTEMatchByTEidAndOrder(te.id, matchIndexInTournament);
		if (resGetTEMatchL.status != "success" ) return ({status: "error", error: "unexpected_error"});
		
		const res : UpdateTEMatchResult = await this._teMatchTab.updateMatchid(resGetTEMatchL.data, idMatch);
		return (mapUpdateTEMatchResultToBaseResult(res));
	}

/**
 * Ends a match in a tournament elimination bracket.
 *
 * This method performs several operations:
 * 1. Retrieves the tournament elimination (TE) by its ID.
 * 2. Retrieves the match corresponding to a specific index in the elimination bracket.
 * 3. Determines the winner based on the recorded scores.
 * 4. Marks the winner in the tournament elimination match.
 * 5. Marks the loser as eliminated.
 * 6. If this was the final match, marks the winner as the tournament winner.
 * 7. Decrements the winner's round value.
 *
 * @param idTE - The ID of the tournament elimination.
 * @param matchIndexInTournament - The index of the match in the elimination bracket (1 = final).
 * @returns A BaseResult indicating success or error with the appropriate code.
 */
	public async endTEMatch(idTE: number, matchIndexInTournament: number): Promise<BaseResult<any>> {
		// 1. Get the tournament elimination object
		const resGetTE = await this._teTab.getTEByid(idTE);
		if (resGetTE.status !== "success") return { status: "error", error: "unexpected_error" };

		const te = resGetTE.data;

		// 2. Get the TE match object by match order
		const resGetTEMatch = await this._teMatchTab.getTEMatchByTEidAndOrder(te.id, matchIndexInTournament);
		if (resGetTEMatch.status !== "success") return { status: "error", error: "unexpected_error" };
		if (resGetTEMatch.data.match_id === undefined) return { status: "error", error: "not_found" };

		// 3. Get the actual match data to determine the winner
		const resGetMatch = await this._matchTab.getMatchById(resGetTEMatch.data.match_id);
		if (resGetMatch.status !== "success") return { status: "error", error: "unexpected_error" };

		const match = resGetMatch.data;

		const idWinner = match.player_1_score >= match.player_2_score
			? match.player_1_id
			: match.player_2_id;

		const idLooser = match.player_1_score < match.player_2_score
			? match.player_1_id
			: match.player_2_id;

		// 4. Mark the winner in the TE match
		const resMarkWinner = await this._teMatchTab.markWinner(resGetTEMatch.data, idWinner);
		if (resMarkWinner.status !== "success") return mapUpdateTEMatchResultToBaseResult(resMarkWinner);

		resGetTEMatch.data.winner_id = idWinner;

		// 5. Mark the loser as eliminated
		const resGetTEPLooser = await this._tePlayerTab.getTEPlayerByTEidAndUserid(idTE, idLooser);
		if (resGetTEPLooser.status === "error") return { status: "error", error: "unexpected_error" };

		const teLooser = resGetTEPLooser.data;
		await this._tePlayerTab.markEliminated(teLooser);

		// 6. Mark the winner as tournament winner if it's the final match
		const resGetTEPWinner = await this._tePlayerTab.getTEPlayerByTEidAndUserid(idTE, idWinner);
		if (resGetTEPWinner.status === "error") return { status: "error", error: "unexpected_error" };

		const teWinner = resGetTEPWinner.data;

		if (resGetTEMatch.data.order_match === 1) {
			const resUpdateTEPWin = await this._tePlayerTab.markWinner(teWinner);
			if (resUpdateTEPWin.status === "error") return { status: "error", error: "unexpected_error" };

			teWinner.is_winner = true;
			const resGetUserData : GetUserResult= await this._userTab.getUserById(teWinner.user_id);
			if (resGetUserData.status === "error") return { status: "error", error: "unexpected_error" };

			const resUpdateTEWin = await this._teTab.updateEndAndWiner(te, {userId: resGetUserData.data.id, name: resGetUserData.data.username});
			if (resUpdateTEWin.status === "error") return { status: "error", error: "unexpected_error" };

		}

		// 7. Decrease the round of the winner
		const resUpdateRound = await this._tePlayerTab.updateRound(teWinner, teWinner.round - 1);
		return mapUpdateTEPlayerResultToBaseResult(resUpdateRound);
	}

/**
 * Returns the number of rows for each database table.
 * @param tab - Name of the table
 * @returns Total number of rows or an error result
 */
	public async getNbrOfLigne(tab : tabsDBName): Promise<BaseResult<number>> {
		let res : number | undefined;
		switch (tab) {
			case "User":
				res = await this._userTab.getNbrOfUsers();
				if (res != undefined) return ({status: "success", data : res});
				break;
			case "Match":
				res = await this._matchTab.getNbrOfMatch();
				if (res != undefined) return ({status: "success", data : res});
				break;
			case "TE":
				res = await this._teTab.getNbrOfTE();
				if (res != undefined) return ({status: "success", data : res});
				break;
			case "TEPlayer":
				res = await this._tePlayerTab.getNbrOfTEPlayers();
				if (res != undefined) return ({status: "success", data : res});
				break;
			case "TEMatch":
				res = await this._teMatchTab.getNbrOfTEMatch();
				if (res != undefined) return ({status: "success", data : res});
				break;
		}
		return { status: "error", error: "unexpected_error" };
	}

/**
 * Returns a specific slice of rows from a table.
 * Example: To retrieve 10 rows starting from the 3rd group (30 to 40), call with (10, 3)
 * @param tab - Table name
 * @param nbrOfLigne - Number of rows to retrieve
 * @param begin - Starting group index (e.g. 3 means starting from row 30)
 * @returns Slice of rows or an error
 */
	public async getSlice(tab : tabsDBName, nbrOfLigne : number, begin: number): Promise<BaseResult<any[]>> {
		let res :any[];
		switch (tab) {
			case "User":
				res = await this._userTab.getUsersSlice(nbrOfLigne, begin);
				if (res != undefined) return ({status: "success", data : res});
				break;
			case "Match":
				res = await this._matchTab.getMatchsSlice(nbrOfLigne, begin);
				if (res != undefined) return ({status: "success", data : res});
				break;
			case "TE":
				res = await this._teTab.getTEsSlice(nbrOfLigne, begin);
				if (res != undefined) return ({status: "success", data : res});
				break;
			case "TEPlayer":
				res = await this._tePlayerTab.getTEPlayersSlice(nbrOfLigne, begin);
				if (res != undefined) return ({status: "success", data : res});
				break;
			case "TEMatch":
				res = await this._teMatchTab.getTEMatchsSlice(nbrOfLigne, begin);
				if (res != undefined) return ({status: "success", data : res});
				break;
		}
		return { status: "error", error: "empty" };
	}

/**
 * Retrieves a single record from the specified table based on parameters.
 * @param tabPm - Object containing the table name and parameters
 * @returns The requested record or an error
 */
	public async get(tabPm : pmTabsDB): Promise<BaseResult<any>> {
		let res : any;
		switch (tabPm.name) {
			case "User":
				res = await this._userTab.getUserById(tabPm.pm.id);
				if (res != undefined) return ({status: "success", data : res});
				break;
			case "Match":
				res = await this._matchTab.getMatchById(tabPm.pm.id);
				if (res != undefined) return ({status: "success", data : res});
				break;
			case "TE":
				res = await this._teTab.getTEByid(tabPm.pm.id);
				if (res != undefined) return ({status: "success", data : res});
				break;
			case "TEPlayer":
				res = await this._tePlayerTab.getTEPlayerByTEidAndUserid(tabPm.pm.idTE, tabPm.pm.idUser);
				if (res != undefined) return ({status: "success", data : res});
				break;
			case "TEMatch":
				res = await this._teMatchTab.getTEMatchByTEidAndOrder(tabPm.pm.idTE, tabPm.pm.order);
				if (res != undefined) return ({status: "success", data : res});
				break;
		}
		return { status: "error", error: "not_found" };
	}
}