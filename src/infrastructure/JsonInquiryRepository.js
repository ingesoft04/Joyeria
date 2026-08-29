import { readFile, writeFile, mkdir } from 'node:fs/promises'; import { dirname } from 'node:path';
export class JsonInquiryRepository {
  constructor(file) { this.file = file; }
  async save(inquiry) { await mkdir(dirname(this.file), { recursive: true }); let rows = []; try { rows = JSON.parse(await readFile(this.file, 'utf8')); } catch {} rows.push(inquiry); await writeFile(this.file, JSON.stringify(rows, null, 2)); }
}
