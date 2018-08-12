import React from "react"
import PropTypes from 'prop-types';

require("style-loader!./Divider.scss");

const ballSmall = require('../../../shared/img/assets/ball_mini.png');

export const DividerCircle = ({className, right, left, center}) => {
  let s = {};
  if (right) s = {right: 0};
  if (left) s = {left: 0};
  if (center) s = {left: '50%', transform:'translateX(-50%)'};
  return (
    <div className={`widget__divider-circle ${className}`}>
      <div className={'widget__divider-circle__line'}/>
      <div className={'widget__divider-circle__circle'} style={s}/>
    </div>
  );
};


export const DividerBall = ({className, right, left, center, img, size}) => {
  let s = {};
  if (right) s = {right: 0};
  if (left) s = {left: 0};
  if (center) s = {left: '50%', transform:'translateX(-50%)'};
  return (
    <div className={`widget__divider-ball ${className} ${size}`}>
      <img src={img ? img : ballSmall} style={s}/>
    </div>
  );
};