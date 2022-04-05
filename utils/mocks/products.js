const productsMock = [
  {
    id: 'a56cafa4-bbb3-473d-a396-ea247b39c249',
    name: 'Wine - Periguita Fonseca',
    price: 1922,
    thumbnail: 'http://dummyimage.com/139x100.png/dddddd/000000',
  },
  {
    id: '9060c448-9693-46b4-bb60-567af20048c5',
    name: 'Macaroons - Two Bite Choc',
    price: 1680,
    thumbnail: 'http://dummyimage.com/157x100.png/5fa2dd/ffffff',
  },
  {
    id: 'b947dd8a-bf3d-4bbc-bafc-d1791c6daad1',
    name: 'Plaintain',
    price: 1474,
    thumbnail: 'http://dummyimage.com/226x100.png/cc0000/ffffff',
  },
  {
    id: '6eca2c8d-e198-40a4-98f7-10385aae0736',
    name: 'Artichoke - Hearts, Canned',
    price: 1956,
    thumbnail: 'http://dummyimage.com/212x100.png/ff4444/ffffff',
  },
  {
    id: 'c2c1d771-cdc5-4e91-a164-45ede4c581f8',
    name: 'Thyme - Fresh',
    price: 1926,
    thumbnail: 'http://dummyimage.com/117x100.png/5fa2dd/ffffff',
  },
  {
    id: 'e55a321a-31ef-4c42-a543-322081d061ff',
    name: 'Nori Sea Weed',
    price: 1186,
    thumbnail: 'http://dummyimage.com/118x100.png/dddddd/000000',
  },
  {
    id: '3abde2dd-87f1-494e-8df9-b39de31a1984',
    name: 'Hersey Shakes',
    price: 1137,
    thumbnail: 'http://dummyimage.com/167x100.png/dddddd/000000',
  },
  {
    id: '7a0b86a5-d24a-428a-a520-cfaf51a123d6',
    name: 'Nut - Pistachio, Shelled',
    price: 1499,
    thumbnail: 'http://dummyimage.com/111x100.png/dddddd/000000',
  },
  {
    id: '693b05d0-ab28-4a46-b50f-d6cec16d382d',
    name: 'Devonshire Cream',
    price: 1520,
    thumbnail: 'http://dummyimage.com/135x100.png/ff4444/ffffff',
  },
  {
    id: 'e387b66b-3ee0-4d64-9cd5-1bde1f025c48',
    name: 'Island Oasis - Sweet And Sour Mix',
    price: 1024,
    thumbnail: 'http://dummyimage.com/107x100.png/ff4444/ffffff',
  },
];

function filteredProductsMock(name) {
  return productsMock.filter((product) => product.name.includes(name));
}
class ProductsServiceMock {
  async getProducts() {
    return Promise.resolve(productsMock);
  }
  async createProducts() {
    return Promise.resolve(productsMock[0]);
  }
}

module.export = {
  productsMock,
  ProductsServiceMock,
  filteredProductsMock,
};
