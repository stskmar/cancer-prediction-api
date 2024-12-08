const { Firestore } = require('@google-cloud/firestore');

async function getAllData() {
  const db = new Firestore();
  const ref = db.collection('predictions');
  const snapshot = await ref.get();

  return snapshot;
}

module.exports = getAllData;
