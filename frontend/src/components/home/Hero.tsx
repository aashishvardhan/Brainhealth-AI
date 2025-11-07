'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Brain, ArrowRight, Sparkles } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative section-padding overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-primary-200 rounded-full filter blur-3xl opacity-20 -top-48 -left-48 animate-float"></div>
        <div className="absolute w-96 h-96 bg-accent-200 rounded-full filter blur-3xl opacity-20 -bottom-48 -right-48 animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 bg-primary-100 text-primary-700 px-5 py-2.5 rounded-full mb-6 shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">AI-Powered Healthcare Platform</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Early <span className="gradient-text">Stroke Detection</span> Saves Lives
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl">
              Upload your brain scan and get instant AI-powered analysis using advanced CNN deep learning. 
              Detect strokes early, find nearby hospitals, and get expert guidance—all in one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/detection" className="flex-1 sm:flex-initial">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary text-lg w-full flex items-center justify-center space-x-2"
                >
                  <Brain className="w-5 h-5" />
                  <span>Start Detection</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link href="/learn" className="flex-1 sm:flex-initial">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary text-lg w-full"
                >
                  Learn About Strokes
                </motion.button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200"
            >
              <div className="text-center sm:text-left">
                <div className="text-3xl sm:text-4xl font-bold text-primary-600 mb-1">99.2%</div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-3xl sm:text-4xl font-bold text-primary-600 mb-1">10K+</div>
                <div className="text-sm text-gray-600">Scans Analyzed</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-3xl sm:text-4xl font-bold text-primary-600 mb-1">24/7</div>
                <div className="text-sm text-gray-600">Available</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Brain Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full aspect-square">
              {/* Placeholder for brain illustration */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full opacity-10 animate-pulse-slow"></div>
              <div className="absolute inset-8 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full opacity-20 animate-pulse-slow" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute inset-16 flex items-center justify-center">
                <Brain className="w-64 h-64 text-primary-600 animate-float" />
              </div>
              
              {/* Floating cards */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-10 -left-4 bg-white p-4 rounded-xl shadow-xl"
              >
                <div className="text-xs text-gray-500">Detection Speed</div>
                <div className="text-lg font-bold text-primary-600">2.3s</div>
              </motion.div>
              
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                className="absolute bottom-10 -right-4 bg-white p-4 rounded-xl shadow-xl"
              >
                <div className="text-xs text-gray-500">Confidence</div>
                <div className="text-lg font-bold text-green-600">98.7%</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
