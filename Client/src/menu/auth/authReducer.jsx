import { AUTH_SUCCESS, AUTH_FAILED, LOGIN_OUT, AUTH_ERROR_CLEAN } from '../../actions/ActionTypes.js';

const initialState = {
    error: '',
};

const authReducer = (state=initialState, action) => {
    switch(action.type) {
        case AUTH_SUCCESS:
            return { error: '', };
        case AUTH_FAILED:
            return { error: action.payload.error, };
        case AUTH_ERROR_CLEAN:
            return { error: '' , };
        case LOGIN_OUT:
            return { error: '', };
        default:
            return state;
    }
};

export default authReducer;