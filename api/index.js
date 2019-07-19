
var express = require('express');
var api = express();
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

api.get('/userList', (req, res) => {
  userController.getUserList().then(users => {
      res.send({ users: users });
  }).catch(error => {
    res.send({ error: error });
  });
})

module.exports = api
