import { seedUsersForFirestore } from '../../../seed/users';
import { seedExpensesInlineUid, seedExpensesUnderUid } from '../../../seed/expenses';

seedUsersForFirestore().then(async users => {
  await seedExpensesInlineUid(users);
  await seedExpensesUnderUid(users)
});
