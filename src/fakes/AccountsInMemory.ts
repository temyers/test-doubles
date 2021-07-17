import { Account, Accounts } from "..";
import { AccountImpl } from "../domain/AccountImpl";
import { id } from '../IdGenerator'
// Fake implementation of Accounts interface
export class AccountsInMemory implements Accounts {

  accounts: AccountMap = {}

  async get(id: string): Promise<Account> {
    const account = this.accounts[id]
    if(!account) {
      throw new Error(`AccountNotFound: ${id}`)
    }
    return account
    
  }
  async create(): Promise<Account> {
    const acc = new AccountImpl(id())
    await this.save(acc)
    return acc;
  }
  async save(...accounts: Account[]): Promise<void> {
    const acc = accounts[0]
    this.accounts[acc.id] = acc
  }

}

type AccountMap = {
  [id:string]: Account
}