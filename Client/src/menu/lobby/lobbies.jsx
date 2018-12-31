import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import * as lobbyActions from '../../actions/lobbyActions.jsx';
import * as paths from '../../routes/Paths.js';
import ModalError from '../../Errors/modalError.jsx';
import BaseWindow from '../baseWindow.jsx';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons/faSyncAlt';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight';

class Lobbies extends Component {
    constructor(props) {
        super(props);

        this.getLobbiesFromServer = this.getLobbiesFromServer.bind(this);
        this.createNewLobby = this.createNewLobby.bind(this);
        this.connectToLobby = this.connectToLobby.bind(this);
        this.modalErrorClose = this.modalErrorClose.bind(this);
    }

    componentDidMount() {
        this.getLobbiesFromServer();
    }

    getLobbiesFromServer() {
        this.props.actions.getLobbies();
    }

    createNewLobby() {
        this.props.history.push(paths.NEW_LOBBY);
    }

    connectToLobby(id) {
        this.props.history.push(paths.concreteLobby(id));
    }

    modalErrorClose() {
        this.props.actions.lobbiesErrorClean();
    }

    getStatus(status) {
        switch (status) {
            case "WaitingForPlayer":
                return "Waiting..";
            case "Full":
                return "Full";
            default:
                return "";
        }
    }

    render() {        
        return (
            <BaseWindow header="Lobbies">
                {this.props.error != "" ? <ModalError handleModalCloseClick={this.modalErrorClose} errorMsg={this.props.error} /> 
                                            : null}
                <table className="table table-hover">
                    <thead>
                    <tr>
                        <th className="col-sm-2">№</th>
                        <th className="col-sm-5">Lobby</th>
                        <th className="col-sm-2">Players</th>
                        <th className="col-sm-3">Status</th>
                    </tr>
                    </thead>
                    <tbody>
                        {this.props.rows.map((row) => (
                            <tr id="Lobby" key={row.ID}>
                                <td className="col-sm-2">{row.ID}</td>
                                <td className="col-sm-5">{row.Name}</td>
                                <td className="col-sm-2">{row.Players}</td>
                                <td className="col-sm-3">
                                    {this.getStatus(row.Status)}
                                    {this.getStatus(row.Status) == "Waiting.." ? 
                                    <button type="button" className="btn btn-success connect-btn btn-sm" 
                                    onClick={this.connectToLobby.bind(this, row.ID)}>
                                        Connect <span><FontAwesomeIcon icon={faArrowRight}/></span>
                                    </button> 
                                    : null }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button type="button" className="btn btn-primary mb-3" onClick={this.createNewLobby}>
                    Create new lobby
                </button>
                <button type="button" id="refreshBtn" className="btn btn-primary mb-3 float-right" onClick={this.getLobbiesFromServer}>
                    <span><FontAwesomeIcon icon={faSyncAlt}/></span> Refresh
                </button>
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
        rows: state.lobbies.rows,
        error: state.lobbies.error,
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Lobbies));