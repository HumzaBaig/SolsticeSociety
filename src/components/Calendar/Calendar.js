import './Calendar.css';
import React, { useEffect, useState, useRef } from 'react';
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import { Calendar, utils } from 'react-modern-calendar-datepicker';

const LiveCalendar = ({ allReservations, setCurrentDate }) => {
  const isInitialMount = useRef(true); // reference to make sure datetime check doesn't run on initial render
  const isSecondRender = useRef(true); // reference to make sure datetime check doesn't run on initial render

  const [selectedDayRange, setSelectedDayRange] = useState({
    from: null,
    to: null
  });

  const maximumDate = {
    year: 2050,
    month: 12,
    day: 30
  }

  //disable all days after earliest reservation that is after the users start day
  useEffect(() => {
    if (isInitialMount.current) {
       isInitialMount.current = false;
       isSecondRender.current = true;
    } else {
      if (!allReservations) {
        allReservations.some((reservation) => {
          let resMonth = parseInt(reservation.datetime.substring(0,2));
          let resDay = parseInt(reservation.datetime.substring(3,5));
          let resYear = parseInt(reservation.datetime.substring(6,10));
          let startDay = selectedDayRange.from.day;
          let startMonth = selectedDayRange.from.month;
          let startYear = selectedDayRange.from.year;

          if(resYear >= startYear) {
            if(resMonth >= startMonth) {
              if(resDay >= startDay) {
                maximumDate.year = resYear;
                maximumDate.month = resMonth;
                maximumDate.day = resDay;
                return true;
              }
            }
          }
          return false;
        });
      }
    }
  }, [selectedDayRange.from]);

  useEffect(() => {
    if (isSecondRender.current) {
       isSecondRender.current = false;
    } else {
      setCurrentDate({
        startDay: selectedDayRange.from.day,
        startMonth: selectedDayRange.from.month,
        startYear: selectedDayRange.from.year,
        endDay: selectedDayRange.to.day,
        endMonth: selectedDayRange.to.month,
        endYear: selectedDayRange.to.year
      });
    }
  }, [selectedDayRange.to]);

  return (
    <div className="center-calendar">
      <Calendar
        value={selectedDayRange}
        onChange={setSelectedDayRange}
        inputPlaceholder="Select a day range"
        minimumDate={utils().getToday()}
        maximumDate={maximumDate}
        colorPrimary="#f9c947"
        colorPrimaryLight="rgba(249,201,71, 0.25)"
        calendarClassName="custom-calendar"
        shouldHighlightWeekends
      />
    </div>
  );
};

export default LiveCalendar;
