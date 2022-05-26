import testing from "@firebase/rules-unit-testing"
import { readFileSync } from 'fs';
import test from 'ava';

const {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment,
} = testing;

let testEnv = await initializeTestEnvironment({
  projectId: 'frontend-masters-firebase',
  firestore: {
    rules: readFileSync('firestore.rules', 'utf8'),
    host: 'localhost',
    port: 8080,
  },
});

function assertPermissionDenied(t, result) {
  t.is(result.code, 'permission-denied');
}

test.before(() => {
  testEnv.clearFirestore();
})

// 1
test('An unauthenticated user fails to write to a profile', async (t) => {
  const context = testEnv.unauthenticatedContext();
  const userDoc = context.firestore().doc('users/david_123');
  const result = await assertFails(userDoc.set({ name: 'Im david', email: 'blah@email.com' }));
  assertPermissionDenied(t, result);
});

// 2
// test('An authenticated user can write their profile', async (t) => {
//   const context = testEnv.authenticatedContext('david_123');
//   const userDoc = context.firestore().doc('users/david_123');
//   const result = await assertSucceeds(userDoc.set({ name: 'Im david' }));
//   t.is(result, undefined);
// });

// 3
test('An unauthenticated user fails to write to expenses', async (t) => {
  const context = testEnv.unauthenticatedContext();
  const expensesDoc = context.firestore().doc('users/darla_999/expenses/food_102');
  const result = await assertFails(expensesDoc.set({ cost: 100, date: new Date() }));
  assertPermissionDenied(t, result);
});

// 3
test('An authenticated user can write to expenses', async (t) => {
  const context = testEnv.authenticatedContext('darla_999');
  const expensesDoc = context.firestore().doc('users/darla_999/expenses/food_102');
  const result = await assertSucceeds(expensesDoc.set({ cost: 100, categories: ['food'], date: new Date() }));
  t.is(result, undefined);
});

// 4
test('A user must have a first name and email', async (t) => {
  const context = testEnv.authenticatedContext('david_123');
  const userDoc = context.firestore().doc('users/david_123');
  const result = await assertSucceeds(userDoc.set({ 
    first: 'Im david',
    email: 'david@email.com', 
  }));
  t.is(result, undefined);
});

// 5
test('An expense must have a cost greater than 0', async (t) => {
  const context = testEnv.authenticatedContext('darla_111');
  const expensesDoc = context.firestore().doc('users/darla_111/expenses/food_214');
  const result = await assertFails(expensesDoc.set({ cost: -100 }));
  assertPermissionDenied(t, result);
});

// 6
test('After expenses are created you cannot modify their dates', async (t) => {
  const context = testEnv.authenticatedContext('sam_315');
  const expensesDoc = context.firestore().doc('users/sam_315/expenses/fun_215');
  const snapshot = await expensesDoc.get();
  if(!snapshot.exists) {
    await expensesDoc.set({ cost: 100, date: new Date() });
  }
  const result = await assertFails(expensesDoc.update({ date: new Date() }));
  assertPermissionDenied(t, result);
});
