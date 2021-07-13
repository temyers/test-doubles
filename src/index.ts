export interface Accounts {
  create(): Account;
  save(...accounts: Account[]): void;
}

export interface Account {
  id: string
  deposit: (amount:number) => Account
  withdraw: (amount:number) => Account
  transfer: ( amount: number, to: Account) => Account
}