import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises'; import { dirname } from 'node:path'; import { Product } from '../domain/Product.js';
export class JsonProductRepository {
  constructor(file, seedFile = file) { this.file = file; this.seedFile = seedFile; }
  async ensure() { try { await readFile(this.file); } catch { await mkdir(dirname(this.file), { recursive: true }); await copyFile(this.seedFile, this.file); } }
  async findAll() { await this.ensure(); return JSON.parse(await readFile(this.file, 'utf8')).map(item => new Product(item)); }
  async findById(id) { return (await this.findAll()).find(item => item.id === id); }
  async update(id, changes) { const rows = await this.findAll(); const index = rows.findIndex(item => item.id === id); if (index < 0) return null; rows[index] = new Product({ ...rows[index], ...changes, id }); await writeFile(this.file, JSON.stringify(rows, null, 2)); return rows[index]; }
}
