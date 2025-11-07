'use client'

import { motion } from 'framer-motion'
import { Brain, Target, Users, Zap, Shield, Globe, Heart, Code, Database, Cpu } from 'lucide-react'

export default function AboutPage() {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Detection',
      description: 'Advanced CNN models analyze brain scans to detect stroke indicators with high accuracy',
      color: 'from-purple-500 to-indigo-600'
    },
    {
      icon: Zap,
      title: 'Explainable AI',
      description: 'Grad-CAM visualization shows which brain regions triggered the detection',
      color: 'from-yellow-500 to-orange-600'
    },
    {
      icon: Shield,
      title: 'Medical Reports',
      description: 'Generate professional PDF reports with patient details and recommendations',
      color: 'from-green-500 to-teal-600'
    },
    {
      icon: Globe,
      title: 'Hospital Finder',
      description: 'OpenStreetMap integration to locate nearby emergency stroke centers',
      color: 'from-blue-500 to-cyan-600'
    }
  ]

  const techStack = [
    {
      category: 'Frontend',
      icon: Code,
      technologies: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'React Leaflet']
    },
    {
      category: 'Backend',
      icon: Database,
      technologies: ['FastAPI', 'Python', 'Uvicorn', 'Pydantic', 'ReportLab']
    },
    {
      category: 'AI/ML',
      icon: Cpu,
      technologies: ['TensorFlow', 'Keras', 'OpenCV', 'Grad-CAM', 'HuggingFace']
    }
  ]

  const mission = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To make advanced stroke detection technology accessible to everyone, everywhere, for free.'
    },
    {
      icon: Users,
      title: 'Our Vision',
      description: 'A world where AI-powered healthcare tools help save lives through early detection and prevention.'
    },
    {
      icon: Heart,
      title: 'Our Values',
      description: 'Accessibility, transparency, privacy, and evidence-based medicine guide everything we build.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero */}
      <div className="section-padding bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Brain className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-4">About BrainHealth AI</h1>
            <p className="text-xl max-w-2xl mx-auto opacity-90">
              Empowering early stroke detection through artificial intelligence
            </p>
          </motion.div>
        </div>
      </div>

      {/* Mission, Vision, Values */}
      <div className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8">
            {mission.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card text-center"
                >
                  <Icon className="w-12 h-12 mx-auto mb-4 text-primary-600" />
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* What We Do */}
      <div className="section-padding bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">What We Do</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              BrainHealth AI combines cutting-edge deep learning with medical imaging to help detect stroke indicators early.
              Our platform provides instant analysis, explainable results, and actionable recommendations.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card"
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Built With Modern Technology</h2>
            <p className="text-xl text-gray-600">
              Open-source technologies powering our platform
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {techStack.map((stack, index) => {
              const Icon = stack.icon
              return (
                <motion.div
                  key={stack.category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card bg-gradient-to-br from-gray-50 to-white"
                >
                  <Icon className="w-10 h-10 mb-4 text-primary-600" />
                  <h3 className="text-2xl font-bold mb-4">{stack.category}</h3>
                  <div className="space-y-2">
                    {stack.technologies.map((tech) => (
                      <div
                        key={tech}
                        className="bg-white px-4 py-2 rounded-lg text-gray-700 font-medium"
                      >
                        {tech}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="section-padding bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container-custom max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                step: 1,
                title: 'Upload Brain Scan',
                description: 'Upload a CT or MRI brain scan image in common formats (JPG, PNG, DICOM)'
              },
              {
                step: 2,
                title: 'AI Analysis',
                description: 'Our CNN model analyzes the image for stroke indicators and patterns'
              },
              {
                step: 3,
                title: 'Explainable Results',
                description: 'View confidence scores and Grad-CAM heatmap showing which brain regions influenced the detection'
              },
              {
                step: 4,
                title: 'Generate Report',
                description: 'Download a professional PDF medical report with patient details and recommendations'
              },
              {
                step: 5,
                title: 'Find Help',
                description: 'Locate nearby stroke centers and emergency hospitals on the interactive map'
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-4 bg-white p-6 rounded-2xl shadow-lg"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="section-padding bg-yellow-50 border-t-4 border-yellow-400">
        <div className="container-custom max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-4 text-yellow-900">⚠️ Medical Disclaimer</h2>
            <div className="text-left space-y-3 text-gray-700">
              <p>
                <strong>BrainHealth AI is an educational and research tool</strong> designed to demonstrate the potential of AI in healthcare.
                It is NOT a medical device and is not intended for clinical diagnosis or treatment.
              </p>
              <p>
                <strong>Always consult qualified healthcare professionals</strong> for medical advice, diagnosis, and treatment.
                Never rely solely on AI-generated results for health decisions.
              </p>
              <p>
                <strong>In case of emergency:</strong> Call 911 (US) or your local emergency number immediately if you suspect a stroke.
                Time is critical in stroke treatment. Remember F.A.S.T. (Face drooping, Arm weakness, Speech difficulty, Time to call emergency).
              </p>
              <p>
                <strong>Privacy:</strong> All image processing happens locally in your browser or on our secure servers.
                We do not store uploaded medical images without explicit consent.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* CTA */}
      <div className="section-padding bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl font-bold mb-4">Ready to Try It?</h2>
            <p className="text-xl mb-8 opacity-90">
              Experience AI-powered stroke detection today
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/detection" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
                Start Detection
              </a>
              <a href="/chatbot" className="btn-primary bg-white/10 hover:bg-white/20 border-2 border-white">
                Ask AI Chatbot
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
