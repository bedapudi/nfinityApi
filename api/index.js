
var express = require('express');
var api = express();
var bodyParser = require('body-parser');
api.use(bodyParser.json({limit: "10mb"}));
api.use(bodyParser.urlencoded({limit: "10mb", extended: true, parameterLimit:50000}));

const pool = require('../db')
const userController = require('../controllers/userController')

pool.getConnection(function(err, connection) {
  if(err) { 
    console.log(err); 
    return; 
  }
  connection.release()
  console.log("DB is ready. Starting the app")
  api.listen(3000);
  console.log("app started")    
});

api.get('/ping', (req, res) => {
    res.send({ ping: true });
});
api.post('/login', (req, res) => {
  userController.login(req.body.email, req.body.password).then(status => {
      res.send({loginSuccess: true});
  }).catch(error => {
    res.send({loginSuccess: false});
  });
});
api.get('/userList', (req, res) => {
  userController.getUserList().then(users => {
      res.send({ users: users });
  }).catch(error => {
    res.send({ error: error });
  });
})

module.exports = api
