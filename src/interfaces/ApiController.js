export class ApiController {
  constructor(catalogService, inquiryService) { Object.assign(this, { catalogService, inquiryService }); }
  async products(req, res, url) { this.json(res, 200, await this.catalogService.list(url.searchParams.get('category'))); }
  async inquiry(req, res) { const body = await this.body(req); this.json(res, 201, await this.inquiryService.create(body)); }
  json(res, status, data) { res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' }); res.end(JSON.stringify(data)); }
  body(req) { return new Promise((resolve, reject) => { let raw=''; req.on('data', c => { raw += c; if(raw.length > 10000) reject(new Error('Solicitud demasiado grande')); }); req.on('end', () => { try { resolve(JSON.parse(raw || '{}')); } catch { reject(new Error('JSON inválido')); } }); }); }
}
