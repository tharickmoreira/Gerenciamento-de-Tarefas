/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// We try to load the config, but we must handle the case where it's missing or invalid
let firebaseApp: any;
let db: any;
let auth: any;

const fetchConfig = () => {
  try {
    // This is a dynamic import or we can try to use a local variable if we want to be safe
    // For now, we'll assume the environment might provide it via a file or we'll mock it if not present
    return null; // Mock for now until setup works
  } catch (e) {
    return null;
  }
};

const config = fetchConfig();

if (config) {
  try {
    firebaseApp = initializeApp(config);
    db = getFirestore(firebaseApp);
    auth = getAuth(firebaseApp);
  } catch (e) {
    console.error('Firebase initialization failed', e);
  }
}

export { db, auth };
