import { SETUP_TRAPS, CHOOSE_TRAP, CLEAR_CHOSEN } from '../../actions/ActionTypes.js';

const initialState = {
    traps: [],
    chosenTrap: "",
};

const trapMenuReducer = (state=initialState, action) => {
    switch(action.type) {
        case SETUP_TRAPS:
            return Object.assign({}, state, {
                traps: action.payload.traps,
            });
        case CHOOSE_TRAP:
            let trapTypes = state.traps.map(trap => trap.type);
            let newTraps = [];
            for (var i = 0; i < state.traps.length; i++)
                newTraps.push(state.traps[i]);

            if (state.chosenTrap != "") {
                let ind = trapTypes.indexOf(state.chosenTrap);
                newTraps[ind].count++;
            }

            let ind = trapTypes.indexOf(action.payload.trap);
            newTraps[ind].count--;
            return Object.assign({}, state, {
                traps: newTraps,
                chosenTrap: action.payload.trap,
            });
        case CLEAR_CHOSEN:
            return Object.assign({}, state, {
                chosenTrap: "",
            });
        default:
            return state;
    }
};

export default trapMenuReducer;