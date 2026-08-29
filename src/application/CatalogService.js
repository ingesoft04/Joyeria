export class CatalogService {
  constructor(productRepository) { this.products = productRepository; }
  async list(category) {
    const items = await this.products.findAll();
    return category && category !== 'todos' ? items.filter(item => item.category === category) : items;
  }
}
