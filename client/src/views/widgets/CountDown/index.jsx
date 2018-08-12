import React from "react"
import * as Utils from "../../../utils/utils.js"
import PropTypes from "prop-types";
import {getTranslate} from "react-localize-redux";
import {connect} from "react-redux";

require("style-loader!./style.css");


class CountDown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeLeft: -1,
    };
    this.updateCountDown = this.updateCountDown.bind(this);
  }

  componentDidMount() {
    this.updateCountDown(this.props);
  }

  componentWillUnmount() {
    window.clearInterval(this.countDownInterval);
  }

  componentWillReceiveProps(nextProps) {
    this.updateCountDown(nextProps);
  }

  updateCountDown(props) {
    this.setState({timeLeft: Math.max(0, props.timeLeft)});

    window.clearInterval(this.countDownInterval);
    if (props.timeLeft > 0) {
      this.countDownInterval = setInterval(() => {
        this.state.timeLeft = this.state.timeLeft - 1;
        this.setState({timeLeft: this.state.timeLeft});
        if (this.state.timeLeft <= 0) {
          window.clearInterval(this.countDownInterval);
          props.onFinish && props.onFinish();
        }
      }, 1000);
    } else {
      props.onFinish && props.onFinish();
    }
  }

  render() {
    let parsedTime = Utils.ExtractUnixTime(this.state.timeLeft);
    let {_t} = this.props;

    return !this.props.showDays
      ? (
        this.props.showHours
          ? <span className={'widget__countdown'}>{Utils.AddHeadingZero(parsedTime.days*24+parsedTime.hours, 2)} : {Utils.AddHeadingZero(parsedTime.minutes, 2)} : {Utils.AddHeadingZero(parsedTime.seconds, 2)}</span>
          : <span className={'widget__countdown'}>{Utils.AddHeadingZero((parsedTime.days*24+parsedTime.hours)*60+parsedTime.minutes, 2)} : {Utils.AddHeadingZero(parsedTime.seconds, 2)}</span>
      )
      : <span className={'widget__countdown'}>{Utils.AddHeadingZero(parsedTime.days, 2)} <span className={'widget__countdown__sub'}>{_t('txt.days')}</span>
        &nbsp;<span className={'widget__countdown__sub'}>:</span> {Utils.AddHeadingZero(parsedTime.hours, 2)} <span className={'widget__countdown__sub'}>{_t('txt.hours')}</span>
        &nbsp;<span className={'widget__countdown__sub'}>:</span> {Utils.AddHeadingZero(parsedTime.minutes, 2)} <span className={'widget__countdown__sub'}>{_t('txt.minutes')}</span>
        &nbsp;<span className={'widget__countdown__sub'}>:</span> {Utils.AddHeadingZero(parsedTime.seconds, 2)} <span className={'widget__countdown__sub'}>{_t('txt.seconds')}</span>
      </span>
    ;
  }
}

CountDown.defaultProps = {
  showDays: false,
  showHours: true,
  onFinish: undefined,
};

CountDown.propTypes = {
  timeLeft: PropTypes.number,
  showDays: PropTypes.bool,
  showHours: PropTypes.bool,
  onFinish: PropTypes.func,
};

const mapStateToProps = (store) => {
  return {
    _t: getTranslate(store.localeReducer),
  }
};

const mapDispatchToProps = (dispatch) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CountDown);
