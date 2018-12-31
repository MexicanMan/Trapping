import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import BaseWindow from '../baseWindow.jsx';
import ModalError from '../../Errors/modalError.jsx';
import * as lobbyActions from '../../actions/lobbyActions.jsx';
import * as paths from '../../routes/Paths.js';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';

const startingGameTitle = 'Starting..';

class Lobby extends Component {
    constructor(props) {
        super(props);

        this.readyClick = this.readyClick.bind(this);
        this.modalErrorClose = this.modalErrorClose.bind(this);
        this.countDownStart = this.countDownStart.bind(this);
        this.countDownStop = this.countDownStop.bind(this);
        this.tick = this.tick.bind(this);

        this.state = {
            currentTime: ''
        };

        this.isCountStarted = false;
        this.isGameStarted = false;
        this.intervalHandle;

        this.props.actions.connectToLobby(this.props.match.params.id);
    }

    componentWillUnmount() {
        this.props.actions.lobbyErrorClean();
        if (!this.isGameStarted)
            this.props.actions.leaveLobby();
    }

    modalErrorClose() {
        this.props.actions.lobbyErrorClean();
    }

    readyClick() {
        if (this.state.currentTime != startingGameTitle)
            this.props.actions.lobbyWSPlayerReadinessChanged(!this.props.playersReadiness[this.props.thisPlayerNo]);
    }

    tick() {
        let currTime = this.state.currentTime;
        currTime--;
        if (currTime == 0) {
            clearInterval(this.intervalHandle);
            this.isGameStarted = true;
            this.isCountStarted = false;

            this.props.history.push(paths.GAME);

            return this.setState({currentTime: startingGameTitle});
        }

        return this.setState({currentTime: currTime});
    }

    countDownStart() {
        this.isCountStarted = true;
        this.intervalHandle = setInterval(this.tick, 1000);
        return this.setState({currentTime: 3});
    }

    countDownStop() {
        clearInterval(this.intervalHandle);
        this.isCountStarted = false;

        return this.setState({currentTime: ''});
    }

    render() {
        let isItFirstPlayer = this.props.thisPlayerNo == 0 ? "font-weight-bold" : "";
        let isItSecondPlayer = this.props.thisPlayerNo == 1 ? "font-weight-bold" : "";
        if (this.props.playersReadiness[0] && this.props.playersReadiness[1] && !this.isCountStarted && !this.isGameStarted) {
            this.countDownStart();
        } else if (this.isCountStarted & (!this.props.playersReadiness[0] || !this.props.playersReadiness[1])) {
            this.countDownStop();
        }

        return (
            <BaseWindow header={`Lobby - ${this.props.lobbyName}`}>
                {this.props.error != "" ? <ModalError handleModalCloseClick={this.modalErrorClose} errorMsg={this.props.error} /> 
                                            : null}
                <hr/>
                <div className="row justify-content-center">
                    <div className="col-sm-8">
                        <div className="row">
                            <div className="col-sm-10"><p className={`${isItFirstPlayer}`}>{this.props.players[0]}</p></div>
                            <div className="col-sm-2">
                                {this.props.playersReadiness[0] ? 
                                    <FontAwesomeIcon icon={faCheck} color="green" />:
                                    <FontAwesomeIcon icon={faTimes} color="red" /> 
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-sm-8">
                        <div className="row">
                            <div className="col-sm-10"><p className={`${isItSecondPlayer}`}>{this.props.players[1]}</p></div>
                            <div className="col-sm-2">
                                {this.props.playersReadiness[1] ? 
                                    <FontAwesomeIcon icon={faCheck} color="green" /> :
                                    <FontAwesomeIcon icon={faTimes} color="red" /> 
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-3" /> 
                    <div className="col-sm-6">
                        <div className="row justify-content-center">
                            <div className="col-sm-10">
                                { !this.props.playersReadiness[this.props.thisPlayerNo] ? 
                                    <button type="button" className="btn btn-success mt-2 mb-3 btn-block" onClick={this.readyClick}>
                                        I'm ready!
                                    </button> :
                                    <button type="button" className="btn btn-danger mt-2 mb-3 btn-block" onClick={this.readyClick}>
                                        Or am I not ready?
                                    </button> 
                                } 
                            </div>
                        </div>                     
                    </div>
                    <div className="col-sm-3">
                        <h2 className="mt-1">{this.state.currentTime}</h2>
                    </div>
                </div>
            </BaseWindow>
        );
    }
}

function mapDispatchToProps(dispatch) {  
    return {
      actions: bindActionCreators(lobbyActions, dispatch)
    };
}

function mapStateToProps(state) {
    return {
        lobbyName: state.lobby.lobbyName,
        players: state.lobby.players,
        playersReadiness: state.lobby.playersReadiness,
        thisPlayerNo: state.lobby.thisPlayerNo,
        error: state.lobby.error,
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps) (Lobby));