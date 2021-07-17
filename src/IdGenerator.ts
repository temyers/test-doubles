import { v4 as uuid } from "uuid";
import { AccountId } from ".";

export function id(): AccountId {
  return uuid()
}