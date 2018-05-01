module.exports = class Transaction {
  constructor(fromWallet, toWallet, amount) {
    this.fromWallet = fromWallet;
    this.toWallet = toWallet;
    this.amount = amount;
  }
}
