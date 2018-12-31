import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Auth from '../src/menu/auth/auth.jsx';
import authActions from '../src/actions/authActions.jsx';
import * as types from '../src/actions/ActionTypes.js';

Enzyme.configure({ adapter: new Adapter() });

describe('Auth Component (Smart)', () => {
    const mockStore = configureStore();
    const initialState = {
        auth: {
            error: '',
        },
    }
    let store, wrapper;

    beforeEach(()=>{
        store = mockStore(initialState);
        wrapper = mount(<Provider store={store}><Auth /></Provider>);
    })

    it('Render the connected(SMART) component', () => {
       expect(wrapper.find(Auth).length).toEqual(1);
    });

    it('Check action on dispatching', () => {
        let action;
        store.dispatch(authActions.authSuccess());
        action = store.getActions();
        expect(action[0].type).toBe(types.AUTH_SUCCESS);
    });
});