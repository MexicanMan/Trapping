import * as types from './ActionTypes.js';
import * as paths from '../routes/Paths.js';
import sessionApi from '../api/sessionApi.jsx';
import store from '../store/store.jsx';
import { authSuccess } from './authActions.jsx';

export function regSuccess() {  
    return { type: types.REG_SUCCESS };
}
  
  export function regFailed(error) {
      return { type: types.REG_FAILED,
			   payload: { 
                    error: error,
                } };
}
  
export function regErrorClean() {
    return { type: types.REG_ERROR_CLEAN };
}
  
export function registerUser(regData, history) {  
    return function(dispatch) {
        return sessionApi.register(regData).then(response => {
            console.log(response);
            if (response.error == "") {
                sessionStorage.setItem('token', response.payload.token);
                sessionStorage.setItem('nickname', response.payload.nickname);
                history.push(paths.REGISTER_CONFIRM);
                store.dispatch(regSuccess());
                store.dispatch(authSuccess());
            }
            else if (response.error == undefined)
            {
                store.dispatch(regFailed("Oops, there are some problems with server!"));
            }
            else
            {
                store.dispatch(regFailed(response.error));
            }
        }).catch(error => {
            throw(error);
        });
    };
}