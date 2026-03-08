import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import FeatureList from './FeatureList'
import { COLORS } from '../utils/constants'

export default function PlanCard({
  name,
  price,
  priceSuffix = '',
  description,
  features = [],
  buttonText = 'Get Started',
  isPopular = false,
  accentColor = COLORS.primary,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8, transition: { duration: 0.25 } }}
      className={`relative flex flex-col rounded-2xl bg-white p-8 shadow-lg ring-1 ${
        isPopular
          ? 'ring-2 ring-blue-500 shadow-blue-100 scale-[1.03]'
          : 'ring-slate-200'
      }`}
    >
      {/* Popular badge */}
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold text-white shadow-md"
            style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)' }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Most Popular
          </span>
        </div>
      )}

      {/* Plan name */}
      <h3 className="text-xl font-bold text-slate-900 mt-2">{name}</h3>

      {/* Price */}
      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-4xl font-extrabold tracking-tight text-slate-900">
          {price}
        </span>
        {priceSuffix && (
          <span className="text-base font-medium text-slate-500">{priceSuffix}</span>
        )}
      </div>

      {/* Description */}
      <p className="mt-4 text-sm text-slate-500 leading-relaxed">{description}</p>

      {/* Divider */}
      <div className="my-6 h-px bg-slate-200" />

      {/* Features */}
      <div className="flex-1">
        <FeatureList features={features} />
      </div>

      {/* CTA Button */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="mt-8 w-full rounded-xl py-3.5 text-sm font-semibold text-white shadow-md transition-shadow hover:shadow-lg cursor-pointer"
        style={{
          background: isPopular
            ? `linear-gradient(135deg, ${COLORS.primaryLight} 0%, ${COLORS.primary} 100%)`
            : `linear-gradient(135deg, ${accentColor}dd 0%, ${accentColor} 100%)`,
        }}
      >
        {buttonText}
      </motion.button>
    </motion.div>
  )
}
