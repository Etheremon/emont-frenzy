import React from 'react';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { getTranslate } from 'react-localize-redux'
import PixiX from "pixix";
import LoadingScene from "./Scenes/LoadingScene/LoadingScene.jsx";
import MainScene from "./Scenes/MainScene/MainScene.jsx";

require("style-loader!./FrenzyGame.scss");


class FrenzyGame extends React.Component {
  componentDidMount() {
    this.game = PixiX.render(this.renderCanvas(), this.refs.canvas, {width: window.innerWidth, height: window.innerHeight});
    this.game.changeProps(this.props);
  }

  renderCanvas() {
    return (
      <PixiX.Game>
        <PixiX.Scene name={'loading'} component={LoadingScene} default={true}/>
        <PixiX.Scene name={'main'} component={MainScene}/>
      </PixiX.Game>
    )
  }

  render () {
    return (
      <div className={'frenzy-game'}>
        <canvas ref="canvas" className={'frenzy-game__canvas'}/>
      </div>
    );
  }
}

const mapStateToProps = (store) => ({
  _t: getTranslate(store.localeReducer),
});

const mapDispatchToProps = (dispatch) => ({
  dispatch: dispatch,
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(FrenzyGame));