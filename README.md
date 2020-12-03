# Solstice Society

## Project Setup

```bash
brew update && brew install pipenv # if you don't have pipenv
git clone https://github.com/Revitii/solsticesociety.git
cd solsticesociety
pipenv install # will install everything you need by reading the Pipfile
heroku git:remote -a solsticesociety # set the Heroku remote
```
And you're done. It'll install all the dependencies you need and set the remote for Heroku.

```bash
pipenv run python [command] [args]
```

This command uses the Python version required for the project, not necessarily yours. Always use this command when running the `python` command.

## Development

You'll need two terminals or a multiplexor

### Running Django

```bash
pipenv run python manage.py runserver # starts the server at http://127.0.0.1:8000/
```
Runs the Django Rest API server for development.  
The cleanup I did makes it easy to test in a development environment and it'll automatically use the correct settings for production when it's pushed to Heroku.

### Running React

I've hardcoded my tokens because I messed with the database a lot. Whatever edits you do, make sure the calls you make are using at least these lines of code:
```javascript
var token = '';
var url = '';

if (process.env.NODE_ENV === 'development') {
  token = '7622fb39205e7d329e8776c3fe02c7cd5a329454';
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
  this.setState({
    reservations
  });
} catch (e) {
  console.log(e);
}
```
I realized I didn't add filtering in the backend, but time filtering is a bit difficult. I don't exactly know how your frontend is looking like either, so I don't know what needs to be done. HOWEVER, this snippet of code will return all the reservations for you, so it's the bare minimum needed.

```bash
yarn start
```

Runs the app in development mode at [http://localhost:3000](http://localhost:3000) and will use the locally running Django server which is at `127.0.0.1:8000`. It's using my token I created for the development server.
<br/><br/>

Honestly that's all that's needed for the development side.

### Email

Go ahead and edit the email bodies if you want. It's in `backend/api/views.py` under `def create():` Here's the format:
```python
send_mail(
    subject,
    body,
    sender,
    [receivers],
    error
)
```
I have two mailing lists right now, `dev_email` and `production_email`. You can add your email to the `dev_email` list if you wanna receive emails while testing. When we're 100% done, we'll switch it to `production_email`.

## Deployment

You already know how it works better than me, but I'm too invested in this `README.md` to stop
```bash
git add .
git status # Can never hurt
git commit -m "commit message"
git push heroku master
```

# API

## The Model

This is the `Reservation` class which everything revolves around:
```python
class Reservation(models.Model):
    name = models.CharField(max_length=50)
    email = models.EmailField()
    start = models.DateTimeField()
    end = models.DateTimeField()
    phone = models.CharField(max_length=10)
    amount_paid = models.DecimalField(max_digits=7, decimal_places=2, default=0.00)
    payment_method = models.CharField(max_length=15, default='')
```

<br/>

This is the expected input and if/how they're validated:
```python
name:           'Shaheer Mirza'             # max length
email:          'shaheermirzacs@gmail.com'  # validated
start:          '%m-%d-%Y %H:%M'            # 10-25-2006 14:30, validated
end:            '%m-%d-%Y %H:%M'            # 10-25-2006 14:30, validated
phone:          '8326230049'                # validated by length
amount_paid:    '99999.99'                  # max value
payment_method: 'MasterCard'                # can be validated by acceptable choices

```

<br/>

Typical JSON example:
```json
[
    {
        "url": "http://127.0.0.1:8000/api/reservations/1/",
        "id": 1,
        "start": "11-10-2020 13:00",
        "end": "11-10-2020 15:00",
        "name": "Shaheer Mirza",
        "email": "ectomoplys@gmail.com",
        "phone": "8326230049",
        "amount_paid": "100.00",
        "payment_method": "MasterCard"
    },
]
```

## Endpoints
```bash
GET https://solsticesociety.herokuapp.com/api/reservations/
# Returns list of Reservations

POST https://solsticesociety.herokuapp.com/api/reservations/
# Adds a Reservation and sends the email right away

DELETE https://solsticesociety.herokuapp.com/api/reservations/<id>/
# Deletes a Reservation given an id (Trailing slash is important!)

https://solsticesociety.herokuapp.com/
# The frontend :)
```

## Responses
```http
409 Conflict
```
### Messages
#### `Time Conflict: (Start|End) Time Conflict`
Returned when the `start` or `end` arguments conflict with other reservations
#### `Time Conflict: End must be greater than Start`
Returned when `end < start`
#### `Time Conflict: Minimum 1 hour required`
Returned when `end == start`


## TODO
* Query Filtering
    * Less load on the client, but I don't think it's too necessary right now if the front end can handle it
* Better Security  
    * I had to have `CORS_ORIGIN_ALLOW_ALL = True`, but I don't like that at all. Can't get it to work otherwise.
    * Ideally, the Django server would only allow requests from `https://solsticesociety.herokuapp.com`
* Automated Tests
    * This is a no brainer since we're becoming more official with better projects
* Better deployment and a more surefire way to test production
    * It was insanely annoying to test production behavior especially with the HTTPS and CORS issues I was having.
    * Build -> Collect Static Files -> Deploy -> Validate Release
        * Took too long
    * I eventually figured out a way locally, but even then it wasn't a for sure solution
    * This would make security fixes and updates much more tolerable with less downtime
    * NASA had two stages - pre production and production. Pre production had a waitlist of builds, so if we finished a build today it wouldn't go into production by next year
        * All companies have stages like this, but only NASA takes so long because we need unbreakable and rigorously tested code
