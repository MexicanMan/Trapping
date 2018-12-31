import authActions from '../src/actions/authActions.jsx';
import * as types from '../src/actions/ActionTypes.js';

describe('Actions', ()=>{
    it('ActionCreator authSuccess()', () => {
        const autSucc = authActions.authSuccess();
        expect(autSucc).toEqual({
            type: types.AUTH_SUCCESS })
    });
});