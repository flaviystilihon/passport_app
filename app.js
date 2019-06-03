const express = require('express');
const indexRouter = require('./routers/index');
const usersRouter = require('./routers/users');
const flash = require('connect-flash');
const session = require('express-session');

const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/users", {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("MongoDB has been connected");
});

const app = express();
const expressLayouts = require('express-ejs-layouts');


//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Bodyparser
app.use(express.urlencoded({extended: false}));

// Express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Connect flash
app.use(flash());


// Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
})


app.use('/', indexRouter);
app.use('/users', usersRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));