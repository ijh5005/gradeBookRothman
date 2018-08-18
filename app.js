const express = require('express');
const app = express();
var bodyParser = require('body-parser');

//database
const mongoose = require('mongoose');
const db = require('./config/config').db;
mongoose.connect(db, () =>  console.log('database connected'));

//routes
const router = require('./routes/api');

//middleware
// create application/json parser
var jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(jsonParser);
app.use(urlencodedParser);
app.use('/', router);
app.use(express.static('public'));

//run app
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});
