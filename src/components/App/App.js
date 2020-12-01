import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import LoadingScreen from '../Loading/Loading';
import LiveCalendar from '../Calendar/Calendar';
import Video from '../VideoPlayer/VideoPlayer';
import TimePickerDropdown from '../TimePickerDropdown/TimePickerDropdown';
import InformationSection from '../Information/Information';
import CheckoutForm from '../CheckoutForm/CheckoutForm';
import LengthPicker from '../LengthPicker/LengthPicker';

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from '@stripe/react-stripe-js';
import { getReservations, setReservation } from '../../services/reservation';
import { queryAllByAltText } from '@testing-library/react';

// const stripePromise = loadStripe('pk_test_51HkymfIVc7a48SipnejreYlgXjWDgmVvWzmXEqMCvcgoLFYlK4nh3exRM1EybKy59gLkZpl0ZSPfNwMhGA9dh4cx004iOS5hhO');
// const stripePromise = loadStripe('pk_live_51HkymfIVc7a48Sipa98kFzvDeTwBGAgnN618VcC0tWB3Jyam0j8Ix4x4ILx3zDPxHsqDRRkiwh1y6tditWfnhlBH00yZ43EkUK');
const App = () => {
  const [loading, setLoading] = useState(true)
  const [allReservations, setAllReservations] = useState([]);
  const [currentDate, setCurrentDate] = useState({});
  const [currentLength, setCurrentLength] = useState({ value: 4, lable: '4 Hours'});
  const [currentStart, setCurrentStart] = useState({});
  const [currentEnd, setCurrentEnd] = useState({});

  const [total, setTotal] = useState();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(async () => {
    const query = new URLSearchParams(window.location.search);

    if (query.get("success")) {
      setIsOpen(true);
    }
    else if (query.get("canceled")) {
      var token = '';
      var url = '';

      if (process.env.NODE_ENV === 'development') {
        token = 'f5fb9a93aca1d7fddbffcada2b29f5dcc65a8698';
        url = 'http://127.0.0.1:8000/api/reservations/';
      } else {
        token = '7ce271e6cdb7c863c9fff0486adb4ceb40adc766';
        url = 'https://solsticesociety.herokuapp.com/api/reservations/';
      }

      const searchUrl = url + '?search=' + query.get('canceled');

      const djangoResponse = await fetch(searchUrl, {
        method: 'GET',
        withCredentials: true,
        headers: new Headers({
          'Authorization': 'Token ' + token,
          'Content-Type': 'application/json'
        }),
      });

      const reservation = await djangoResponse.json();

      if (reservation && reservation[0]) {
        url += reservation[0].id + '/'

        const response = await fetch(url, {
          method: 'DELETE',
          withCredentials: true,
          headers: new Headers({
            'Authorization': 'Token ' + token,
            'Content-Type': 'application/json'
          }),
        });
      }

      // To attempt to hide the session id
      window.history.pushState('done', 'Solstice Society', '/');
    }
  }, [])

  //get all reservations
  useEffect(() => {
    let mounted = true;
    getReservations()
      .then(reservations => {
        if(mounted) {
          setAllReservations(reservations);
          setTimeout(() => setLoading(false), 1500)
        }
      });
      return () => mounted = false;
  }, []);


  // temporary fix to update currentEnd state (need to clear out all instances of ending time from frontend)
  useEffect(() => {
    setCurrentEnd({
      endTime: (parseInt(currentStart.startTime) + currentLength.value)
    });
  }, [currentLength, currentStart]);

  useEffect(() => {
    let total = 1300.00 + ((currentLength.value - 4) * 200);
    setTotal("$" + total);
  }, [currentDate, currentEnd, currentStart]);

  //post reservation
  const showModal = () => {
    // let data = {
    //   'name': name,
    //   'email': email,
    //   'start': currentDate.startMonth + "-" + currentDate.startDay + "-" + currentDate.startYear + " " + currentStart.startTime,
    //   'end': currentDate.endMonth + "-" + currentDate.endDay + "-" + currentDate.endYear + " " + currentEnd.endTime,
    //   'phone': number,
    //   'amount_paid': '2230.98',
    //   'payment_method': 'Mastercard'
    // }

    // setReservation(data);
  };

  return (
    <>
    {loading === false ? (
      <div className="App">
        {isOpen === false ? (
          <>
            <Video />
            <div className="center-content">
              <h2 className="cta-text">Make a Reservation:</h2>
              <LiveCalendar allReservations={allReservations} setCurrentDate={setCurrentDate} />
              <h2 className="cta-text left-text">I want to book...</h2>
              <div className="timing-container">
                <LengthPicker setCurrentLength={setCurrentLength} />
                <h3 className="timing-text"> from </h3>
                <TimePickerDropdown setCurrentStart={setCurrentStart} startOrEnd='start' />
              </div>
              <h2 className="cta-text left-text">User Info:</h2>
                <div className="form-box">
                  <CheckoutForm
                    total={total}
                    date={currentDate}
                    start={currentStart}
                    end={currentEnd}
                  />
                </div>
            </div>
          </>
        ) : (
          <>
            <Video />
            <br />
            <br />
            <br />
            <div className="form-box">
              <h2 className="cta-text success-text">Your Spot Has Been Booked!</h2>
            </div>
          </>
        )}
        <InformationSection />
      </div>
      ) : (
        <LoadingScreen />
      )}
    </>
  );
}

export default App;
