// CSS import
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './styles/alertFix.css';
import './styles/lobbyTable.css';
import './styles/padding.css';
import './styles/text.css';

// React-redux import
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Switch , Route } from 'react-router-dom';

// App components import
import App from './App.jsx';
import Auth from './menu/auth/auth.jsx';
import Register from './menu/reg/reg.jsx';
import RegConfirmation from './menu/reg/regConfrimation.jsx';
import Lobbies from './menu/lobby/lobbies.jsx';
import NewLobby from './menu/lobby/newLobby/newLobby.jsx';
import Lobby from './menu/lobby/lobby.jsx';
import Game from './game/game.jsx';
import store from './store/store.jsx';
import history from "./history/history.js";

// Routes import
import PrivateRoute from './routes/privateRoute.jsx';
import AlreadyAuthRoute from './routes/alreadyAuthRoute.jsx';
import * as paths from './routes/Paths.js';

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <Switch>
                <AlreadyAuthRoute exact path="/" component={App} />
                <AlreadyAuthRoute path={paths.AUTH} component={Auth} />
                <AlreadyAuthRoute exact path={paths.REGISTER} component={Register} />
                <PrivateRoute path={paths.REGISTER_CONFIRM} component={RegConfirmation} />
                <PrivateRoute path={paths.LOBBIES} component={Lobbies} />
                <PrivateRoute path={paths.NEW_LOBBY} component={NewLobby} />
                <PrivateRoute path={paths.LOBBY} component={Lobby} />
                <PrivateRoute path={paths.GAME} component={Game} />
            </Switch>
        </Router>
    </Provider>, document.getElementById('root')
);