import { seedUsersForFirestore } from '../../seed/users';
import { seedExpensesInlineUid } from '../../seed/expenses';

seedUsersForFirestore().then(seedExpensesInlineUid);
