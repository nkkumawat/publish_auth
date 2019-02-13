const express = require('express');
const app = express();
const port = 3000 || process.env.PORT;
const Web3 = require('web3');
const truffle_connect = require('./connection/app.js');
const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', express.static('public_static'));

app.get('/getAccounts', (req, res) => {
  truffle_connect.start(function (answer) {
    res.send(answer);
  })
});

app.post('/addInt', (req, res) => {
  console.log(req.body);
  let _a = req.body._a;
  let _b = req.body._b;
  let _account_token = req.body._account_token;
  
  truffle_connect.addTwoInt(_a , _b,_account_token, (_c) => {
      response = [_c]
      return res.send(response);
  });
});


app.listen(port, () => {
    truffle_connect.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    console.log("Express Listening at http://localhost:" + port);
  
});