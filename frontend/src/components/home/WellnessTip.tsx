'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Lightbulb, RefreshCw } from 'lucide-react'
import axios from 'axios'

const fallbackTips = [
  '🧠 Your brain uses 20% of your body\'s oxygen and energy!',
  '💧 Stay hydrated - dehydration affects brain function',
  '🎵 Listening to music boosts brain connectivity',
  '😴 Get 7-9 hours of sleep for optimal brain health',
  '🥗 Eat omega-3 rich foods for better cognition',
  '🏃 Exercise increases brain-derived neurotrophic factor',
  '📚 Learning new skills creates new neural pathways',
  '🧘 Meditation reduces stress and improves focus',
  '🤝 Social connections protect brain health',
  '☀️ Sunlight exposure boosts mood and vitamin D'
]

export default function WellnessTip() {
  const [tip, setTip] = useState(fallbackTips[0])
  const [loading, setLoading] = useState(false)

  const fetchTip = async () => {
    setLoading(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const response = await axios.get(`${apiUrl}/api/wellness-tip`)
      setTip(response.data.tip)
    } catch (error) {
      // Use fallback tip if API fails
      setTip(fallbackTips[Math.floor(Math.random() * fallbackTips.length)])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTip()
  }, [])

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="card bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Brain Booster of the Day
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 180 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={fetchTip}
                    disabled={loading}
                    className="p-2 bg-white rounded-lg hover:bg-yellow-100 transition-colors shadow-md"
                  >
                    <RefreshCw className={`w-5 h-5 text-orange-600 ${loading ? 'animate-spin' : ''}`} />
                  </motion.button>
                </div>
                
                <motion.p
                  key={tip}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-lg text-gray-700 leading-relaxed"
                >
                  {tip}
                </motion.p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
