import {Rectangle, Sprite} from "pixix";
import React from 'react'
import PixiX, {Container} from "pixix";
import {
  WORLD_WIDTH, NUM_ROWS, BG_TOP_SIZE, BG_BOTTOM_SIZE, OFFSET_FOOTER_BG,
  SIZE_OF_BODY_BG, OFFSET_BODY_BG, WORLD_HEIGHT
} from "../../../FrenzyGameConstant";

export default class ScrollWrapper extends PixiX.Component {
  constructor(game, props) {
    super(game, props);
    this.onWheel = this.onWheel.bind(this);

    this.baseScale = this.game.options.width / WORLD_WIDTH;
  }

  start() {
    this.game.options.view.addEventListener("wheel", this.onWheel);
    this.maxContainerY = 0;
    this.minContainerY = - WORLD_HEIGHT * this.baseScale + this.game.options.height;
  }

  onWheel(event) {
    this.refs['mainContainer'].component.y = this.refs['mainContainer'].component.y - event.deltaY;

    if (this.refs['mainContainer'].component.y > this.maxContainerY) {
      this.refs['mainContainer'].component.y = this.maxContainerY;
    }

    if (this.refs['mainContainer'].component.y < this.minContainerY) {
      this.refs['mainContainer'].component.y = this.minContainerY;
    }
  };

  exit() {
    this.game.options.view.removeEventListener("wheel", this.onWheel);
  }

  render() {
    return (
      <Container ref='mainContainer'>
        {/*<DisplacementFilter src={'@img/clouds'} autoFit={true} ref={`displacementFilter`}/>*/}

        <Rectangle ref={'header-body'}
                   x={0} y={0}
                   width={this.game.options.width}
                   height={WORLD_HEIGHT * this.baseScale}
                   fillColor={0x217bbe} borderColor={0x217bbe}/>

        <Sprite src={`@img/header-bg`} anchor={{x: 0.5, y: 0}} ref='header-bg'
                x={this.game.options.width / 2}
                scale={{x: WORLD_WIDTH / BG_TOP_SIZE.w * this.baseScale, y: WORLD_WIDTH / BG_TOP_SIZE.w * this.baseScale}}/>

        <Sprite src={`@img/footer-bg`} anchor={{x: 0.5, y: 1}} ref='header-bg'
                x={this.game.options.width / 2}
                y={WORLD_HEIGHT * this.baseScale}
                scale={{x: WORLD_WIDTH / BG_BOTTOM_SIZE.w * this.baseScale, y: WORLD_WIDTH / BG_BOTTOM_SIZE.w * this.baseScale}}/>
        {this.props.children}
      </Container>
    );
  }
}