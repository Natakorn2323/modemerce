export type PaymentMethod = 'promptpay' | 'card' | 'internet_banking'

const FEE_RATES: Record<PaymentMethod, number> = {
  promptpay:        0.0165,
  card:              0.0365,
  internet_banking: 0.0165,
}

const FEE_LABELS: Record<PaymentMethod, string> = {
  promptpay:        'PromptPay QR',
  card:              'บัตรเครดิต/เดบิต',
  internet_banking: 'Internet Banking',
}

export function calculateFee(amount: number, method: PaymentMethod) {
  const rate          = FEE_RATES[method]
  const platformFee   = Math.round(amount * rate * 100) / 100
  const sellerPayout  = Math.round((amount - platformFee) * 100) / 100

  return {
    rate,
    ratePercent:  (rate * 100).toFixed(2) + '%',
    platformFee,
    sellerPayout,
    label:        FEE_LABELS[method],
  }
}

export function getAllFeeRates() {
  return Object.entries(FEE_RATES).map(([method, rate]) => ({
    method,
    label:       FEE_LABELS[method as PaymentMethod],
    ratePercent: (rate * 100).toFixed(2) + '%',
  }))
}