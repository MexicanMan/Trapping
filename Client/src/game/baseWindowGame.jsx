import React, { Component } from 'react';

// Base window background for games
class BaseWindowGame extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="row mt-2 no-gutters ml-1 mr-1">
                <div className="col-sm-12 border rounded border-dark bg-light">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default BaseWindowGame;