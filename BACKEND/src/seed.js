import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import config from './config/index.js';

import User from './models/user.model.js';
import FarmerProfile from './models/farmerProfile.model.js';
import Product from './models/product.model.js';
import Order from './models/order.model.js';
import Payment from './models/payment.model.js';
import DeliveryTracking from './models/deliveryTracking.model.js';
import HarvestTimeline from './models/harvestTimeline.model.js';
import Message from './models/message.model.js';
import Notification from './models/notification.model.js';
import Review from './models/review.model.js';
import Wallet from './models/wallet.model.js';
import AiPrediction from './models/aiPrediction.model.js';

export const seedDatabase = async () => {
  console.log('🌱 Starting DIRECT FARM Database Initialization & Seeding...');

  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 5000 });
    }

    console.log('🧹 Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      FarmerProfile.deleteMany({}),
      Product.deleteMany({}),
      Order.deleteMany({}),
      Payment.deleteMany({}),
      DeliveryTracking.deleteMany({}),
      HarvestTimeline.deleteMany({}),
      Message.deleteMany({}),
      Notification.deleteMany({}),
      Review.deleteMany({}),
      Wallet.deleteMany({}),
      AiPrediction.deleteMany({})
    ]);

    console.log('🔐 Hashing default user passwords...');
    const hashedPassword = await bcrypt.hash('FarmDirect2026!', 10);

    console.log('👤 Creating Users (Admin, Farmers, Customers)...');
     await User.create({
      firstName: 'DirectFarm',
      lastName: 'Admin',
      email: 'admin@directfarm.com',
      password: hashedPassword,
      role: 'admin',
      isVerified: true,
      walletBalance: 50000,
      addresses: [{
        label: 'HQ',
        street: '100 Agricultural Hub Expressway',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560001',
        country: 'India'
      }]
    });

    const farmerRamesh = await User.create({
      firstName: 'Ramesh',
      lastName: 'Patel',
      email: 'ramesh.farmer@directfarm.com',
      password: hashedPassword,
      role: 'farmer',
      isVerified: true,
      walletBalance: 12500,
      addresses: [{
        label: 'Farm House',
        street: 'Plot 42, Green Valley Organic Zone',
        city: 'Nashik',
        state: 'Maharashtra',
        postalCode: '422001',
        country: 'India'
      }]
    });

    const farmerPriya = await User.create({
      firstName: 'Priya',
      lastName: 'Sharma',
      email: 'priya.farmer@directfarm.com',
      password: hashedPassword,
      role: 'farmer',
      isVerified: true,
      walletBalance: 8900,
      addresses: [{
        label: 'Sunrise Orchards',
        street: 'Orchard Lane, Highway 8',
        city: 'Ratnagiri',
        state: 'Maharashtra',
        postalCode: '415612',
        country: 'India'
      }]
    });

    const customerRahul = await User.create({
      firstName: 'Rahul',
      lastName: 'Verma',
      email: 'rahul.customer@directfarm.com',
      password: hashedPassword,
      role: 'customer',
      isVerified: true,
      walletBalance: 3200,
      addresses: [{
        label: 'Home',
        street: 'Flat 402, Highrise Apartments, MG Road',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400001',
        country: 'India'
      }]
    });

    const customerSneha = await User.create({
      firstName: 'Sneha',
      lastName: 'Kulkarni',
      email: 'sneha.customer@directfarm.com',
      password: hashedPassword,
      role: 'customer',
      isVerified: true,
      walletBalance: 1500,
      addresses: [{
        label: 'Apartment',
        street: '12 Sunshine Enclave, Baner',
        city: 'Pune',
        state: 'Maharashtra',
        postalCode: '411045',
        country: 'India'
      }]
    });

    console.log('🌾 Creating Farmer Profiles...');
    const profileRamesh = await FarmerProfile.create({
      user: farmerRamesh._id,
      farmName: 'Green Valley Organic Farms',
      description: 'Dedicated to 100% certified pesticide-free organic farming for over 15 years.',
      location: {
        address: 'Plot 42, Green Valley Organic Zone',
        city: 'Nashik',
        state: 'Maharashtra',
        postalCode: '422001',
        country: 'India',
        coordinates: { type: 'Point', coordinates: [73.7898, 19.9975] }
      },
      organicCertification: true,
      verificationStatus: 'verified',
      trustedBadge: true,
      experienceYears: 15,
      gallery: [
        { mediaUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854', type: 'image' },
        { mediaUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb16422', type: 'image' }
      ],
      farmStory: 'Our journey started in 2011 with a simple vision: bringing farm-fresh, chemical-free produce straight from the soil to urban kitchen tables without middleman markups.',
      lastHarvestAt: new Date(Date.now() - 3 * 86400000)
    });

    const profilePriya = await FarmerProfile.create({
      user: farmerPriya._id,
      farmName: 'Sunrise Mango & Spices Estate',
      description: 'Specializing in authentic Ratnagiri Alphonso Mangoes, fresh spices, and farm dairy.',
      location: {
        address: 'Orchard Lane, Highway 8',
        city: 'Ratnagiri',
        state: 'Maharashtra',
        postalCode: '415612',
        country: 'India',
        coordinates: { type: 'Point', coordinates: [73.312, 16.9902] }
      },
      organicCertification: true,
      verificationStatus: 'verified',
      trustedBadge: true,
      experienceYears: 10,
      gallery: [
        { mediaUrl: 'https://images.unsplash.com/photo-1557800636-894a64c1696f', type: 'image' }
      ],
      farmStory: 'Sunrise Estate is a family-owned orchard preserving traditional eco-friendly farming practices.',
      lastHarvestAt: new Date(Date.now() - 1 * 86400000)
    });

    console.log('📦 Creating Products...');
    const mangoes = await Product.create({
      farmer: profilePriya._id,
      name: 'Organic Alphonso Mangoes (GI Tagged)',
      description: 'Naturally ripened, sweet GI-certified Ratnagiri Alphonso Mangoes packed in eco-boxes.',
      category: 'Fruits',
      price: 1200,
      quantityAvailable: 150,
      images: [{ url: 'https://images.unsplash.com/photo-1553279768-865429fa0078', type: 'image' }],
      shelfLifeDays: 7,
      packaging: '1 Dozen Box (approx 3.2 kg)',
      harvestDate: new Date(Date.now() - 2 * 86400000),
      freshnessScore: 98,
      isOrganic: true
    });

    const tomatoes = await Product.create({
      farmer: profileRamesh._id,
      name: 'Farm-Fresh Vine-Ripened Tomatoes',
      description: 'Juicy, rich red tomatoes grown hydroponically without artificial chemicals.',
      category: 'Vegetables',
      price: 60,
      quantityAvailable: 500,
      images: [{ url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea', type: 'image' }],
      shelfLifeDays: 10,
      packaging: '1 kg Eco Bag',
      harvestDate: new Date(Date.now() - 1 * 86400000),
      freshnessScore: 95,
      isOrganic: true
    });

    const rice = await Product.create({
      farmer: profileRamesh._id,
      name: 'Aromatic Traditional Basmati Rice',
      description: 'Aged long-grain organic Basmati rice harvested with love and sun-dried naturally.',
      category: 'Grains',
      price: 240,
      quantityAvailable: 300,
      images: [{ url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c', type: 'image' }],
      shelfLifeDays: 365,
      packaging: '5 kg Jute Sack',
      harvestDate: new Date(Date.now() - 30 * 86400000),
      freshnessScore: 90,
      isOrganic: true
    });

    console.log('📅 Creating Harvest Timelines...');
    await HarvestTimeline.create({
      farmer: profileRamesh._id,
      cropName: 'Organic Vine Tomatoes',
      plantedAt: new Date(Date.now() - 75 * 86400000),
      expectedHarvestAt: new Date(Date.now() + 5 * 86400000),
      events: [
        { eventType: 'seeding', title: 'Seed Sowing', description: 'Planted heirloom tomato seeds.', occurredAt: new Date(Date.now() - 75 * 86400000) },
        { eventType: 'fertilization', title: 'Compost Feed', description: 'Applied organic vermicompost.', occurredAt: new Date(Date.now() - 45 * 86400000) },
        { eventType: 'flowering', title: 'Flowering Stage', description: 'Flowers blooming healthy.', occurredAt: new Date(Date.now() - 20 * 86400000) }
      ]
    });

    console.log('🛒 Creating Orders...');
    const order1 = await Order.create({
      customer: customerRahul._id,
      farmer: profilePriya._id,
      items: [{ product: mangoes._id, quantity: 2, price: 1200 }],
      status: 'delivered',
      subtotal: 2400,
      shippingFee: 100,
      tax: 120,
      total: 2620,
      deliveryAddress: customerRahul.addresses[0],
      invoiceUrl: 'https://directfarm.com/invoices/INV-2026-001.pdf'
    });

    const order2 = await Order.create({
      customer: customerSneha._id,
      farmer: profileRamesh._id,
      items: [
        { product: tomatoes._id, quantity: 3, price: 60 },
        { product: rice._id, quantity: 1, price: 240 }
      ],
      status: 'shipped',
      subtotal: 420,
      shippingFee: 50,
      tax: 21,
      total: 491,
      deliveryAddress: customerSneha.addresses[0],
      invoiceUrl: 'https://directfarm.com/invoices/INV-2026-002.pdf'
    });

    console.log('💳 Creating Payments...');
    await Payment.create({
      order: order1._id,
      user: customerRahul._id,
      method: 'razorpay',
      amount: 2620,
      status: 'completed',
      transactionId: 'pay_RZP982341234',
      providerResponse: { razorpay_payment_id: 'pay_RZP982341234', status: 'captured' }
    });

    await Payment.create({
      order: order2._id,
      user: customerSneha._id,
      method: 'wallet',
      amount: 491,
      status: 'completed',
      transactionId: 'TXN_WLT_77182'
    });

    console.log('🚚 Creating Delivery Tracking...');
    await DeliveryTracking.create({
      order: order1._id,
      courier: 'FarmExpress Logistics',
      trackingNumber: 'FEX-9982341',
      currentStatus: 'delivered',
      estimatedDelivery: new Date(Date.now() - 86400000),
      route: ['Ratnagiri Sorting Center', 'Mumbai Central Hub', 'Customer Doorstep'],
      events: [
        { status: 'Picked Up', location: 'Ratnagiri Orchards', recordedAt: new Date(Date.now() - 3 * 86400000) },
        { status: 'In Transit', location: 'Mumbai Central Hub', recordedAt: new Date(Date.now() - 2 * 86400000) },
        { status: 'Delivered', location: 'Customer Residence, Mumbai', recordedAt: new Date(Date.now() - 1 * 86400000) }
      ]
    });

    await DeliveryTracking.create({
      order: order2._id,
      courier: 'GreenRoute Express',
      trackingNumber: 'GRE-8819234',
      currentStatus: 'in_transit',
      estimatedDelivery: new Date(Date.now() + 86400000),
      route: ['Nashik Farm Gate', 'Pune Distribution Hub'],
      events: [
        { status: 'Picked Up', location: 'Green Valley Farms, Nashik', recordedAt: new Date(Date.now() - 12 * 3600000) },
        { status: 'In Transit', location: 'Pune Highway Checkpoint', recordedAt: new Date(Date.now() - 2 * 3600000) }
      ]
    });

    console.log('⭐ Creating Reviews...');
    await Review.create({
      author: customerRahul._id,
      farmer: profilePriya._id,
      product: mangoes._id,
      rating: 5,
      comment: 'Absolutely divine Alphonso mangoes! Fresh, fragrant, and zero artificial chemical smell.'
    });

    console.log('💬 Creating Messages & Notifications...');
    const conversationId = new mongoose.Types.ObjectId();
    await Message.create({
      conversationId,
      sender: customerRahul._id,
      receiver: farmerPriya._id,
      content: 'Hi Priya, will more mango boxes be available next week?',
      isRead: true
    });

    await Message.create({
      conversationId,
      sender: farmerPriya._id,
      receiver: customerRahul._id,
      content: 'Hello Rahul! Yes, our next harvest is scheduled for Monday!',
      isRead: false
    });

    await Notification.create({
      user: customerRahul._id,
      title: 'Order Delivered!',
      body: 'Your order of Organic Alphonso Mangoes has been delivered.',
      channel: 'in-app',
      readAt: new Date()
    });

    await Notification.create({
      user: customerSneha._id,
      title: 'Order Out for Delivery',
      body: 'Your farm fresh vegetables and basmati rice are on the way!',
      channel: 'push'
    });

    console.log('💼 Creating Wallets...');
    await Wallet.create({
      user: customerRahul._id,
      balance: 3200,
      currency: 'INR',
      transactions: [
        { type: 'credit', amount: 5000, description: 'Added funds via UPI' },
        { type: 'debit', amount: 1800, description: 'Purchase on Direct Farm' }
      ]
    });

    await Wallet.create({
      user: farmerRamesh._id,
      balance: 12500,
      currency: 'INR',
      transactions: [
        { type: 'credit', amount: 12500, description: 'Direct payout for produce orders' }
      ]
    });

    console.log('🤖 Creating AI Predictions...');
    await AiPrediction.create({
      user: farmerRamesh._id,
      farmer: profileRamesh._id,
      product: tomatoes._id,
      type: 'disease',
      inputData: { crop: 'Tomato', humidity: '72%', leafImage: 'sample_leaf.jpg' },
      result: { diseaseName: 'Early Blight', recommendation: 'Apply organic neem oil spray in early morning.' },
      confidence: 0.94
    });

    await AiPrediction.create({
      farmer: profilePriya._id,
      product: mangoes._id,
      type: 'price',
      inputData: { location: 'Ratnagiri', season: 'Peak Summer', grade: 'A+' },
      result: { suggestedPricePerDozen: 1250, marketDemand: 'Very High' },
      confidence: 0.89
    });

    console.log('🎉 DIRECT FARM Database Seeding Completed Successfully!');
    return { success: true };
  } catch (error) {
    console.error('❌ Error during database seeding:', error);
    throw error;
  }
};

// If run directly via command line
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}