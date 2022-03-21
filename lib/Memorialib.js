class Memorialib {
  constructor() {
    this.array = [];
    this.count = 0;
  }

  get() {
    return this.array;
  }
  getAll(id) {
    const result = this.array.find((element) => element.id == id);
    return result;
  }

  craete(objet) {
    this.array.push({ ...objet, id: this.count + 1 });
    this.count++;
    return objet;
  }

  update(id, newObject) {
    const element = this.getProductById(id);
    const index = this.array.indexOf(element);
    this.array[index] = newObject;
    return newObject;
  }

  delete(id) {
    const element = this.getProductById(id);
    const index = this.array.indexOf(element);
    this.array.splice(index, 1);
    return this.array;
  }
}

module.exports = new Memorialib();
