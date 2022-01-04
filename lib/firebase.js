var admin = require('firebase-admin');

var serviceAccount = require('../db/firebase/coder-house-store-api-firebase-adminsdk-psbcj-2f497d8a2f.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

class Firebase {
  constructor() {
    this.product = '';
  }
  createProduct({product}) {
    async () => {
      const db = admin.firestore();
      const collection = db.collection('products');

      try {
        let id;
        let doc = collection.doc(id.toString());
        await doc.create(product);
        id++;
      } catch (error) {
        console.log(error);
      }
    };
    console.log(`${product.name} was created`);
  }

  getProducts() {
    async () => {
      const db = admin.firestore();
      const collection = db.collection('products');

      try {
        const queryGet = await collection.get();
        console.log('Entry');
        const response = queryGet.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            description: data.description,
            code: data.code,
            thumbnail: data.thumbnail,
            price: data.price,
            stock: data.stock,
          };
        });
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
  }
  getProductId(productId) {
    async () => {
      const db = admin.firestore();
      const collection = db.collection('products');
      try {
        const doc = collection.doc(`${productId}`);
        const item = await doc.get();
        const response = item.data();
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
  }

  updateProduct(productId, data) {
    async () => {
      const db = admin.firestore();
      const collection = db.collection('products');

      try {
        let doc = collection.doc(`${productId}`);
        doc = await doc.update(data);

        console.log(doc);
      } catch (error) {
        console.log(error);
      }
    };
  }
  deleteProduct(productId) {
    async () => {
      const db = admin.firestore();
      const collection = db.collection('products');

      try {
        let doc = collection.doc(`${productId}`);
        doc = await doc.delete();
        console.log(doc);
      } catch (error) {
        console.log(error);
      }
    };
  }
}

module.exports = Firebase;
