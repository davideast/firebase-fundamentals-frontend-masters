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

// 1
test('An unauthenticated user fails to write to a profile', async (t) => {

});

// 2
test('An authenticated user can write their profile', async (t) => {

});

// 3
test('An unauthenticated user fails to write to expenses', async (t) => {

});

// 4
test('An authenticated user can write to expenses', async (t) => {

});

// 4. A user must have a first name and email
test('A user must have a first name and email', async (t) => {

});

// 5. An expense must have a cost greater than 0
test('An expense must have a cost greater than 0', async (t) => {

});

// 6. After expenses are created you cannot modify their dates
test('After expenses are created you cannot modify their dates', async (t) => {

});
