import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import * as paths from '../../routes/Paths.js';
import BaseWindow from '../baseWindow.jsx';

class RegConfirmation extends Component {
    constructor(props){
        super(props);

        this.redirect = this.redirect.bind(this);
    }

    redirect(event) {
        this.props.history.push(paths.LOBBIES);
    }

    render() {
        return (
            <BaseWindow header="Registration">
                <hr />
                <div class="alert alert-success">
                    You are now <strong>registered</strong>!
                </div>
                <button type="button" className="btn btn-success mb-3 mt-2" onClick={this.redirect}>Let's play then!</button>
            </BaseWindow>
        );
    }
}

export default withRouter(RegConfirmation);