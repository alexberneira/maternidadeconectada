'use client'

import Link from 'next/link'
import { Crown, Star } from 'lucide-react'

export default function SubscriptionBanner() {
  return (
    <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl p-6 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-white bg-opacity-20 p-3 rounded-full">
            <Crown className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-1">
              Upgrade para Premium
            </h3>
            <p className="text-pink-100">
              Acesse todo o conteúdo exclusivo por apenas R$ 39/mês
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="flex items-center space-x-1 text-yellow-300">
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
            </div>
            <p className="text-sm text-pink-100">
              +1000 mães já assinaram
            </p>
          </div>
          
          <Link
            href="/subscription"
            className="bg-white text-pink-600 px-6 py-2 rounded-md font-medium hover:bg-pink-50 transition-colors"
          >
            Assinar Agora
          </Link>
        </div>
      </div>
    </div>
  )
} 