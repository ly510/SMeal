const express = require('express');
const Stripe = require("stripe");
require("dotenv").config();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

var host = "0.0.0.0";
var port = 5500;

router.post('/create-checkout-session', async (req, res) => {
    const DOMAIN = `http://${host}:${port}`;
    // Extract the product details from req.body
    const { description, listingID, price } = req.body;
    // const listingID = req.body.listingID;

    if (price === null || price === undefined) {
      res.status(400).send({
        error: 'Product price missing.',
      });
      return;
    }
    const session = await stripe.checkout.sessions.create({
        // an array of items
        line_items: [
        {
          price_data: {
            currency: 'sgd',
            product_data: {
              name: description,
            },
            unit_amount: price * 100,
          },
          quantity: 1,
        },
      ],
    //   redirect based on success/failed payment
      mode: 'payment',
      success_url: `${DOMAIN}/my-listings.html?payment=success&listingID=${listingID}`,
      cancel_url: `${DOMAIN}/my-listings.html?payment=canceled&listingID=${listingID}`,
    });
  
    res.send({url: session.url});
  });

  module.exports = router;