const express = require('express');
const Stripe = require("stripe");
require("dotenv").config();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

var host = "127.0.0.1";
var port = 5500;

router.post('/create-checkout-session', async (req, res) => {
    const DOMAIN = `http://${host}:${port}`;
    // Extract the product details from req.body
    const { description } = req.body;

    const session = await stripe.checkout.sessions.create({
        // an array of items
        line_items: [
        {
          price_data: {
            currency: 'sgd',
            product_data: {
              name: description,
            },
            unit_amount: 500,
          },
          quantity: 1,
        },
      ],
    //   redirect based on success/failed payment
      mode: 'payment',
      success_url: `${DOMAIN}/payment-success.html`,
      cancel_url: `${DOMAIN}/my-listings.html`,
    });
  
    res.send({url: session.url});
  });

  module.exports = router;