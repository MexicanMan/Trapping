import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as gameActions from '../actions/gameActions.jsx';

const gameStartedTitle = "GO!";
const placeTrapTitle = "Place traps:";
const startTimeCount = 30;
const criticalTime = 10;

class PlayerList extends Component {
    constructor(props){
        super(props);

        this.state = {
            currentTime: '',
            placeTrapTitle: '',
        };

        this.intervalGameStartHandle;

        this.getPlayerColor = this.getPlayerColor.bind(this);
        this.outputPlayers = this.outputPlayers.bind(this);
        this.getTimerColor = this.getTimerColor.bind(this);
        this.tick = this.tick.bind(this);
    }

    componentDidMount() {
        this.intervalGameStartHandle = setInterval(this.tick, 1000);
        this.setState({currentTime: startTimeCount, placeTrapTitle: placeTrapTitle});
    }

    tick() {
        let currTime = this.state.currentTime;
        currTime--;
        if (currTime == 0) {
            clearInterval(this.intervalGameStartHandle);

            return this.setState({currentTime: gameStartedTitle, placeTrapTitle: ''});
        }

        return this.setState(Object.assign({}, this.state, {currentTime: currTime}));
    }

    getPlayerColor(id) {
        switch (id) {
            case 0: 
                return 'text-danger';
            case 1:
                return 'text-warning';
            default:
                return '';
        }
    }

    outputPlayers() {
        let players = [];

        for (var i = 0; i < this.props.players.length; i++) {
            let isThisPlayer = '';
            if (i == this.props.thisPlayerNo)
                isThisPlayer = 'font-weight-bold';

            players.push(<p className={`${isThisPlayer} ${this.getPlayerColor(i)}`}>{this.props.players[i]}</p>);
        }

        return players.map(player => (<tr id="Player">
            <td className="col-sm-12">{player}</td>
        </tr>));
    }

    getTimerColor() {
        if (this.state.currentTime > criticalTime)
            return 'text-success';
        else if (this.state.currentTime <= criticalTime)
            return 'text-danger';
        else 
            return '';
    }

    render() {     
        return (
            <div className="col-sm-2 pl-1 pr-1">
                <h2 className={`text-center ${this.getTimerColor()}`}>{this.state.placeTrapTitle} {this.state.currentTime}</h2>
                <table className="table">
                    <thead>
                        <tr>
                            <th className="col-sm-12"><p className="text-center">Players Online</p></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.outputPlayers()}
                    </tbody>
                </table>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {  
    return {
      actions: bindActionCreators(gameActions, dispatch)
    };
}

function mapStateToProps(state) {
    return {
        players: state.lobby.players,
        thisPlayerNo: state.lobby.thisPlayerNo,
    };
}

export default connect(mapStateToProps, mapDispatchToProps) (PlayerList);