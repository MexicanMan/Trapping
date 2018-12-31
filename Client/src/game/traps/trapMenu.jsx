import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as gameActions from '../../actions/gameActions.jsx';
import * as traps from './trapTypes.js';
import { SizeMe } from 'react-sizeme'

class TrapMenu extends Component {
    constructor(props){
        super(props);

        this.getTrapSprite = this.getTrapSprite.bind(this);
        this.getTrapName = this.getTrapName.bind(this);
        this.chooseTrap = this.chooseTrap.bind(this);
    }

    chooseTrap(trap) {
        if (trap.count > 0 && this.props.phase == 1)
            this.props.actions.chooseTrap(trap.type);
    }

    getTrapSprite(type) {
        switch (type) {
            case traps.IceBomb:
                return 'img/traps/ice-bomb.png';
            case traps.WolfPit:
                return 'img/traps/wolf-pit.png';
        }
    }

    getTrapName(type) {
        switch (type) {
            case traps.IceBomb:
                return 'Ice bomb';
            case traps.WolfPit:
                return 'Wolf pit';
        }
    }

    render() {     
        return (
            <div className="col-sm-2 pl-1 pr-1">
                <table className="table table-hover">
                    <tbody>
                        {this.props.traps.map((trap) => (
                            <tr id={trap.type} onClick={this.chooseTrap.bind(this, trap)}>
                                <SizeMe render={({ size }) => <td className="col-sm-4"><img src={this.getTrapSprite(trap.type)} 
                                    height={size.width >= 64 ? 64 : size.width}
                                    width={size.width >= 64 ? 64 : size.width} /></td>} />
                                <td className="col-sm-5">{this.getTrapName(trap.type)}</td>
                                <td className="col-sm-3">x{trap.count}</td>
                            </tr>
                        ))}
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
        traps: state.trapMenu.traps,
        phase: state.game.phase,
    };
}

export default connect(mapStateToProps, mapDispatchToProps) (TrapMenu);