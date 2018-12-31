import * as types from './ActionTypes.js';  
import sessionApi from '../api/sessionApi.jsx';
import store from '../store/store.jsx';
import { concreteLobby, GAME } from '../routes/Paths.js';
import { setUpGame } from './gameActions.jsx';

/* Lobbies actions*/

export function lobbiesGetSucces(rows) {
    return { type: types.LOBBIES_GET_SUCCESS,
             payload: { 
                rows: rows,
            }};
}

export function lobbiesGetError(error) {
	return { type: types.LOBBIES_GET_ERROR,
			  payload: { 
				error: error,
			}};
}

export function lobbiesErrorClean() {
	return { type: types.LOBBIES_ERROR_CLEAN };
}

export function getLobbies() {  
	return function(dispatch) {
		return sessionApi.getLobbies().then(response => {
			console.log(response);
			if (response.error == "") {
				store.dispatch(lobbiesGetSucces(response.payload.lobbies));
			}
			else if (response.error == undefined)
			{
				store.dispatch(lobbiesGetError("Oops, there are some problems with server!"));
			}
			else
			{
				store.dispatch(lobbiesGetError(response.error));
			}
		}).catch(error => {
			throw(error);
		});
	};
}

/* New lobby creation actions */

export function newLobbySuccess() {
    return { type: types.CREATE_NEW_LOBBY_SUCCESS };
}

export function newLobbyError(error) {
	return { type: types.CREATE_NEW_LOBBY_FAILED,
			 payload: { 
				error: error,
			}};
}

export function newLobbyErrorClean() {
	return { type: types.CREATE_NEW_LOBBY_ERROR_CLEAN };
}

export function createNewLobby(lobbyName, history) {  
	return function(dispatch) {
		return sessionApi.createNewLobby(lobbyName).then(response => {
			console.log(response);
			if (response.error == "") {
				store.dispatch(newLobbySuccess());
				history.push(concreteLobby(response.payload.id));
			}
			else if (response.error == undefined)
			{
				store.dispatch(newLobbyError("Oops, there are some problems with server!"));
			}
			else
			{
				store.dispatch(newLobbyError(response.error));
			}
		}).catch(error => {
			throw(error);
		});
	};
}

/* Connect to lobby and ws lobby work */

export function lobbyConnectSuccess(lobbyName) {
	return { type: types.LOBBY_CONN_GET_SUCCESS,
			 payload: { 
				lobbyName: lobbyName,
			}};
}

export function lobbyWSOpen() {
	return { type: types.LOBBY_CONN_WS_OPEN, };
}

export function lobbyWSPingGet(error, players) {
	return { type: types.LOBBY_WS_PING_GET,
			 payload: {
				error: error,
				players: players,
			}};
}

export function lobbyWSPingSend() {
	return { type: types.LOBBY_WS_PING_SEND, };
}

export function lobbyWSPlayerReadinessChanged(readiness) {
	return  { type: types.LOBBY_WS_PLAYER_READINESS_CHANGED,
			  payload: {
				readiness: readiness,
			}};
}

export function lobbyError(error) {
	return { type: types.LOBBY_GET_ERROR,
			 payload: { 
				error: error,
			}};
}

export function lobbyErrorClean() {
	return { type: types.LOBBY_ERROR_CLEAN };
}

export function leaveLobby() {
	return { type: types.LOBBY_WS_LEAVE };
}

export function lobbyClean() {
	return { type: types.LOBBY_CLEAN };
}

export function lobbyStartGame(cellString, startRect, finishPos, width, height, characters, traps) {
	// Building map
	const cells = cellString.split(' ');
	let map = [];
	for (var i = 0; i < height; i++) {
		let line = [];
		for (var j = 0; j < width; j++) {
			line.push(parseInt(cells[i*width + j], 10));
		}
		map.push(line);
	}

	// Building modifiers map
	let modifiers = [];
	for (var i = 0; i < height; i++) {
		let line = [];
		for (var j = 0; j < width; j++) {
			if (startRect.left <= j && startRect.right >= j && 
				startRect.down <= i && startRect.up >= i)
				line.push(1);
			else if (j == finishPos.xpos && i == finishPos.ypos)
				line.push(2);
			else
				line.push(0);
		}
		modifiers.push(line);
	}

	store.dispatch(setUpGame(map, modifiers, width, height, characters, traps));
}

export function connectToLobby(lobbyId) {
	return function(dispatch) {
		return sessionApi.connectToLobby(lobbyId).then(response => {
			console.log(response);
			if (response.error == "") {
				store.dispatch(lobbyConnectSuccess(response.payload.Name));
				
				store.dispatch(lobbyWSOpen());
			}
			else if (response.error == undefined)
			{
				store.dispatch(lobbyError("Oops, there are some problems with server!"));
			}
			else
			{
				store.dispatch(lobbyError(response.error));
			}
		}).catch(error => {
			throw(error);
		});
	};
}