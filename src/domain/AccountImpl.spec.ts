import { expect } from "chai"
import { Account } from ".."
import { AccountImpl } from "./AccountImpl"

describe("Account", () => {
  var acc:Account
  
  beforeEach( () => {
    acc = new AccountImpl("12345")
  })

  it("should start with 0 balance", () => {
    expect(acc.balance).to.equal(0)
  })

  describe("#deposit", () => {
    it("should add to the account balance", () => {
      acc.deposit(50)

      expect(acc.balance).to.equal(50)
    })
  })
})