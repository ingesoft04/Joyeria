export class Product {
  constructor(data) {
    if (!data.id || !data.name || !data.category) throw new Error('Producto inválido');
    Object.assign(this, data);
  }
}
