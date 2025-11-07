'use client'

import { motion } from 'framer-motion'
import { Users, Brain, TrendingUp, Award } from 'lucide-react'

const stats = [
  {
    icon: Users,
    value: '50K+',
    label: 'Users Worldwide',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Brain,
    value: '100K+',
    label: 'Scans Analyzed',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: TrendingUp,
    value: '99.2%',
    label: 'Accuracy Rate',
    color: 'from-green-500 to-teal-500'
  },
  {
    icon: Award,
    value: '24/7',
    label: 'Availability',
    color: 'from-orange-500 to-red-500'
  }
]

export default function Stats() {
  return (
    <section className="section-padding bg-gradient-to-r from-primary-600 to-accent-600">
      <div className="container-custom">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="flex justify-center mb-4">
                <div className={`w-20 h-20 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center`}>
                  <stat.icon className="w-10 h-10 text-white" />
                </div>
              </div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                {stat.value}
              </div>
              <div className="text-blue-100 text-lg">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
