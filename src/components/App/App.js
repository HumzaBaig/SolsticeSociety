import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import LoadingScreen from '../Loading/Loading';
import LiveCalendar from '../Calendar/Calendar';
import Video from '../VideoPlayer/VideoPlayer';
import TimePickerDropdown from '../TimePickerDropdown/TimePickerDropdown';
import ImageSliderSecond from '../ImageSlider/ImageSliderSecond';
import CheckoutForm from '../CheckoutForm/CheckoutForm';
import LengthPicker from '../LengthPicker/LengthPicker';
import Animation from '../Animation/Animation';

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from '@stripe/react-stripe-js';
import { getReservations, setReservation } from '../../services/reservation';
import { queryAllByAltText } from '@testing-library/react';

import { CgMusicSpeaker } from 'react-icons/cg';
import { HiOutlineLightBulb } from 'react-icons/hi';
import { BiDrink } from 'react-icons/bi';
import { FaUtensils, FaChair } from 'react-icons/fa';
import { GiCigarette, GiPlanks, GiUnicorn, GiGlassBall } from 'react-icons/gi';
import { GrLounge } from 'react-icons/gr';
import { TiBeer } from 'react-icons/ti';
import { RiTeamLine } from 'react-icons/ri';
import { IoAirplaneOutline } from 'react-icons/io5';

const App = () => {
  const [loading, setLoading] = useState(true)
  const [allReservations, setAllReservations] = useState([]);
  const [currentDate, setCurrentDate] = useState({});
  const [currentLength, setCurrentLength] = useState({ value: 4, lable: '4'});
  const [currentStart, setCurrentStart] = useState({});
  const [currentEnd, setCurrentEnd] = useState({});
  const [isWeekend, setIsWeekend] = useState(false);

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
        token = '6996b998b6edf16bd40fc2acca897d365feec0d5';
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
    let time = parseInt(currentStart.startTime) + currentLength.value;
    if (time > 24) {
      time -= 24;
    }

    setCurrentEnd({
      endTime: time + ":00"
    });
  }, [currentLength, currentStart]);

  useEffect(() => {
    let total;
    let dayNumber = new Date(currentDate.year, currentDate.month - 1, currentDate.day).getDay();

    if (dayNumber == 0 || dayNumber > 4) {
      setIsWeekend(true);
      total = 1500.00;
    } else {
      total = 1300.00;
    }

    total += ((currentLength.value - 4) * 200);
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
                  <h3 className="timing-text">hours at</h3>
                  <TimePickerDropdown setCurrentStart={setCurrentStart} startOrEnd='start' />
                </div>
                <h2 className="cta-text">YOUR <span className="thin-text">INFO:</span></h2>
                <div className="form-box">
                  <CheckoutForm
                    total={total}
                    date={currentDate}
                    start={currentStart}
                    end={currentEnd}
                    isWeekend={isWeekend}
                    />
                </div>
              </div>
              <div className="center">
                <h2 className="cta-text left-text">THE <span className="thin-text">GALLERY:</span></h2>
              </div>
              <ImageSliderSecond />
              <div className="center">
                <h2 className="cta-text left-text info-title">JUST A BIT<br /><span className="thin-text">ABOUT US:</span></h2>
                <div className="info-container">
                  <div className="specs-container">
                    <h3 className="left-text info-subtitle">SPECIFICATIONS:</h3>
                    <p className="info-text info-small">LENGTH</p>
                    <p className="info-text">50'/</p>

                    <p className="info-text info-small">YEAR</p>
                    <p className="info-text">2002</p>

                    <p className="info-text info-small">POWER</p>
                    <p className="info-text">660 HSP</p>

                    <p className="info-text info-small">MODEL</p>
                    <p className="info-text">Carver 410 Sport Sedan</p>
                  </div>

                  <hr className="info-divider" />

                <div className="features-container">
                  <h3 className="left-text info-subtitle">FEATURES:</h3>
                  <div className="feature-box">
                    <CgMusicSpeaker />
                    <p className="feature">Loud PA system setup with large subwoofer</p>
                  </div>
                  <div className="feature-box">
                    <HiOutlineLightBulb />
                    <p className="feature">LED light setup</p>
                  </div>
                  <div className="feature-box">
                    <BiDrink />
                    <p className="feature">Full bar setup</p>
                  </div>
                  <div className="feature-box">
                    <FaUtensils />
                    <p className="feature">Towels, coolers, cups, plates, ice all provided</p>
                  </div>
                  <div className="feature-box">
                    <GiCigarette />
                    <p className="feature">Powerful humidifiers for indoor smoking</p>
                  </div>
                  <div className="feature-box">
                    <GrLounge />
                    <p className="feature">Large 8-person lounge island with a canopy</p>
                  </div>
                  <div className="feature-box">
                    <GiPlanks />
                    <p className="feature">Large gangplank</p>
                  </div>
                  <div className="feature-box">
                    <TiBeer />
                    <p className="feature">Floating beer pong</p>
                  </div>
                  <div className="feature-box">
                    <FaChair />
                    <p className="feature">Floating hammock chairs</p>
                  </div>
                  <div className="feature-box">
                    <GiUnicorn />
                    <p className="feature">Floating unicorn</p>
                  </div>
                  <div className="feature-box">
                    <GiGlassBall />
                    <p className="feature">2 large stand-inside, walk-on-water floating balls</p>
                  </div>
                </div>

                <hr className="info-divider" />

              <div className="team-container">
                <h3 className="left-text info-subtitle">THE CREW:</h3>
                <div className="team-member-box">
                  <RiTeamLine />
                  <p className="team-member">3 Crew Members</p>
                </div>
                <div className="team-member-box">
                  <IoAirplaneOutline />
                  <p className="team-member">1 Airplane Steward</p>
                </div>
              </div>


                  <p className="tip-text">
                    * Tips are appreciated, but not mandatory
                  </p>
                  <p className="contact-text">
                    Call <a href="tel:504-881-3388">(504) 881-3388</a> if you have any questions or concerns.
                  </p>
                </div>
                <a className="revitii" href="https://www.revitii.com">Made by Revitii</a>
                <br />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="result-container">
              <Animation path="https://assets1.lottiefiles.com/datafiles/K6S8jDtSdQ7EPjH/data.json" />
              <h2 className="success-text">Thank You For Your Reservation</h2>
              <h3 className="email-reminder">You'll be recieving a confirmation email from us shortly, with all of your reservation details. Make sure to check your spam folder as well.</h3>
              <p className="success-contact contact-text">
                Call <a href="tel:504-881-3388">(504) 881-3388</a> if you have any questions or concerns.
              </p>
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
