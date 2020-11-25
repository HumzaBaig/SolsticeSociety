import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import LoadingScreen from '../Loading/Loading';
import LiveCalendar from '../Calendar/Calendar';
import ImageSlider from '../ImageSlider/ImageSlider';
import TimePickerDropdown from '../TimePickerDropdown/TimePickerDropdown';
import InformationSection from '../Information/Information';
import CheckoutForm from '../CheckoutForm/CheckoutForm';

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from '@stripe/react-stripe-js';
import { getReservations,setReservation } from '../../services/reservation';
import { queryAllByAltText } from '@testing-library/react';

// const stripePromise = loadStripe('pk_test_51HkymfIVc7a48SipnejreYlgXjWDgmVvWzmXEqMCvcgoLFYlK4nh3exRM1EybKy59gLkZpl0ZSPfNwMhGA9dh4cx004iOS5hhO');
const stripePromise = loadStripe('pk_live_51HkymfIVc7a48Sipa98kFzvDeTwBGAgnN618VcC0tWB3Jyam0j8Ix4x4ILx3zDPxHsqDRRkiwh1y6tditWfnhlBH00yZ43EkUK');
const App = () => {
  const isInitialMountForm = useRef(true); // reference to make sure form validation doesn't run on initial render

  const [loading, setLoading] = useState(true)
  const [allReservations, setAllReservations] = useState([]);
  const [currentDate, setCurrentDate] = useState({});
  const [currentStart, setCurrentStart] = useState({});
  const [currentEnd, setCurrentEnd] = useState({});

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [total, setTotal] = useState();

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [numberError, setNumberError] = useState('');

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);

    if (query.get("success")) {
      setIsOpen(true);
    }

    if (query.get("canceled")) {
      setIsOpen(false);
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

    var startDateTime = new Date(currentDate.startMonth + "-" + currentDate.startDay + "-" + currentDate.startYear + " " + currentStart.startTime);
    var endDateTime = new Date(currentDate.endMonth + "-" + currentDate.endDay + "-" + currentDate.endYear + " " + currentEnd.endTime);

    hours = Math.abs(startDateTime - endDateTime) / (1000 * 60 * 60);
    if (hours >= 4 ) {
      total = 1300.00 + ((hours - 4) * 200);
      total = "$" + total;
    } else {
      total = "Minimum reservation is 4 hours";
    }

    setTotal(total);
  }, [currentDate, currentEnd, currentStart]);


  const formValidation = () => {
    var regex = /[^\s@]+@[^\s@]+\.[^\s@]+/;

    if (name === "") {
      setNameError('Name cant be blank!');
    }
    if (email === "") {
      setEmailError('Email cant be blank!');
    }
    if (number === "") {
      setNumberError('Phone Number cant be blank!');
    }
    if (number.length !== 10) {
      setNumberError('This is not a valid phone number!');
    }
    if (regex.test(email)) {
      setEmailError('This is not a valid email address!');
    }
  }

  useEffect(() => {
    if (isInitialMountForm) {
      isInitialMountForm.current = false;
      return;
    }

    formValidation();

  }, [name, email, number]);

  const safariRenderHack = { opacity: total % 2 ? 1 : 0.99 };

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
                  { nameError && <p>{nameError}</p> }
                  <input
                    type="email"
                    className="input-box"
                    placeholder="example@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                { emailError && <p>{emailError}</p> }
                  <input
                    type="text"
                    className="input-box"
                    placeholder="(555) 555-5555"
                    value={number}
                    onChange={e => setNumber(e.target.value)}
                  />
                { numberError && <p>{numberError}</p> }
                  <div className="description" style={safariRenderHack}>
                    <h3 className="total-tag">Total Price:</h3>
                    <h5 className="total-price">{total}</h5>
                  </div>
                  <Elements stripe={stripePromise}>
                    <CheckoutForm
                      name={name}
                      email={email}
                      phone={number}
                      date={currentDate}
                      start={currentStart}
                      end={currentEnd}
                    />
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
