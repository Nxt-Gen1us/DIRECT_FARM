import adminService from '../services/admin.service.js';

export const getAdminStats = async (_req, res, next) => {
  try {
    const stats = await adminService.getStats();
    res.status(200).json({ status: 'success', data: stats });
  } catch (error) {
    next(error);
  }
};

export const listAdminUsers = async (req, res, next) => {
  try {
    const users = await adminService.listUsers(req.query);
    res.status(200).json({ status: 'success', data: users });
  } catch (error) {
    next(error);
  }
};

export const listAdminFarmers = async (req, res, next) => {
  try {
    const farmers = await adminService.listFarmers(req.query);
    res.status(200).json({ status: 'success', data: farmers });
  } catch (error) {
    next(error);
  }
};

export const updateFarmerVerification = async (req, res, next) => {
  try {
    const farmer = await adminService.setFarmerVerification(req.params.profileId, req.body.verificationStatus);
    res.status(200).json({ status: 'success', data: farmer });
  } catch (error) {
    next(error);
  }
};

export const createAdminUser = async (req, res, next) => {
  try { res.status(201).json({ status: 'success', data: await adminService.createUser(req.body) }); } catch (error) { next(error); }
};

export const updateAdminUser = async (req, res, next) => {
  try { res.status(200).json({ status: 'success', data: await adminService.updateUser(req.params.userId, req.body) }); } catch (error) { next(error); }
};

export const deleteAdminUser = async (req, res, next) => {
  try { await adminService.deleteUser(req.params.userId, req.user.id); res.status(204).send(); } catch (error) { next(error); }
};

export const createAdminProduct = async (req, res, next) => {
  try { res.status(201).json({ status: 'success', data: await adminService.createProduct(req.body) }); } catch (error) { next(error); }
};
export const updateAdminProduct = async (req, res, next) => {
  try { res.status(200).json({ status: 'success', data: await adminService.updateProduct(req.params.productId, req.body) }); } catch (error) { next(error); }
};
export const deleteAdminProduct = async (req, res, next) => {
  try { await adminService.deleteProduct(req.params.productId); res.status(204).send(); } catch (error) { next(error); }
};
