const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');

function environment() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_SECRET;

  if (process.env.PAYPAL_ENV === 'live') {
    return new checkoutNodeJssdk.core.LiveEnvironment(clientId, clientSecret); // ✅ live environment
  } else {
    return new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);
  }
}

function client() {
  console.log('🔐 PayPal Env:', {
    PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
    PAYPAL_SECRET: process.env.PAYPAL_SECRET,
    PAYPAL_ENV: process.env.PAYPAL_ENV
  });
  return new checkoutNodeJssdk.core.PayPalHttpClient(environment());
}

module.exports = { client };
