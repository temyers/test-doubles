import { DynamoDB } from "aws-sdk";
import { Account, Accounts } from "..";

export class AccountsDDB implements Accounts {

  constructor(private ddb: DynamoDB){
    
  }

  create(): Account {
    throw new Error("Method not implemented.");
  }
  save(...accounts: Account[]): void {
    throw new Error("Method not implemented.");
  }

}