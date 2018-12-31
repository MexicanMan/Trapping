import * as types from './ActionTypes.js';
import * as paths from '../routes/Paths.js';
import sessionApi from '../api/sessionApi.jsx';
import store from '../store/store.jsx';

export function authSuccess() {  
  return { type: types.AUTH_SUCCESS };
}

export function authFailed(error) {
	return { type: types.AUTH_FAILED,
			  payload: { 
				error: error,
			} };
}

export function authErrorClean() {
	return { type: types.AUTH_ERROR_CLEAN };
}

export function loginUser(credentials, history) {  
	return function(dispatch) {
		return sessionApi.login(credentials).then(response => {
			console.log(response);
			if (response.error == "") {
				sessionStorage.setItem('token', response.payload.token);
				sessionStorage.setItem('nickname', response.payload.nickname);
				store.dispatch(authSuccess());
				history.push(paths.LOBBIES);
			}
			else if (response.error == undefined)
			{
				store.dispatch(authFailed("Oops, there are some problems with server!"));
			}
			else
			{
				store.dispatch(authFailed(response.error));
			}
		}).catch(error => {
			throw(error);
		});
	};
}