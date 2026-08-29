import test from 'node:test'; import assert from 'node:assert/strict'; import { CatalogService } from '../src/application/CatalogService.js';
const repository={findAll:async()=>[{category:'aretes'},{category:'anillos'}]};
test('filtra el catálogo sin acoplar el servicio al almacenamiento',async()=>{assert.deepEqual(await new CatalogService(repository).list('aretes'),[{category:'aretes'}]);});
