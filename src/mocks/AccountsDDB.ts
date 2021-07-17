import { DynamoDB } from "aws-sdk";
import { Account, Accounts, IdGenerator } from "..";
import { v4 as uuid } from "uuid";
import { AccountImpl } from "../domain/AccountImpl";

export class AccountsDDB implements Accounts {
  constructor(private ddb: DynamoDB, private nextId: IdGenerator) {}
  async get(id: string): Promise<Account> {
    throw new Error("Method not implemented.");
  }

  async create(): Promise<Account> {
    const acc = new AccountImpl(this.nextId())
    await this.save(acc)
    return acc;
  }

  async save(...accounts: Account[]): Promise<void> {
    const saveRequests = accounts.map(acc => this.ddb.putItem({
      Item: {
        AccountId: {
          S: acc.id,
        },
        Balance: {
          N: `${acc.balance}`,
        },
      },
      TableName: "Accounts",
    }).promise())
    await Promise.all(saveRequests)
  }
}
