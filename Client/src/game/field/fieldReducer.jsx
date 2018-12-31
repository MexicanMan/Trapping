import { SETUP_MAP, SHOW_TRAP, ACTIVATE_TRAP, REMOVE_TRAP, FIELD_CLEAN } from '../../actions/ActionTypes.js';
import * as traps from '../traps/trapTypes.js';
import * as modifierTypes from './modifierTypes.js';

const initialState = {
    width: 0,
    height: 0,
    map: [],
    modifiers: [],
};

const fieldReducer = (state=initialState, action) => {
    switch(action.type) {
        case SETUP_MAP:
            return Object.assign({}, state, {
                width: action.payload.width,
                height: action.payload.height,
                map: action.payload.map,
                modifiers: action.payload.modifiers, });
        case FIELD_CLEAN:
            return initialState;
        case SHOW_TRAP:
            let newModifiers = [];
            for (var i = 0; i < state.modifiers.length; i++) {
                let row = [];
                for (var j = 0; j <  state.modifiers[i].length; j++)
                    row.push(state.modifiers[i][j]);
                newModifiers.push(row);
            }

            switch (action.payload.trap) {
                case traps.IceBomb:
                    newModifiers[action.payload.y][action.payload.x] = modifierTypes.IceBomb;
                    break;
            }

            return Object.assign({}, state, {
                modifiers: newModifiers, });
        case ACTIVATE_TRAP:
            let newActivatedModifiers = [];
            for (var i = 0; i < state.modifiers.length; i++) {
                let row = [];
                for (var j = 0; j <  state.modifiers[i].length; j++)
                    row.push(state.modifiers[i][j]);
                newActivatedModifiers.push(row);
            }

            switch (action.payload.trap) {
                case traps.IceBomb:
                    newActivatedModifiers[action.payload.y][action.payload.x] = modifierTypes.Ice;
                    break;
                case traps.WolfPit:
                    newActivatedModifiers[action.payload.y][action.payload.x] = modifierTypes.PitOpen;
                    break;
            }

            return Object.assign({}, state, {
                modifiers: newActivatedModifiers, });
        case REMOVE_TRAP:
            let newRemovedModifiers = [];
            for (var i = 0; i < state.modifiers.length; i++) {
                let row = [];
                for (var j = 0; j <  state.modifiers[i].length; j++)
                    row.push(state.modifiers[i][j]);
                newRemovedModifiers.push(row);
            }

            newRemovedModifiers[action.payload.y][action.payload.x] = modifierTypes.Empty;

            return Object.assign({}, state, {
                modifiers: newRemovedModifiers, });
        case FIELD_CLEAN:
            return initialState;
        default:
            return state;
    }
};

export default fieldReducer;