const Blockchain = require('./blockchain.js');
const Wallet = require('./wallet.js');

let myCoin = new Blockchain();

// Create wallets
const myWallet = new Wallet('Victor');
const kateWallet = new Wallet('Kate', 10);
const johnWallet = new Wallet('John Doe');

// Create 2 pending transactions
myCoin.createTransaction(kateWallet, myWallet, 3);
myCoin.createTransaction(kateWallet, johnWallet, 2);

// Start mining
myCoin.minePendingTransactions(kateWallet);

// Should recevie 3 coins from kate
console.log("myWallet's balance: ", myCoin.getWalletBalance(myWallet));

// Should recevie 2 coins from kate
console.log("johnWallet's balance: ", myCoin.getWalletBalance(johnWallet));

// Should have 5(10-3-2) coins
console.log("kateWallet's balance: ", myCoin.getWalletBalance(kateWallet));
console.log("issued coins: ", myCoin.circulatingSupply);



// create 2 more transations
myCoin.createTransaction(kateWallet, myWallet, 300); // this one should fail
myCoin.createTransaction(kateWallet, johnWallet, 4);

// Start mining again
myCoin.minePendingTransactions(kateWallet);

// Should have 3 coins
console.log("myWallet's balance: ", myCoin.getWalletBalance(myWallet));

// Should have 6(2+4) coins
console.log("johnWallet's balance: ", myCoin.getWalletBalance(johnWallet));

// Should be 51, 1(owned) + 50 rewards
console.log("kateWallet's balance: ", myCoin.getWalletBalance(kateWallet));
console.log("issued coins: ", myCoin.circulatingSupply);
