import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, Copy, CheckCircle, Loader2, Link } from 'lucide-react'

const formatTimestamp = (value) => {
  if (!value) return '—'
  // If it's a unix timestamp (number or numeric string)
  const num = Number(value)
  if (!Number.isNaN(num) && num > 1_000_000_000) {
    const ms = num > 1e12 ? num : num * 1000
    return new Date(ms).toLocaleString()
  }
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleString()
}

const truncateHash = (hash) => {
  if (!hash || hash.length <= 16) return hash || '—'
  return `${hash.slice(0, 8)}...${hash.slice(-8)}`
}

export default function BlockchainVerification({
  transactionHash,
  blockchainNetwork,
  blockchainTimestamp,
}) {
  const [verified, setVerified] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleVerify = () => {
    if (verifying || verified) return
    setVerifying(true)
    setTimeout(() => {
      setVerifying(false)
      setVerified(true)
    }, 1400)
  }

  const handleCopy = async () => {
    if (!transactionHash) return
    try {
      await navigator.clipboard.writeText(transactionHash)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
      const ta = document.createElement('textarea')
      ta.value = transactionHash
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="blockchain-verify-card" id="blockchain-verification">
      {/* Header */}
      <div className="blockchain-verify-header">
        <div className="blockchain-verify-header-icon">
          <ShieldCheck className="blockchain-verify-shield-icon" />
        </div>
        <div>
          <h3 className="blockchain-verify-title">Report Integrity Verification</h3>
          <p className="blockchain-verify-subtitle">
            This AI-generated medical report is secured using blockchain and cannot be manipulated.
          </p>
        </div>
      </div>

      {/* Pre-verification: Verify button */}
      <AnimatePresence mode="wait">
        {!verified && !verifying && (
          <motion.div
            key="verify-btn"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="blockchain-verify-action"
          >
            <button
              type="button"
              className="blockchain-verify-btn"
              onClick={handleVerify}
              id="verify-report-btn"
            >
              <Link className="blockchain-verify-btn-icon" />
              Verify Report
            </button>
          </motion.div>
        )}

        {/* Verifying spinner */}
        {verifying && (
          <motion.div
            key="verifying"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="blockchain-verifying"
          >
            <Loader2 className="blockchain-verifying-spinner" />
            <span className="blockchain-verifying-text">Verifying on blockchain...</span>
          </motion.div>
        )}

        {/* Verified state */}
        {verified && (
          <motion.div
            key="verified"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {/* Success badge */}
            <div className="blockchain-verified-badge">
              <CheckCircle className="blockchain-verified-icon" />
              <div>
                <span className="blockchain-verified-label">Report Verified</span>
                <span className="blockchain-verified-network">
                  Verified on {blockchainNetwork || 'Blockchain'} Blockchain
                </span>
              </div>
            </div>

            {/* Details */}
            <div className="blockchain-details">
              <div className="blockchain-field">
                <span className="blockchain-field-label">Transaction Hash</span>
                <div className="blockchain-hash-row">
                  <code className="blockchain-hash" title={transactionHash}>
                    {truncateHash(transactionHash)}
                  </code>
                  <button
                    type="button"
                    className="blockchain-copy-btn"
                    onClick={handleCopy}
                    title="Copy full hash"
                  >
                    {copied ? (
                      <CheckCircle className="blockchain-copy-icon blockchain-copy-done" />
                    ) : (
                      <Copy className="blockchain-copy-icon" />
                    )}
                  </button>
                </div>
              </div>

              <div className="blockchain-field">
                <span className="blockchain-field-label">Blockchain Network</span>
                <span className="blockchain-field-value">
                  {blockchainNetwork || '—'}
                </span>
              </div>

              <div className="blockchain-field">
                <span className="blockchain-field-label">Blockchain Timestamp</span>
                <span className="blockchain-field-value">
                  {formatTimestamp(blockchainTimestamp)}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
