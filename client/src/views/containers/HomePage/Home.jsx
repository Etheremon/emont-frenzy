import React from 'react';

import {connect} from "react-redux";
import {getTranslate, setActiveLanguage} from 'react-localize-redux';

import withRouter from "react-router-dom/es/withRouter";
import * as LS from "../../../services/localStorageService";
import FrenzyGame from "../../../games/FrenzyGame/FrenzyGame.jsx";

require("style-loader!./Home.scss");

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.handleLanguageChange = this.handleLanguageChange.bind(this);
  }

  componentDidMount() {
  }


  componentWillUnmount() {
  }

  handleLanguageChange(val) {
    this.props.dispatch(setActiveLanguage(val));
    LS.SetItem(LS.Fields.language, val);
  }

  componentWillUpdate(nextProps, nextState) {

  }

  componentDidUpdate() {

  }

  render() {
    let {_t} = this.props;

    return (
      <div className={'home'}>
        <FrenzyGame/>
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  return {
    _t: getTranslate(store.localeReducer),
  }
};

const mapDispatchToProps = (dispatch) => ({
  dispatch: dispatch,
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage));
