const SHA256 = require("crypto-js/sha256");

class Block {
  constructor (index, timestamp, transaction, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.transaction = transaction;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce= 0;
  }

  calculateHash () {
    return SHA256(
      this.index +
      this.timestamp +
      this.previousHash +
      JSON.stringify(this.transaction) +
      this.nonce
    ).toString();
  }

  mineBlock(difficulty) {
    console.log('MINING BLOCKS...');
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log('BLOCK MINED: ' + this.hash);
  }
}

class Blockchain {
  constructor () {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 3;
  }

  createGenesisBlock() {
    return new Block(0, '2018-05-01', 'First transaction', '0');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
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
}

let myCoin = new Blockchain();

myCoin.addBlock(new Block(1, "20/07/2017", { amount: 4 }))
myCoin.addBlock(new Block(2, "20/07/2017", { amount: 40 }))

console.log('Chain is valid: ', myCoin.isChainValid());

// Modfiy block content
myCoin.chain[1].transaction = { amount: 100 };

// Add a new block without previousHash
myCoin.chain.push(new Block(4, "20/07/2017", { amount: 120 }))
console.log('Chain is valid: ', myCoin.isChainValid());
