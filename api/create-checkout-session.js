// This runs on Vercel's server, never in the visitor's browser.
// It uses your SECRET key (from an environment variable, never hard-coded)
// to ask Stripe to create a secure, Stripe-hosted checkout page.

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

  module.exports = async (req, res) => {
      if (req.method !== 'POST') {
            res.setHeader('Allow', 'POST');
              return res.status(405).json({ error: 'Method not allowed' });
            }

              try {
                const origin = req.headers.origin || `https://${req.headers.host}`;

                const session = await stripe.checkout.sessions.create({
                    payment_method_types: ['card'],
                      mode: 'payment',
                      line_items: [
                        {
                          price_data: {
                            currency: 'eur',
                            product_data: {
                              name: 'AIptieka Reservation Deposit',
                              description: 'Reserve your pickup lane',
                            },
                            unit_amount: 500,
                          },
                          quantity: 1,
                        },
                      ],
                      success_url: `${origin}/success.html`,
                      cancel_url: `${origin}/cancel.html`,
                      });

                      res.status(200).json({ url: session.url });
                      } catch (err) {
                        console.error(err);
                        res.status(500).json({ error: err.message });
                      }
                    };
                      
