import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth, UserRecord } from 'firebase-admin/auth';
import { MockUser, CreatedUser } from './types';
const serviceAccount = require('./sa.json');

export const firebaseApp = initializeApp({
  credential: cert(serviceAccount)
});

export const firestore = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);
export const usersCol = firestore.collection('users');
export const expensesCol = firestore.collection('expenses');

export async function createUsers(usersArray: MockUser[]) {
  let users = [] as CreatedUser[];
  for await (const user of usersArray) {
    const userRecord = await auth.createUser({
      email: user.email,
      emailVerified: true,
      displayName: `${user.first} ${user.last}`,
      disabled: false,
    });
    users = [...users, { ...user, uid: userRecord.uid }]
  }
  return users;
}

export async function getAllUsers(users: UserRecord[] = []): Promise<UserRecord[]> {
  const listResult = await auth.listUsers();
  if(listResult.pageToken != null) {
    users = [...users, ...listResult.users];
    return getAllUsers(users);
  }
  return users;
}

export async function deleteAllAuthUsers() {
  const allUsers = await getAllUsers();
  const allUids = allUsers.map(u => u.uid);
  return auth.deleteUsers(allUids);
}
