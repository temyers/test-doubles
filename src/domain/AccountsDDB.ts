import { DynamoDB } from "aws-sdk";
import { Account, Accounts, IdGenerator } from "..";
import { v4 as uuid } from "uuid";
import { AccountImpl } from "./AccountImpl";

export class AccountsDDB implements Accounts {
  constructor(private ddb: DynamoDB, private nextId: IdGenerator) {}
  async get(id: string): Promise<Account> {
    // throw new Error("Method not implemented.");
    const response = await this.ddb.getItem({
      Key: {
        AccountId: {
          S:id
        }
      },
      TableName: "Accounts"
    }).promise()

    if(!response.Item){
      throw new Error(`AccountNotFound: ${id}`)
    }
    const balance = response.Item?.Balance?.N as string

    return new AccountImpl(id,parseInt(balance))
  }

  async create(): Promise<Account> {
    const acc = new AccountImpl(this.nextId())
    await this.save(acc)
    return acc;
  }

  async save(...accounts: Account[]): Promise<void> {
    // Not suitable for production use, but makes cleaning up in tests unnecessary
    const TTL_SECONDS = 60
    const ttl = new Date().getTime() + TTL_SECONDS
    const saveRequests = accounts.map(acc => this.ddb.putItem({
      Item: {
        AccountId: {
          S: acc.id,
        },
        Balance: {
          N: `${acc.balance}`,
        },
        TTL: {
          N: `${ttl}`
        }
      },
      TableName: "Accounts",
    }).promise())
    await Promise.all(saveRequests)
  }
}
