const { Firestore } = require('@google-cloud/firestore');

async function storeData(id, data) {
  const db = new Firestore();
   try {
       await predictCollection.doc(id).set(data);
   } catch (error) {
       console.error('Error storing data:', error);
       throw new Error('Terjadi kesalahan saat menyimpan data');
   }
}

module.exports = storeData;
