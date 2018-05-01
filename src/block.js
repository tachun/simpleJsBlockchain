const SHA256 = require("crypto-js/sha256");

module.exports = class Block {
  constructor (timestamp, transactions, previousHash = '') {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0; // a random int for genrerate a different hash
  }

  calculateHash () {
    return SHA256(
      this.timestamp +
      this.previousHash +
      JSON.stringify(this.transactions) +
      this.nonce
    ).toString();
  }

  mineBlock(difficulty) {
    console.log('\n\n MINING BLOCKS...');
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log('BLOCK MINED...', `\n previousHash: ${this.previousHash} \n hash: ${this.hash}`);
  }
}
