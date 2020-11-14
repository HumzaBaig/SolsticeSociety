import React, { useState, useEffect } from 'react';
import TimePicker from 'react-time-picker';
import './TimePickerDropdown.css'

const TimePickerDropdown = ({ setCurrentEnd, setCurrentStart, startOrEnd }) => {
  const [value, onChange] = useState('10:00');

  useEffect(() => {
    if(startOrEnd === 'start') {
      setCurrentStart({
        startTime: value
      });
    } else {
      setCurrentEnd({
        endTime: value
      });
    }
  }, [value]);

  return (
    <div>
      <TimePicker
        className="timepicker"
        onChange={onChange}
        value={value}
        maxDetail="hour"
        required={true}
        disableClock={true}
      />
    </div>
  );
}

export default TimePickerDropdown;
