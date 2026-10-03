import User from '../models/user.model.js';
import FarmerProfile from '../models/farmerProfile.model.js';
import Order from '../models/order.model.js';
import Product from '../models/product.model.js';
import bcrypt from 'bcryptjs';

class AdminService {
  async getStats() {
    const [roles, farmerCount, productCount, orderCount, revenue, categoryMix, pendingFarmers] = await Promise.all([
      User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
      FarmerProfile.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { status: { $nin: ['cancelled', 'returned'] } } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      Product.aggregate([
        { $group: { _id: '$category', value: { $sum: 1 } } },
        { $sort: { value: -1 } }
      ]),
      FarmerProfile.countDocuments({ verificationStatus: 'pending' })
    ]);
    const roleCounts = Object.fromEntries(roles.map((entry) => [entry._id, entry.count]));
    const categoryTotal = categoryMix.reduce((sum, entry) => sum + entry.value, 0) || 1;
    return {
      gmv: revenue[0]?.total ?? 0,
      orders: orderCount,
      farmers: farmerCount,
      buyers: roleCounts.customer ?? 0,
      admins: roleCounts.admin ?? 0,
      lots: productCount,
      pendingFarms: pendingFarmers,
      roleMix: [
        { name: 'Customers', value: roleCounts.customer ?? 0 },
        { name: 'Farmers', value: roleCounts.farmer ?? 0 },
        { name: 'Admins', value: roleCounts.admin ?? 0 }
      ],
      categoryMix: categoryMix.map((entry) => ({
        name: entry._id || 'Other',
        value: Math.round((entry.value / categoryTotal) * 100)
      }))
    };
  }

  async listUsers({ role, search, limit = 50 } = {}) {
    const filter = {};
    if (role && ['customer', 'farmer', 'admin'].includes(role)) filter.role = role;
    if (search) {
      const expression = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [{ firstName: expression }, { lastName: expression }, { email: expression }];
    }
    return User.find(filter).select('firstName lastName email role isVerified createdAt').sort({ createdAt: -1 }).limit(Math.min(Number(limit) || 50, 100));
  }

  async listFarmers({ status, limit = 50 } = {}) {
    const filter = {};
    if (status && ['pending', 'verified', 'rejected'].includes(status)) filter.verificationStatus = status;
    return FarmerProfile.find(filter)
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(Math.min(Number(limit) || 50, 100));
  }

  async setFarmerVerification(profileId, verificationStatus) {
    const profile = await FarmerProfile.findByIdAndUpdate(
      profileId,
      { verificationStatus, trustedBadge: verificationStatus === 'verified' },
      { new: true }
    ).populate('user', 'firstName lastName email');
    if (!profile) throw Object.assign(new Error('Farmer profile not found'), { statusCode: 404 });
    return profile;
  }

  async createUser({ firstName, lastName, email, password, role = 'customer', isVerified = false }) {
    if (!['customer', 'farmer', 'admin'].includes(role)) throw Object.assign(new Error('Invalid role'), { statusCode: 400 });
    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) throw Object.assign(new Error('Email already registered'), { statusCode: 409 });
    const user = await User.create({ firstName, lastName, email: email.toLowerCase().trim(), password: await bcrypt.hash(password, 12), role, isVerified });
    return User.findById(user.id).select('firstName lastName email role isVerified createdAt');
  }

  async updateUser(id, update) {
    const allowed = ['firstName', 'lastName', 'email', 'role', 'isVerified'];
    const changes = Object.fromEntries(Object.entries(update).filter(([key]) => allowed.includes(key)));
    if (changes.role && !['customer', 'farmer', 'admin'].includes(changes.role)) throw Object.assign(new Error('Invalid role'), { statusCode: 400 });
    if (changes.email) changes.email = changes.email.toLowerCase().trim();
    const user = await User.findByIdAndUpdate(id, changes, { new: true, runValidators: true }).select('firstName lastName email role isVerified createdAt');
    if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 });
    return user;
  }

  async deleteUser(id, actorId) {
    if (id === actorId) throw Object.assign(new Error('You cannot delete your own admin account'), { statusCode: 400 });
    const user = await User.findByIdAndDelete(id).select('firstName lastName email role isVerified createdAt');
    if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 });
    return user;
  }

  async createProduct(payload) {
    const farmer = payload.farmerId || payload.farmer
      ? await FarmerProfile.findById(payload.farmerId || payload.farmer)
      : await FarmerProfile.findOne({}).sort({ createdAt: 1 });
    if (!farmer) throw Object.assign(new Error('Farmer profile not found'), { statusCode: 404 });
    const { farmerId, ...data } = payload;
    return Product.create({ ...data, farmer: farmer.id });
  }

  async updateProduct(id, update) {
    const product = await Product.findByIdAndUpdate(id, update, { new: true, runValidators: true });
    if (!product) throw Object.assign(new Error('Product not found'), { statusCode: 404 });
    return product;
  }

  async deleteProduct(id) {
    const product = await Product.findByIdAndDelete(id);
    if (!product) throw Object.assign(new Error('Product not found'), { statusCode: 404 });
  }
}

export default new AdminService();
