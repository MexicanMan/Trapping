import { LOBBY_CONN_GET_SUCCESS, LOBBY_GET_ERROR, LOBBY_ERROR_CLEAN, LOBBY_WS_PING_GET, LOBBY_WS_LEAVE, LOBBY_CLEAN } from '../../actions/ActionTypes.js';

const initialState = {
    lobbyName: '',
    players: ["", ""],
    playersReadiness: [false, false],
    thisPlayerNo: 0,
    error: '',
};

const lobbyReducer = (state=initialState, action) => {
    switch(action.type) {
        case LOBBY_CONN_GET_SUCCESS:
            return Object.assign({}, state, {
                lobbyName: action.payload.lobbyName, });
        case LOBBY_GET_ERROR:
            return Object.assign({}, state, {
                error: action.payload.error, });
        case LOBBY_ERROR_CLEAN:
            return Object.assign({}, state, {
                error: '', });
        case LOBBY_WS_PING_GET:
            let players = action.payload.players.map(player => player.nick);
            let playersReadiness = action.payload.players.map(player => {
                if (player.status == "Ready") 
                    return true;
                else
                    return false;
            });

            let thisPlayerNo = players.length-1;
            for (var i = 0; i < players.length-1; i++)
                if (players[i] == sessionStorage.nickname) {
                    thisPlayerNo = i;
                    break;
                }
                
            return Object.assign({}, state, {
                players: players,
                playersReadiness: playersReadiness,
                thisPlayerNo: thisPlayerNo,
                error: action.payload.error
            });
        case LOBBY_WS_LEAVE:
            let newPlayerReadiness = state.playersReadiness;
            newPlayerReadiness[state.thisPlayerNo] = false;

            return Object.assign({}, state, {
                playersReadiness: newPlayerReadiness,
            });
        case LOBBY_CLEAN:
            return initialState;
        default:
            return state;
    }
};

export default lobbyReducer;