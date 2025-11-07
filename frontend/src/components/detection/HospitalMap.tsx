'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { ExternalLink, Phone, Navigation } from 'lucide-react'
import axios from 'axios'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface Hospital {
  name: string
  address: string
  distance: string
  phone: string
  url: string
  lat: number
  lon: number
}

export default function HospitalMap() {
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [loading, setLoading] = useState(true)
  const [userLocation, setUserLocation] = useState<[number, number]>([28.6139, 77.2090])

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude])
          fetchHospitals(position.coords.latitude, position.coords.longitude)
        },
        () => {
          // Use default location (Delhi) if permission denied
          fetchHospitals(28.6139, 77.2090)
        }
      )
    } else {
      fetchHospitals(28.6139, 77.2090)
    }
  }, [])

  const fetchHospitals = async (lat: number, lon: number) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const response = await axios.get(`${apiUrl}/api/hospitals?lat=${lat}&lon=${lon}`)
      setHospitals(response.data.hospitals)
    } catch (error) {
      console.error('Error fetching hospitals:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="loader"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Map */}
      <div className="rounded-lg overflow-hidden shadow-lg h-96">
        <MapContainer
          center={userLocation}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {hospitals.map((hospital, index) => (
            <Marker key={index} position={[hospital.lat, hospital.lon]}>
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-lg mb-2">{hospital.name}</h3>
                  <a
                    href={hospital.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Visit Website →
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Hospital List */}
      <div className="grid md:grid-cols-2 gap-4">
        {hospitals.map((hospital, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
            <h4 className="font-bold text-lg mb-3">{hospital.name}</h4>
            <div className="flex space-x-2">
              <a
                href={`tel:${hospital.phone}`}
                className="flex-1 btn-primary text-sm py-2 flex items-center justify-center space-x-1"
              >
                <Phone className="w-4 h-4" />
                <span>Call</span>
              </a>
              <a
                href={hospital.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 btn-outline text-sm py-2 flex items-center justify-center space-x-1"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Visit</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
