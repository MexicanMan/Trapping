import { LOBBIES_GET_SUCCESS, LOBBIES_GET_ERROR, LOBBIES_ERROR_CLEAN } from '../../actions/ActionTypes.js';

const initialState = {
    rows: [],
    error: '',
};

const lobbiesReducer = (state=initialState, action) => {
    switch(action.type) {
        case LOBBIES_GET_SUCCESS:
            return { 
                rows: action.payload.rows,
                error: '', };
        case LOBBIES_GET_ERROR:
            return {
                rows: [],
                error: action.payload.error, };
        case LOBBIES_ERROR_CLEAN:
            return { 
                rows: [],
                error: '', };
        default:
            return state;
    }
};

export default lobbiesReducer;