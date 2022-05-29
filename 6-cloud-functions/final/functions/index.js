const functions = require('firebase-functions');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');

const firebaseApp = initializeApp(functions.config().firebase);

exports.ssr = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  const ONE_HOUR_IN_SECONDS = 3600;
  response.set(`Cache-Control', 'max-age=600, s-maxage=${ONE_HOUR_IN_SECONDS}`);
  response.send(`
  <h1>${Date.now()}</h1>
  `);
});

exports.updateUserExpenses = functions.firestore
  .document('/users/{uid}')
  .onUpdate(async (change) => {
  const after = change.after.data();
  functions.logger.info(change.after.data(), {structuredData: true});
  const db = getFirestore(firebaseApp);
  const query = db.collection('expenses').where('uid', '==', after.uid);
  const snapshot = await query.get();
  const batch = db.batch();
  // What if the batch grows more than 500?
  // - Use multiple arrays
  // What if the batch is potentially more than 10k records?
  // - Use a cursor to iterate through the data set  (~500 at time) and issue batches
  // What if the batch is well more than 10k? More like 50k!
  // - Look into chron jobs or long running instances like Cloud Run
  snapshot.docs.forEach(d => {
    batch.update(d.ref, { user: after });
  });
  return batch.commit();
});

exports.addCollaborator = functions.firestore
  .document('/budgets/{budgetId}/collaboratorRequests/{email}')
  .onCreate(async (snapshot, context) => {
    // Find the user by their email
    const { budgetId, email } = context.params;
    const auth = getAuth(firebaseApp);
    try {
      const user = await auth.getUserByEmail(email);
      // add to collaborators with uid
      const db = getFirestore(firebaseApp);
      return db.doc(`/budgets/${budgetId}/collaborators/${user.uid}`)
        .set({ role: 'admin' });
    } catch (error) {
      // Send an email out inviting them to the system.
      // Check out Firebase Extensions to do this with minimal code.
      return;
    }
  });

exports.userCreated = functions.auth.user().onCreate(async user => {
  const db = getFirestore(firebaseApp);
  const groupQuery = db.collectionGroup('collaboratorRequests')
    .where('email', '==', user.email);
  // Add to collaboratos for each one
  const snapshots = await groupQuery.get();
  const batch = db.batch();
  snapshots.docs.forEach(d => {
    // bugdets/good_budget
    const budgetRef = d.ref.parent.parent;
    // budgets/good_budget/collaborators/david_123
    const collabDoc = budgetRef.collection('collaborators').doc(user.uid);
    batch.set(collabDoc, { role: 'admin' });
  });
  return batch.commit();
})
