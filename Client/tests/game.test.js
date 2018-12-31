import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Game from '../src/game/game.jsx';
import Actions from '../src/actions/actions.jsx';
import * as types from '../src/actions/ActionTypes.js';

Enzyme.configure({ adapter: new Adapter() });

describe('Game Component (Smart)', () => {
    const mockStore = configureStore();
    const initialState = {
        game: {
            No: 0,
            status: 'disconnected',
        },
    }
    let store, wrapper;

    beforeEach(()=>{
        store = mockStore(initialState);
        wrapper = mount(<Provider store={store}><Game /></Provider>);
    })

    it('Render the connected(SMART) component', () => {
       expect(wrapper.find(Game).length).toEqual(1);
    });

    it('Check action on dispatching', () => {
        let action;
        store.dispatch(Actions.connecting());
        action = store.getActions();
        expect(action[0].type).toBe(types.CONNECTING);
    });
});