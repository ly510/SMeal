// This is your test publishable API key.
const stripe = Stripe("pk_test_51O8fhHLuDBv83vNNW2jYFmazyaK8aMx7AX8wbsNOK2k1SMV7y7qFQAZROY1LV0JR7M7LdSDpjWqQgTMTH3LGvmcR00yuYBHEnU");

initialize();

// Create a Checkout Session as soon as the page loads
async function initialize() {
  const response = await fetch("/create-checkout-session", {
    method: "POST",
  });

  const { clientSecret } = await response.json();

  const checkout = await stripe.initEmbeddedCheckout({
    clientSecret,
  });

  // Mount Checkout
  checkout.mount('#checkout');
}