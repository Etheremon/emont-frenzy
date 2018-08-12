import {Button} from "pixix";
import React from 'react'
import PixiX from "pixix";

export default class Block extends PixiX.Component {
  render() {
    return (
      <Button src={'@img/cell'} anchor={{x: 0.5, y: 0.5}} scale={{x: 1, y: 1 }}/>
    );
  }
}