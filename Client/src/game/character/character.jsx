import React, { Component } from 'react';
import { connect } from 'react-redux';
import Konva from 'konva';
import { bindActionCreators } from 'redux';
import * as characterActions from '../../actions/characterActions.jsx';
import { Stage, Layer, Rect, Text, Circle, Line } from 'react-konva';

class Character extends Component {
    constructor(props){
        super(props);

        this.getSkinSprite = this.getSkinSprite.bind(this);

        this.state = {
            redImg: new Image(),
            yellowImg: new Image(),
            skullImg: new Image(),
        };

        this.imageLoader();
    }

    imageLoader() {
        this.state.redImg.onload = () => {
            if (this.imageNode != null)
                this.imageNode.getLayer().batchDraw();
        };
        this.state.redImg.src = 'img/players/red.png';

        this.state.yellowImg.onload = () => {
            if (this.imageNode != null)
                this.imageNode.getLayer().batchDraw();
        };
        this.state.yellowImg.src = 'img/players/yellow.png';

        this.state.skullImg.onload = () => {
            if (this.imageNode != null)
                this.imageNode.getLayer().batchDraw();
        };
        this.state.skullImg.src = 'img/skull.png';
    }

    getSkinSprite() {
        if (this.props.isDead)
            return this.state.skullImg;
        else if (this.props.id == 0)
            return this.state.redImg;
        else if (this.props.id == 1)
            return this.state.yellowImg;
    }

    render() {
        let currX = this.props.xOffset + this.props.position[0] * (this.props.tileSize + 1);
        let currY = this.props.yOffset + this.props.position[1] * (this.props.tileSize + 1);

        return (
            <Rect
                x={currX}
                y={currY}
                width={this.props.tileSize}
                height={this.props.tileSize}
                fillPatternImage={this.getSkinSprite()}
                fillPatternScaleX={this.props.tileScale}
                fillPatternScaleY={this.props.tileScale}
                fillPatternRepeat={'no-repeat'}
                ref={node => {
                        this.imageNode = node;
                    }}
            />
        );
    }
}

function mapDispatchToProps(dispatch) {  
    return {
      actions: bindActionCreators(characterActions, dispatch)
    };
}

function mapStateToProps(state, ownProps) {
    return {
        nickname: state.characters.nicknames[ownProps.id],
        position: state.characters.positions[ownProps.id],
        isDead: state.characters.isDead[ownProps.id],
    };
}

export default connect(mapStateToProps, mapDispatchToProps) (Character);