import { CREATE_NEW_LOBBY_SUCCESS, CREATE_NEW_LOBBY_FAILED, CREATE_NEW_LOBBY_ERROR_CLEAN } from '../../../actions/ActionTypes.js';

const initialState = {
    error: '',
};

const newLobbyReducer = (state=initialState, action) => {
    switch(action.type) {
        case CREATE_NEW_LOBBY_SUCCESS:
            return {
                error: '', };
        case CREATE_NEW_LOBBY_FAILED:
            return {
                error: action.payload.error, };
        case CREATE_NEW_LOBBY_ERROR_CLEAN:
            return {
                error: '', };
        default:
            return state;
    }
};

export default newLobbyReducer;