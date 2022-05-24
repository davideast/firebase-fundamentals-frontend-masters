import { seedUsersForFirestore } from './users';
import { seedExpensesDernormalized } from './expenses';

export function seed() {
  return seedUsersForFirestore().then(seedExpensesDernormalized);
}
