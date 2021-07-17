import { DynamoDB } from "aws-sdk"
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { expect,  } from "chai"
import { Accounts } from ".."
import { AccountsDDB } from "../domain/AccountsDDB"
import { AccountsDDBDocumentClient } from "../domain/AccountsDDBDocumentClient";
import { id } from "../IdGenerator"
import { AccountsInMemory } from "./AccountsInMemory"


export function suite(accounts:Accounts){
  describe("Accounts", () => {
    describe("#create()", () => {
      it("should create a new account", async () => {
        const account = await accounts.create()

        expect(account.balance).to.equal(0)
      })

      it("should create unique accounts", async () => {

        const accountsToCreate = 100

        var createRequests = []
        for(var i=0; i<accountsToCreate;i++){
          createRequests.push(accounts.create())
        }
        const generatedAccounts = await Promise.all(createRequests)

        var generatedIds = new Set()
        generatedAccounts.forEach(acc => generatedIds.add(acc.id))
        
        expect(generatedIds.size).to.equal(accountsToCreate)
      })

      it("should save the created account", async () => {
        // When
        const acc = await accounts.create()

        // Then
        const savedAcc = await accounts.get(acc.id)

        expect(savedAcc.id).to.equal(acc.id)
      })
    })

    describe("#save()", () => {
      
      it("should update a previous account", async () => {
        // Given
        const acc = await accounts.create()
        acc.deposit(500)

        
        // When 
        await accounts.save(acc)
        
        // Then
        const savedAcc = await accounts.get(acc.id)
        expect(savedAcc.balance).to.equal(acc.balance)
        
      })
      
      it("should update multiple accounts", async () => {
        const acc1 = await accounts.create()
        const acc2 = await accounts.create()
        
        acc1.deposit(50)
        acc1.deposit(25)
        
        // When
        await accounts.save(acc1,acc2)
        
        //Then
        const saved1 = await accounts.get(acc1.id)
        expect(saved1.balance).to.equal(acc1.balance)
        const saved2 = await accounts.get(acc2.id)
        expect(saved2.balance).to.equal(acc2.balance)

      })
    })

    describe("#get()", () => {
      it("should throw an error if the account does not exist", async () => {
        try{
          await accounts.get("unknownId")
          throw new Error("error not thrown")
        }catch(err){
          expect(err.message).to.equal("AccountNotFound: unknownId")
        }
      })

      it("should get a saved account", async () => {

        // Given
        const acc = await accounts.create()

        // when
        const returnedAcc = await accounts.get(acc.id)

        //then
        expect(returnedAcc.id).to.equal(acc.id)
        expect(returnedAcc.balance).to.equal(acc.balance)
      })
      
    })
  })
}

// Test the implementations of the specification 

// Fake implementation
suite(new AccountsInMemory())

// Integration test for real implementation
suite(new AccountsDDB(new DynamoDB({
  region: "ap-southeast-2"
}), id))

// Integration test for refactoring to use DynamoDB Document Client
suite(new AccountsDDBDocumentClient(new DocumentClient({
  region: "ap-southeast-2"
}), id))