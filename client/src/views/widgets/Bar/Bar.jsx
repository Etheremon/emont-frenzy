import React from "react"
import PropTypes from 'prop-types';

require("style-loader!./Bar.scss");

export const BarPercentage = ({percentage, text, color, className}) => {
  return (
    <div className={`widget__bar-percentage ${className} widget__bar-percentage__${color}`}>
      <div className={'widget__bar-percentage__bar'}/>
      <div className={'widget__bar-percentage__perc'} style={{right: `${100-percentage}%`}}/>
      {
        text ? <div className={'widget__bar-percentage__text'}>{text}</div> : null
      }
    </div>
  );
};