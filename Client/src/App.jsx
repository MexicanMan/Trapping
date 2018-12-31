import React, { Component } from 'react';
import Auth from './menu/auth/auth.jsx'

// Always start with auth
class App extends Component {
    render() {
        return (
            <div>
                <Auth />
            </div>
        );
    }
}

export default App;