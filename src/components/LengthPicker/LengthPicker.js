import './LengthPicker.css';
import React, { useState } from 'react';
import Select from 'react-select';

const LengthPicker = ({ setCurrentLength, currentLength }) => {
  const options = [
                    { value: 4, label: "4 Hours" },
                    { value: 6, label: "6 Hours" },
                    { value: 8, label: "8 Hours" }
                  ];

  const [isDisabled, setDisabled] = useState(false);

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      width: 110,
      borderTopWidth: 0,
      borderRightWidth: 0,
      borderLeftWidth: 0,
      borderBottomWidth: 2,
    }),
    indicatorSeperator: (provided, state) => ({
      ...provided,
      display: none
    }),
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
