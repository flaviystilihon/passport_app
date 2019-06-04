const express = require('express');
const indexRouter = require('./routers/index');
const usersRouter = require('./routers/users');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

var MongoDBSessionStore = require('connect-mongodb-session')(session);

// Passport config
require('./config/passport')(passport);

const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/users", {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("MongoDB has been connected");
});

const app = express();
const expressLayouts = require('express-ejs-layouts');

var store = new MongoDBSessionStore({
  uri: 'mongodb://localhost:27017/session_storage',
  collection: 'mySessions'
});

// Catch errors
store.on('error', function(error) {
  console.log(error);
});

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Bodyparser
app.use(express.urlencoded({extended: false}));

// Express session
app.use(session({
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    store: store,
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());


// Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})


app.use('/', indexRouter);
app.use('/users', usersRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));