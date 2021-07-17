export type AccountId = string

export interface Accounts {
  create(): Promise<Account>;
  save(...accounts: Account[]): Promise<void>;
  /**
   * Get an account
   * @param id The id of the account to retrieve
   * @throws Error("AccountNotFound") if the given ID does not exist
   */
  get(id:string): Promise<Account>;
}

export interface Account {
  id: AccountId;
  balance: number;
  deposit: (amount: number) => Account;
  withdraw: (amount: number) => Account;
  transfer: (amount: number, to: Account) => Account;
}

export type IdGenerator = () => AccountId
