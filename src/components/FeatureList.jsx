import { CheckCircle } from 'lucide-react'

export default function FeatureList({ features = [] }) {
  return (
    <ul className="space-y-3">
      {features.map((feature, i) => (
        <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
          <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  )
}
