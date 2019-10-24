const express = require('express');
const session = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const dotenv = require('dotenv');


const userInViews = require('./lib/middleware/userInViews');
const authRouter = require('./routes/auth');
const indexRouter = require('./routes');

const app = express();
// Load environment variables from .env
dotenv.config();
// config express-session
const sess = {
  secret: 'CHANGE THIS TO A RANDOM SECRET',
  cookie: {},
  resave: false,
  saveUninitialized: true
};

if (app.get('env') === 'production') {
  // Use secure cookies in production (requires SSL/TLS)
  sess.cookie.secure = true;

  // Uncomment the line below if your application is behind a proxy (like on Heroku)
  // or if you're encountering the error message:
  // "Unable to verify authorization request state"
  // app.set('trust proxy', 1);
}



// Load Passport

// Configure Passport to use Auth0
const strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL:
    process.env.AUTH0_CALLBACK_URL || 'http://localhost:4000/callback'
  },
  function (accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null, profile);
  }
  );
  
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

app.use(session(sess));
passport.use(strategy);

app.use(passport.initialize());
app.use(passport.session());

app.use(userInViews());
app.use(authRouter);
app.use(indexRouter);


app.listen(4000, () => console.log('running on port 4000'));
