import { Account } from "../index";


export class AccountImpl implements Account {
  constructor(public _id: string, private _balance: number = 0) { }

  get id() {
    return this._id;
  }

  get balance() {
    return this._balance;
  }

  deposit(amount: number): Account {
    this._balance += amount
    return this;
  }
  withdraw(amount: number): Account {
    return this;
  }
  transfer(amount: number, to: Account): Account {
    return this;
  }
}
