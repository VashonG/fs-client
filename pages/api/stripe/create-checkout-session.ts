import type { NextApiRequest, NextApiResponse } from 'next'

import Cors from 'cors'
import Stripe from 'stripe'
import initMiddleware from 'utils/init-middleware'
import rateLimit from 'express-rate-limit'

const cors = initMiddleware(
  Cors({
    methods: ['POST'],
  })
)

const limiter = initMiddleware(
  rateLimit({
    windowMs: 30_000, // 30sec
    max: 4, // Max 4 request per 30 sec
  })
)
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = new Stripe(process.env.STRIPE_SECRET || '', {
  apiVersion: '2020-08-27',
})

export default async function handler(
  request: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  await cors(request, res)
  await limiter(request, res)
  if (request.method === 'POST') {
    const { priceId } = request.body

    // See https://stripe.com/docs/api/checkout/sessions/create
    // for additional parameters to pass.
    try {
      const session = request.body.customerId
        ? await stripe.checkout.sessions.create({
            mode: request.body.pay_mode,
            payment_method_types: ['card'],
            client_reference_id: request.body.userId,
            metadata: {
              priceId: request.body.priceId,
            },
            customer: request.body.customerId,
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
            success_url: `${request.headers.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${request.headers.origin}/pricing`,
          })
        : await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            customer_email: request.body.email,
            client_reference_id: request.body.userId,
            metadata: {
              priceId: request.body.priceId,
            },
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
            success_url: `${request.headers.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${request.headers.origin}/pricing`,
          })
      res.status(200).send({ url: session.url })
    } catch (error: unknown) {
      res.status(400)
      if (error instanceof Error) {
        return res.send({
          error: {
            message: error.message,
          },
        })
      }
    }
  }
}
