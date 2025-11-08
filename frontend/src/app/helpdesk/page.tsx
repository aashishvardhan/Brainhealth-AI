'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Heart, Activity, AlertCircle, CheckCircle, TrendingUp, Users, Lightbulb } from 'lucide-react'

const educationalContent = {
  mentalHealth: {
    title: "Mental Health & Stroke Risk",
    icon: Brain,
    content: [
      {
        subtitle: "How Stress Affects Your Brain",
        text: "Chronic stress increases cortisol levels, which can lead to high blood pressure, inflammation, and increased stroke risk. Managing stress through meditation, exercise, and proper sleep is crucial."
      },
      {
        subtitle: "Depression and Stroke Connection",
        text: "Studies show that people with depression have a 45% higher risk of stroke. Depression can lead to unhealthy behaviors like smoking, poor diet, and physical inactivity, all stroke risk factors."
      },
      {
        subtitle: "Anxiety and Cardiovascular Health",
        text: "Chronic anxiety can cause persistent elevation in heart rate and blood pressure, putting extra strain on blood vessels and increasing stroke risk over time."
      }
    ]
  },
  recovery: {
    title: "Psychological Well-being in Recovery",
    icon: Heart,
    content: [
      {
        subtitle: "Positive Mindset Accelerates Healing",
        text: "Research shows that stroke survivors with positive attitudes and strong social support recover faster and regain more function than those experiencing depression or isolation."
      },
      {
        subtitle: "Mental Health Support is Essential",
        text: "Post-stroke depression affects 30-50% of survivors. Professional counseling, support groups, and family involvement significantly improve recovery outcomes and quality of life."
      },
      {
        subtitle: "Neuroplasticity and Hope",
        text: "Your brain can reorganize itself after stroke through neuroplasticity. Combining physical rehabilitation with mental exercises and emotional support enhances brain recovery."
      }
    ]
  },
  prevention: {
    title: "Holistic Stroke Prevention",
    icon: Activity,
    content: [
      {
        subtitle: "Mind-Body Connection",
        text: "Regular meditation and mindfulness practices can lower blood pressure by 10-15%, reducing stroke risk. Just 10 minutes daily can make a significant difference."
      },
      {
        subtitle: "Exercise for Brain Health",
        text: "Physical activity releases endorphins, reduces stress, and improves blood flow to the brain. Aim for 30 minutes of moderate exercise 5 days a week."
      },
      {
        subtitle: "Social Connections Matter",
        text: "Strong social relationships reduce stress hormones and inflammation. Stay connected with friends and family - loneliness is a hidden stroke risk factor."
      }
    ]
  },
  warningSign: {
    title: "Recognize Warning Signs",
    icon: AlertCircle,
    content: [
      {
        subtitle: "Act F.A.S.T.",
        text: "Face drooping, Arm weakness, Speech difficulty, Time to call emergency services. Every minute counts - brain cells die quickly during a stroke."
      },
      {
        subtitle: "Don't Ignore Mini-Strokes (TIA)",
        text: "Transient Ischemic Attacks are warning signs. Even if symptoms resolve quickly, seek immediate medical attention - they predict a major stroke within days."
      },
      {
        subtitle: "Know Your Risk Factors",
        text: "High blood pressure, diabetes, smoking, obesity, and atrial fibrillation significantly increase stroke risk. Regular checkups and management are vital."
      }
    ]
  }
}

const quickTopics = [
  { id: 'mentalHealth', label: 'Mental Health & Stroke', icon: Brain, color: 'from-blue-500 to-cyan-500' },
  { id: 'recovery', label: 'Recovery & Well-being', icon: Heart, color: 'from-pink-500 to-rose-500' },
  { id: 'prevention', label: 'Holistic Prevention', icon: Activity, color: 'from-green-500 to-emerald-500' },
  { id: 'warningSigns', label: 'Warning Signs', icon: AlertCircle, color: 'from-orange-500 to-red-500' },
]

export default function AIHelpdeskPage() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)

  const currentContent = selectedTopic && educationalContent[selectedTopic as keyof typeof educationalContent]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="section-padding-sm">
        <div className="container-narrow">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Lightbulb className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              AI <span className="gradient-text">Helpdesk</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Learn how mental health, stress, and psychological well-being influence stroke risk and recovery
            </p>
          </motion.div>

          {/* Topic Selection */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {quickTopics.map((topic, index) => (
              <motion.button
                key={topic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedTopic(topic.id)}
                className={`card text-left relative overflow-hidden group ${
                  selectedTopic === topic.id ? 'ring-2 ring-primary-500' : ''
                }`}
              >
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${topic.color} opacity-10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500`}></div>
                <div className="relative">
                  <div className={`w-12 h-12 bg-gradient-to-br ${topic.color} rounded-xl flex items-center justify-center mb-3`}>
                    <topic.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900">{topic.label}</h3>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Content Display */}
          <AnimatePresence mode="wait">
            {selectedTopic && currentContent ? (
              <motion.div
                key={selectedTopic}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="card"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className={`w-12 h-12 bg-gradient-to-br ${quickTopics.find(t => t.id === selectedTopic)?.color} rounded-xl flex items-center justify-center`}>
                    {/* @ts-ignore */}
                    <currentContent.icon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold">{currentContent.title}</h2>
                </div>

                <div className="space-y-6">
                  {currentContent.content.map((section, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100"
                    >
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-6 h-6 text-primary-600 mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{section.subtitle}</h3>
                          <p className="text-gray-700 leading-relaxed">{section.text}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="card text-center py-12"
              >
                <Lightbulb className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-xl text-gray-500">Select a topic above to learn more</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Key Takeaways */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-8 text-white"
          >
            <h3 className="text-2xl font-bold mb-4 flex items-center space-x-2">
              <TrendingUp className="w-7 h-7" />
              <span>Key Takeaways</span>
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>Mental health and physical health are deeply connected - take care of both</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>Stress management and positive mindset can significantly reduce stroke risk</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>Psychological support improves recovery outcomes after stroke</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>Early detection and immediate action save lives - know the warning signs</span>
              </li>
            </ul>
          </motion.div>

          {/* Emergency Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 bg-red-50 border-2 border-red-200 rounded-xl p-6"
          >
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-red-900 mb-2">Medical Emergency</h4>
                <p className="text-red-700 text-sm">
                  If you or someone you know is experiencing stroke symptoms, call emergency services immediately. 
                  This platform is for educational purposes only and is not a substitute for professional medical advice.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
