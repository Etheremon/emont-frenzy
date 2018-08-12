import {Sprite} from "pixix";
import React from 'react'
import PixiX from "pixix";

export default class LoadingBar extends PixiX.Component {
  constructor(game) {
    super(game);
    this.speed = 0.1;
    this.image = require('../../../../../shared/img/assets/loading.png');
  }

  update() {
    this.refs['loadingSprite'].component.rotation = this.refs['loadingSprite'].component.rotation + this.speed;
  }

  render() {
    return (
      <Sprite image={this.image} anchor={{x: 0.5, y: 0.5}} ref='loadingSprite'/>
    );
  }
}