import React from 'react'
import {Container, Scene} from "pixix";
import PixiX from "pixix";
import LoadingBar from "../components/LoadingBar/LoadingBar.jsx";
import {NUMBER_OF_FISH} from "../../FrenzyGameConstant";
import {AddHeadingZero} from "../../../../utils/utils";

export default class LoadingScene extends PixiX.Component {
  constructor(game) {
    super(game);
  }

  start() {
    PixiX.Loader.addCompleteCallback(this.completeLoading.bind(this));
    PixiX.Loader.addAsset(`header-bg`, require(`../../../../shared/img/background/bg-top.png`));
    PixiX.Loader.addAsset(`footer-bg`, require(`../../../../shared/img/background/bg-bottom.png`));
    PixiX.Loader.addAsset(`cell`, require(`../../../../shared/img/assets/cell.png`));
    for (let i = 0; i < NUMBER_OF_FISH; i++) {
      let id = AddHeadingZero(i, 2);
      PixiX.Loader.addAsset(`fish_${id}`, require(`../../../../shared/img/fishes/fish_${id}.png`));
    }
    PixiX.Loader.load();
  }

  completeLoading() {
    if (!this.isChangingScene) {
      PixiX.Loader.reset();
      this.game.changeScene('main');
      this.isChangingScene = true;
    }
  }

  render() {
    return (
      <Container>
        <LoadingBar x={this.game.options.width / 2} y={this.game.options.height / 2}/>
      </Container>
    );
  }
}