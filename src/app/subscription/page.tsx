"use client"

import { useState } from "react"

export default function SubscriptionPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubscribe = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError("Erro ao redirecionar para o pagamento.")
      }
    } catch (err) {
      setError("Erro ao iniciar assinatura.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Assine e tenha acesso total!</h1>
        <p className="text-lg text-gray-600 mb-6">
          7 dias grátis, depois <span className="font-bold text-pink-600">R$ 39/mês</span>.
          Cancele quando quiser.
        </p>
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">{error}</div>}
        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="w-full py-3 px-6 bg-pink-600 text-white rounded-md font-bold text-lg hover:bg-pink-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Redirecionando..." : "Assinar Agora"}
        </button>
        <p className="text-xs text-gray-400 mt-4">Pagamento 100% seguro via Stripe</p>
      </div>
    </div>
  )
} 