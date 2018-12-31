import { REG_SUCCESS, REG_FAILED, REG_ERROR_CLEAN } from '../../actions/ActionTypes.js';

const initialState = {
    error: '',
};

const regReducer = (state=initialState, action) => {
    switch(action.type) {
        case REG_SUCCESS:
            return { 
                error: '', };
        case REG_FAILED:
            return { 
                error: action.payload.error, };
        case REG_ERROR_CLEAN:
            return { 
                error: '' };
        default:
            return state;
    }
};

export default regReducer;