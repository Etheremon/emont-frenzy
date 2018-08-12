import React from "react"
import PropTypes from 'prop-types';
import Loading from "../Loading/Loading.jsx";
import {Icon} from "semantic-ui-react";

require("style-loader!./Button.scss");


export const ButtonIcon = ({className, name, onClick, inverted, size}) => {
  return (
    <div className={`widget__button-icon ${inverted ? 'inverted' : ''} ${size}`} onClick={() => {onClick && onClick()}}>
      <Icon name={name} />
    </div>
  );
};

export const Button = ({className, label, children, color, size, img, imgEle, handleOnClick, disabled, loading}) => {
  let imgTag = null;
  if (imgEle) imgTag = imgEle;
    else if (img) imgTag = <img src={img}/>;

  if (!loading)
    return (
      <div onClick={() => {handleOnClick && handleOnClick();}}
           className={`widget__button widget__button__${color} ${size ? `widget__button__${size}` : '' } ${img ? 'widget__button__icon' : ''} ${disabled ? 'disabled' : ''} ${className}`}>
        {imgTag}
        {label || children}
      </div>
    );
  else
    return (
      <div className={`widget__button widget__button__${color} ${size ? `widget__button__${size}` : '' } ${img ? 'widget__button__icon' : ''} ${className}`}>
        {imgTag}
        <Loading/>
      </div>
    );
};

Button.defaultProps = {
  img: null,
  color: 'blue',
  size: '',
  disabled: false,
  loading: false,
};

Button.propTypes = {
  label: PropTypes.string,
  color: PropTypes.string,
  img: PropTypes.string,
  size: PropTypes.string,
  handleOnClick: PropTypes.func,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
};


export const ButtonGroup = ({buttons}) => {
  return (
    <div className={`widget__button-group`}>
      {buttons.map((btn, idx) => (
        <div key={idx} className={`${btn.active ? 'active' : ''}`} onClick={() => btn.onClick && btn.onClick()}>
          {btn.label}
        </div>
      ))}
    </div>
  )
};

ButtonGroup.defaultProps = {
};

ButtonGroup.propTypes = {
  buttons: PropTypes.arrayOf(PropTypes.shape({
    onClick: PropTypes.func,
    label: PropTypes.string,
    active: PropTypes.bool,
  })),
};