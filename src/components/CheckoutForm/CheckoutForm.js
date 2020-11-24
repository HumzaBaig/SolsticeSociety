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
  const stripe = useStripe();
  const elements = useElements();


  const handlePay = async (event) => {
    event.preventDefault();

    const stripe = await stripePromise;
    console.log(props.start);

    var token = '';
    var url = '';

    if (process.env.NODE_ENV === 'development') {
      token = '7622fb39205e7d329e8776c3fe02c7cd5a329454';
      url = 'http://127.0.0.1:8000/checkout/';
    } else {
      token = '7ce271e6cdb7c863c9fff0486adb4ceb40adc766';
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
        name: props.name,
        email: props.email,
        date: props.date,
        start: props.start,
        end: props.end,
        phone: props.phone,
      })
    });

    const session = await response.json();

    // When the customer clicks on the b utton, redirect them to Checkout
    const result = await stripe.redirectToCheckout({
      sessionId: session.id
    });

    if (result.error) {
      alert(result.error.message);
    } else {
      // console.log(token);
      if (process.env.NODE_ENV === 'development') {
        url = 'http://127.0.0.1:8000/api/reservations/';
      } else {
        url = 'https://solsticesociety.herokuapp.com/api/reservations/';
      }

      response = await fetch(url, {
        method: 'POST',
        withCredentials: true,
        headers: new Headers({
          'Authorization': 'Token ' + token,
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
          name: props.name,
          email: props.email,
          start: session.start,
          end: session.end,
          phone: props.phone,
          amount_paid: session.amount_paid,
          payment_method: '',
        })
      });

      if (result.error) {
        alert(result.error.message);
      }
    }
  }

  return (
    <form onSubmit={handlePay}>
      {/* <CardElement
        options={{
          style: {
            base: {
              fontSize: '18px',
              color: '#424770',
              fontFamily: 'Homepage Baukasten-Book, sans-serif',
              letterSpacing: '0.025em',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#c23d4b',
            },
          },
        }}
      /> */}
      <center className="background-form">
        <button className="submission-button" type="submit" disabled={!stripe}>
          Pay
        </button>
      </center>
    </form>
  );
};

export default CheckoutForm;
