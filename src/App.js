import logo from './logo.svg';
import React, { Component } from 'react';
import './App.css';

class App extends Component {
  state = {
    reservations: []
  };

  async componentDidMount() {
    // var devToken = '7622fb39205e7d329e8776c3fe02c7cd5a329454';
    // var prodToken = '7ce271e6cdb7c863c9fff0486adb4ceb40adc766';
    var token = '';
    var url = '';
    console.log(process.env.NODE_ENV);
    if (process.env.NODE_ENV === 'development') {
      token = '7622fb39205e7d329e8776c3fe02c7cd5a329454';
      url = 'http://127.0.0.1:8000/api/reservations/';
      console.log('here');
    } else {
      token = '7ce271e6cdb7c863c9fff0486adb4ceb40adc766';
      url = 'https://127.0.0.1:8000/api/reservations/';
      console.log('howdy');
    }

    console.log(token);
    console.log(url);
    try {
      // const res = await fetch('http://solsticesociety.herokuapp.com/api/registrations/');
      const res = await fetch(url,
      {
        method: 'GET',
        withCredentials: true,
        headers: new Headers({
          'Authorization': 'Token ' + token,
          'Content-Type': 'application/json'
        })
      });
      const reservations = await res.json();
      this.setState({
        reservations
      });
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    console.log(this.state.reservations);
    return (
      <div>
        {this.state.reservations.map(item => (
          <div key={item.id}>
          <h1>{item.name}</h1>
          </div>
        ))}
      </div>
    );
  }
}

export default App;