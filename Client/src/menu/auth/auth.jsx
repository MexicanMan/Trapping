import React, { Component } from 'react';
import { bindActionCreators } from 'redux';  
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as authActions from '../../actions/authActions.jsx';
import * as paths from '../../routes/Paths.js';
import BaseWindow from '../baseWindow.jsx';
import FloatError from '../../Errors/floatError.jsx';

class Auth extends Component {
    constructor(props) {
        super(props);

        this.state = {
            credentials: {
                email: '',
                password: ''
            }
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.registerClicked = this.registerClicked.bind(this);
        this.alertClosed = this.alertClosed.bind(this);
    }

    registerClicked(event) {
        this.props.history.push(paths.REGISTER);
    }

    alertClosed(event) {
        this.props.actions.authErrorClean();
    }

    handleChange(event) {  
        const field = event.target.name;
        const credentials = this.state.credentials;
        credentials[field] = event.target.value;
        return this.setState({credentials: credentials});
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.actions.loginUser(this.state.credentials, this.props.history);
    }

    render() { 
        return (
            <BaseWindow header="Sign In">
                <hr />
                {this.props.error != "" ? <FloatError handleCloseClick={this.alertClosed} errorMsg={this.props.error} /> 
                                            : null}
                <form onSubmit={this.handleSubmit} className="needs-validation" novalidate>
                    <div className="form-group">
                        <label for="email">Email address:</label>
                        <input type="email" className="form-control" placeholder="Enter email" id="email"
                        name="email" value={this.state.credentials.email} onChange={this.handleChange} required/>
                    </div>
                    <div className="form-group">
                        <label for="pwd">Password:</label>
                        <input type="password" className="form-control" placeholder="Enter password" id="pwd" 
                        name="password" value={this.state.credentials.password} onChange={this.handleChange} required/>
                    </div>
                    <button type="submit" className="btn btn-primary mb-3">Sign In</button>
                    <button type="button" className="btn btn-primary mb-3 float-right" onClick={this.registerClicked}>
                        Register
                    </button>
                </form>
            </BaseWindow>
        );
    }
}

function mapDispatchToProps(dispatch) {  
    return {
      actions: bindActionCreators(authActions, dispatch)
    };
}

function mapStateToProps(state) {
    return {
        error: state.auth.error,
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Auth));