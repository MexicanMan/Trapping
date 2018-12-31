import React, { Component } from 'react';
import $ from 'jquery';
import * as resTypes from '../gameResultResType.js';

class FinishModal extends Component {
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

        handleModalCloseClick();
    }

    render() {
        let modalTitle = "";
        let modalBody = "";
        let buttonText = "";
        let buttonColor = "";

        switch (this.props.result) {
            case resTypes.WON:
                modalTitle = "Congratulations!";
                modalBody = <p>Winner winner chicken dinner - <span className="text-large">{this.props.winnerNick}</span>!!!</p>;
                buttonText = "WOW!";
                buttonColor = "btn-success";
                break;
            case resTypes.LOST:
                modalTitle = "Don't be upset";
                modalBody = <p>Today <mark>{this.props.winnerNick}</mark> won, but you will win the next time!</p>;
                buttonText = "Okay :(";
                buttonColor = "btn-danger";
                break;
            case resTypes.DRAW:
                modalTitle = "Well";
                modalBody = <p>You all died... Why?</p>;
                buttonText = "Go next";
                buttonColor = "btn-warning";
                break;
        }

        return (
            <div>
                <div className="modal fade" ref={modal => this.modal = modal} id="finishModal" tabIndex="-1" 
                    role="dialog" aria-labelledby="ModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="ModalLabel">{modalTitle}</h5>
                            </div>
                            <div className="modal-body">
                                {modalBody}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className={`btn ${buttonColor}`} onClick={this.handleCloseClick}>{buttonText}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
  }

  export default FinishModal;