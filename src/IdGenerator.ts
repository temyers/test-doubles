import { v4 as uuid } from "uuid";
import { AccountId } from ".";

export function generate(): AccountId {
  return uuid()
}