import React from "react"
import PropTypes from 'prop-types';

require("style-loader!./Input.scss");


export class Input extends React.Component {
  constructor(props) {
    super(props);
  }

  getValue() {
    return this.input.value;
  }

  render() {
    let {value, type, placeholder, label, disabled, size, onChange, inverted} = this.props;

    return (
      <div className={`widget__input ${inverted ? 'inverted' : ''} ${size}`}>
        <label>{label}</label>
        <input type={type} disabled={disabled} defaultValue={value} placeholder={placeholder}
               onChange={(e) => {onChange && onChange(e.target.value)}}
               ref={(input) => this.input = input}/>
      </div>
    )
  }

}

Input.defaultProps = {
  disabled: false,
  label: '',
  value: '',
  placeholder: '',
  type: 'text',
  inverted: false,
  size: '',
};

Input.propTypes = {
  label: PropTypes.any,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  color: PropTypes.string,
  img: PropTypes.string,
  size: PropTypes.string,
  disabled: PropTypes.bool,
  type: PropTypes.string,
  onChange: PropTypes.func,
  inverted: PropTypes.bool,
};
