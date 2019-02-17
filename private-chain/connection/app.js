const contract = require('truffle-contract');

const metacoin_artifact = require('../build/contracts/OnlineBooksAuthenticity.json');
var MetaCoin = contract(metacoin_artifact);

module.exports = {
  getAccounts: function(callback) {
    var self = this;
    MetaCoin.setProvider(self.web3.currentProvider);
    self.web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
       console.log("error");
        return;
      }
      if (accs.length == 0) {
        console.log("No Accounts");
        return;
      }
      self.accounts = accs;
      self.account = self.accounts[2];
      callback(self.accounts);
    });
  },
  // refreshBalance: function(account, callback) {
  //   var self = this;

  //   // Bootstrap the MetaCoin abstraction for Use.
  //   MetaCoin.setProvider(self.web3.currentProvider);

  //   var meta;
  //   MetaCoin.deployed().then(function(instance) {
  //     meta = instance;
  //     return meta.getBalance.call(account, {from: account});
  //   }).then(function(value) {
  //       callback(value.valueOf());
  //   }).catch(function(e) {
  //       console.log(e);
  //       callback("Error 404");
  //   });
  // },
  // sendCoin: function(amount, sender, receiver, callback) {
  //   var self = this;

  //   // Bootstrap the MetaCoin abstraction for Use.
  //   MetaCoin.setProvider(self.web3.currentProvider);

  //   var meta;
  //   MetaCoin.deployed().then(function(instance) {
  //     meta = instance;
  //     return meta.sendCoin(receiver, amount, {from: sender});
  //   }).then(function() {
  //     self.refreshBalance(sender, function (answer) {
  //       callback(answer);
  //     });
  //   }).catch(function(e) {
  //     console.log(e);
  //     callback("ERROR 404");
  //   });
  // },
    createContract: function( callback) {
    var self = this;
    MetaCoin.setProvider(self.web3.currentProvider);
    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.createContract( {from: '0x32B320475245069F7D629785882F5F704cE22196'});
    }).then(function(answer) {
        callback(answer);
    }).catch(function(e) {
      console.log(e);
      callback("ERROR 404");
    });
  }
}
