import './LengthPicker.css';
import React, { useState } from 'react';
import Select from 'react-select';

const LengthPicker = ({ setCurrentLength, currentLength }) => {
  const options = [
                    { value: 4, label: "4" },
                    { value: 6, label: "6" },
                    { value: 8, label: "8" }
                  ];

  const [isDisabled, setDisabled] = useState(false);

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      fontFamily: 'Homepage Baukasten-Book',
      fontSize: 26,
      fontWeight: 400,
      color: '#000',
      borderTopWidth: 0,
      borderRightWidth: 0,
      borderLeftWidth: 0,
      borderBottomWidth: 1,
      borderBottomColor: '#f9c947',
      borderRadius: 0,
      width: 65,
      height: 60
    }),
    singleValue: (provided, state) => ({
      ...provided,
      margin: 0
    }),
    indicatorSeparator: (provided, state) => ({
      ...provided,
      width: 0
    }),
    dropdownIndicator: (provided, state) => ({
        ...provided,
        transform: state.selectProps.menuIsOpen && 'rotate(180deg)'
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? 'rgba(249, 201, 71, 0.3)' : '#fff',
      backgroundColor: state.isSelected ? 'rgba(249, 201, 71, 0.7)' : '#fff',
      color: (state.isFocused || state.isSelected) ? '#000' : null,
    })
  }

  return (
    <Select
          className="length-picker"
          defaultValue={options[0]}
          isDisabled={isDisabled}
          isLoading={false}
          isClearable={false}
          isRtl={false}
          isSearchable={false}
          name="length"
          options={options}
          onChange={setCurrentLength}
          styles={customStyles}
        />
  );
}

export default LengthPicker;
