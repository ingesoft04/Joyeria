export class ApiController {
  constructor(catalogService, inquiryService, adminService) { Object.assign(this, { catalogService, inquiryService, adminService }); }
  async products(req, res, url) { this.json(res, 200, await this.catalogService.list(url.searchParams.get('category'))); }
  async inquiry(req, res) { const body = await this.body(req); this.json(res, 201, await this.inquiryService.create(body)); }
  async login(req,res) { this.json(res,200,{token:this.adminService.login((await this.body(req)).password)}); }
  async updateProduct(req,res,id) { this.adminService.authorize(req.headers.authorization); this.json(res,200,await this.adminService.update(id,await this.body(req))); }
  json(res, status, data) { res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' }); res.end(JSON.stringify(data)); }
  body(req) { return new Promise((resolve, reject) => { let raw=''; req.on('data', c => { raw += c; if(raw.length > 6*1024*1024) { reject(new Error('Solicitud demasiado grande')); req.destroy(); } }); req.on('end', () => { try { resolve(JSON.parse(raw || '{}')); } catch { reject(new Error('JSON inválido')); } }); }); }
}
