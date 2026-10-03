import productService from '../services/product.service.js';

export const createProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct({ farmer: req.user.id, ...req.body });
    res.status(201).json({ status: 'success', data: product });
  } catch (error) {
    next(error);
  }
};

export const listProducts = async (req, res, next) => {
  try {
    const {
      q,
      search,
      cat,
      category,
      organic,
      isOrganic,
      farmer,
      minPrice,
      maxPrice,
      available,
      sort,
      page = 1,
      limit = 20,
    } = req.query;
    const filter = {};
    const searchTerm = q || search;
    const selectedCategory = cat || category;
    const organicFilter = organic ?? isOrganic;
    const safePage = Math.max(1, Number.parseInt(page, 10) || 1);
    const safeLimit = Math.min(100, Math.max(1, Number.parseInt(limit, 10) || 20));

    if (searchTerm) {
      filter.$or = [
        { name: { $regex: searchTerm, $options: 'i' } },
        { variety: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
        { origin: { $regex: searchTerm, $options: 'i' } },
        { tags: { $in: [new RegExp(searchTerm, 'i')] } },
      ];
    }
    if (selectedCategory) filter.category = selectedCategory;
    if (organicFilter === '1' || organicFilter === 'true') filter.isOrganic = true;
    if (farmer) filter.farmer = farmer;
    if (available === '1' || available === 'true') filter.quantityAvailable = { $gt: 0 };

    const price = {};
    if (minPrice !== undefined && Number.isFinite(Number(minPrice))) price.$gte = Number(minPrice);
    if (maxPrice !== undefined && Number.isFinite(Number(maxPrice))) price.$lte = Number(maxPrice);
    if (Object.keys(price).length) filter.price = price;

    const sortOptions = {
      priceAsc: { price: 1 },
      priceDesc: { price: -1 },
      name: { name: 1 },
      fresh: { harvestDate: -1, createdAt: -1 },
      newest: { createdAt: -1 },
    };

    const options = {
      skip: (safePage - 1) * safeLimit,
      limit: safeLimit,
      sort: sortOptions[sort] || { createdAt: -1 },
    };

    const products = await productService.listProducts(filter, options);
    res.status(200).json({ status: 'success', data: products });
  } catch (error) {
    next(error);
  }
};

export const listCategories = async (req, res, next) => {
  try {
    const categories = await productService.listCategories();
    res.status(200).json({ status: 'success', data: categories });
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const product = await productService.getProduct(req.params.productId);
    res.status(200).json({ status: 'success', data: product });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await productService.updateProduct(req.params.productId, req.body);
    res.status(200).json({ status: 'success', data: product });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    await productService.deleteProduct(req.params.productId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
