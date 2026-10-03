import deliveryTrackingService from '../services/deliveryTracking.service.js';

export const getDeliveryTracking = async (req, res, next) => {
  try {
    const tracking = await deliveryTrackingService.getTrackingForOrder(req.params.orderId, req.user);
    res.status(200).json({ status: 'success', data: tracking });
  } catch (error) {
    next(error);
  }
};

export const updateDeliveryTracking = async (req, res, next) => {
  try {
    const tracking = await deliveryTrackingService.updateTracking(req.params.orderId, req.body, req.user);
    res.status(200).json({ status: 'success', data: tracking });
  } catch (error) {
    next(error);
  }
};

export const addDeliveryEvent = async (req, res, next) => {
  try {
    const tracking = await deliveryTrackingService.addTrackingEvent(req.params.orderId, req.body, req.user);
    res.status(200).json({ status: 'success', data: tracking });
  } catch (error) {
    next(error);
  }
};
