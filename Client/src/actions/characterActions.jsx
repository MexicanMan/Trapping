import * as types from './ActionTypes.js';
import store from '../store/store.jsx';

export function setUpCharacters(characters) {
	let charCount = characters.length;
	let nicknames = characters.map(char => char.nickname);
	let positions = characters.map(char => [char.xpos, char.ypos]);

    return { type: types.SETUP_CHARS,
			 payload: { 
				charCount: charCount,
				nicknames: nicknames,
				positions: positions,
	   		}};
}

export function characterMove(nickname, direction) {
	return { type: types.MOVE_CHAR, 
			 payload: { 
				nickname: nickname,
				direction: direction,
		   	}};
}

export function killChar(nickname) {
	return { type: types.KILL_CHAR, 
			 payload: { 
		   		nickname: nickname,
		  	}};
}

export function cleanChars() {
	return { type: types.CLEAN_CHARS, };
}