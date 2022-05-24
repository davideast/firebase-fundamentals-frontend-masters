import { seedUsersForFirestore } from '../../seed/users';
import { seedExpensesDernormalized } from '../../seed/expenses';

seedUsersForFirestore().then(seedExpensesDernormalized);
