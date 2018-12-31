import React, { Component } from 'react';

import { fromTypeToText } from './errorFormat.js';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons/faExclamationTriangle';

class FloatError extends Component {
    constructor(props){
        super(props);
    }

    render() {
        return (
            <div className="alert alert-danger" role="alert">
                    <button type="button" className="close" onClick={this.props.handleCloseClick}>
                        &times;
                    </button>
                    <span><FontAwesomeIcon icon={faExclamationTriangle}/></span>
                    <span className="pl-1">{fromTypeToText(this.props.errorMsg)}</span>
            </div>
        );
    }
}

export default FloatError;