const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay (you'll need to add your keys to environment variables)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'your_razorpay_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_razorpay_key_secret'
});

// Create order
router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, itemType, itemId } = req.body;

    if (!amount || !receipt || !itemType || !itemId) {
      return res.status(400).json({ 
        message: 'Amount, receipt, itemType, and itemId are required' 
      });
    }

    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt,
      notes: {
        itemType,
        itemId
      }
    };

    const order = await razorpay.orders.create(options);
    
    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID || 'your_razorpay_key_id'
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({ 
      message: 'Failed to create order', 
      error: error.message 
    });
  }
});

// Verify payment
router.post('/verify-payment', async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      itemType,
      itemId 
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ 
        message: 'Missing payment verification parameters' 
      });
    }

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'your_razorpay_key_secret')
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ 
        message: 'Payment verification failed' 
      });
    }

    // Payment is verified, you can now:
    // 1. Update database with purchase record
    // 2. Send download link
    // 3. Send confirmation email
    
    // For now, we'll just return success
    res.json({
      success: true,
      message: 'Payment verified successfully',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ 
      message: 'Payment verification failed', 
      error: error.message 
    });
  }
});

// Get payment details
router.get('/payment/:paymentId', async (req, res) => {
  try {
    const payment = await razorpay.payments.fetch(req.params.paymentId);
    res.json(payment);
  } catch (error) {
    console.error('Fetch payment error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch payment details', 
      error: error.message 
    });
  }
});

// Refund payment (admin only)
router.post('/refund', async (req, res) => {
  try {
    const { paymentId, amount, reason } = req.body;

    if (!paymentId) {
      return res.status(400).json({ message: 'Payment ID is required' });
    }

    const refundOptions = {
      amount: amount ? amount * 100 : undefined, // Partial refund if amount specified
      notes: {
        reason: reason || 'Refund requested'
      }
    };

    const refund = await razorpay.payments.refund(paymentId, refundOptions);
    
    res.json({
      success: true,
      refund,
      message: 'Refund processed successfully'
    });

  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({ 
      message: 'Refund failed', 
      error: error.message 
    });
  }
});

// Webhook to handle payment events
router.post('/webhook', (req, res) => {
  try {
    const webhookSignature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'your_webhook_secret';
    
    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (webhookSignature !== expectedSignature) {
      return res.status(400).json({ message: 'Invalid webhook signature' });
    }

    const event = req.body.event;
    const paymentEntity = req.body.payload.payment.entity;

    switch (event) {
      case 'payment.captured':
        // Handle successful payment
        console.log('Payment captured:', paymentEntity.id);
        // Update your database, send confirmation email, etc.
        break;
        
      case 'payment.failed':
        // Handle failed payment
        console.log('Payment failed:', paymentEntity.id);
        break;
        
      default:
        console.log('Unhandled webhook event:', event);
    }

    res.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ message: 'Webhook processing failed' });
  }
});

module.exports = router;