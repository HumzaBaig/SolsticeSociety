import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import LoadingScreen from '../Loading/Loading';
import LiveCalendar from '../Calendar/Calendar';
import Video from '../VideoPlayer/VideoPlayer';
import TimePickerDropdown from '../TimePickerDropdown/TimePickerDropdown';
import ImageSliderSecond from '../ImageSlider/ImageSliderSecond';
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
  const [currentLength, setCurrentLength] = useState({ value: 4, lable: '4'});
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
            <div className="main-content">
              <div className="center">
                <h2 className="cta-text top-text">WHEN WILL YOU<br /><span className="thin-text">CLIMB ABOARD?</span></h2>
                <LiveCalendar allReservations={allReservations} setCurrentDate={setCurrentDate} />
                <h2 className="cta-text">I WANT TO<br /><span className="thin-text">RESERV<span className="ellipse">E...</span></span></h2>
                <div className="timing-container">
                  <LengthPicker setCurrentLength={setCurrentLength} />
                  <h3 className="timing-text">hours from </h3>
                  <TimePickerDropdown setCurrentStart={setCurrentStart} startOrEnd='start' />
                </div>
                <h2 className="cta-text">YOUR <span className="thin-text">INFO:</span></h2>
                <div className="form-box">
                  <CheckoutForm
                    total={total}
                    date={currentDate}
                    start={currentStart}
                    end={currentEnd}
                    />
                </div>
              </div>
              <div className="center">
                <h2 className="cta-text left-text info-title">BOAT <span className="thin-text">SPECS:</span></h2>
              </div>
              <ImageSliderSecond />
              <div className="center">
                <div className="info-container center">
                  <p className="info-text left-text">
                    47ft x 14ft (50 with the swim platform) flybridge - year 2002, 660 hsp, Carver 410 sport sedan.
                  </p>
                  <p className="info-text left-text">
                    50ft carver in beautiful condition with all of the features needed plus:
                  </p>
                  <ul className="info-text">
                    <li>Loud PA system setup with large subwoofer</li>
                    <li>LED light setup</li>
                    <li>Full bar setup</li>
                    <li>Towels, coolers, cups, plates, ice all provided</li>
                    <li>Powerful humidifiers for indoor smoking</li>
                    <li>Large 8-person lounge island with a canopy</li>
                    <li>Large gangplank</li>
                    <li>Floating beer pong</li>
                    <li>Floating hammock chairs</li>
                    <li>Floating unicorn</li>
                    <li>2 large stand-inside, walk-on-water floating balls</li>
                  </ul>
                  <p className="info-text left-text">
                    All features EXCLUSIVE to this carver only!
                  </p>
                  <p className="info-text left-text">
                    Boat comes with full service (3 crew members, 1 airplane steward) to accommodate you so you won’ t have to worry about anything but having a great time aboard!
                  </p>
                  <p className="info-text left-text">
                    * Tips are appreciated, but not mandatory *
                  </p>
                </div>
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
      </div>
      ) : (
        <LoadingScreen />
      )}
    </>
  );
}

export default App;
