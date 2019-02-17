const express = require('express');
const app = express();
const port = 5000 || process.env.PORT;
const Web3 = require('web3');
const truffle_connect = require('./connection/app');
const bodyParser = require('body-parser');
const tokenizer = require('./services/tokenizer');
const responseCodes = require('./config/responseCodes')

const user = require('./routes/user')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use('/', express.static('public_static'));

app.get('/', (req, res) => {
  res.render('index')
});
app.post("/user/createNew", (req, res) => {
  let params = req.body;
  let user = {
    user_email : params.user_email,
    user_password : params.user_password,
    user_type: params.user_type,
    user_blockchain_account_token: ""
  }
  truffle_connect.web3.personal.newAccount((err , account_token )=> {
    if(!err){
      user.user_blockchain_account_token = account_token;
      const token = tokenizer.getToken(user)
      res.send([token]);
    }else {
      return ["error"];
    }
  });
});

app.post('/varifyUser' , (req , res)=> {
  let params = req.body;
  let response = {}
  tokenizer.varifyUser(params.auth_token).then((user)=> {
    response.status = responseCodes.ok;
    response.user = user;
    res.json(user);
  }).catch((err)=> {
    response = responseCodes.status = err;
    res.json(response);
  })
});

app.get('/user', (req, res) => {
  res.render('user')
});

app.post('/createContract', (req, res) => {
  truffle_connect.createContract(function (answer) {
    res.json(answer);
  });
});

// app.post('/getBalance', (req, res) => {
//   console.log("**** GET /getBalance ****");
//   console.log(req.body);
//   let currentAcount = req.body.account;

//   truffle_connect.refreshBalance(currentAcount, (answer) => {
//     let account_balance = answer;
//     truffle_connect.start(function(answer){
//       // get list of all accounts and send it along with the response
//       let all_accounts = answer;
//       response = [account_balance, all_accounts]
//       res.send(response);
//     });
//   });
// });

// app.post('/sendCoin', (req, res) => {
//   console.log("**** GET /sendCoin ****");
//   console.log(req.body);

//   let amount = req.body.amount;
//   let sender = req.body.sender;
//   let receiver = req.body.receiver;

//   truffle_connect.sendCoin(amount, sender, receiver, (balance) => {
//     res.send(balance);
//   });
// });

app.listen(port, () => {
  truffle_connect.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  console.log("Express Listening at http://localhost:" + port);
});
