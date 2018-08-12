import React from "react"
import PropTypes from 'prop-types';

require("style-loader!./Header.scss");

export const HeaderHighlight = ({className, children, inverted}) => {
  return (
    <div className={`widget__header-highlight ${className} ${inverted ? 'inverted': ''}`}>
      {children}
    </div>
  );
};

export const HeaderNormal = ({className, children, inverted, size}) => {
  return (
    <div className={`widget__header-normal ${className} ${inverted ? 'inverted': ''} ${size}`}>
      {children}
    </div>
  );
};