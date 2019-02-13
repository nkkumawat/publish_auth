const contract = require('truffle-contract');
const add_int_artifact = require('../build/contracts/AddInteger.json');
var AddInt = contract(add_int_artifact);

module.exports = {
  start: function(callback) {
    var self = this;
    AddInt.setProvider(self.web3.currentProvider);
    self.web3.eth.getAccounts(function(err, accs) {
      // console.log(accs)
      if (err) {
        console.log(err);
        return;
      }
      if (accs.length == 0) {
        console.log("0 account created");
        return;
      }
      self.accounts = accs;
      self.account = self.accounts[2];
      callback(self.accounts);
    });
  },
  addTwoInt: function(_a , _b, callback) {
    var self = this;
    AddInt.setProvider(self.web3.currentProvider);
    var answer;
    // callback(_a)
    AddInt.deployed().then(function(instance) {
      answer = instance;
      return answer.addition.call(_a , _b);
    }).then(function(value) {
        callback(value.valueOf());
    }).catch(function(e) {
        console.log(e);
        callback("Error 404");
    });
  }
}
