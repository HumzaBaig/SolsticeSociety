import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import LoadingScreen from '../Loading/Loading';
import LiveCalendar from '../Calendar/Calendar';
import Video from '../VideoPlayer/VideoPlayer';
import TimePickerDropdown from '../TimePickerDropdown/TimePickerDropdown';
import InformationSection from '../Information/Information';
import CheckoutForm from '../CheckoutForm/CheckoutForm';

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from '@stripe/react-stripe-js';
import { getReservations,setReservation } from '../../services/reservation';
import { queryAllByAltText } from '@testing-library/react';

// const stripePromise = loadStripe('pk_test_51HkymfIVc7a48SipnejreYlgXjWDgmVvWzmXEqMCvcgoLFYlK4nh3exRM1EybKy59gLkZpl0ZSPfNwMhGA9dh4cx004iOS5hhO');
// const stripePromise = loadStripe('pk_live_51HkymfIVc7a48Sipa98kFzvDeTwBGAgnN618VcC0tWB3Jyam0j8Ix4x4ILx3zDPxHsqDRRkiwh1y6tditWfnhlBH00yZ43EkUK');
const App = () => {
  const isInitialMountForm = useRef(false); // reference to make sure form validation doesn't run on initial render

  const [loading, setLoading] = useState(true)
  const [allReservations, setAllReservations] = useState([]);
  const [currentDate, setCurrentDate] = useState({});
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

  useEffect(() => {
    var total = 0.00;
    var hours = 0;
  
    var startDateTime = new Date(Date.parse(currentDate.startMonth + "/" + currentDate.startDay + "/" + currentDate.startYear + " " + currentStart.startTime));
    var endDateTime = new Date(currentDate.endMonth + "/" + currentDate.endDay + "/" + currentDate.endYear + " " + currentEnd.endTime);
  
    hours = Math.abs(startDateTime - endDateTime) / (1000 * 60 * 60);
    if (hours >= 4 ) {
      total = 1300.00 + ((hours - 4) * 200);
      total = "$" + total;
    } else {
      total = "Minimum reservation is 4 hours";
    }
  
    setTotal(total);
  }, [currentDate, currentEnd, currentStart, total]);

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
              <h2 className="cta-text left-text">Starting at:</h2>
              <TimePickerDropdown setCurrentStart={setCurrentStart} startOrEnd='start' />
              <h2 className="cta-text left-text">Ending at:</h2>
              <TimePickerDropdown setCurrentEnd={setCurrentEnd} startOrEnd='end' />
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
