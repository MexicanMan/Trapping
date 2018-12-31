import configureStore from 'redux-mock-store';
import Actions from '../src/actions/actions.jsx';
import * as types from '../src/actions/ActionTypes.js';

const mockStore = configureStore();

describe('Store', () => {
    it('Should dispatch action', () => {
        const initialState = { };
        const store = mockStore(initialState);
      
        store.dispatch(Actions.connected());
    
        const actions = store.getActions();
        const expectedAction = {
            type: types.CONNECTED,
			payload: {
				No: 2,
				status: 'connected',
            }
        }
        expect(actions).toEqual([expectedAction]);
      })
});

