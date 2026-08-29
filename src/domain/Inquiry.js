export class Inquiry {
  constructor({ name, phone, productId, message = '' }) {
    if (!name?.trim() || !phone?.trim() || !productId?.trim()) throw new Error('Nombre, teléfono y producto son obligatorios');
    this.id = crypto.randomUUID(); this.name = name.trim(); this.phone = phone.trim();
    this.productId = productId.trim(); this.message = message.trim().slice(0, 500); this.createdAt = new Date().toISOString();
  }
}
