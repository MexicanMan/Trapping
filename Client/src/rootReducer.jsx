import { combineReducers } from 'redux';
import fieldReducer from './game/field/fieldReducer.jsx';
import trapMenuReducer from './game/traps/trapMenuReducer.jsx';
import gameReducer from './game/gameReducer.jsx';
import characterReducer from './game/character/characterReducer.jsx';
import authReducer from './menu/auth/authReducer.jsx';
import regReducer from './menu/reg/regReducer.jsx';
import lobbiesReducer from './menu/lobby/lobbiesReducer.jsx';
import newLobbyReducer from './menu/lobby/newLobby/newLobbyReducer.jsx';
import lobbyReducer from './menu/lobby/lobbyReducer.jsx';

const rootReducer = combineReducers({
    field: fieldReducer,
    trapMenu: trapMenuReducer,
    game: gameReducer,
    characters: characterReducer,
    auth: authReducer,
    reg: regReducer,
    lobbies: lobbiesReducer,
    newLobby: newLobbyReducer,
    lobby: lobbyReducer,
});

export default rootReducer;