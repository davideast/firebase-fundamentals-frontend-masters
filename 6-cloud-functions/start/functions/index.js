const functions = require('firebase-functions');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');

const firebaseApp = initializeApp(functions.config().firebase);

// 1. Return a webpage with the current date, set a CDN cache for an hour
exports.ssr = functions.https.onRequest((request, response) => {
  
});

// 2. When a user updates their info, copy it across their expenses 
exports.updateUserExpenses = functions.firestore
  .document('/users/{uid}')
  .onUpdate(async (change) => {
  
});

// 3. When a user adds a collaboratorRequest to their "budget", look up the
// uid by their email, and if they exist add them as a collaborator.
exports.addCollaborator = functions.firestore
  .document('/budgets/{budgetId}/collaboratorRequests/{email}')
  .onCreate(async (snapshot, context) => {
    
  });

// 4. When a user is created, check if they have any collaboratorRequests that
// exist and set them as collaborators.
exports.userCreated = functions.auth.user().onCreate(async user => {
  
});
