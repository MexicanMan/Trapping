import React, { Component } from 'react';
import { bindActionCreators } from 'redux';  
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as regActions from '../../actions/regActions.jsx';
import BaseWindow from '../baseWindow.jsx';
import FloatError from '../../Errors/floatError.jsx';

class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            registrationData : {
                nickname: '',
                email: '',
                password: '',
                confirmPassword: ''
            }
        };

        this.isPwdsMatches = true;
        this.isNickLen = true;

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.alertClosed = this.alertClosed.bind(this);
    }

    alertClosed(event) {
        this.props.actions.regErrorClean();
    }

    handleChange(event) {  
        const field = event.target.name;
        const registrationData = this.state.registrationData;
        registrationData[field] = event.target.value;

        // Crutch because of bug with form-group validating
        if (field == 'confirmPassword' || field == 'password') {
            if (this.state.registrationData.password == this.state.registrationData.confirmPassword)
                this.isPwdsMatches = true;
            else
                this.isPwdsMatches = false;
        }
        else if (field == 'nickname') {
            if (this.state.registrationData.nickname.length == 0 || this.state.registrationData.nickname.length > 20)
                this.isNickLen = false;
            else
                this.isNickLen = true;
        }

        return this.setState({registrationData: registrationData});
    }

    handleSubmit(event) {
        event.preventDefault();
        if (this.isPwdsMatches && this.isNickLen) {
            let regData = { nickname: this.state.registrationData.nickname,
                            email: this.state.registrationData.email,
                            password: this.state.registrationData.password };
            this.props.actions.registerUser(regData, this.props.history);
        }
    }

    render() {
        let isConfirmPwdValid = !this.isPwdsMatches ? 'is-invalid' : '';
        let isNickValid = !this.isNickLen ? 'is-invalid' : '';

        return (
            <BaseWindow header="Registration">
                <hr />
                {this.props.error != "" ? <FloatError handleCloseClick={this.alertClosed} errorMsg={this.props.error} /> 
                                            : null}
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label for="nick">Nickname:</label>
                        <input type="text" className={`form-control ${isNickValid}`} placeholder="Enter nickname" id="nick"
                        name="nickname" value={this.state.registrationData.nickname} onChange={this.handleChange} required/>
                        <div className="invalid-feedback">Nickname should be between 1 and 20 symbols!</div>
                    </div>
                    <div className="form-group">
                        <label for="email">Email address:</label>
                        <input type="email" className="form-control" placeholder="Enter email" id="email"
                        name="email" value={this.state.registrationData.email} onChange={this.handleChange} required/>
                    </div>
                    <div className="form-group">
                        <label for="pwd">Password:</label>
                        <input type="password" className="form-control" placeholder="Enter password" id="pwd" 
                        name="password" value={this.state.registrationData.password} onChange={this.handleChange} required/>
                    </div>
                    <div className="form-group">
                        <label for="pwdConf">Confirm password:</label>
                        <input type="password" className={`form-control ${isConfirmPwdValid}`} placeholder="Confirm password" 
                        id="pwdConf" name="confirmPassword" value={this.state.registrationData.confrimPassword} 
                        onChange={this.handleChange} required/>
                        <div className="invalid-feedback">Passwords do not match!</div>
                    </div>
                    <button type="submit" className="btn btn-primary mb-3">Register</button>
                </form>
            </BaseWindow>
        );
    }
}

function mapDispatchToProps(dispatch) {  
    return {
      actions: bindActionCreators(regActions, dispatch)
    };
}

function mapStateToProps(state) {
    return {
        error: state.reg.error,
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Register));