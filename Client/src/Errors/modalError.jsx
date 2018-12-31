import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import $ from 'jquery';

import { UNAUTH_USER_ERROR } from './errorTypes.js';
import * as paths from '../routes/Paths.js';
import { fromTypeToText } from './errorFormat.js';

// Small crutch =)
class ModalError extends Component {
    constructor(props) {
        super(props);
        this.handleCloseClick = this.handleCloseClick.bind(this);
    }

    componentDidMount() {
        const { handleModalCloseClick } = this.props;
        $(this.modal).modal('show');
        $(this.modal).on('hidden.bs.modal', handleModalCloseClick);
    }

    handleCloseClick() {
        const { handleModalCloseClick } = this.props;
        $(this.modal).modal('hide');

        if (this.props.errorMsg == UNAUTH_USER_ERROR)
        { 
            sessionStorage.removeItem('token');
            this.props.history.push(paths.AUTH);
        }

        handleModalCloseClick();
    }

    render() {
      return (
        <div>
            <div className="modal fade" ref={modal => this.modal = modal} id="errorModal" tabIndex="-1" 
            role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Error!</h5>
                        </div>
                        <div className="modal-body">
                            {fromTypeToText(this.props.errorMsg)}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger" onClick={this.handleCloseClick}>OK</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      );
    }
  }

  export default withRouter(ModalError);