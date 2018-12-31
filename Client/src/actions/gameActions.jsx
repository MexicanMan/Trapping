import * as types from './ActionTypes.js';
import store from '../store/store.jsx';
import * as traps from '../game/traps/trapTypes.js';
import { setUpCharacters } from './characterActions.jsx';

export function gameGetError(error) {
	return { type: types.GAME_GET_ERROR,
			 payload: { 
				error: error,
			}};
}

export function gameErrorClean() {
	return { type: types.GAME_ERROR_CLEAN };
}

export function gameClean() {
	return { type: types.GAME_CLEAN };
}

export function fieldClean() {
	return { type: types.FIELD_CLEAN };
}

export function changeGamePhase(phase) {
	return { type: types.CHANGE_GAME_PHASE,
			 payload: { 
		   		phase: phase,
	   		}};
}

export function attemptMove(direction) {
	return { type: types.MOVE_ATTEMPT,
			 payload: { 
				direction: direction,
			}};
}

export function chooseTrap(type) {
	return { type: types.CHOOSE_TRAP,
			 payload: { 
				trap: type,
	   		}};
}

export function tryPlaceTrap(x, y, type) {
	return { type: types.TRY_PLACE_TRAP,
			 payload: { 
				x: x,
				y: y,
				trap: type,
			}};
}

export function activateTrap(x, y, type) {
	if (type == traps.IceBomb) {
		setTimeout(function() {
			store.dispatch(defrost(x, y));
		}, 2000);
	}

	return { type: types.ACTIVATE_TRAP,
			 payload: { 
		   		x: x,
		   		y: y,
		   		trap: type,
	   		}};
}

export function defrost(x, y) {
	return { type: types.REMOVE_TRAP,
			 payload: { 
			  	x: x,
			  	y: y,
		  	}};
}

export function clearChosenTrap() {
	return { type: types.CLEAR_CHOSEN };
}

export function showTrap(x, y, trap) {
	return { type: types.SHOW_TRAP,
			 payload: { 
		   		x: x,
		   		y: y,
		   		trap: trap,
	   		}};
}

export function removeTrap(x, y) {
	return { type: types.REMOVE_TRAP,
			 payload: { 
			  	x: x,
			  	y: y,
		  	}};
}

export function setUpGame(map, modifiers, width, height, characters, traps) {
	return function (dispatch) {
		store.dispatch(setUpMap(map, modifiers, width, height));
		store.dispatch(setUpTraps(traps));
		store.dispatch(setUpCharacters(characters));
	}
}

export function setUpMap(map, modifiers, width, height) {
    return { type: types.SETUP_MAP,
			 payload: { 
				width: width,
				height: height,
				map: map,
				modifiers: modifiers,
	   		}};
}

export function setUpTraps(traps) {
	let tTraps = [];
	traps.map(trap => tTraps.push({ type: trap.trap, count: trap.count }));  //ToDo 
	return { type: types.SETUP_TRAPS,
			 payload: { 
				traps: tTraps,
		  	}};
}

export function finishGame(nickname) {
	return { type: types.FINISH_GAME,
			 payload: {
		   		winnerNick: nickname,
		  	}};
}

export function drawGame() {
	return { type: types.DRAW_GAME };
}