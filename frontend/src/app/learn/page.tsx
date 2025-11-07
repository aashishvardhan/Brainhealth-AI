'use client'

import { motion } from 'framer-motion'
import { Book, Brain, Heart, Activity, AlertCircle, Shield, Lightbulb, TrendingUp } from 'lucide-react'

export default function LearnPage() {
  const topics = [
    {
      icon: Brain,
      title: 'Understanding Stroke',
      description: 'Learn what a stroke is, how it happens, and its impact on the brain',
      content: [
        'A stroke occurs when blood supply to part of the brain is interrupted',
        'Brain cells begin to die within minutes without oxygen',
        '1 in 4 people worldwide will have a stroke in their lifetime',
        'Stroke is the 2nd leading cause of death globally'
      ],
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: AlertCircle,
      title: 'Warning Signs (F.A.S.T.)',
      description: 'Recognize stroke symptoms early to save lives',
      content: [
        'F - Face drooping: One side of face feels numb or droops',
        'A - Arm weakness: One arm feels weak or numb',
        'S - Speech difficulty: Speech is slurred or hard to understand',
        'T - Time to call emergency: Every second counts!'
      ],
      color: 'from-red-500 to-pink-600'
    },
    {
      icon: Heart,
      title: 'Types of Stroke',
      description: 'Different types require different treatments',
      content: [
        'Ischemic (87%): Blood clot blocks artery in brain',
        'Hemorrhagic (13%): Blood vessel bursts in brain',
        'TIA (Mini-stroke): Temporary blockage, warning sign',
        'Each type has specific treatment protocols'
      ],
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: Shield,
      title: 'Prevention Strategies',
      description: 'Reduce your stroke risk by up to 80%',
      content: [
        'Control blood pressure (most important!)',
        'Exercise 30 minutes daily, 5 days a week',
        'Eat Mediterranean diet rich in vegetables',
        'Quit smoking and limit alcohol consumption'
      ],
      color: 'from-green-500 to-teal-600'
    },
    {
      icon: Activity,
      title: 'Risk Factors',
      description: 'Know your risk factors and take action',
      content: [
        'Controllable: High blood pressure, diabetes, smoking',
        'Age: Risk doubles every decade after 55',
        'Family history and genetics play a role',
        'Lifestyle: Diet, exercise, stress management matter'
      ],
      color: 'from-yellow-500 to-orange-600'
    },
    {
      icon: TrendingUp,
      title: 'Recovery & Rehabilitation',
      description: 'Most recovery happens in first 3-6 months',
      content: [
        'Physical therapy restores movement and balance',
        'Speech therapy improves communication skills',
        'Occupational therapy helps with daily activities',
        'Many survivors regain independence with proper care'
      ],
      color: 'from-cyan-500 to-blue-600'
    }
  ]

  const stats = [
    { number: '12.2M', label: 'Strokes annually worldwide' },
    { number: '5.5M', label: 'Deaths from stroke each year' },
    { number: '3-4.5hrs', label: 'Critical treatment window' },
    { number: '80%', label: 'Of strokes are preventable' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="section-padding bg-gradient-to-r from-primary-600 to-accent-600 text-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Book className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-4">Learn About Stroke</h1>
            <p className="text-xl max-w-2xl mx-auto opacity-90">
              Knowledge is power. Learn how to prevent, recognize, and respond to stroke emergencies.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-primary-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Topics Section */}
      <div className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topics.map((topic, index) => {
              const Icon = topic.icon
              return (
                <motion.div
                  key={topic.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card hover:shadow-2xl transition-all duration-300"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${topic.color} rounded-2xl flex items-center justify-center mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{topic.title}</h3>
                  <p className="text-gray-600 mb-4">{topic.description}</p>
                  <ul className="space-y-2">
                    {topic.content.map((item, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <span className="text-primary-600 font-bold mt-1">•</span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Emergency CTA */}
      <div className="section-padding bg-gradient-to-r from-red-500 to-pink-600 text-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h2 className="text-4xl font-bold mb-4">🚨 In Case of Emergency</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              If you or someone you know is experiencing stroke symptoms, call emergency services immediately!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="tel:108" className="btn bg-white text-red-600 hover:bg-gray-100 text-lg px-8 py-4">
                📞 Call 108 (India)
              </a>
              <a href="tel:112" className="btn bg-white text-red-600 hover:bg-gray-100 text-lg px-8 py-4">
                📞 Call 112 (Emergency)
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Resources Section */}
      <div className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-center mb-12">Additional Resources</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card">
              <Lightbulb className="w-12 h-12 text-yellow-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Prevention Tips</h3>
              <p className="text-gray-600 mb-4">Daily habits that reduce stroke risk</p>
              <a href="/chatbot" className="text-primary-600 hover:underline font-medium">
                Ask our AI Bot →
              </a>
            </div>
            <div className="card">
              <Brain className="w-12 h-12 text-purple-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">AI Detection</h3>
              <p className="text-gray-600 mb-4">Upload brain scans for instant analysis</p>
              <a href="/detection" className="text-primary-600 hover:underline font-medium">
                Try Detection →
              </a>
            </div>
            <div className="card">
              <Activity className="w-12 h-12 text-green-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Health Tools</h3>
              <p className="text-gray-600 mb-4">Track your brain health metrics</p>
              <a href="/tools" className="text-primary-600 hover:underline font-medium">
                Explore Tools →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
