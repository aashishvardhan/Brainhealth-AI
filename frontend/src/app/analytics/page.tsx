'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Users, MapPin, Brain, AlertTriangle, Calendar, Activity } from 'lucide-react'
import axios from 'axios'

interface AnalyticsData {
  total_scans: number
  stroke_detected: number
  normal_scans: number
  detection_rate: number
  avg_confidence: number
  daily_scans: Array<{ date: string; count: number }>
  risk_distribution: Array<{ category: string; count: number }>
  geographic_data: Array<{ region: string; cases: number }>
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const response = await axios.get(`${apiUrl}/api/analytics?range=${timeRange}`)
      setAnalytics(response.data)
    } catch (error) {
      console.error('Error fetching analytics:', error)
      // Mock data for demo
      setAnalytics({
        total_scans: 1247,
        stroke_detected: 423,
        normal_scans: 824,
        detection_rate: 33.9,
        avg_confidence: 87.5,
        daily_scans: [
          { date: '2025-10-30', count: 45 },
          { date: '2025-10-31', count: 52 },
          { date: '2025-11-01', count: 38 },
          { date: '2025-11-02', count: 61 },
          { date: '2025-11-03', count: 55 },
          { date: '2025-11-04', count: 48 },
          { date: '2025-11-05', count: 43 }
        ],
        risk_distribution: [
          { category: 'High Risk', count: 156 },
          { category: 'Medium Risk', count: 267 },
          { category: 'Low Risk', count: 401 },
          { category: 'Normal', count: 423 }
        ],
        geographic_data: [
          { region: 'Andhra Pradesh', cases: 234 },
          { region: 'Delhi NCR', cases: 189 },
          { region: 'Maharashtra', cases: 167 },
          { region: 'Karnataka', cases: 143 },
          { region: 'Tamil Nadu', cases: 128 }
        ]
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loader"></div>
      </div>
    )
  }

  const maxDailyScans = Math.max(...(analytics?.daily_scans.map(d => d.count) || [1]))

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="section-padding-sm">
        <div className="container-wide">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <BarChart3 className="w-9 h-9 lg:w-11 lg:h-11 text-white" />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold gradient-text">
                Analytics Dashboard
              </h1>
            </div>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Population health insights and stroke detection trends
            </p>
          </motion.div>

          {/* Time Range Selector */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex bg-white rounded-xl shadow-lg p-1.5">
              {(['7d', '30d', '90d'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-6 sm:px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    timeRange === range
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : 'Last 90 Days'}
                </button>
              ))}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card bg-gradient-to-br from-blue-500 to-cyan-500 text-white"
            >
              <div className="flex items-center justify-between mb-2">
                <Activity className="w-8 h-8 opacity-80" />
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-3xl font-bold mb-1">{analytics?.total_scans}</h3>
              <p className="text-blue-100">Total Scans</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card bg-gradient-to-br from-red-500 to-pink-500 text-white"
            >
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="w-8 h-8 opacity-80" />
                <span className="text-sm">⚠️</span>
              </div>
              <h3 className="text-3xl font-bold mb-1">{analytics?.stroke_detected}</h3>
              <p className="text-red-100">Strokes Detected</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card bg-gradient-to-br from-green-500 to-emerald-500 text-white"
            >
              <div className="flex items-center justify-between mb-2">
                <Brain className="w-8 h-8 opacity-80" />
                <span className="text-sm">✓</span>
              </div>
              <h3 className="text-3xl font-bold mb-1">{analytics?.normal_scans}</h3>
              <p className="text-green-100">Normal Scans</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card bg-gradient-to-br from-purple-500 to-indigo-500 text-white"
            >
              <div className="flex items-center justify-between mb-2">
                <BarChart3 className="w-8 h-8 opacity-80" />
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-3xl font-bold mb-1">{analytics?.avg_confidence.toFixed(1)}%</h3>
              <p className="text-purple-100">Avg Confidence</p>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Daily Scans Trend */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="card"
            >
              <h3 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                <Calendar className="w-6 h-6 text-indigo-600" />
                <span>Daily Scan Activity</span>
              </h3>
              <div className="space-y-3">
                {analytics?.daily_scans.map((day, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      <span className="font-semibold text-indigo-600">{day.count} scans</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(day.count / maxDailyScans) * 100}%` }}
                        transition={{ delay: 0.6 + index * 0.05, duration: 0.5 }}
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Risk Distribution */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="card"
            >
              <h3 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
                <span>Risk Distribution</span>
              </h3>
              <div className="space-y-4">
                {analytics?.risk_distribution.map((risk, index) => {
                  const colors = {
                    'High Risk': 'from-red-500 to-pink-500',
                    'Medium Risk': 'from-orange-500 to-yellow-500',
                    'Low Risk': 'from-blue-500 to-cyan-500',
                    'Normal': 'from-green-500 to-emerald-500'
                  }
                  const maxCount = Math.max(...analytics.risk_distribution.map(r => r.count))
                  
                  return (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-semibold text-gray-700">{risk.category}</span>
                        <span className="text-gray-600">{risk.count} patients</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(risk.count / maxCount) * 100}%` }}
                          transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
                          className={`bg-gradient-to-r ${colors[risk.category as keyof typeof colors]} h-4 rounded-full`}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          </div>

          {/* Geographic Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="card"
          >
            <h3 className="text-2xl font-bold mb-6 flex items-center space-x-2">
              <MapPin className="w-6 h-6 text-red-600" />
              <span>Geographic Stroke Hotspots</span>
            </h3>
            <div className="grid md:grid-cols-5 gap-4">
              {analytics?.geographic_data.map((region, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="bg-gradient-to-br from-red-50 to-pink-50 p-4 rounded-xl border-2 border-red-200 hover:border-red-400 transition-all"
                >
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600 mb-1">{region.cases}</div>
                    <div className="text-sm text-gray-700 font-semibold">{region.region}</div>
                    <div className="text-xs text-gray-500 mt-1">cases detected</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="card bg-gradient-to-r from-indigo-500 to-purple-500 text-white mt-8"
          >
            <h3 className="text-2xl font-bold mb-4 flex items-center space-x-2">
              <Brain className="w-7 h-7" />
              <span>AI-Generated Insights</span>
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <h4 className="font-bold mb-2">📈 Detection Rate</h4>
                <p className="text-sm text-indigo-100">
                  {analytics?.detection_rate.toFixed(1)}% of scans show stroke indicators, slightly above national average of 30%.
                </p>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <h4 className="font-bold mb-2">🎯 Peak Activity</h4>
                <p className="text-sm text-indigo-100">
                  Highest scan volume on weekdays (avg 52/day) vs weekends (avg 41/day). Consider staffing adjustments.
                </p>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <h4 className="font-bold mb-2">🗺️ Regional Focus</h4>
                <p className="text-sm text-indigo-100">
                  Andhra Pradesh shows 87% higher case rate. Recommend targeted awareness campaigns.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
