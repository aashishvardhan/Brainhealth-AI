'use client'

import Link from 'next/link'
import { Brain, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-300">
      <div className="container-custom section-padding-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">BrainHealth AI</h3>
            </div>
            <p className="text-sm mb-6 leading-relaxed">
              AI-powered platform for early brain stroke detection and healthcare guidance using advanced deep learning.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-primary-400 transition-colors">Home</Link></li>
              <li><Link href="/detection" className="hover:text-primary-400 transition-colors">Stroke Detection</Link></li>
              <li><Link href="/chatbot" className="hover:text-primary-400 transition-colors">AI Chatbot</Link></li>
              <li><Link href="/learn" className="hover:text-primary-400 transition-colors">Learn About Strokes</Link></li>
              <li><Link href="/tools" className="hover:text-primary-400 transition-colors">Health Tools</Link></li>
              <li><Link href="/about" className="hover:text-primary-400 transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Emergency Contacts */}
          <div>
            <h4 className="text-white font-semibold mb-4">Emergency</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-red-400" />
                <span>Ambulance: <strong className="text-white">108</strong></span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-red-400" />
                <span>Emergency: <strong className="text-white">112</strong></span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-primary-400" />
                <Link href="/detection#hospitals" className="hover:text-primary-400 transition-colors">
                  Find Nearby Hospitals
                </Link>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
              <p className="text-xs text-red-300">
                <strong>Warning:</strong> If experiencing stroke symptoms (F.A.S.T.), call emergency immediately!
              </p>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <Mail className="w-4 h-4 mt-1 text-primary-400" />
                <div>
                  <p className="text-sm">support@brainhealth.ai</p>
                  <p className="text-sm">info@brainhealth.ai</p>
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <Phone className="w-4 h-4 mt-1 text-primary-400" />
                <div>
                  <p className="text-sm">+91 1800-XXX-XXXX</p>
                  <p className="text-xs text-gray-500">Mon-Fri, 9AM-6PM IST</p>
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 mt-1 text-primary-400" />
                <p className="text-sm">India</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-gray-800 pt-6 mb-6">
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
            <h5 className="text-yellow-300 font-semibold mb-2 text-sm">⚠️ Medical Disclaimer</h5>
            <p className="text-xs text-gray-400">
              BrainHealth AI is an educational and assistive tool only. It is <strong>NOT</strong> a substitute for professional medical advice, diagnosis, or treatment. 
              Always consult qualified healthcare providers for medical decisions. In case of emergency, call your local emergency services immediately.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p className="mb-4 md:mb-0 text-gray-400">
            &copy; {currentYear} BrainHealth AI. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <Link href="/privacy" className="hover:text-primary-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary-400 transition-colors">Terms of Service</Link>
            <Link href="/cookies" className="hover:text-primary-400 transition-colors">Cookie Policy</Link>
          </div>
        </div>

        {/* Made with Love */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            Made with <span className="text-red-500 animate-pulse">❤️</span> for better brain health worldwide
          </p>
        </div>
      </div>
    </footer>
  )
}
