const SHA256 = require('crypto-js/sha256');
const Block = require('./block.js');
const Transaction = require('./transaction.js');

module.exports = class Blockchain {
  constructor () {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 3;
    this.pendingTransactions = [];
    this.minigReward = 50;
    this.maxCoins = {
      balance: 21000000
    };
    this.circulatingSupply = 0;
  }

  createGenesisBlock() {
    return new Block('2018-05-01', 'First transactions', '0');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransactions(minigRewardWallet) {
    // Check transation is is valid (not security at all here)
    const validPendingTransactions = this.pendingTransactions.filter(trans => {
      return this.isTransactionValid(trans.fromWallet.balance, trans.amount);
    })

    // In real world: miner choose transactions to add in block
    let newBlock =  new Block(Date.now(), validPendingTransactions);
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);

    // Remove validated transactions from pendingTransactions
    this.pendingTransactions = [];

    // Push block into blockchain
    this.chain.push(newBlock);

    // Send rewards to miner
    this.sendMiningRewards(minigRewardWallet);
  }

  createTransaction(fromWallet, toWallet, amount) {
    const newTransaction = new Transaction(fromWallet, toWallet, amount);
    this.pendingTransactions.push(newTransaction);
  }

  sendMiningRewards(minigRewardWallet) {
    const sendReward = new Transaction(this.maxCoins, minigRewardWallet, this.minigReward);
    this.pendingTransactions.push(sendReward);
    this.circulatingSupply += this.minigReward;
  }

  isTransactionValid(balance, amountSpend) {
    return balance >= amountSpend;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++){
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }

  getWalletBalance(wallet) {
    let balance = wallet.balance;

    for (const block of this.chain) {
      for (const transaction of block.transactions) {
        if (transaction.fromWallet && (transaction.fromWallet.address === wallet.address)) {
          balance -= transaction.amount;
        }

        if (transaction.toWallet && (transaction.toWallet.address === wallet.address)) {
          // console.log('in add', wallet.balance);
          balance += transaction.amount;
        }
      }
    }

    return balance;
  }
}
