import { DynamoDB } from "aws-sdk";
import { Account, AccountImpl, Accounts, IdGenerator } from "..";
import { v4 as uuid } from "uuid";

export class AccountsDDB implements Accounts {
  constructor(private ddb: DynamoDB, private nextId: IdGenerator) {}

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
