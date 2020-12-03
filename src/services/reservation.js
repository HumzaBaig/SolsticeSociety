var token = '';
var url = '';

// Gets all the reservations from the server
export async function getReservations() {

  if (process.env.NODE_ENV === 'development') {
    token = 'f5fb9a93aca1d7fddbffcada2b29f5dcc65a8698';
    url = 'http://127.0.0.1:8000/api/reservations/';
  } else {
    token = '6996b998b6edf16bd40fc2acca897d365feec0d5';
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
    token = 'f5fb9a93aca1d7fddbffcada2b29f5dcc65a8698';
    url = 'http://127.0.0.1:8000/api/reservations/';
  } else {
    token = '6996b998b6edf16bd40fc2acca897d365feec0d5';
    url = 'https://solsticesociety.herokuapp.com/api/reservations/';
  }

  console.log(JSON.stringify(data));

  try {
    const res = await fetch(url,
    {
      method: 'POST',
      withCredentials: true,
      headers: new Headers({
        'Authorization': 'Token ' + token,
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(data)
    });
  } catch (e) {
    console.log(e);
  }
}
