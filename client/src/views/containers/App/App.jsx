import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import { getTranslate } from 'react-localize-redux'

import { Actions } from '../../../actions/index.js'
import * as Tracker from '../../../services/tracker'

import * as LS from '../../../services/localStorageService';
import TxnBar from "../../components/bars/TxnBar/TxnBar.jsx";

import Home from '../HomePage/Home.jsx'
import FrenzyGame from "../../../games/FrenzyGame/FrenzyGame.jsx";

require("style-loader!./App.scss");


class App extends React.Component {

  constructor(props) {
    super(props);
    this.maintenance = false;
  }

  componentDidMount() {
    Tracker.VisitPage();
    if (window.rpcConnected) Tracker.EnableMetamask();

    // Check for Ether Account from window.core
    let acc = undefined, test_acc = undefined;
    window.test_account = LS.GetItem(LS.Fields.account) || undefined;

    setInterval(function() {
      if (window.account === undefined) return;

      if (window.account !== acc || window.test_account !== test_acc) {
        let selected_acc;
        if (window.account) {
          // Case new acc
          selected_acc = window.account;
          acc = window.account;
          test_acc = null;
          window.test_account = null;
        } else if (!window.account && acc) {
          // Case log out
          selected_acc = null;
          acc = window.account;
          window.test_account = null;
          test_acc = null;
        } else {
          // Case test acc
          selected_acc = window.test_account || null;
          test_acc = window.test_account;
          acc = window.account;
        }
        this.props.dispatch(Actions.auth.login(selected_acc));
        if (selected_acc)
          LS.SetItem(LS.Fields.account, selected_acc);
        else
          LS.DeleteItem(LS.Fields.account);
      }
    }.bind(this), 1000);
  }

  render () {
    return this.maintenance ? (
      <div className={'page__wrapper maintenance'}>
        <div style={{paddingTop: "80px"}}>
          <div className="ui container success message">
            <ul className="ui list">
              We are under maintenance. Please come back later!<br/>
              Check out our <a href={'https://discord.gg/umUNHvJ'} target={'_blank'}>Discord</a> for more information.<br/>
            </ul>
          </div>
        </div>
      </div>
    ) : (
      <div className={'page-wrapper'}>
        <Switch>
          <Route component={Home}/>
        </Switch>

        <TxnBar/>
      </div>
    )
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
)(App));