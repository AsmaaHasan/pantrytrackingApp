const admin = require('firebase-admin');
const serviceAccount = require('inventory-management-app\src\serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "inventory-management-app-cae3d.appspot.com"
});

const firestore = admin.firestore();
const storage = admin.storage();
const auth = admin.auth();

module.exports = { firestore, storage, auth };
