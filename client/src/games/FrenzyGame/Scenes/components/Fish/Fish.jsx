import {Sprite} from "pixix";
import React from 'react'
import PixiX from "pixix";
import {AddHeadingZero} from "../../../../../utils/utils";

export default class Block extends PixiX.Component {
  render() {
    return (
      <Sprite anchor={{x: 0.5, y: 0.5}} src={`@img/fish_${AddHeadingZero(this.props.type, 2)}`} scale={{x: 1, y: 1 }}/>
    );
  }
}