import gameReducer from '../src/game/gameReducer.jsx';
import * as types from '../src/actions/ActionTypes.js';

describe('GameReducer', () => {
    it('Should return the initial state', () => {
        expect(gameReducer(undefined, {})).toEqual({
            No: 0,
            status: 'disconnected',
        });
    });

    it('Should handle CONNECTING', () => {
        expect(
            gameReducer({}, {
                type: types.CONNECTING,
                payload: {
                    No: 1,
                    status: 'connecting',
                }
            })
            ).toEqual({
                No: 1,
                status: 'connecting',
            }
        );
        
        expect(
            gameReducer({
                No: 0,
                status: 'disconnected',
            },
            {
                type: types.CONNECTING,
                payload: {
                    No: 1,
                    status: 'connecting',
                }
            })
        ).toEqual({
            No: 1,
            status: 'connecting',
        });
    });

    it('Should handle CONNECTED', () => {
        expect(
            gameReducer({
                No: 1,
                status: 'connecting',
            },
            {
                type: types.CONNECTED,
                payload: {
                    No: 2,
                    status: 'connected',
                }
            })
        ).toEqual({
            No: 2,
            status: 'connected',
        });
    });

    it('Should handle DISCONNECTED', () => {
        expect(
            gameReducer({
                No: 2,
                status: 'connected',
            },
            {
                type: types.DISCONNECTED,
                payload: {
                    No: 0,
                    status: 'disconnected',
                }
            })
        ).toEqual({
            No: 0,
            status: 'disconnected',
        });
    });
});