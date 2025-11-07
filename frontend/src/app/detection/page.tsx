'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Brain, AlertCircle, CheckCircle, TrendingUp, MapPin, Phone, ExternalLink, Download, FileText, Layers } from 'lucide-react'
import axios from 'axios'
import dynamic from 'next/dynamic'

// Dynamically import Map component (client-side only)
const HospitalMap = dynamic(() => import('@/components/detection/HospitalMap'), { ssr: false })

export default function DetectionPage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [patientName, setPatientName] = useState('')
  const [generatingPDF, setGeneratingPDF] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
      setResult(null)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!file) {
      setError('Please select an image file')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      
      // Check if backend is deployed (not localhost)
      const isProduction = !apiUrl.includes('localhost')
      
      if (!isProduction) {
        // DEMO MODE: Simulate AI analysis
        await new Promise(resolve => setTimeout(resolve, 2500))
        
        const isStroke = Math.random() > 0.5
        const confidence = isStroke ? 0.85 + Math.random() * 0.15 : 0.70 + Math.random() * 0.15
        
        const mockResult = {
          prediction: isStroke ? "Stroke Detected" : "Normal Brain Scan",
          confidence: Math.round(confidence * 100) / 100,
          stroke_detected: isStroke,
          risk_level: isStroke ? (confidence > 0.90 ? "High" : "Medium") : "Low",
          timestamp: new Date().toISOString(),
          recommendations: isStroke ? [
            "⚠️ Immediate medical attention required",
            "📞 Contact emergency services: 911 or local emergency number",
            "🏥 Transport to nearest stroke center immediately",
            "⏰ Note the exact time symptoms started (critical for treatment)",
            "🚫 Do not give food, water, or medication"
          ] : [
            "✅ No immediate concerns detected in this scan",
            "📋 Continue regular health checkups with your doctor",
            "🏃 Maintain healthy lifestyle and exercise regularly",
            "💊 Follow any prescribed medications as directed",
            "📊 Monitor blood pressure and cholesterol levels"
          ],
          stroke_type: isStroke ? "Ischemic Stroke" : null,
          gradcam_image: null
        }
        
        setResult(mockResult)
        setLoading(false)
        return
      }
      
      // PRODUCTION MODE: Use real API
      const formData = new FormData()
      formData.append('file', file)

      const response = await axios.post(`${apiUrl}/api/detect-stroke`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      setResult(response.data)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error analyzing image. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadPDF = async () => {
    if (!result || !patientName) {
      setError('Please enter your name to generate the report')
      return
    }

    setGeneratingPDF(true)
    setError(null)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      
      const pdfData = {
        patient_name: patientName,
        image_name: file?.name || 'brain_scan.jpg',
        prediction: result.prediction,
        confidence: result.confidence,
        stroke_detected: result.stroke_detected,
        risk_level: result.risk_level,
        stroke_type: result.stroke_type,
        recommendations: result.recommendations,
        chatbot_advice: "Regular monitoring and lifestyle modifications recommended. Consult with a neurologist for detailed assessment.",
        gradcam_base64: result.gradcam_image
      }

      const response = await axios.post(`${apiUrl}/api/generate-report`, pdfData, {
        responseType: 'blob'
      })

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `BrainHealth_Report_${patientName.replace(/ /g, '_')}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err: any) {
      setError('Error generating PDF report. Please try again.')
    } finally {
      setGeneratingPDF(false)
    }
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  const isDemoMode = apiUrl.includes('localhost')

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
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              AI <span className="gradient-text">Stroke Detection</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Upload your brain MRI or CT scan for instant AI-powered analysis using advanced CNN deep learning
            </p>
          </motion.div>

          {/* Demo Mode Banner */}
          {isDemoMode && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-8"
            >
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-yellow-700 dark:text-yellow-300 font-medium text-sm">
                    🧪 Demo Mode Active
                  </p>
                  <p className="text-yellow-600 dark:text-yellow-400 text-xs mt-1">
                    Using simulated AI results. Deploy backend to Render.com for real stroke detection. See RENDER_DEPLOY.md
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-10">
            {/* Upload Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card"
            >
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 flex items-center space-x-2">
                <Brain className="w-7 h-7 text-primary-600" />
                <span>Upload Brain Scan</span>
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* File Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 sm:p-12 text-center hover:border-primary-500 transition-all duration-300">
                  <input
                    type="file"
                    id="file-upload"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-gray-500">
                      MRI or CT scan images (JPG, PNG)
                    </p>
                  </label>
                </div>

                {/* Preview */}
                {preview && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative"
                  >
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full rounded-lg shadow-lg"
                    />
                    <p className="text-sm text-gray-600 mt-2">
                      Selected: {file?.name}
                    </p>
                  </motion.div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-red-700">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!file || loading}
                  className="btn-primary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="loader mr-3"></div>
                      Analyzing...
                    </>
                  ) : (
                    'Analyze Scan'
                  )}
                </button>
              </form>

              {/* Info Box */}
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Important Notes:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Upload clear, high-quality brain scan images</li>
                  <li>• Analysis takes 2-5 seconds</li>
                  <li>• Your images are NOT stored on our servers</li>
                  <li>• This tool is for educational purposes only</li>
                  <li>• Consult healthcare professionals for diagnosis</li>
                </ul>
              </div>
            </motion.div>

            {/* Results Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="card flex flex-col items-center justify-center h-full"
                  >
                    <div className="loader mb-4"></div>
                    <p className="text-lg text-gray-600">Analyzing brain scan...</p>
                    <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
                  </motion.div>
                ) : result ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="space-y-6"
                  >
                    {/* Result Card */}
                    <div className={`card ${result.stroke_detected ? 'bg-red-50 border-2 border-red-200' : 'bg-green-50 border-2 border-green-200'}`}>
                      <div className="flex items-start space-x-4">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${result.stroke_detected ? 'bg-red-500' : 'bg-green-500'}`}>
                          {result.stroke_detected ? (
                            <AlertCircle className="w-10 h-10 text-white" />
                          ) : (
                            <CheckCircle className="w-10 h-10 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className={`text-2xl font-bold mb-2 ${result.stroke_detected ? 'text-red-900' : 'text-green-900'}`}>
                            {result.prediction}
                          </h3>
                          <div className="flex items-center space-x-2 mb-3">
                            <TrendingUp className="w-5 h-5 text-gray-600" />
                            <span className="text-lg font-semibold">
                              Confidence: {result.confidence}%
                            </span>
                          </div>
                          {result.stroke_type && (
                            <div className="mb-3">
                              <span className="text-sm text-gray-600">Classification: </span>
                              <span className="text-sm font-semibold text-gray-900">{result.stroke_type}</span>
                            </div>
                          )}
                          <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                            result.risk_level === 'High' ? 'bg-red-200 text-red-900' :
                            result.risk_level === 'Moderate' ? 'bg-yellow-200 text-yellow-900' :
                            'bg-green-200 text-green-900'
                          }`}>
                            Risk Level: {result.risk_level}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Grad-CAM Visualization */}
                    {result.gradcam_image && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200"
                      >
                        <div className="flex items-center space-x-2 mb-4">
                          <Layers className="w-6 h-6 text-purple-600" />
                          <h3 className="text-xl font-bold text-purple-900">🔬 Explainable AI (Grad-CAM) Visualization</h3>
                        </div>
                        <p className="text-gray-700 mb-4">
                          This heatmap shows which brain regions influenced our AI&apos;s decision. 
                          <span className="font-semibold"> Red/yellow areas</span> indicate regions of high importance for stroke detection.
                        </p>
                        <div className="relative rounded-lg overflow-hidden shadow-xl">
                          <img
                            src={`data:image/png;base64,${result.gradcam_image}`}
                            alt="Grad-CAM Heatmap"
                            className="w-full"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-3">
                            <p className="text-sm">
                              <span className="font-semibold">How to read:</span> Warmer colors (red/yellow) = Higher AI attention | Cooler colors (blue/green) = Lower attention
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
                          <div className="bg-blue-100 p-2 rounded">
                            <div className="w-full h-4 bg-gradient-to-r from-blue-600 to-blue-400 rounded mb-1"></div>
                            <p className="text-blue-900 font-medium">Low</p>
                          </div>
                          <div className="bg-yellow-100 p-2 rounded">
                            <div className="w-full h-4 bg-gradient-to-r from-yellow-600 to-yellow-400 rounded mb-1"></div>
                            <p className="text-yellow-900 font-medium">Medium</p>
                          </div>
                          <div className="bg-red-100 p-2 rounded">
                            <div className="w-full h-4 bg-gradient-to-r from-red-600 to-red-400 rounded mb-1"></div>
                            <p className="text-red-900 font-medium">High</p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Download PDF Report */}
                    <div className="card bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                      <div className="flex items-start space-x-4">
                        <FileText className="w-10 h-10 flex-shrink-0" />
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold mb-2">📄 Download Medical Report</h3>
                          <p className="mb-4 opacity-90">
                            Generate a comprehensive PDF report with all analysis results, Grad-CAM visualization, and medical recommendations.
                          </p>
                          <div className="space-y-3">
                            <input
                              type="text"
                              placeholder="Enter your name for the report"
                              value={patientName}
                              onChange={(e) => setPatientName(e.target.value)}
                              className="w-full px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                            />
                            <button
                              onClick={handleDownloadPDF}
                              disabled={!patientName || generatingPDF}
                              className="btn bg-white text-blue-600 hover:bg-gray-100 w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {generatingPDF ? (
                                <>
                                  <div className="loader-small mr-2"></div>
                                  Generating PDF...
                                </>
                              ) : (
                                <>
                                  <Download className="w-5 h-5" />
                                  <span>Download Medical Report (PDF)</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div className="card">
                      <h3 className="text-xl font-bold mb-4">📋 Recommendations</h3>
                      <ul className="space-y-3">
                        {result.recommendations?.map((rec: string, index: number) => (
                          <li key={index} className="flex items-start space-x-3">
                            <span className="text-primary-600 font-bold">•</span>
                            <span className="text-gray-700">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Hospital Section (only if stroke detected) */}
                    {result.stroke_detected && (
                      <div id="hospitals" className="space-y-6">
                        <div className="card bg-gradient-to-r from-red-500 to-pink-500 text-white">
                          <h3 className="text-2xl font-bold mb-2">🚨 Immediate Action Required</h3>
                          <p className="mb-4">If you are experiencing symptoms, seek medical attention immediately!</p>
                          <div className="grid grid-cols-2 gap-4">
                            <a href="tel:108" className="btn bg-white text-red-600 hover:bg-gray-100 flex items-center justify-center space-x-2">
                              <Phone className="w-5 h-5" />
                              <span>Call 108</span>
                            </a>
                            <a href="tel:112" className="btn bg-white text-red-600 hover:bg-gray-100 flex items-center justify-center space-x-2">
                              <Phone className="w-5 h-5" />
                              <span>Call 112</span>
                            </a>
                          </div>
                        </div>

                        <div className="card">
                          <h3 className="text-2xl font-bold mb-4 flex items-center space-x-2">
                            <MapPin className="w-7 h-7 text-primary-600" />
                            <span>🏥 Neurology Hospitals</span>
                          </h3>
                          <HospitalMap />
                        </div>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="card flex flex-col items-center justify-center h-full text-center py-20"
                  >
                    <Brain className="w-24 h-24 text-gray-300 mb-6" />
                    <h3 className="text-2xl font-bold text-gray-700 mb-2">
                      No Results Yet
                    </h3>
                    <p className="text-gray-500">
                      Upload a brain scan image to get started
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
