import './App.css';
import React, { useState, useEffect } from 'react';
import LoadingScreen from '../Loading/Loading';
import LiveCalendar from '../Calendar/Calendar';
import ImageSlider from '../ImageSlider/ImageSlider';
import TimePickerDropdown from '../TimePickerDropdown/TimePickerDropdown';

import { getReservations,setReservation } from '../../services/reservation';

const App = () => {
  const [loading, setLoading] = useState(true)
  const [allReservations, setAllReservations] = useState([]);
  const [currentDate, setCurrentDate] = useState({});
  const [currentStart, setCurrentStart] = useState({});
  const [currentEnd, setCurrentEnd] = useState({});

  // useEffect(() => {
  //   console.table(currentDate)
  // }, [currentDate]);
  // useEffect(() => {
  //   console.table(currentStart)
  // }, [currentStart]);
  // useEffect(() => {
  //   console.table(currentEnd)
  // }, [currentEnd]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000)
  }, [])

  //get all reservations
  useEffect(() => {
    let mounted = true;
    getReservations()
      .then(reservations => {
        if(mounted) {
          setAllReservations(reservations);
        }
      });
      return () => mounted = false;
  }, []);

  //post reservation
  const submit = () => {
    let data = {
      'name': 'Humza Baig',
      'email': 'humza.baig2009@gmail.com',
      'start': currentDate.startMonth + "-" + currentDate.startDay + "-" + currentDate.startYear + " " + currentStart.value + ":00",
      'end': currentDate.endMonth + "-" + currentDate.endDay + "-" + currentDate.endYear + " " + currentEnd.value + ":00",
      'phone': '8325157091',
      'amount_paid': '2230.98',
      'payment_method': 'Mastercard'
    }
    setReservation(data).then(res => {
        console.log(res);
      }).then(() => {
          setCurrentDate({});
          setCurrentStart({});
          setCurrentEnd({});
        }
      );
  };

  return (
    <>
    { loading === false ? (
      <div className="App">
        <ImageSlider />
        <div className="center-content">
          <h2 className="cta-text">Make a Reservation:</h2>
          <LiveCalendar allReservations={allReservations} setCurrentDate={setCurrentDate} />
          <h2 className="cta-text left-text">Starting at:</h2>
          <TimePickerDropdown setCurrentStart={setCurrentStart} startOrEnd='start' />
          <h2 className="cta-text left-text">Ending at:</h2>
          <TimePickerDropdown setCurrentEnd={setCurrentEnd} startOrEnd='end' />
          <button className="submission-button" onClick={submit}>Reserve</button>
        </div>
      </div>
      ) : (
        <LoadingScreen />
      )}
    </>
  );
}

export default App;
