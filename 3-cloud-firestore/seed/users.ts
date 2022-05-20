import { createUsers, usersCol, deleteAllAuthUsers, getAllUsers } from './admin'
import { convertMockarooData } from './util'
import { batchUp, commitBatches } from './batch';
import type { MockUser } from './types'
const userData = require('./data/users-sm.json');

export async function seedUsers() {
  const mockUsers = convertMockarooData<MockUser>(userData, (user) => {
    if (user.birthday) {
      user.birthday = new Date(user.birthday)
    }
    return user
  })
  return createUsers(mockUsers)
}

export async function seedUsersForFirestore() {
  const createdUsers = await seedUsers();
  const batches = batchUp({ 
    colRef: usersCol, 
    indexKey: 'uid',
    arrayData: createdUsers,
  });
  await commitBatches(batches);
  return createdUsers;
}

export async function deleteAllUsersForFirestore() {
  const refList = await usersCol.listDocuments()
  const deletePromises = refList.map(ref => ref.delete());
  return Promise.all(deletePromises);
}

export async function deleteAllUsers() {
  await deleteAllUsersForFirestore();
  await deleteAllAuthUsers();
}

export { getAllUsers };
