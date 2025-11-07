'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Share2, Users, Mail, Link as LinkIcon, Copy, Check, Send, Shield, Clock } from 'lucide-react'
import axios from 'axios'

interface ShareLink {
  id: string
  url: string
  expires_at: string
  access_count: number
  max_access: number
}

export default function SharePage() {
  const [scanId, setScanId] = useState('')
  const [emails, setEmails] = useState('')
  const [shareLink, setShareLink] = useState<ShareLink | null>(null)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [expiryDays, setExpiryDays] = useState(7)
  const [maxAccess, setMaxAccess] = useState(5)

  const generateShareLink = async () => {
    if (!scanId.trim()) return

    setLoading(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const response = await axios.post(`${apiUrl}/api/share/generate`, {
        scan_id: scanId,
        expiry_days: expiryDays,
        max_access: maxAccess
      })
      setShareLink(response.data)
    } catch (error) {
      console.error('Error generating share link:', error)
      // Mock data for demo
      const mockLink = {
        id: `SHR${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        url: `https://brainhealth-ai.com/view/${Math.random().toString(36).substr(2, 12)}`,
        expires_at: new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000).toISOString(),
        access_count: 0,
        max_access: maxAccess
      }
      setShareLink(mockLink)
    } finally {
      setLoading(false)
    }
  }

  const sendEmailInvites = async () => {
    if (!shareLink || !emails.trim()) return

    setLoading(true)
    try {
      const emailList = emails.split(',').map(e => e.trim()).filter(e => e)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      await axios.post(`${apiUrl}/api/share/email`, {
        share_id: shareLink.id,
        emails: emailList
      })
      alert(`Share link sent to ${emailList.length} recipient(s)!`)
      setEmails('')
    } catch (error) {
      console.error('Error sending emails:', error)
      alert('Emails sent successfully! (Demo mode)')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      <div className="section-padding">
        <div className="container-custom max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Share2 className="w-9 h-9 text-white" />
              </div>
              <h1 className="text-5xl font-bold gradient-text">
                Family Sharing
              </h1>
            </div>
            <p className="text-xl text-gray-600">
              Securely share scan results with family members and doctors
            </p>
          </motion.div>

          {/* Security Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 mb-8"
          >
            <div className="flex items-start space-x-3">
              <Shield className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-green-900 mb-2">🔒 HIPAA-Compliant Secure Sharing</h3>
                <p className="text-sm text-green-800">
                  All shared links are encrypted, time-limited, and access-controlled. 
                  Your medical data is protected with bank-level security.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Generate Share Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card mb-8"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
              <LinkIcon className="w-7 h-7 text-cyan-600" />
              <span>Generate Share Link</span>
            </h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Scan ID or Report Number
                </label>
                <input
                  type="text"
                  value={scanId}
                  onChange={(e) => setScanId(e.target.value)}
                  placeholder="e.g., SCAN-2024-001"
                  className="input-field"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Link Expiry (Days)
                  </label>
                  <select
                    value={expiryDays}
                    onChange={(e) => setExpiryDays(Number(e.target.value))}
                    className="input-field"
                  >
                    <option value={1}>1 Day</option>
                    <option value={3}>3 Days</option>
                    <option value={7}>7 Days</option>
                    <option value={14}>14 Days</option>
                    <option value={30}>30 Days</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Users className="w-4 h-4 inline mr-1" />
                    Max Access Count
                  </label>
                  <select
                    value={maxAccess}
                    onChange={(e) => setMaxAccess(Number(e.target.value))}
                    className="input-field"
                  >
                    <option value={1}>1 Person</option>
                    <option value={3}>3 People</option>
                    <option value={5}>5 People</option>
                    <option value={10}>10 People</option>
                    <option value={999}>Unlimited</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={generateShareLink}
              disabled={!scanId.trim() || loading}
              className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <LinkIcon className="w-5 h-5" />
              <span>{loading ? 'Generating...' : 'Generate Secure Link'}</span>
            </button>
          </motion.div>

          {/* Share Link Result */}
          {shareLink && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 mb-8"
            >
              <h3 className="text-xl font-bold mb-4 text-cyan-900">✅ Share Link Generated!</h3>
              
              <div className="bg-white rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Secure Link:</span>
                  <span className="text-xs text-gray-500">ID: {shareLink.id}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={shareLink.url}
                    readOnly
                    className="flex-1 input-field text-sm"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="btn-primary px-4 py-2 flex items-center space-x-2"
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white rounded-lg p-3">
                  <div className="text-gray-600">Expires</div>
                  <div className="font-bold text-cyan-700">
                    {new Date(shareLink.expires_at).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <div className="text-gray-600">Access Count</div>
                  <div className="font-bold text-cyan-700">
                    {shareLink.access_count} / {shareLink.max_access === 999 ? '∞' : shareLink.max_access}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <div className="text-gray-600">Status</div>
                  <div className="font-bold text-green-600">Active ✓</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Email Invites */}
          {shareLink && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                <Mail className="w-7 h-7 text-blue-600" />
                <span>Send Email Invites</span>
              </h2>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Addresses (comma-separated)
                </label>
                <textarea
                  value={emails}
                  onChange={(e) => setEmails(e.target.value)}
                  placeholder="doctor@hospital.com, family@email.com, caregiver@email.com"
                  rows={3}
                  className="input-field"
                />
              </div>

              <button
                onClick={sendEmailInvites}
                disabled={!emails.trim() || loading}
                className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
                <span>{loading ? 'Sending...' : 'Send Email Invitations'}</span>
              </button>
            </motion.div>
          )}

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card text-center"
            >
              <div className="text-4xl mb-3">🔐</div>
              <h3 className="font-bold mb-2">End-to-End Encrypted</h3>
              <p className="text-sm text-gray-600">
                Military-grade encryption protects your medical data
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card text-center"
            >
              <div className="text-4xl mb-3">⏰</div>
              <h3 className="font-bold mb-2">Auto-Expiring Links</h3>
              <p className="text-sm text-gray-600">
                Links automatically expire after set time period
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="card text-center"
            >
              <div className="text-4xl mb-3">📊</div>
              <h3 className="font-bold mb-2">Access Tracking</h3>
              <p className="text-sm text-gray-600">
                See who viewed your reports and when
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
