/* Dont forget to create your customer portal on Stripe 
https://dashboard.stripe.com/test/settings/billing/portal */
import type { NextApiRequest, NextApiResponse } from 'next'

import Cors from 'cors'
import Stripe from 'stripe'
import initMiddleware from 'utils/init-middleware'
import rateLimit from 'express-rate-limit'

const cors = initMiddleware(
  Cors({
    methods: ['POST', 'PUT'],
  })
)

const limiter = initMiddleware(
  rateLimit({
    windowMs: 30_000, // 30sec
    max: 150, // Max 4 request per 30 sec
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
    const returnUrl = `${request.headers.origin}/dashboard` // Stripe will return to the dashboard, you can change it

    const portalsession = await stripe.billingPortal.sessions.create({
      customer: request.body.customerId,
      return_url: returnUrl,
    })
    res.status(200).send({ url: portalsession.url })
  }
}
