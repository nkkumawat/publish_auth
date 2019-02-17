var express = require("express");
var router = express.Router();
var tokenizer = require('../services/tokenizer');
const truffle_connect = require('../connection/app');

router.post("/createNew", (req, res) => {
  // let params = req.body.params;
  console.log("params");
  truffle_connect.web3.personal.newAccount((account_token)=> {
    // res.send(account_token);
    console.log(account_token);
    res.send("params");
  });

});


module.exports = router;