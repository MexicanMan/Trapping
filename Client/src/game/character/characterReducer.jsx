import { SETUP_CHARS, MOVE_CHAR, KILL_CHAR, CLEAN_CHARS } from '../../actions/ActionTypes.js';

const initialState = {
    charCount: 0,
    nicknames: ["", ""],
    positions: [[0, 0], [0, 0]],
    isDead: [false, false],
};

const characterReducer = (state=initialState, action) => {
    switch (action.type) {
        case SETUP_CHARS:
            let isDead = [];
            for (var i = 0; i < state.isDead.length; i++) {
                isDead.push(false);
            }

            return Object.assign({}, state, {
                charCount: action.payload.charCount,
                nicknames: action.payload.nicknames,
                positions: action.payload.positions,
                isDead: isDead,
            });
        case MOVE_CHAR:
            let index = state.nicknames.indexOf(action.payload.nickname);
            let newPositions = [];
            for (var i = 0; i < state.charCount; i++) {
                newPositions.push([state.positions[i][0], state.positions[i][1]]);
            }
            
            switch (action.payload.direction) {
                case 'left':
                    newPositions[index][0] -= 1;
                    break;
                case 'right':
                    newPositions[index][0] += 1;
                    break;
                case 'up':
                    newPositions[index][1] -= 1;
                    break;
                case 'down': 
                    newPositions[index][1] += 1;
                    break;
            }

            return Object.assign({}, state, {
                positions: newPositions,
            });
        case KILL_CHAR:
            let ind = state.nicknames.indexOf(action.payload.nickname);
            let newIsDead = [];
            for (var i = 0; i < state.charCount; i++) {
                newIsDead.push(state.isDead[i]);
            }

            newIsDead[ind] = true;
            return Object.assign({}, state, {
                isDead: newIsDead,
            });
        case CLEAN_CHARS:
            return initialState;
        default:
            return state;
    }
};

export default characterReducer;