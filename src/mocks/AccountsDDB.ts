import { DynamoDB } from "aws-sdk";
import { Account, AccountImpl, Accounts, IdGenerator } from "..";
import { v4 as uuid } from "uuid";

export class AccountsDDB implements Accounts {
  constructor(private ddb: DynamoDB, private nextId: IdGenerator) {}

  async create(): Promise<Account> {
    await this.ddb.putItem({
      Item: {
        AccountId: {
          S: this.nextId(),
        },
        Balance: {
          N: "0",
        },
      },
      TableName: "Accounts",
    }).promise();
    return new AccountImpl(uuid());
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
