import authReducer from '../src/menu/auth/authReducer.jsx';
import * as types from '../src/actions/ActionTypes.js';

describe('AuthReducer', () => {
    it('Should return the initial state', () => {
        expect(authReducer(undefined, {})).toEqual({
            error: '',
        });
    });

    it('Should handle AUTH_SUCCESS', () => {
        expect(
            authReducer({}, {
                type: types.AUTH_SUCCESS,
            })
            ).toEqual({
                error: '',
            }
        );
        
        expect(
            authReducer({
                error: 'ERROR ...',
            },
            {
                type: types.AUTH_SUCCESS,
            })
        ).toEqual({
            error: '',
        });
    });

    it('Should handle AUTH_FAILED', () => {
        expect(
            authReducer({
                error: '',
            },
            {
                type: types.AUTH_FAILED,
                payload: { 
                    error: 'ERROR ...',
                }
            })
        ).toEqual({
            error: 'ERROR ...',
        });
    });

    it('Should handle AUTH_ERROR_CLEAN', () => {
        expect(
            authReducer({
                error: 'ERROR ...',
            },
            {
                type: types.AUTH_ERROR_CLEAN,
            })
        ).toEqual({
            error: '',
        });
    });
});