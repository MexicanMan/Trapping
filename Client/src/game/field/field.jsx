import React, { Component } from 'react';
import { connect } from 'react-redux';
import Konva from 'konva';
import { bindActionCreators } from 'redux';
import { Stage, Layer, Rect } from 'react-konva';
import sizeMe from 'react-sizeme';
import * as gameActions from '../../actions/gameActions.jsx';
import Character from '../character/character.jsx';
import * as fieldTypes from './fieldTypes.js';
import * as modifierTypes from './modifierTypes.js';

class Field extends Component {
    constructor(props){
        super(props);

        this.getTileSprite = this.getTileSprite.bind(this);
        this.getModifySprite = this.getModifySprite.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseMoveOff = this.handleMouseMoveOff.bind(this);
        this.handleMouseClick = this.handleMouseClick.bind(this);
        this.drawMap = this.drawMap.bind(this);
        this.drawSelectedTile = this.drawSelectedTile.bind(this);
        this.drawModifiers = this.drawModifiers.bind(this);
        this.drawCharacters = this.drawCharacters.bind(this);
        this.drawUpperModifiers = this.drawUpperModifiers.bind(this);

        this.isSelected = false;
        this.upperModifiers = [];

        this.state = {
            selectedPos: {
                selectedX: 0,
                selectedY: 0,
            },

            fieldImg: new Image(),
            voidImg: new Image(),

            startImg: new Image(),
            finishImg: new Image(),

            iceBombImg: new Image(),
            iceImg: new Image(),
            pitOpenImg: new Image(),

            selectedImg: new Image(),
        };

        this.imageLoader();
    }

    imageLoader() {
        this.state.fieldImg.onload = () => {
            if (this.imageNode != null)
                this.imageNode.getLayer().batchDraw();
        };
        this.state.fieldImg.src = 'img/mapTiles/grass.png';

        this.state.voidImg.onload = () => {
            if (this.imageNode != null)
                this.imageNode.getLayer().batchDraw();
        };
        this.state.voidImg.src = 'img/mapTiles/empty.png';

        this.state.startImg.onload = () => {
            if (this.imageNode != null)
                this.imageNode.getLayer().batchDraw();
        };
        this.state.startImg.src = 'img/mapTiles/start.png';

        this.state.finishImg.onload = () => {
            if (this.imageNode != null)
                this.imageNode.getLayer().batchDraw();
        };
        this.state.finishImg.src = 'img/mapTiles/finish.png';

        this.state.iceBombImg.onload = () => {
            if (this.imageNode != null)
                this.imageNode.getLayer().batchDraw();
        };
        this.state.iceBombImg.src = 'img/traps/ice-bomb.png';

        this.state.iceImg.onload = () => {
            if (this.imageNode != null)
                this.imageNode.getLayer().batchDraw();
        };
        this.state.iceImg.src = 'img/ice.png';

        this.state.pitOpenImg.onload = () => {
            if (this.imageNode != null)
                this.imageNode.getLayer().batchDraw();
        };
        this.state.pitOpenImg.src = 'img/pit-open.png';

        this.state.selectedImg.onload = () => {
            if (this.imageNode != null)
                this.imageNode.getLayer().batchDraw();
        };
        this.state.selectedImg.src = 'img/mapTiles/selected.png';
    }

    getTileSprite(type) {
        switch (type) {
            case fieldTypes.Grass:
                return this.state.fieldImg;
            case fieldTypes.Void:
                return this.state.voidImg;
        }
    }

    getModifySprite(type) {
        switch (type) {
            case modifierTypes.Empty:
                return this.state.voidImg;
            case modifierTypes.Start:
                return this.state.startImg;
            case modifierTypes.Finish:
                return this.state.finishImg;
            case modifierTypes.IceBomb:
                return this.state.iceBombImg;
            case modifierTypes.Ice:
                return this.state.iceImg;
            case modifierTypes.PitOpen:
                return this.state.pitOpenImg;
        }
    }

    handleMouseMove(e, tileSize, xOffset, yOffset, mapWidth, mapHeight) {
        const mouseX = e.evt.layerX;
        const mouseY = e.evt.layerY;

        if (mouseX > xOffset && mouseX < mapWidth + xOffset && 
            mouseY > yOffset && mouseY < mapHeight + yOffset) {
            let x = Math.floor((mouseX - xOffset)/(tileSize+1));
            let y = Math.floor((mouseY - yOffset)/(tileSize+1));

            if (this.props.modifiers[y][x] != modifierTypes.Start && 
                this.props.modifiers[y][x] != modifierTypes.Finish && this.props.map[y][x] < fieldTypes.Void) {
                this.isSelected = true;
                return this.setState(Object.assign({}, this.state, {
                    selectedPos: {
                        selectedX: xOffset + x * (tileSize+1) + 1,
                        selectedY: yOffset + y * (tileSize+1) + 1,
                    },
                }));
            }
        }

        this.isSelected = false;
        return this.setState(Object.assign({}, this.state, {
            selectedPos: {
                selectedX: 0,
                selectedY: 0,
            },
        }));
    }

    handleMouseMoveOff() {
        if (this.isSelected) {
            this.isSelected = false;
            return this.setState(Object.assign({}, this.state, {
                selectedPos: {
                    selectedX: 0,
                    selectedY: 0,
                },
            }));
        }
    }

    handleMouseClick(e, tileSize, xOffset, yOffset, mapWidth, mapHeight) {
        const mouseX = e.evt.layerX;
        const mouseY = e.evt.layerY;

        if (mouseX > xOffset && mouseX < mapWidth + xOffset && 
            mouseY > yOffset && mouseY < mapHeight + yOffset) {
            let x = Math.floor((mouseX - xOffset)/(tileSize+1));
            let y = Math.floor((mouseY - yOffset)/(tileSize+1));

            if (this.props.modifiers[y][x] != modifierTypes.Start && 
                this.props.modifiers[y][x] != modifierTypes.Finish && this.props.map[y][x] < fieldTypes.Void) {
                this.props.actions.tryPlaceTrap(x, y, this.props.chosenTrap);
                this.isSelected = false;
            }
        }
    }

    drawMap(tileSize, tileScale, xOffset, yOffset) {
        let currY = -tileSize + yOffset;

        return this.props.map.map(row => {
            let currX = -tileSize + xOffset;
            currY += tileSize + 1;
            return row.map(tile => {
                currX += tileSize + 1;
                return <Rect
                    x={currX}
                    y={currY}
                    width={tileSize}
                    height={tileSize}
                    fillPatternImage={this.getTileSprite(tile)}
                    fillPatternScaleX={tileScale}
                    fillPatternScaleY={tileScale}
                    ref={node => {
                            this.imageNode = node;
                        }}
                />
            });
        })
    }

    drawModifiers(tileSize, tileScale, xOffset, yOffset) {
        let currY = -tileSize + yOffset;

        this.upperModifiers = [];
        return this.props.modifiers.map(row => {
            let currX = -tileSize + xOffset;
            currY += tileSize + 1;
            return row.map(tile => {
                currX += tileSize + 1;
                if (tile == modifierTypes.Ice) {
                    this.upperModifiers.push({x: currX, y: currY, tile: tile});
                    return null;
                } else    
                    return <Rect
                        x={currX}
                        y={currY}
                        width={tileSize}
                        height={tileSize}
                        fillPatternImage={this.getModifySprite(tile)}
                        fillPatternScaleX={tileScale}
                        fillPatternScaleY={tileScale}
                        fillPatternRepeat={'no-repeat'}
                        ref={node => {
                                this.imageNode = node;
                            }}
                    />
            });
        });
    }

    drawCharacters(tileSize, tileScale, xOffset, yOffset) {
        let chars = [];

        for (var i = 0; i < this.props.charCount; i++) {
            chars.push(<Character id={i} tileSize={tileSize} tileScale={tileScale} 
                        xOffset={xOffset} yOffset={yOffset} />);
        }

        return chars.map(char => char);
    }

    drawSelectedTile(tileSize, tileScale) {
        return <Rect
                    x={this.state.selectedPos.selectedX}
                    y={this.state.selectedPos.selectedY}
                    width={tileSize}
                    height={tileSize}
                    fillPatternImage={this.isSelected ? this.state.selectedImg : this.state.voidImg}
                    fillPatternScaleX={tileScale}
                    fillPatternScaleY={tileScale}
                    fillPatternRepeat={'no-repeat'}
                    ref={node => {
                            this.imageNode = node;
                        }}
                />
    }

    drawUpperModifiers(tileSize, tileScale) {
        return this.upperModifiers.map(modifier => {
            return <Rect
                x={modifier.x}
                y={modifier.y}
                width={tileSize}
                height={tileSize}
                fillPatternImage={this.getModifySprite(modifier.tile)}
                fillPatternScaleX={tileScale}
                fillPatternScaleY={tileScale}
                fillPatternRepeat={'no-repeat'}
                ref={node => {
                        this.imageNode = node;
                    }}
            />
        });
    }

    render() {
        const width = this.props.size.width - 4;
        const height = window.innerHeight - 100 - 2;
        let tileSize = 64; 
        let tileScale = 1;
        let xOffset = 0, yOffset = 0;

        // Scaling
        const minLen = Math.min(width, height); 
        const maxLenTile = Math.max(this.props.width, this.props.height);
        const tempTileSize = minLen/maxLenTile;
        if (tempTileSize >= 64) {
            tileSize = 64;
            tileScale = 1;
        } else if (tempTileSize >= 48 && tempTileSize < 64) {
            tileSize = 48;
            tileScale = 0.75;
        } else if (tempTileSize >= 32 && tempTileSize < 48) {
            tileSize = 32;
            tileScale = 0.5;
        } else {
            tileSize = 16;
            tileScale = 0.25;
        }
        
        // Calculatin offsets for centering
        const mapWidth = this.props.width * (tileSize + 1);
        const mapHeight = this.props.height * (tileSize + 1);
        if (width > mapWidth)
            xOffset = width/2 - mapWidth/2;
        if (height > mapHeight)
            yOffset = height/2 - mapHeight/2;

        return (
            <div className="col-sm-8 border border-bottom-0 border-top-0 border-dark">
                <Stage width={width} height={height} className="padding-1" 
                    onContentMouseMove={(e) => this.props.phase == 1 && this.props.chosenTrap != "" ? 
                        this.handleMouseMove(e, tileSize, xOffset, yOffset, mapWidth, mapHeight) : 
                        this.handleMouseMoveOff()}
                    onContentClick={(e) => this.props.phase == 1 && this.props.chosenTrap != "" ? 
                        this.handleMouseClick(e, tileSize, xOffset, yOffset, mapWidth, mapHeight) : 
                        null}>
                    <Layer>
                        <Rect 
                            x={0}
                            y={0}
                            width={width}
                            height={height}
                            fill="black"
                        />

                        {this.drawMap(tileSize, tileScale, xOffset, yOffset)}

                        {this.drawSelectedTile(tileSize, tileScale)}

                        {this.drawModifiers(tileSize, tileScale, xOffset, yOffset)}

                        {this.drawCharacters(tileSize, tileScale, xOffset, yOffset)}

                        {this.drawUpperModifiers(tileSize, tileScale)}
                    </Layer>
                </Stage>
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
        width: state.field.width,
        height: state.field.height,
        map: state.field.map,
        modifiers: state.field.modifiers,
        charCount: state.characters.charCount,
        phase: state.game.phase,
        chosenTrap: state.trapMenu.chosenTrap,
    };
}

export default connect(mapStateToProps, mapDispatchToProps) (sizeMe({ monitorHeight: true, monitorWidth: true }) (Field));