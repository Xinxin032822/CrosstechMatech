const admin = require('firebase-admin');
const functions = require('firebase-functions')
const serviceAccount = require('./serviceAccount.json');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const { client } = require('./paypalClient');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

// ───────────────────────────────────────────────────────────────
// GCash Invoice Creation
app.post('/create-gcash-invoice', async (req, res) => {
  const { amount, name, email } = req.body;

  try {
    const response = await axios.post(
      'https://api.xendit.co/v2/invoices',
      {
        external_id: `invoice-${Date.now()}`,
        payer_email: email,
        description: `Payment for ${name}`,
        amount: amount,
        currency: 'PHP',
        payment_methods: ['GCASH'],
      },
      {
        auth: {
          username: process.env.XENDIT_SECRET_KEY,
          password: '',
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('❌ Failed to create GCash invoice:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to create GCash invoice' });
  }
});

// ───────────────────────────────────────────────────────────────
// Credit Card Payment Endpoint
app.post('/create-card-invoice', async (req, res) => {
  const { amount, name, email } = req.body;

  try {
    const response = await axios.post(
      'https://api.xendit.co/v2/invoices',
      {
        external_id: `invoice-${Date.now()}`,
        payer_email: email,
        description: `Card payment for ${name}`,
        amount: amount,
        currency: 'PHP',
        // fallback to no method if CARD fails
        // Xendit will auto-display the available method (likely GCash only for now)
        payment_methods: ['CARD'],
      },
      {
        auth: {
          username: process.env.XENDIT_SECRET_KEY,
          password: '',
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    const fallback = error.response?.data?.error_code === 'UNAVAILABLE_PAYMENT_METHOD_ERROR';

    if (fallback) {
      console.warn('⚠️ Falling back to available methods (e.g., GCash)');
      try {
        const fallbackResponse = await axios.post(
          'https://api.xendit.co/v2/invoices',
          {
            external_id: `invoice-${Date.now()}`,
            payer_email: email,
            description: `Fallback payment for ${name}`,
            amount: amount,
            currency: 'PHP'
          },
          {
            auth: {
              username: process.env.XENDIT_SECRET_KEY,
              password: '',
            },
          }
        );
        return res.json(fallbackResponse.data);
      } catch (fallbackError) {
        console.error('❌ Fallback failed:', fallbackError.response?.data || fallbackError.message);
        return res.status(500).json({ error: 'Both CARD and fallback failed' });
      }
    }

    console.error('❌ Failed to create CARD invoice:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to create CARD invoice' });
  }
});

// ───────────────────────────────────────────────────────────────
// Paypal Payment Endpoint

app.post('/create-paypal-order', async (req, res) => {
  const { amount, currency = 'PHP' } = req.body;

  const request = new (require('@paypal/checkout-server-sdk')).orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: currency,
        value: amount.toFixed(2),
      },
    }],
  });

  try {
    const order = await client().execute(request);
    res.status(200).json(order.result);
  } catch (err) {
    console.error("❌ PayPal order creation failed:", err);
    res.status(500).json({ error: 'Failed to create PayPal order' });
  }
});

// ───────────────────────────────────────────────────────────────
// Paypal Capture Payment Endpoint

app.post('/capture-paypal-order', async (req, res) => {
  const { orderId } = req.body;

  const request = new (require('@paypal/checkout-server-sdk')).orders.OrdersCaptureRequest(orderId);
  request.requestBody({});

  try {
    const capture = await client().execute(request);
    res.status(200).json(capture.result);
  } catch (err) {
    console.error("❌ PayPal order capture failed:", err);
    res.status(500).json({ error: 'Failed to capture PayPal order' });
  }
});

// ───────────────────────────────────────────────────────────────
// Paypal Webhook for Invoice Status

app.post('/webhook/paypal', async (req, res) => {
  const event = req.body;
  console.log("📩 PayPal Webhook Received:", event);

  // Process event types like PAYMENT.CAPTURE.COMPLETED
  res.status(200).send("Webhook received.");
});


// ───────────────────────────────────────────────────────────────
// Webhook for Invoice Status
app.post('/webhook/xendit', express.json({ type: '*/*' }), async (req, res) => {
  const event = req.body;

  console.log("📩 Xendit Webhook Received:", event);

  const invoiceId = event.id;
  const status = event.status;

  try {
    const usersSnapshot = await db.collection('users').get();

    for (const userDoc of usersSnapshot.docs) {
      const ordersRef = db.collection('users').doc(userDoc.id).collection('orders');
      const matchingOrderQuery = await ordersRef.where('xenditInvoiceId', '==', invoiceId).get();

      for (const orderDoc of matchingOrderQuery.docs) {
        await orderDoc.ref.update({
          paymentStatus: status,
          status: status === 'PAID' ? 'Confirmed' : 'Pending',
        });

        console.log(`✅ Updated order ${orderDoc.id} for user ${userDoc.id}`);
      }
    }

    res.status(200).send("Webhook received and processed.");
  } catch (error) {
    console.error("❌ Webhook processing error:", error);
    res.status(500).send("Error processing webhook.");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
})

exports.api = functions.https.onRequest(app);