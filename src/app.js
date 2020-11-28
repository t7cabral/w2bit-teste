 
'use strict';
require('dotenv').config();
const express = require('express')
const path = require('path');
const cors = require('cors')
const bodyParser = require("body-parser");
const routerAuth = require('./routes/auth');
const routerUser = require('./routes/user');

const app = express();

app.use(cors())
app.use(`/${process.env.APP_STORAGE}`, express.static(path.join(__dirname, `../${process.env.APP_STORAGE}`)));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/auth', routerAuth);
app.use('/user', routerUser);

module.exports = app;
