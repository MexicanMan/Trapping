import * as commandsTypes from './CommandsTypes.js';
import * as lobbyActions from '../actions/lobbyActions.jsx';
import * as gameActions from '../actions/gameActions.jsx';
import * as characterActions from '../actions/characterActions.jsx';
import * as actionTypes from '../actions/ActionTypes.js';
import { serverWS } from '../config.js';

const socketMiddleware = (function(){ 
	var socket = null;

	function sendMsg(msg, store) {
		try {
			socket.send(msg);
		} catch(error) {
			store.dispatch(lobbyActions.lobbyError("Oops, there are some problems with server!"));
		}
	}

	const onOpen = (ws,store) => evt => {
		//Send a connect message
		console.log("OPENED");
		ws.send(JSON.stringify({token: sessionStorage.token, type: commandsTypes.CONNECT, payload: {}}));
		//Tell the store we're connected
		//store.dispatch(Actions.connected());
	}

	const onClose = (ws,store) => evt => {
		console.log("CLOSED");
		store.dispatch(lobbyActions.lobbyClean());
		store.dispatch(characterActions.cleanChars());
	}

	const onError = (ws, store) => evt => {
		console.log("ERROR");
		store.dispatch(lobbyActions.lobbyError("Oops, there are some problems with server!"));
	}

	const onMessage = (ws,store) => evt => {
		//Parse the JSON message received on the websocket	
		console.log("NAPISANO " + evt.data);
		var msg = JSON.parse(evt.data);
		switch(msg.type) {
			case commandsTypes.PING:
				store.dispatch(lobbyActions.lobbyWSPingGet(msg.error, msg.payload.players));
				//store.dispatch(lobbyActions.lobbyWSPingSend()); - depricated
				break;
			case commandsTypes.START_GAME:
				lobbyActions.lobbyStartGame(msg.payload.field.cells, msg.payload.start, msg.payload.finish,
							   msg.payload.field.width, msg.payload.field.height, msg.payload.characters, 
							   msg.payload.traps);
				break;
			case commandsTypes.MOVE:
				store.dispatch(characterActions.characterMove(msg.payload.nickname, msg.payload.direction));
				break;
			case commandsTypes.START_RUN:
				store.dispatch(gameActions.changeGamePhase(2));
				break;
			case commandsTypes.SHOW_TRAP:
				store.dispatch(gameActions.showTrap(msg.payload.xpos, msg.payload.ypos, msg.payload.trap));
				break;
			case commandsTypes.TRAP_PLACED:
				store.dispatch(gameActions.clearChosenTrap());
				break;
			case commandsTypes.KILL_CHAR:
				store.dispatch(characterActions.killChar(msg.payload.nickname));
				break;
			case commandsTypes.ACTIVATED_TRAP:
				store.dispatch(gameActions.activateTrap(msg.payload.xpos, msg.payload.ypos, msg.payload.trap));
				break;
			case commandsTypes.REMOVE_TRAP:
				store.dispatch(gameActions.removeTrap(msg.payload.xpos, msg.payload.ypos));
				break;
			case commandsTypes.FINISH:
				store.dispatch(gameActions.finishGame(msg.payload.nickname));
				break;
			case commandsTypes.DRAW:
				store.dispatch(gameActions.drawGame());
				break;
			//ToDo errors
			default:
				console.log("Received unknown message type: '" + msg.type + "'");
				break;
		}
	}

	return store => next => action => {
		switch(action.type) {
			case actionTypes.LOBBY_CONN_WS_OPEN:
				if (socket != null) {
					socket.close();
				}
				//Send an action that shows a "connecting..." status for now
				console.log("CONNECTION");

				//Attempt to connect (we could send a 'failed' action on error)
				socket = new WebSocket(serverWS);
				socket.onmessage = onMessage(socket, store);
				socket.onclose = onClose(socket, store);
				socket.onopen = onOpen(socket, store);
				socket.onerror = onError(socket, store);

				return next(action);
			case actionTypes.LOBBY_WS_PING_SEND:
				sendMsg(JSON.stringify({token: sessionStorage.token, type: commandsTypes.PING, payload: {}}), store);

				return next(action);
			case actionTypes.LOBBY_WS_PLAYER_READINESS_CHANGED:
				sendMsg(JSON.stringify({token: sessionStorage.token, type: commandsTypes.PLAYER_STATUS_CHANGED,
										payload: {
											status: action.payload.readiness,
										}}), store);

				return next(action);
			case actionTypes.MOVE_ATTEMPT:
				sendMsg(JSON.stringify({token: sessionStorage.token, type: commandsTypes.MOVE_ATTEMPT,
										payload: {
											direction: action.payload.direction,
										}}), store);

				return next(action);
			case actionTypes.TRY_PLACE_TRAP:
				sendMsg(JSON.stringify({token: sessionStorage.token, type: commandsTypes.TRAP_PLACE,
										payload: {
											xpos: action.payload.x,
											ypos: action.payload.y,
											trap: action.payload.trap,
										}}), store);

				return next(action);
			case actionTypes.LOBBY_WS_LEAVE:
				sendMsg(JSON.stringify({token: sessionStorage.token, type: commandsTypes.DISCONNECT,
						payload: { }}), store);

				if (socket != null) {
					socket.close();
					socket = null;
				}

				return next(action);
			case actionTypes.GAME_CLEAN:
				if (socket != null) {
					socket.close();
					socket = null;
				}

				return next(action);
			default:
				return next(action);
		}
	}

})();

export default socketMiddleware;
