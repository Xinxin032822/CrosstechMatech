const admin = require('firebase-admin');
const functions = require('firebase-functions');
const serviceAccount = require('./serviceAccount.json');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// ───────────────────────────────────────────────────────────────
// Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

// ───────────────────────────────────────────────────────────────
// Email Transporter (using Gmail — better to use SendGrid/Mailgun in production)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS, // app password (not your Gmail password)
  },
});

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
    console.error(
      '❌ Failed to create GCash invoice:',
      error.response?.data || error.message
    );
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
    const fallback =
      error.response?.data?.error_code ===
      'UNAVAILABLE_PAYMENT_METHOD_ERROR';

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
            currency: 'PHP',
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
        console.error(
          '❌ Fallback failed:',
          fallbackError.response?.data || fallbackError.message
        );
        return res
          .status(500)
          .json({ error: 'Both CARD and fallback failed' });
      }
    }

    console.error(
      '❌ Failed to create CARD invoice:',
      error.response?.data || error.message
    );
    res.status(500).json({ error: 'Failed to create CARD invoice' });
  }
});

// ───────────────────────────────────────────────────────────────
// Webhook for Invoice Status
app.post(
  '/webhook/xendit',
  express.json({ type: '*/*' }),
  async (req, res) => {
    const event = req.body;

    console.log('📩 Xendit Webhook Received:', event);

    const invoiceId = event.id;
    const status = event.status;

    try {
      const usersSnapshot = await db.collection('users').get();

      for (const userDoc of usersSnapshot.docs) {
        const ordersRef = db
          .collection('users')
          .doc(userDoc.id)
          .collection('orders');
        const matchingOrderQuery = await ordersRef
          .where('xenditInvoiceId', '==', invoiceId)
          .get();

        for (const orderDoc of matchingOrderQuery.docs) {
          const orderData = orderDoc.data();

          await orderDoc.ref.update({
            paymentStatus: status,
            status: status === 'PAID' ? 'Confirmed' : 'Pending',
          });

          console.log(
            `✅ Updated order ${orderDoc.id} for user ${userDoc.id}`
          );

          // ✅ Send email if payment is successful
          if (status === 'PAID') {
            const mailOptions = {
              from: process.env.EMAIL_USER,
              to: orderData.email,
              subject: 'Order Confirmation - CrosstechMatech',
              text: `Hi ${orderData.fullName},

Thank you for your order! Your payment was successful.

Order Details:
- Product: ${orderData.productName}
- Quantity: ${orderData.quantity}
- Total: ₱${orderData.total}

We’ll process your order soon.

- CrosstechMatech Team`,
            };

            try {
              await transporter.sendMail(mailOptions);
              console.log(`📧 Email sent to ${orderData.email}`);
            } catch (emailError) {
              console.error('❌ Failed to send email:', emailError);
            }
          }
        }
      }

      res.status(200).send('Webhook received and processed.');
    } catch (error) {
      console.error('❌ Webhook processing error:', error);
      res.status(500).send('Error processing webhook.');
    }
  }
);

// ───────────────────────────────────────────────────────────────
// Firebase Export
exports.api = functions.https.onRequest(app);
