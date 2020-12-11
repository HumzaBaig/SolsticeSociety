import React, { useState } from 'react';
import {loadStripe} from '@stripe/stripe-js';
import {
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

import './CheckoutForm.css';

const createOptions = () => {
  return {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        fontFamily: 'Open Sans, sans-serif',
        letterSpacing: '0.025em',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#c23d4b',
      },
    }
  }
};

// const stripePromise = loadStripe('pk_test_51HkymfIVc7a48SipnejreYlgXjWDgmVvWzmXEqMCvcgoLFYlK4nh3exRM1EybKy59gLkZpl0ZSPfNwMhGA9dh4cx004iOS5hhO');
const stripePromise = loadStripe('pk_live_51HkymfIVc7a48Sipa98kFzvDeTwBGAgnN618VcC0tWB3Jyam0j8Ix4x4ILx3zDPxHsqDRRkiwh1y6tditWfnhlBH00yZ43EkUK');

const CheckoutForm = (props) => {
  // const stripe = useStripe();
  // const elements = useElements();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [partySize, setPartySize] = useState();
  const [secondaryName, setSecondaryName] = useState('');
  const [secondaryPhone, setSecondaryPhone] = useState('');

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [secondaryNameError, setSecondaryNameError] = useState('');
  const [secondaryPhoneError, setSecondaryPhoneError] = useState('');

  const handlePay = async (event) => {
    event.preventDefault();

    if (formValidated() == true) {

      const stripe = await stripePromise;

      var token = '';
      var url = '';

      try {
        if (process.env.NODE_ENV === 'development') {
          token = 'f5fb9a93aca1d7fddbffcada2b29f5dcc65a8698';
          url = 'http://127.0.0.1:8000/checkout/';
        } else {
          token = '6996b998b6edf16bd40fc2acca897d365feec0d5';
          url = 'https://solsticesociety.herokuapp.com/checkout/';
        }

        const response = await fetch(url, {
          method: 'POST',
          withCredentials: true,
          headers: new Headers({
            'Authorization': 'Token ' + token,
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify({
            email: email,
            date: props.date,
            start: props.start,
            end: props.end,
            is_weekend: props.isWeekend
          })
        });

        const session = await response.json();

        if (process.env.NODE_ENV === 'development') {
          url = 'http://127.0.0.1:8000/api/reservations/';
        } else {
          url = 'https://solsticesociety.herokuapp.com/api/reservations/';
        }

        const djangoResponse = await fetch(url, {
          method: 'POST',
          withCredentials: true,
          headers: new Headers({
            'Authorization': 'Token ' + token,
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify({
            session_id: session.id,
            name: name,
            secondary_name: secondaryName,
            party_size: partySize,
            email: email,
            start: session.start,
            end: session.end,
            phone: phone.replace(/\D/g, ''),
            secondary_phone: secondaryPhone.replace(/\D/g, ''),
            amount_paid: String(session.amount_paid / 100),
            is_weekend: session.isWeekend,
          })
        });

        if (djangoResponse.error) {
          console.log('conflict');
          alert('Schedule conflict');
          return;
        }

        var reservation = await djangoResponse.json();

        const result = await stripe.redirectToCheckout({
          sessionId: session.id,
        }).then(async (result) => {
          console.log('stripe failure');

          if (result.error) {
            if (process.env.NODE_ENV === 'development') {
              url = 'http://127.0.0.1:8000/api/reservations/' + reservation.id + '/';
            } else {
              url = 'https://solsticesociety.herokuapp.com/api/reservations/' + reservation.id + '/';
            }

            const response = await fetch(url, {
              method: 'DELETE',
              withCredentials: true,
              headers: new Headers({
                'Authorization': 'Token ' + token,
                'Content-Type': 'application/json'
              }),
            });

            alert(result.error.message);
          }
        });

      } catch (e) {
        console.log(e.message);
      }
    }
  }

  const safariRenderHack = { opacity: props.total % 2 ? 1 : 0.99 };

  const validateEmail = (s) => {
    var regex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g;
    let error = '';

    if (s === '') {
      error = 'Please provide an email';
    }
    else if (!regex.test(s)) {
      error = 'Not a valid email';
    }

    setEmailError(error);

    return error === '';
  }

  const validateName = (s, callback) => {
    let error = '';

    if (s === '') {
      error = 'Please provide a name';
    }
    else if (!(s.indexOf(' ') > 0)) {
      error = 'Provide a first and last name';
    }

    callback(error);

    return error === '';
  }

  const handlePhoneChange = (s, callback) => {
    callback(previousValue => normalizeInput(s, previousValue));
  }

  const validatePhone = (value, callback) => {
    let error = ""

    if (!value) error = "Required!"
    else if (value.length !== 14) error = "Invalid phone format. ex: (555) 555-5555";

    callback(error);

    return error === '';
  }

  const normalizeInput = (value, previousValue) => {
    // return nothing if no value
    if (!value) return value;

    // only allows 0-9 inputs
    const currentValue = value.replace(/[^\d]/g, '');
    const cvLength = currentValue.length;

    if (!previousValue || value.length > previousValue.length) {

      // returns: "x", "xx", "xxx"
      if (cvLength < 4) return currentValue;

      // returns: "(xxx)", "(xxx) x", "(xxx) xx", "(xxx) xxx",
      if (cvLength < 7) return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3)}`;

      // returns: "(xxx) xxx-", (xxx) xxx-x", "(xxx) xxx-xx", "(xxx) xxx-xxx", "(xxx) xxx-xxxx"
      return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3, 6)}-${currentValue.slice(6, 10)}`;
    }
  };

  const onPartyChange = (e) => {
    if (e === 'Party Size') {
      setPartySize(0);
    }
    else {
      setPartySize(parseInt(e, 10));
    }
  }

  const formValidated = () => {
    let n = validateName(name, setNameError);
    let sn = validateName(secondaryName, setSecondaryNameError);
    let e = validateEmail(email, setEmailError);
    let p = validatePhone(phone, setPhoneError);
    let sp = validatePhone(secondaryPhone, setSecondaryPhoneError);

    if (n && sn && e && p && sp) {
      return true;
    }

    alert('Please correct any mistakes with the input');
    return false;
  }

  return (
    <form onSubmit={handlePay}>

      <div className='input-container'>
        <input
          type="text"
          className="input-box"
          placeholder="Primary Contact Full Name"
          value={name}
          onChange={e => setName(e.target.value)}
          onBlur={e => validateName(e.target.value, setNameError)}
        />
        { nameError && <p className='error'>{nameError}</p> }
      </div>

      <div className='input-container'>
        <input
          type="email"
          className="input-box"
          placeholder="Primary Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onBlur={e => validateEmail(e.target.value, setEmailError)}
        />
        { emailError && <p className='error'>{emailError}</p> }
      </div>

      <div className='input-container'>
        <input
          type="text"
          name='phone'
          className="input-box"
          placeholder="Primary Phone"
          value={phone}
          onChange={e => handlePhoneChange(e.target.value, setPhone)}
          onBlur={e => validatePhone(e.target.value, setPhoneError)}
        />
        { phoneError && <p className='error'>{phoneError}</p> }
      </div>

      <div className='input-container select-container'>
        <select
          className='input-box'
          // value={partySize}
          onChange={e => onPartyChange(e.target.value)}
        >
          <option disabled value='0'>Party Size</option>
          <option value='1'>1</option>
          <option value='2'>2</option>
          <option value='3'>3</option>
          <option value='4'>4</option>
          <option value='5'>5</option>
          <option value='6'>6</option>
          <option value='7'>7</option>
          <option value='8'>8</option>
        </select>
      </div>

      <div className='input-container'>
        <input
          type="text"
          className="input-box"
          placeholder="Secondary Contact Full Name"
          value={secondaryName}
          onChange={e => setSecondaryName(e.target.value)}
          onBlur={e => validateName(e.target.value, setSecondaryNameError)}
        />
        { secondaryNameError && <p className='error'>{secondaryNameError}</p> }
      </div>

      <div className='input-container'>
        <input
          type="text"
          name='phone'
          className="input-box"
          placeholder="Secondary Phone"
          value={secondaryPhone}
          onChange={e => handlePhoneChange(e.target.value, setSecondaryPhone)}
          onBlur={e => validatePhone(e.target.value, setSecondaryPhoneError)}
        />
        { secondaryPhoneError && <p className='error'>{secondaryPhoneError}</p> }
      </div>

      <div className="description" style={safariRenderHack}>
        <h3 className="total-tag">Total Price:</h3>
        <h5 className="total-price">{props.total}</h5>
      </div>
      <h5 className="deposit-tag">Due now: <span className="deposit-price">${props.deposit}</span></h5>

      <center className="background-form">
        <button className="submission-button" type="submit">
          Pay
        </button>
      </center>
    </form>
  );
};

export default CheckoutForm;
