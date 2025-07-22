const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

app.post('/create-gcash-invoice', async (req, res) => {
  const { amount, name, email, userId, formData, productInfo } = req.body;

  try {
    const response = await axios.post('https://api.xendit.co/v2/invoices', {
      external_id: 'invoice-' + Date.now(),
      payer_email: email,
      description: `Payment for ${name}`,
      amount: amount,
      currency: 'PHP',
      payment_methods: ['GCASH'],
    }, {
      auth: {
        username: process.env.XENDIT_SECRET_KEY,
        password: '',
      },
    });

    const invoice = response.data;


    await db.collection('users').doc(userId).collection('orders').add({
      ...formData,
      ...productInfo,
      xenditInvoiceId: invoice.id,
      paymentStatus: 'Pending',
      status: 'Pending',
      createdAt: new Date(),
    });

    res.json(invoice); // Send invoice back to frontend
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to create GCash invoice' });
  }
});


app.post('/webhook/xendit', express.json({ type: '*/*' }), async (req, res) => {
  const event = req.body;

  console.log("Xendit Webhook:", event);

  const invoiceId = event.id;
  const status = event.status;

  try {
    const usersSnapshot = await db.collection('users').get();

    usersSnapshot.forEach(async userDoc => {
      const ordersRef = db.collection('users').doc(userDoc.id).collection('orders');
      const matchingOrderQuery = await ordersRef.where('xenditInvoiceId', '==', invoiceId).get();

      matchingOrderQuery.forEach(async orderDoc => {
        await orderDoc.ref.update({
          paymentStatus: status,
          status: status === 'Paid' ? 'Confirmed' : 'Pending',
        });

        console.log(`✅ Updated order ${orderDoc.id} for user ${userDoc.id}`);
      });
    });

    res.status(200).send("Webhook received and processed.");
  } catch (error) {
    console.error("❌ Webhook error:", error);
    res.status(500).send("Error processing webhook");
  }
});



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

