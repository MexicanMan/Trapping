import React, { Component } from 'react';

import { version } from '../config.js';

// Base window background for all menu items
class BaseWindow extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div className="row mt-5">
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4 border rounded border-dark bg-light">
                        <h3 className="mt-2">Trapping | {this.props.header}</h3>
                        {this.props.children}
                    </div>
                    <div className="col-sm-4"></div>
                </div>
                <div className="row">
                    <div className="col text-center text-muted">alpha - ver. {version}</div>
                </div>
            </div>
        );
    }
}

export default BaseWindow;