import './App.css';
import React, { useState, useEffect } from 'react';
import LoadingScreen from '../Loading/Loading';
import LiveCalendar from '../Calendar/Calendar';
import ImageSlider from '../ImageSlider/ImageSlider';
import TimePickerDropdown from '../TimePickerDropdown/TimePickerDropdown';
import InformationSection from '../Information/Information';
import CheckoutForm from '../CheckoutForm/CheckoutForm';

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from '@stripe/react-stripe-js';
import { getReservations,setReservation } from '../../services/reservation';

const stripePromise = loadStripe('pk_live_51HkymfIVc7a48Sipa98kFzvDeTwBGAgnN618VcC0tWB3Jyam0j8Ix4x4ILx3zDPxHsqDRRkiwh1y6tditWfnhlBH00yZ43EkUK');

const App = () => {
  const [loading, setLoading] = useState(true)
  const [allReservations, setAllReservations] = useState([]);
  const [currentDate, setCurrentDate] = useState({});
  const [currentStart, setCurrentStart] = useState({});
  const [currentEnd, setCurrentEnd] = useState({});

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');

  const [isOpen, setIsOpen] = useState(false);

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
    //
    // setReservation(data);
  };

  return (
    <>
    {loading === false ? (
      <div className="App">
        {isOpen === false ? (
          <>
            <ImageSlider />
            <div className="center-content">
              <h2 className="cta-text">Make a Reservation:</h2>
              <LiveCalendar allReservations={allReservations} setCurrentDate={setCurrentDate} />
              <h2 className="cta-text left-text">Starting at:</h2>
              <TimePickerDropdown setCurrentStart={setCurrentStart} startOrEnd='start' />
              <h2 className="cta-text left-text">Ending at:</h2>
              <TimePickerDropdown setCurrentEnd={setCurrentEnd} startOrEnd='end' />
              <h2 className="cta-text left-text">User Info:</h2>
                <div className="form-box">
                  <input
                    type="text"
                    className="input-box"
                    placeholder="John Doe"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                  <input
                    type="email"
                    className="input-box"
                    placeholder="example@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                  <input
                    type="text"
                    className="input-box"
                    placeholder="0000000000"
                    value={number}
                    onChange={e => setNumber(e.target.value)}
                  />
                  <Elements stripe={stripePromise}>
                    <CheckoutForm setIsOpen={setIsOpen} />
                  </Elements>
                </div>
            </div>
          </>
        ) : (
          <>
            <ImageSlider />
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
