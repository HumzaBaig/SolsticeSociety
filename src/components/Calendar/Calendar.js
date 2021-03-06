import './Calendar.css';
import React, { useEffect, useState, useRef } from 'react';
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import { Calendar, utils } from 'react-modern-calendar-datepicker';

const LiveCalendar = ({ allReservations, setCurrentDate }) => {
  const isInitialMount = useRef(true); // reference to make sure datetime check doesn't run on initial render

  const [selectedDay, setSelectedDay] = useState(null);

  const maximumDate = {
    year: 2050,
    month: 12,
    day: 30
  }

  const disabledDays = [
    {
      year: 2020,
      month: 12,
      day: 25,
    },
    {
      year: 2020,
      month: 12,
      day: 26,
    },
    {
      year: 2020,
      month: 12,
      day: 27,
    },
    {
      year: 2021,
      month: 1,
      day: 1,
    },
    {
      year: 2021,
      month: 1,
      day: 2,
    },
    {
      year: 2021,
      month: 1,
      day: 3,
    }
  ];

  //disable all days after earliest reservation that is after the users start day
  useEffect(() => {
    if (isInitialMount.current) {
       isInitialMount.current = false;
    } else {
      // if (!allReservations) {
      //   allReservations.some((reservation) => {
      //     let resMonth = parseInt(reservation.datetime.substring(0,2));
      //     let resDay = parseInt(reservation.datetime.substring(3,5));
      //     let resYear = parseInt(reservation.datetime.substring(6,10));
      //     let day = selectedDay.day;
      //     let month = selectedDay.month;
      //     let year = selectedDay.year;
      //
      //     if(resYear >= year) {
      //       if(resMonth >= month) {
      //         if(resDay >= day) {
      //           maximumDate.year = resYear;
      //           maximumDate.month = resMonth;
      //           maximumDate.day = resDay;
      //           return true;
      //         }
      //       }
      //     }
      //     return false;
      //   });
      // }

      setCurrentDate({
        day: selectedDay.day,
        month: selectedDay.month,
        year: selectedDay.year,
      });

    }
  }, [selectedDay]);

  return (
    <div className="center-calendar">
      <Calendar
        value={selectedDay}
        onChange={setSelectedDay}
        inputPlaceholder="Select a day"
        minimumDate={utils().getToday()}
        maximumDate={maximumDate}
        disabledDays={disabledDays}
        colorPrimary="#f9c947"
        colorPrimaryLight="rgba(249,201,71, 0.25)"
        calendarClassName="custom-calendar"
        shouldHighlightWeekends
        renderFooter={() => (
          <div style={{ padding: '0 2rem .5rem 2rem' }}>
            <p style={{ lineHeight: 1.5, fontSize: '11px' }}>
              *Special pricing for Christmas and New Years weekends. Contact us at <a href="tel:504-881-3388">(504) 881-3388</a> for more info.
            </p>
          </div>
        )}
      />
    </div>
  );
}

export default LiveCalendar;
