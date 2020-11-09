import logo from './logo.svg';
import React, { Component } from 'react';
import './App.css';

class App extends Component {
  state = {
    reservations: []
  };

  async componentDidMount() {
    try {
      // const res = await fetch('http://solsticesociety.herokuapp.com/api/registrations/');
      const res = await fetch('http://127.0.0.1:8000/api/reservations/',
      {
        method: 'get',
        headers: new Headers({
          'Authorization': 'Token c11f78e06af03d2d8c481de4ee0c69603d1014ca'
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
    // console.log(this.state.reservations);
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