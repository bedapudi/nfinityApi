
var express = require('express');
var api = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cors = require('cors');
const basicAuth = require('../auth/basic-auth');

api.use(bodyParser.json({limit: "10mb"}));
api.use(bodyParser.urlencoded({limit: "10mb", extended: true, parameterLimit:50000}));
api.use(cookieParser());
api.use(cors());
api.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

/* api.use(function(req, res, next) {
  if(req.method == "OPTIONS"){
    res.send(200)
  } else {
    next()
  }
}) */

api.use(basicAuth)


const pool = require('../db')
const userController = require('../controllers/userController')

pool.getConnection(function(err, connection) {
  if(err) { 
    console.log(err); 
    return; 
  }
  connection.release()
  console.log("DB is ready. Starting the app")
  api.listen(3010);
  console.log("app started")    
});

api.get('/ping', (req, res) => {
    res.send({ ping: true });
});
api.post('/login', (req, res) => {
  userController.login(req.body.email, req.body.password).then(user => {
      res.send({loginSuccess: true, user:user});
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

api.post('/addUser', (req, res)=>{
  userController.addUser(req.body).then(user=>{
    res.send(user);
  }).catch(error => {
    res.send({error});
  })
})

api.post('/updateUser', (req, res)=>{
  userController.updateUser(req.body).then(result=>{
    res.send(result);
  }).catch(error => {
    res.send({error});
  })
})

api.delete('/deleteUser', (req, res)=>{
  userController.deleteUser(req.body.id).then(result=>{
    res.send(result);
  }).catch(error => {
    res.send({error});
  })
})

module.exports = api
