
var express = require('express');
const api = require('./api')
var app = express();

app.use('/', api);