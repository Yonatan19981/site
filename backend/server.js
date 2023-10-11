const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const MongoStore = require('connect-mongo');
const routes = require('./routes/index');
const validPassword = require('./passport/passwordFunctions').validPassword;
const cors = require('cors');

const app = express();
const PORT = 4080;

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cors());

const User = require('./models/User');

// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shift-scheduler');
mongoose.connect('mongodb://database:27017/shift-scheduler').catch((err) => {
  console.log(err.msg);
});

// .connect(process.env.MONGODB_URI || 'mongodb://localhost/shift-scheduler')
/**
 * PASSPORT SET UP
 **/

passport.use(
  new LocalStrategy((username, password, cb) => {
    User.findOne({ username: username })
      .then((user) => {
        if (!user) {
          return cb(null, false);
        }

        const isValid = validPassword(password, user.hash, user.salt);

        if (isValid) {
          return cb(null, user);
        } else {
          return cb(null, false);
        }
      })
      .catch((err) => {
        cb(err);
      });
  })
);

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
});

app.use(
  session({
    secret: 'boterham',
    store: MongoStore.create({ mongoUrl: 'mongodb://database:27017/shift-scheduler' }),
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// PASSPORT AUTHENTICATION BEFORE ROUTES
app.use(passport.initialize());
app.use(passport.session());

// PRODUCTION BUILD
app.use(express.static('../frontend/build'));

// ROUTES
app.use(routes);

app.listen(PORT, console.log(`Server is running on http://localhost:${PORT}`));
