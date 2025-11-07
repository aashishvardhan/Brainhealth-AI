'use client'

import { motion } from 'framer-motion'
import { Brain, Bot, BookOpen, Activity, MapPin, Shield, BarChart3 } from 'lucide-react'
import Link from 'next/link'

const features = [
  {
    icon: Brain,
    title: 'AI Stroke Detection',
    description: 'Upload MRI/CT scans for instant analysis using advanced CNN models trained on thousands of medical images.',
    href: '/detection',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50'
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Track population health trends, stroke hotspots, and detection patterns with real-time data visualization.',
    href: '/analytics',
    color: 'from-indigo-500 to-purple-500',
    bgColor: 'bg-indigo-50'
  },
  {
    icon: Bot,
    title: 'AI Health Chatbot',
    description: 'Get instant answers about stroke symptoms, prevention, and neurology from our HuggingFace-powered chatbot.',
    href: '/chatbot',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50'
  },
  {
    icon: BookOpen,
    title: 'Neurology Hub',
    description: 'Learn about different types of strokes, risk factors, prevention strategies, and recovery processes.',
    href: '/learn',
    color: 'from-green-500 to-teal-500',
    bgColor: 'bg-green-50'
  },
  {
    icon: Activity,
    title: 'Health Tools',
    description: 'Calculate BMI, analyze blood pressure, assess stress levels with our interactive health calculators.',
    href: '/tools',
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-50'
  },
  {
    icon: MapPin,
    title: 'Hospital Finder',
    description: 'Locate nearby neurology hospitals and clinics using OpenStreetMap integration for immediate care.',
    href: '/detection#hospitals',
    color: 'from-red-500 to-pink-500',
    bgColor: 'bg-red-50'
  },
  {
    icon: Shield,
    title: 'Privacy Focused',
    description: 'Your medical data is never stored. All processing happens securely and your privacy is our priority.',
    href: '/about',
    color: 'from-indigo-500 to-purple-500',
    bgColor: 'bg-indigo-50'
  }
]

export default function Features() {
  return (
    <section className="section-padding bg-gradient-to-b from-gray-50 to-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            Comprehensive <span className="gradient-text">Healthcare Platform</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
            Everything you need for brain health monitoring and stroke prevention in one powerful platform
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={feature.href}>
                <div className="card-hover h-full cursor-pointer group">
                  <div className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 group-hover:text-primary-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                    {feature.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
