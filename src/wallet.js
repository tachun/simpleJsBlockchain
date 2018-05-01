const SHA256 = require("crypto-js/sha256");

module.exports = class Wallet {
  constructor(owner, balance = 0) {
    this.owner = owner;
    this.balance = balance;
    this.address = this.createPublicKey();
    this.nonce= 0; // a random int for genrerate a different hash
  }

  createPublicKey() {
    this.nonce++;
    return SHA256(this.owner + Date.now() + this.nonce).toString();
  }
}
