import React from "react";


const imgSource = {
};

export const Img = ({className, img, onClick}) => {
  return (
    <img className={className} src={imgSource[img]} onClick={() => {onClick && onClick()}}/>
  );
};