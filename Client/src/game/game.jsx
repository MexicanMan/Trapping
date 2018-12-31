import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import withKeyLayer from 'react-key-layers';
import Field from './field/field.jsx';
import TrapMenu from './traps/trapMenu.jsx';
import PlayerList from './playerList.jsx';
import BaseWindowGame from './baseWindowGame.jsx';
import ModalError from '../Errors/modalError.jsx';
import FinishModal from './endModal/finishModal.jsx';
import * as gameActions from '../actions/gameActions.jsx';
import * as paths from '../routes/Paths.js';

const moveDelay = 100;

class Game extends Component {
    constructor(props){
        super(props);

        this.intervalWaitHandle;
        this.isMoveAllowed = true;

        this.modalErrorClose = this.modalErrorClose.bind(this);
        this.modalFinishClose = this.modalFinishClose.bind(this);
        this.tick = this.tick.bind(this);

        this.props.actions.changeGamePhase(1);

        this.props.addKeyListener('keyDown', (e) => {
            if (this.isMoveAllowed && this.props.phase == 2)
                this.handleKeyDown(e);
        });
    }

    componentWillUnmount() {
        this.props.actions.gameClean();
        this.props.actions.fieldClean();
    }

    modalErrorClose() {
        this.props.actions.gameErrorClean();
    }

    modalFinishClose() {
        this.props.history.push(paths.LOBBIES);
    }

    tick() {
        clearInterval(this.intervalWaitHandle);
        this.isMoveAllowed = true;
    }

    handleKeyDown(e) {
        this.isMoveAllowed = false;
        this.intervalWaitHandle = setInterval(this.tick, moveDelay);

        switch(e.keyCode) {
            case 83:
                return this.props.actions.attemptMove('down');
            case 68:
                return this.props.actions.attemptMove('right');
            case 87:
                return this.props.actions.attemptMove('up');
            case 65:
                return this.props.actions.attemptMove('left');
            default:
                console.log(e.keyCode);
        };
    };

    render() {
        return (
            <BaseWindowGame id="gameWindow">
                {this.props.error != "" ? <ModalError handleModalCloseClick={this.modalErrorClose} errorMsg={this.props.error} /> 
                                            : null}
                {this.props.result != "" ? <FinishModal handleModalCloseClick={this.modalFinishClose} result={this.props.result}
                                            winnerNick={this.props.winnerNick} /> : null}
                <div className="row no-gutters">
                    <PlayerList />
                    <Field />
                    <TrapMenu />
                </div>
            </BaseWindowGame>
        );
    }
}

function mapDispatchToProps(dispatch) {  
    return {
      actions: bindActionCreators(gameActions, dispatch)
    };
}

function mapStateToProps(state) {
    return {
        error: state.game.error,
        phase: state.game.phase,
        result: state.game.result,
        winnerNick: state.game.winnerNick,
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps) (withKeyLayer(Game)));