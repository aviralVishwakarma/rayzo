import { Link } from "react-router-dom"

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-10 text-sm text-slate-600">

        {/* Brand */}
        <div>
          <Link to="/" className="font-semibold text-slate-800 text-lg mb-3 block">
            Rayzo
          </Link>
          <p>
            AI-powered lung X-ray intelligence for faster, smarter medical diagnosis.
          </p>
          <p className="mt-4 text-xs text-slate-400">
            © 2026 Rayzo. All rights reserved.
          </p>
        </div>

        {/* Product */}
        <div>
          <h4 className="font-semibold text-slate-800 mb-3">Product</h4>
          <ul className="space-y-2">
            <li><Link to="/product#how-it-works" className="hover:text-blue-600">How it works</Link></li>
            <li><Link to="/product#ai-analysis" className="hover:text-blue-600">AI Analysis</Link></li>
            <li><Link to="/product#reports" className="hover:text-blue-600">Reports</Link></li>
            <li><Link to="/product#about" className="hover:text-blue-600">About Team</Link></li>
          </ul>
        </div>

        {/* Access */}
        <div>
          <h4 className="font-semibold text-slate-800 mb-3">Access</h4>
          <ul className="space-y-2">
            <li><Link to="/register" className="hover:text-blue-600">Register</Link></li>
            <li><Link to="/login" className="hover:text-blue-600">Login</Link></li>
          </ul>
        </div>

        {/* Platform */}
        <div>
          <h4 className="font-semibold text-slate-800 mb-3">Platform</h4>
          <ul className="space-y-2">
            <li><Link to="/product" className="hover:text-blue-600">Product Overview</Link></li>
            <li><Link to="/product#how-it-works" className="hover:text-blue-600">Technology Stack</Link></li>
            <li><Link to="/product#ai-analysis" className="hover:text-blue-600">AI Model Details</Link></li>
          </ul>
        </div>

      </div>
    </footer>
  )
}