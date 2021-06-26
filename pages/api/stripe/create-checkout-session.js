import Cors from "cors";
import initMiddleware from "utils/init-middleware";

const rateLimit = require("express-rate-limit");

const cors = initMiddleware(
  Cors({
    methods: ["POST"],
  })
);

const limiter = initMiddleware(
  rateLimit({
    windowMs: 30000, // 30sec
    max: 4, // Max 4 request per 30 sec
  })
);
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = require("stripe")(process.env.STRIPE_SECRET);

export default async function handler(req, res) {
  await cors(req, res);
  await limiter(req, res);
  if (req.method === "POST") {
    const priceId = req.body.priceId;

    // See https://stripe.com/docs/api/checkout/sessions/create
    // for additional parameters to pass.
    try {
      const session = req.body.customerId
        ? await stripe.checkout.sessions.create({
            mode: "subscription",
            payment_method_types: ["card"],
            client_reference_id: req.body.userId,
            metadata: { token: req.body.tokenId, priceId: req.body.priceId },
            customer: req.body.customerId,
            line_items: [
              {
                price: priceId,
                // For metered billing, do not pass quantity
                quantity: 1,
              },
            ],
            // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
            // the actual Session ID is returned in the query parameter when your customer
            // is redirected to the success page.
            success_url: `${req.headers.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}/dashboard?session_id=canceled`,
          })
        : await stripe.checkout.sessions.create({
            mode: "subscription",
            payment_method_types: ["card"],
            customer_email: req.body.email,
            client_reference_id: req.body.userId,
            metadata: { token: req.body.tokenId, priceId: req.body.priceId },
            line_items: [
              {
                price: priceId,
                // For metered billing, do not pass quantity
                quantity: 1,
              },
            ],
            // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
            // the actual Session ID is returned in the query parameter when your customer
            // is redirected to the success page.
            success_url: `${req.headers.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
          });

      res.send({
        sessionId: session.id,
      });
    } catch (e) {
      res.status(400);
      return res.send({
        error: {
          message: e.message,
        },
      });
    }
  }
}