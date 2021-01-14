const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const config = require('./app/config');

const passport = require('./app/passport/setup');
const authRoutes = require('./app/routes/auth');
const registerRoutes = require('./app/routes/register');
const staffRouters = require('./app/routes/staff');
const volunteerRouter = require('./app/routes/volunteerRoute');

const isStaff = require('./app/routes/gaurds/is-staff.guard');
const protectRoutes = require('./app/routes/gaurds/protect-routes');

const app = express();

mongoose
  .connect('mongodb://127.0.0.1:27017/volunteer-tracking', {
    useNewUrlParser: true
  })
  .then(console.log(`MongoDB connected ${config.MONGO_URI}`))
  .catch(err => console.log(err));


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(express.static(__dirname + '/public'));

app.use(
  session({
    secret: config.secret,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
      mongooseConnection: mongoose.connection
    })
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth/login', authRoutes);
app.use('/api/auth/register', registerRoutes);
app.use('/api/auth/staff', isStaff, staffRouters);
app.use('/api/auth/volunteer', protectRoutes, volunteerRouter);
app.use('/', function (req, res) {
  res.send('Volunteer Tracking | Version: 1.0.0');
})

app.listen(config.PORT, () => console.log(`App listening on port ${config.PORT}!`));