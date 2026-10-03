import test from 'node:test';
import assert from 'node:assert';

import orderService from '../src/services/order.service.js';
import Product from '../src/models/product.model.js';
import orderRepository from '../src/repositories/order.repository.js';
import walletRepository from '../src/repositories/wallet.repository.js';

test('wallet payment should deduct balance and mark order as paid', async () => {
  const originalFind = Product.find;
  const originalCreate = orderRepository.create;
  const originalWalletFind = walletRepository.findByUser;
  const originalWalletAdd = walletRepository.addTransaction;

  Product.find = () => ({
    select: () => ({
      lean: async () => [
        { _id: 'p1', price: 250, farmer: 'f1', quantityAvailable: 12 },
      ],
    }),
  });

  walletRepository.findByUser = async () => ({ balance: 500 });
  let debitCalled = false;
  walletRepository.addTransaction = async (userId, tx) => {
    debitCalled = true;
    assert.strictEqual(userId, 'u1');
    assert.strictEqual(tx.type, 'debit');
    assert.strictEqual(tx.amount, 290);
    return { balance: 250, user: userId, transactions: [tx] };
  };

  orderRepository.create = async (payload) => {
    assert.strictEqual(payload.paymentMethod, 'wallet');
    assert.strictEqual(payload.paymentStatus, 'paid');
    return { ...payload, _id: 'o1' };
  };

  try {
    const result = await orderService.createOrder({
      customer: 'u1',
      paymentMethod: 'wallet',
      items: [{ product: 'p1', quantity: 1 }],
      deliveryAddress: { street: 'Main Road', city: 'Junagadh', state: 'Gujarat', postalCode: '362001', country: 'India' },
    });

    assert.strictEqual(result.paymentStatus, 'paid');
    assert.strictEqual(debitCalled, true);
  } finally {
    Product.find = originalFind;
    orderRepository.create = originalCreate;
    walletRepository.findByUser = originalWalletFind;
    walletRepository.addTransaction = originalWalletAdd;
  }
});
