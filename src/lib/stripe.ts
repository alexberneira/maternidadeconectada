import Stripe from 'stripe'

let stripe: Stripe | null = null

export const getStripe = () => {
  if (!stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY não está configurada')
    }
    
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-05-28.basil',
      typescript: true,
    })
  }
  
  return stripe
}

// Para compatibilidade com imports existentes
export { getStripe as stripe } 