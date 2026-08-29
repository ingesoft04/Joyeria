import { readFile } from 'node:fs/promises'; import { Product } from '../domain/Product.js';
export class JsonProductRepository {
  constructor(file) { this.file = file; }
  async findAll() { return JSON.parse(await readFile(this.file, 'utf8')).map(item => new Product(item)); }
  async findById(id) { return (await this.findAll()).find(item => item.id === id); }
}
