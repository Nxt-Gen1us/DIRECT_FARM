import orderRepository from '../repositories/order.repository.js';
import walletRepository from '../repositories/wallet.repository.js';
import Product from '../models/product.model.js';
import Order from '../models/order.model.js';
import FarmerProfile from '../models/farmerProfile.model.js';

function orderError(message, statusCode) {
  return Object.assign(new Error(message), { statusCode });
}

class OrderService {
  /**
   * Create a new order.
   * 
   * SECURITY RULES enforced here:
   *  1. Item prices are ALWAYS recalculated from the database — never trusted from the client.
   *  2. subtotal, shippingFee and total are recalculated server-side.
   *  3. The `farmer` field is resolved from the first order item's product if not explicitly provided.
   */
  async createOrder(orderData) {
    const { items, deliveryAddress, customer, paymentMethod = 'cod' } = orderData;

    if (!items || items.length === 0) {
      throw Object.assign(new Error('Order must contain at least one item'), { statusCode: 400 });
    }

    // ── 1. Fetch live prices from DB ──────────────────────────────────────────
    const productIds = items.map((i) => i.product);
    const products = await Product.find({ _id: { $in: productIds } }).select('_id price farmer quantityAvailable').lean();

    const productMap = Object.fromEntries(products.map((p) => [p._id.toString(), p]));

    const resolvedItems = items.map((item) => {
      const product = productMap[item.product.toString()];
      if (!product) {
        throw Object.assign(
          new Error(`Product not found: ${item.product}`),
          { statusCode: 404 },
        );
      }
      // SECURITY: use server price, not client-supplied price
      return {
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      };
    });

    // ── 2. Recalculate totals server-side ─────────────────────────────────────
    const subtotal = resolvedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shippingFee = subtotal >= 999 ? 0 : 40;
    const tax = 0;
    const total = subtotal + shippingFee + tax;

    if (paymentMethod === 'wallet') {
      const wallet = await walletRepository.findByUser(customer);
      if (!wallet || wallet.balance < total) {
        throw Object.assign(new Error('Insufficient wallet balance'), { statusCode: 402 });
      }
      await walletRepository.addTransaction(customer, {
        type: 'debit',
        amount: total,
        reference: `order_${Date.now()}`,
        description: 'Order payment via wallet'
      });
    }

    // ── 3. Resolve farmer from first product if not provided ──────────────────
    let farmer = orderData.farmer;
    if (!farmer) {
      const firstProduct = productMap[resolvedItems[0].product.toString()];
      if (!firstProduct?.farmer) {
        throw Object.assign(new Error('Unable to determine farmer for order'), { statusCode: 400 });
      }
      farmer = firstProduct.farmer;
    }

    return orderRepository.create({
      customer,
      farmer,
      items: resolvedItems,
      status: 'pending',
      paymentMethod,
      paymentStatus: paymentMethod === 'wallet' ? 'paid' : 'pending',
      subtotal,
      shippingFee,
      tax,
      total,
      deliveryAddress,
    });
  }

  async getOrder(orderId, actor) {
    const order = await orderRepository.findById(orderId);
    if (!order) throw orderError('Order not found', 404);
    if (actor.role === 'admin') return order;

    const customerId = order.customer?._id?.toString() ?? order.customer?.toString();
    const farmerUserId = order.farmer?.user?._id?.toString() ?? order.farmer?.user?.toString();
    if (actor.id !== customerId && actor.id !== farmerUserId) {
      throw orderError('Forbidden', 403);
    }
    return order;
  }

  async getCustomerOrders(customerId, options) {
    return orderRepository.findByCustomer(customerId, options);
  }

  async getFarmerOrders(farmerUserId, options) {
    const profile = await FarmerProfile.findOne({ user: farmerUserId }).select('_id').lean();
    if (!profile) return [];
    return orderRepository.findByFarmer(profile._id, options);
  }

  async updateOrder(orderId, updateData, actor) {
    const order = await Order.findById(orderId);
    if (!order) throw orderError('Order not found', 404);

    if (actor.role === 'customer') {
      if (updateData.status !== 'cancelled') {
        throw orderError('Customers can only cancel orders', 403);
      }
      if (order.customer.toString() !== actor.id) throw orderError('Forbidden', 403);
      if (!['pending', 'confirmed'].includes(order.status)) {
        throw orderError('This order can no longer be cancelled', 409);
      }
    } else if (actor.role === 'farmer') {
      const profile = await FarmerProfile.findOne({ user: actor.id }).select('_id').lean();
      if (!profile || order.farmer.toString() !== profile._id.toString()) {
        throw orderError('Forbidden', 403);
      }
    }

    // Only allow status updates; strip any price/total overrides
    const { status, trackingNumber, courier, estimatedDelivery } = updateData;
    return orderRepository.updateById(orderId, {
      ...(status !== undefined && { status }),
      ...(trackingNumber !== undefined && { trackingNumber }),
      ...(courier !== undefined && { courier }),
      ...(estimatedDelivery !== undefined && { estimatedDelivery }),
    });
  }
}

export default new OrderService();
