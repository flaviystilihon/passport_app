const express = require('express');
const indexRouter = require('./routers/index');
const usersRouter = require('./routers/users');

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

app.use('/', indexRouter);
app.use('/users', usersRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));