 
require('dotenv').config();
const app = require('express')();
const cors = require('cors')
const bodyParser = require("body-parser");
const routerAuth = require('./routes/auth');

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/auth', routerAuth);
// app.use('/user', routerUser);

module.exports = app;
