import Product from '../models/product.model.js';

class ProductRepository {
  async create(productData) {
    return Product.create(productData);
  }

  async findById(id) {
    return Product.findById(id).populate('farmer');
  }

  async findAll(filter = {}, options = {}) {
    return Product.find(filter)
      .skip(options.skip || 0)
      .limit(options.limit || 20)
      .sort(options.sort || { createdAt: -1 });
  }

  async updateById(id, updateData) {
    return Product.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteById(id) {
    return Product.findByIdAndDelete(id);
  }
}

export default new ProductRepository();
