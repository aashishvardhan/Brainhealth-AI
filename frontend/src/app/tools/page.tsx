'use client'

import { motion } from 'framer-motion'
import { Heart, Activity, Brain, Calculator, TrendingUp, Timer, Droplet, Weight } from 'lucide-react'
import { useState } from 'react'

export default function ToolsPage() {
  const [bmi, setBmi] = useState<{ height: string; weight: string; result: { value: string; category: string } | null }>({ height: '', weight: '', result: null })
  const [bp, setBp] = useState({ systolic: '', diastolic: '', result: '' })
  const [strokeRisk, setStrokeRisk] = useState<{ age: string; bp: boolean; diabetes: boolean; smoking: boolean; result: { score: number; level: string } | null }>({ age: '', bp: false, diabetes: false, smoking: false, result: null })

  const calculateBMI = () => {
    const h = parseFloat(bmi.height) / 100 // convert to meters
    const w = parseFloat(bmi.weight)
    if (h > 0 && w > 0) {
      const bmiValue = w / (h * h)
      const result = bmiValue.toFixed(1)
      let category = ''
      if (bmiValue < 18.5) category = 'Underweight'
      else if (bmiValue < 25) category = 'Normal'
      else if (bmiValue < 30) category = 'Overweight'
      else category = 'Obese'
      setBmi({ ...bmi, result: { value: result, category } })
    }
  }

  const checkBloodPressure = () => {
    const sys = parseInt(bp.systolic)
    const dia = parseInt(bp.diastolic)
    let result = ''
    if (sys < 120 && dia < 80) result = '✅ Normal'
    else if (sys < 130 && dia < 80) result = '⚠️ Elevated'
    else if (sys < 140 || dia < 90) result = '🟡 High BP Stage 1'
    else if (sys >= 140 || dia >= 90) result = '🔴 High BP Stage 2'
    else if (sys >= 180 || dia >= 120) result = '🚨 Hypertensive Crisis'
    setBp({ ...bp, result })
  }

  const calculateStrokeRisk = () => {
    const age = parseInt(strokeRisk.age)
    let score = 0
    if (age > 55) score += 3
    else if (age > 45) score += 2
    else if (age > 35) score += 1
    if (strokeRisk.bp) score += 3
    if (strokeRisk.diabetes) score += 2
    if (strokeRisk.smoking) score += 2
    
    let level = ''
    if (score <= 2) level = 'Low Risk'
    else if (score <= 5) level = 'Moderate Risk'
    else level = 'High Risk'
    
    setStrokeRisk({ ...strokeRisk, result: { score, level } })
  }

  const tools = [
    {
      icon: Calculator,
      title: 'BMI Calculator',
      description: 'Calculate your Body Mass Index',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: Activity,
      title: 'Blood Pressure Checker',
      description: 'Check if your BP is in healthy range',
      color: 'from-red-500 to-pink-600'
    },
    {
      icon: TrendingUp,
      title: 'Stroke Risk Assessment',
      description: 'Estimate your stroke risk level',
      color: 'from-purple-500 to-indigo-600'
    },
    {
      icon: Timer,
      title: 'Meditation Timer',
      description: 'Practice mindfulness for brain health',
      color: 'from-green-500 to-teal-600'
    },
    {
      icon: Droplet,
      title: 'Hydration Tracker',
      description: 'Track daily water intake',
      color: 'from-cyan-500 to-blue-600'
    },
    {
      icon: Weight,
      title: 'Fitness Tracker',
      description: 'Log exercise and activity',
      color: 'from-orange-500 to-red-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      {/* Hero */}
      <div className="section-padding bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Heart className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-4">Health Tools</h1>
            <p className="text-xl max-w-2xl mx-auto opacity-90">
              Track, monitor, and improve your brain health with our free tools
            </p>
          </motion.div>
        </div>
      </div>

      {/* Interactive Tools */}
      <div className="section-padding">
        <div className="container-custom max-w-4xl">
          {/* BMI Calculator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card mb-8 bg-gradient-to-br from-blue-50 to-cyan-50"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Calculator className="w-8 h-8 text-blue-600" />
              <h2 className="text-3xl font-bold">BMI Calculator</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">Height (cm)</label>
                <input
                  type="number"
                  value={bmi.height}
                  onChange={(e) => setBmi({ ...bmi, height: e.target.value })}
                  className="input-field"
                  placeholder="170"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Weight (kg)</label>
                <input
                  type="number"
                  value={bmi.weight}
                  onChange={(e) => setBmi({ ...bmi, weight: e.target.value })}
                  className="input-field"
                  placeholder="70"
                />
              </div>
            </div>
            <button onClick={calculateBMI} className="btn-primary mb-4">
              Calculate BMI
            </button>
            {bmi.result && (
              <div className="bg-white p-4 rounded-lg">
                <p className="text-2xl font-bold text-primary-600">BMI: {bmi.result.value}</p>
                <p className="text-lg text-gray-700">Category: {bmi.result.category}</p>
              </div>
            )}
          </motion.div>

          {/* Blood Pressure Checker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card mb-8 bg-gradient-to-br from-red-50 to-pink-50"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Activity className="w-8 h-8 text-red-600" />
              <h2 className="text-3xl font-bold">Blood Pressure Checker</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">Systolic (top number)</label>
                <input
                  type="number"
                  value={bp.systolic}
                  onChange={(e) => setBp({ ...bp, systolic: e.target.value })}
                  className="input-field"
                  placeholder="120"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Diastolic (bottom number)</label>
                <input
                  type="number"
                  value={bp.diastolic}
                  onChange={(e) => setBp({ ...bp, diastolic: e.target.value })}
                  className="input-field"
                  placeholder="80"
                />
              </div>
            </div>
            <button onClick={checkBloodPressure} className="btn-primary mb-4">
              Check Blood Pressure
            </button>
            {bp.result && (
              <div className="bg-white p-4 rounded-lg">
                <p className="text-xl font-bold">{bp.result}</p>
              </div>
            )}
          </motion.div>

          {/* Stroke Risk Assessment */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card mb-8 bg-gradient-to-br from-purple-50 to-indigo-50"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Brain className="w-8 h-8 text-purple-600" />
              <h2 className="text-3xl font-bold">Stroke Risk Assessment</h2>
            </div>
            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">Age</label>
                <input
                  type="number"
                  value={strokeRisk.age}
                  onChange={(e) => setStrokeRisk({ ...strokeRisk, age: e.target.value })}
                  className="input-field"
                  placeholder="45"
                />
              </div>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={strokeRisk.bp}
                    onChange={(e) => setStrokeRisk({ ...strokeRisk, bp: e.target.checked })}
                    className="w-5 h-5 text-primary-600"
                  />
                  <span>High Blood Pressure</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={strokeRisk.diabetes}
                    onChange={(e) => setStrokeRisk({ ...strokeRisk, diabetes: e.target.checked })}
                    className="w-5 h-5 text-primary-600"
                  />
                  <span>Diabetes</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={strokeRisk.smoking}
                    onChange={(e) => setStrokeRisk({ ...strokeRisk, smoking: e.target.checked })}
                    className="w-5 h-5 text-primary-600"
                  />
                  <span>Smoking</span>
                </label>
              </div>
            </div>
            <button onClick={calculateStrokeRisk} className="btn-primary mb-4">
              Calculate Risk
            </button>
            {strokeRisk.result && (
              <div className="bg-white p-4 rounded-lg">
                <p className="text-xl font-bold text-primary-600">Risk Level: {strokeRisk.result.level}</p>
                <p className="text-gray-600">Score: {strokeRisk.result.score}/10</p>
              </div>
            )}
            <p className="text-sm text-gray-500 mt-4">
              ⚠️ This is an educational tool only. Consult a healthcare professional for proper medical assessment.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Coming Soon Tools */}
      <div className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-center mb-12">More Tools Coming Soon</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {tools.slice(3).map((tool, index) => {
              const Icon = tool.icon
              return (
                <motion.div
                  key={tool.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card text-center opacity-60"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${tool.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{tool.title}</h3>
                  <p className="text-gray-600">{tool.description}</p>
                  <p className="text-sm text-primary-600 mt-4">Coming Soon</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
