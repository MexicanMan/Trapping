import { GAME_GET_ERROR, GAME_ERROR_CLEAN, CHANGE_GAME_PHASE, GAME_CLEAN, FINISH_GAME, DRAW_GAME } from '../actions/ActionTypes.js';
import { LOST, WON, DRAW } from './gameResultResType.js';

const initialState = {
    error: '',
    phase: 1,
    result: '',
    winnerNick: '',
};

const gameReducer = (state=initialState, action) => {
    switch(action.type) {
        case GAME_GET_ERROR:
            return Object.assign({}, state, {
                error: action.payload.error, });
        case GAME_ERROR_CLEAN:
            return Object.assign({}, state, {
                error: '', });
        case GAME_CLEAN:
            return initialState;
        case CHANGE_GAME_PHASE:
            return Object.assign({}, state, {
                phase: action.payload.phase, });
        case FINISH_GAME:
            let res = LOST; 

            if (sessionStorage.nickname == action.payload.winnerNick)
                res = WON;
        
            return Object.assign({}, state, {
                result: res,
                winnerNick: action.payload.winnerNick,
            });
        case DRAW_GAME:
            return Object.assign({}, state, {
                result: DRAW,
            });
        default:
            return state;
    }
};

export default gameReducer;