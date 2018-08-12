import React from 'react'
import PixiX, {Container, DisplacementFilter} from "pixix";
import ScrollWrapper from "../components/ScrollWrapper/ScrollWrapper.jsx";
import Block from "../components/Block/Block.jsx";
import {
  WORLD_WIDTH,
  NUM_ROWS,
  NUM_COLS,
  IMG_FISH_SIZE,
  IMG_CELL_SIZE,
  NUMBER_OF_FISH,
  BOARD_MARGIN,
  BOARD_WIDTH
} from "../../FrenzyGameConstant";
import {rangeRandom} from "../../../../utils/utils";
import Fish from "../components/Fish/Fish.jsx";

const NUMBER_OF_DUMMY_FISH = 200;

export default class MainScene extends PixiX.Component {
  constructor(game, props) {
    super(game, props);
    this.randomFishes();
  }

  randomFishes() {
    this.fishes = [];
    for (let i = 0; i < NUMBER_OF_DUMMY_FISH; i++) {
      this.fishes.push({
        x: rangeRandom(0, NUM_COLS - 1),
        y: rangeRandom(0, NUM_ROWS - 1),
        type: rangeRandom(0, NUMBER_OF_FISH - 1)
      });
    }
  }

  renderBlockBoard() {
    let cellSize = BOARD_WIDTH / NUM_COLS;
    let scale = cellSize / IMG_CELL_SIZE.w;

    let blocks = [];
    for (let yIdx = 0; yIdx < NUM_ROWS; yIdx++) {
      for (let xIdx = 0; xIdx < NUM_COLS; xIdx++) {
        blocks.push(<Block
          x={(cellSize / 2 + xIdx * cellSize)}
          y={(cellSize / 2 + yIdx * cellSize)}
          scale={{x: scale, y: scale}}/>);
      }
    }
    return blocks;
  }

  renderFishes() {
    let fishSize = BOARD_WIDTH / NUM_COLS;
    let scale = fishSize / IMG_FISH_SIZE.w;

    return this.fishes.map((fish, idx) => {
      return <Fish x={(fishSize / 2 + fish.x * fishSize)}
                   y={(fishSize / 2 + fish.y * fishSize)}
                   scale={{x: scale, y: scale}}
                   key={idx}
                   type={fish.type} />
    });
  }

  render() {
    let rootScale = this.game.options.width / WORLD_WIDTH;
    return (
      <ScrollWrapper>
        <Container x={BOARD_MARGIN.x*rootScale} y={BOARD_MARGIN.y*rootScale} scale={{x: rootScale, y: rootScale}}>
          {this.renderBlockBoard()}
          {this.renderFishes()}
        </Container>
      </ScrollWrapper>
    );
  }
}