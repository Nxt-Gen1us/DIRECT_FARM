import productRepository from '../repositories/product.repository.js';

class ProductService {
  async createProduct(payload) {
    return productRepository.create(payload);
  }

  async getProduct(productId) {
    return productRepository.findById(productId);
  }

  async listProducts(filters, options) {
    return productRepository.findAll(filters, options);
  }

  async listCategories() {
    const categories = await productRepository.listCategories();
    return categories.filter(Boolean).sort((a, b) => a.localeCompare(b));
  }

  async updateProduct(productId, updateData) {
    return productRepository.updateById(productId, updateData);
  }

  async deleteProduct(productId) {
    return productRepository.deleteById(productId);
  }
}

export default new ProductService();
