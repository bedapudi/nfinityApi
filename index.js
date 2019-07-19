
var express = require('express');
var app = express();
const api = require('./api')
app.use('/',api);