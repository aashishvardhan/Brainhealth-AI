'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Brain, Sparkles, TrendingUp, Shield, Heart, Zap } from 'lucide-react'
import Hero from '@/components/home/Hero'
import Features from '@/components/home/Features'
import WellnessTip from '@/components/home/WellnessTip'

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <Features />

      {/* Wellness Tip Section */}
      <WellnessTip />

      {/* How It Works Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Advanced AI-powered stroke detection in three simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: Brain,
                title: 'Upload Image',
                description: 'Upload your brain MRI or CT scan image securely to our platform',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                step: '02',
                icon: Sparkles,
                title: 'AI Analysis',
                description: 'Our advanced CNN model analyzes the image for stroke indicators',
                color: 'from-purple-500 to-pink-500'
              },
              {
                step: '03',
                icon: TrendingUp,
                title: 'Get Results',
                description: 'Receive detailed results with confidence scores and recommendations',
                color: 'from-orange-500 to-red-500'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="card relative overflow-hidden group"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.color} opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`}></div>
                
                <div className="relative">
                  <div className="text-6xl font-bold text-gray-100 mb-4">{item.step}</div>
                  <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mb-6 transform group-hover:rotate-12 transition-transform duration-300`}>
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section-padding bg-gradient-to-br from-primary-600 to-accent-600 text-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Why Choose BrainHealth AI?
            </h2>
            <p className="text-xl text-white max-w-2xl mx-auto opacity-90">
              Advanced technology meets compassionate care
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Advanced AI Technology',
                description: 'CNN model trained on medical imaging data for accurate analysis'
              },
              {
                icon: Zap,
                title: 'Instant Analysis',
                description: 'Get AI-powered analysis results in seconds'
              },
              {
                icon: Heart,
                title: 'Educational Platform',
                description: 'Learn about stroke prevention and early detection'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="glass p-8 rounded-2xl text-center hover:bg-white/20 transition-all duration-300"
              >
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <item.icon className="w-10 h-10 text-primary-600" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">{item.title}</h3>
                <p className="text-white opacity-90">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-3xl p-12 text-center text-white shadow-2xl"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Early detection can save lives. Upload your brain scan now for instant AI-powered analysis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/detection">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-4"
                >
                  Start Detection
                </motion.button>
              </Link>
              <Link href="/learn">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-4"
                >
                  Learn More
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
