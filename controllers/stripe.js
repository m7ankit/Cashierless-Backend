const stripe = require("stripe")(process.env.STRIPE_SECRET);
const uuid = require("uuid/v4");

exports.makePayment = (req, res) => {
  const { products, token } = req.body;

  let amount = 0;
  products.map((p) => {
    amount = amount + p.price * p.count;
  });

  const idempotencyKey = uuid();

  // 1. Create a customer
  // 2. Charge the customer
  // 3. Send response

  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges
        .create(
          {
            amount: amount * 100,
            currency: "inr",
            customer: customer.id,
            receipt_email: token.email,
            description: "Test account",
            shipping: {
              name: token.card.name,
              address: {
                line1: token.card.address_line1,
                line2: token.card.address_line2,
                city: token.card.address_city,
                country: token.card.address_country,
              },
            },
          },
          { idempotencyKey }
        )
        .then((result) => {
          res.status(200).json(result);
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json({
            error: "Payment Declined",
          });
        });
    });
};
