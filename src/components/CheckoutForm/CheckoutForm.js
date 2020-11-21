import React from 'react';
import {loadStripe} from '@stripe/stripe-js';
import {
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

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

const CheckoutForm = ({ setIsOpen }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    // Block native form submission.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const cardElement = elements.getElement(CardElement);

    // Use your card Element with other Stripe.js APIs
    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      console.log('[error]', error);
    } else {
      console.log('[PaymentMethod]', paymentMethod);
    }
  };

  // successModal on CheckoutForm button submit
  const handleSubmitTemp = (event) => {
    event.preventDefault();
    setIsOpen(true);
  };

  return (
    <form onSubmit={handleSubmitTemp}>
      <CardElement
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
      />
      <center className="background-form">
        <button className="submission-button" type="submit" disabled={!stripe}>
          Pay
        </button>
      </center>
    </form>
  );
};

export default CheckoutForm;
