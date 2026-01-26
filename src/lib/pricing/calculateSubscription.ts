// Subscription Pricing Calculator for Trainer Onboarding
// Calculates monthly subscription cost based on trainer profile data

export type TrainerCategory = 'Individual/Artisan/Small Business' | 'Company'
export type CommitmentType = 'Full-time' | 'Part-time'
export type CurriculumType = 'own' | 'prentis' | 'custom' | 'later' | null

export type PricingInput = {
  trainerCategory: TrainerCategory
  requestPrentisTeaching: boolean
  typicalCommitment: CommitmentType
  primaryIndustry: string
  prentisAccreditation: boolean
  outcomeIntent: string[]
  curriculumType?: CurriculumType
}

export type AddOn = {
  name: string
  amount: number
}

export type PricingBreakdown = {
  baseTier: { name: string; amount: number }
  addOns: AddOn[]
  industryMultiplier: { industry: string; multiplier: number }
  subtotal: number
  total: number
}

// Base tier pricing (in Naira)
const BASE_PRICES = {
  'Individual/Artisan/Small Business': 10000, // ₦10k
  'Company': 50000 // ₦50k
}

// Teaching team add-on pricing (in Naira)
const TEACHING_ADD_ONS = {
  'Individual/Artisan/Small Business': {
    'Part-time': 30000, // ₦30k
    'Full-time': 60000  // ₦60k
  },
  'Company': {
    'Part-time': 80000,  // ₦80k
    'Full-time': 150000  // ₦150k
  }
}

// Fixed add-on prices
const ACCREDITATION_PRICE = 25000 // ₦25k
const DIRECT_HIRE_PRICE = 20000   // ₦20k

// Curriculum pricing (in Naira)
const CURRICULUM_PRICES = {
  'prentis': 15000,  // ₦15k for ready-made Prentis curriculum
  'custom': 35000,   // ₦35k for custom Prentis curriculum
  'own': 0,          // No charge for own curriculum
  'later': 0         // No charge (decide later)
}

// Industry multipliers
const INDUSTRY_MULTIPLIERS: Record<string, { category: string; multiplier: number }> = {
  // Basic Trades - 1.0x
  'Fashion & Textiles': { category: 'Basic Trades', multiplier: 1.0 },
  'Woodwork & Furniture': { category: 'Basic Trades', multiplier: 1.0 },
  'Food & Beverage': { category: 'Basic Trades', multiplier: 1.0 },
  'Beauty & Cosmetics': { category: 'Basic Trades', multiplier: 1.0 },
  'Agriculture': { category: 'Basic Trades', multiplier: 1.0 },

  // Skilled Trades - 1.25x
  'Metalwork & Fabrication': { category: 'Skilled Trades', multiplier: 1.25 },
  'Hardware & Construction': { category: 'Skilled Trades', multiplier: 1.25 },
  'Automotive': { category: 'Automotive', multiplier: 1.25 },

  // Technical - 1.5x
  'Technology & Electronics': { category: 'Technical', multiplier: 1.5 },

  // Professional - 1.75x
  'Logistics & Transportation': { category: 'Professional', multiplier: 1.75 },

  // Default for "Other" or unknown industries
  'Other': { category: 'General', multiplier: 1.0 }
}

export function calculateSubscription(input: PricingInput): PricingBreakdown {
  const addOns: AddOn[] = []

  // 1. Get base tier price
  const baseTierName = input.trainerCategory === 'Company' ? 'Corporate' : 'Artisan'
  const baseAmount = BASE_PRICES[input.trainerCategory]

  // 2. Calculate teaching team add-on if requested (Full-time costs more than Part-time)
  if (input.requestPrentisTeaching) {
    const teachingAmount = TEACHING_ADD_ONS[input.trainerCategory][input.typicalCommitment]
    const commitmentLabel = input.typicalCommitment === 'Full-time' ? 'Full-time' : 'Part-time'
    addOns.push({
      name: `Prentis Teaching Team (${commitmentLabel})`,
      amount: teachingAmount
    })
  }

  // 3. Add accreditation if enabled
  if (input.prentisAccreditation) {
    addOns.push({
      name: 'Prentis Accreditation',
      amount: ACCREDITATION_PRICE
    })
  }

  // 4. Add direct hire if selected in outcome intent
  if (input.outcomeIntent.includes('Direct Hire')) {
    addOns.push({
      name: 'Direct Hire Access',
      amount: DIRECT_HIRE_PRICE
    })
  }

  // 5. Add curriculum pricing if using Prentis curriculum
  if (input.curriculumType && CURRICULUM_PRICES[input.curriculumType] > 0) {
    const curriculumAmount = CURRICULUM_PRICES[input.curriculumType]
    const curriculumLabel = input.curriculumType === 'prentis'
      ? 'Prentis Ready-Made Curriculum'
      : 'Custom Prentis Curriculum'
    addOns.push({
      name: curriculumLabel,
      amount: curriculumAmount
    })
  }

  // 6. Get industry multiplier
  const industryData = INDUSTRY_MULTIPLIERS[input.primaryIndustry] || INDUSTRY_MULTIPLIERS['Other']

  // 7. Calculate totals
  const addOnsTotal = addOns.reduce((sum, addon) => sum + addon.amount, 0)
  const subtotal = baseAmount + addOnsTotal
  const total = Math.round(subtotal * industryData.multiplier)

  return {
    baseTier: {
      name: baseTierName,
      amount: baseAmount
    },
    addOns,
    industryMultiplier: {
      industry: input.primaryIndustry,
      multiplier: industryData.multiplier
    },
    subtotal,
    total
  }
}

// Helper to format currency in Naira
export function formatNaira(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount).replace('NGN', '₦')
}

// Helper to get tier display name
export function getTierDisplayName(category: TrainerCategory): string {
  return category === 'Company' ? 'Corporate' : 'Artisan'
}
