export type AccountId = string

export interface Accounts {
  create(): Promise<Account>;
  save(...accounts: Account[]): Promise<void>;
}

export interface Account {
  id: AccountId;
  balance: number;
  deposit: (amount: number) => Account;
  withdraw: (amount: number) => Account;
  transfer: (amount: number, to: Account) => Account;
}

export class AccountImpl implements Account {
  constructor(public _id: string, private _balance: number = 0) {}

  get id(){
    return this._id
  }

  get balance(){
    return this._balance;
  }

  deposit(amount: number): Account {
    return this;
  }
  withdraw(amount: number): Account {
    return this;
  }
  transfer(amount: number, to: Account): Account {
    return this;
  }
}

export type IdGenerator = () => AccountId
