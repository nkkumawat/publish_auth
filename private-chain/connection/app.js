const contract = require('truffle-contract');
const add_int_artifact = require('../build/contracts/AddInteger.json');
var AddIntContract = contract(add_int_artifact);

module.exports = {
  start: function(callback) {
    var self = this;
    AddIntContract.setProvider(self.web3.currentProvider);
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
  addTwoInt: function(_a , _b, _account_token , callback) {
    var self = this;
    AddIntContract.setProvider(self.web3.currentProvider);
    var answer;
  
    AddIntContract.deployed().then(function(instance) {
      return instance.addTwoNumbers.call(_a , _b , {from : _account_token});
    }).then(function(value) {
        callback(value.valueOf());
    }).catch(function(e) {
        console.log(e);
        callback("Error 404" + e);
    });
  }
}
