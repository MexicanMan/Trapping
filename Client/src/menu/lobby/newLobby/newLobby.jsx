import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';

import ModalError from '../../../Errors/modalError.jsx';
import BaseWindow from '../../baseWindow.jsx';
import * as lobbyActions from '../../../actions/lobbyActions.jsx';

class NewLobby extends Component {
    constructor(props) {
        super(props);

        this.state = {
            lobbyName: '',
        };

        this.isNameLen = true;

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.modalErrorClose = this.modalErrorClose.bind(this);
    }

    handleChange(event) {
        const lobbyName = event.target.value;

        if (lobbyName.length == 0 || lobbyName.length > 18)
            this.isNameLen = false;
        else
            this.isNameLen = true;

        return this.setState({lobbyName: lobbyName});
    }

    handleSubmit(event) {
        event.preventDefault();
        if (this.isNameLen) {
            this.props.actions.createNewLobby(this.state.lobbyName, this.props.history);
        }
    }

    modalErrorClose() {
        this.props.actions.newLobbyErrorClean();
    }

    render() {
        let isNameValid = !this.isNameLen ? 'is-invalid' : '';

        return (
            <BaseWindow header="Create new lobby">
                <hr/>
                {this.props.error != "" ? <ModalError handleModalCloseClick={this.modalErrorClose} errorMsg={this.props.error} /> 
                                            : null}
                <form onSubmit={this.handleSubmit} className="needs-validation" novalidate>
                    <div className="form-group">
                        <label for="lobbyName">Lobby name:</label>
                        <input type="text" className={`form-control ${isNameValid}`} placeholder="Enter name" id="lobbyName" 
                        name="lobbyName" value={this.state.lobbyName} onChange={this.handleChange} required/>
                        <div className="invalid-feedback">Lobby name should be between 1 and 18 symbols!</div>
                    </div>
                    <button type="submit" className="btn btn-primary mb-3">Create</button>
                </form>
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
        error: state.newLobby.error,
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NewLobby));