import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator, enableMultiTabIndexedDbPersistence } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { config } from './config';

function initialize() {
  const firebaseApp = initializeApp(config.firebase);
  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);
  return { firebaseApp, auth, firestore };
}

function connectToEmulators({ firebaseApp, auth, firestore }) {
  if(location.hostname === 'localhost') {
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    connectFirestoreEmulator(firestore, 'localhost', 8080);
  }
  return { firebaseApp, auth, firestore };
}

function enableOffline({ firestore, firebaseApp, auth }) {
  enableMultiTabIndexedDbPersistence(firestore);
  return { firestore, firebaseApp, auth };
}

export function getFirebase() {
  const existingApp = getApps().at(0);
  if(existingApp) return initialize();
  const services = connectToEmulators(initialize());
  return enableOffline(services);
}
