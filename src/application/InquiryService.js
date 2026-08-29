import { Inquiry } from '../domain/Inquiry.js';
export class InquiryService {
  constructor(inquiryRepository, productRepository, whatsappNumber) { Object.assign(this, { inquiryRepository, productRepository, whatsappNumber }); }
  async create(payload) {
    const inquiry = new Inquiry(payload); const product = await this.productRepository.findById(inquiry.productId);
    if (!product) throw new Error('El producto seleccionado no existe');
    await this.inquiryRepository.save(inquiry);
    const text = `Hola, soy ${inquiry.name}. Me interesa ${product.name} (${product.id}). ${inquiry.message}`.trim();
    return { id: inquiry.id, whatsappUrl: `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(text)}` };
  }
}
