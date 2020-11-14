var token = '';
var url = '';

// Gets all the reservations from the server
export async function getReservations() {

  if (process.env.NODE_ENV === 'development') {
    token = '7622fb39205e7d329e8776c3fe02c7cd5a329454';
    url = 'http://127.0.0.1:8000/api/reservations/';
  } else {
    token = '7ce271e6cdb7c863c9fff0486adb4ceb40adc766';
    url = 'https://solsticesociety.herokuapp.com/api/reservations/';
  }

  try {
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
    return reservations
  } catch (e) {
    console.log(e);
  }
}

// Posts the reservation to the server
export async function setReservation(data) {

  if (process.env.NODE_ENV === 'development') {
    token = '7622fb39205e7d329e8776c3fe02c7cd5a329454';
    url = 'http://127.0.0.1:8000/api/reservations/';
  } else {
    token = '7ce271e6cdb7c863c9fff0486adb4ceb40adc766';
    url = 'https://solsticesociety.herokuapp.com/api/reservations/';
  }

  try {
    const res = await fetch(url,
    {
      method: 'POST',
      withCredentials: true,
      headers: new Headers({
        'Authorization': 'Token ' + token,
        'Content-Type': 'application/json'
      }),
      body: data})
      .then(function(response) {
          return response.json();
        });
  } catch (e) {
    console.log(e);
  }
}
