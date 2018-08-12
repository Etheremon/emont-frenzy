import React from "react"
import PropTypes from 'prop-types';
import Dropdown from "../Dropdown/Dropdown.jsx";

require("style-loader!./Select.scss");


export class Select extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: props.options.find(o => o.value === props.defaultValue) || props.options[0],
    };
    this.selected = props.options.find(o => o.value === props.defaultValue) || props.options[0];
  }

  getValue() {
    return this.selected.value;
  }

  render() {
    let {options, inverted, size, onChange, position, enableSearch} = this.props;

    return (
      <div className={`widget__select ${inverted ? 'inverted' : ''} ${size}`}>
        <Dropdown enableSearch={enableSearch} position={position} list={options.map((option) => {
          return {
            search: enableSearch ? option.search : undefined,
            content: option.label,
            onClick: () => {this.setState({selected: option}); onChange && onChange(option.value);}
          }
        })}>
          {this.state.selected.label}
        </Dropdown>
      </div>
    )
  }

}

Select.defaultProps = {
  label: '',
  children: null,
  defaultValue: '',
  inverted: false,
  size: '',
  position: undefined,
  enableSearch: false,
};

Select.propTypes = {
  label: PropTypes.any,
  children: PropTypes.any,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,
  inverted: PropTypes.bool,
  size: PropTypes.string,
  position: PropTypes.string,
  enableSearch: PropTypes.bool,
};
