'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'

export function CreatorProfile() {
  const { address } = useAccount()
  const [profile, setProfile] = useState({
    name: '',
    bio: '',
    location: '',
    language: 'en',
  })
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!address) return

    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/creators?address=${address}`)
        if (!response.ok) return
        const data = await response.json()
        if (data.creator) {
          setProfile({
            name: data.creator.name,
            bio: data.creator.bio,
            location: data.creator.location,
            language: data.creator.language,
          })
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      }
    }
    fetchProfile()
  }, [address])

  const handleSave = async () => {
    if (!address) return

    setLoading(true)
    try {
      // First check if creator exists
      const checkResponse = await fetch(`/api/creators?address=${address}`)
      const checkData = await checkResponse.json()
      
      const creatorData = {
        id: checkData.creator?.id || crypto.randomUUID(),
        walletAddress: address,
        ...profile,
        createdAt: checkData.creator?.createdAt || Date.now(),
      }

      const response = await fetch('/api/creators', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(creatorData),
      })

      if (response.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass-card rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6 drop-shadow-lg">Your Profile</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-white font-semibold mb-2">Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full glass text-white px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 border border-white/20"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">Bio</label>
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full glass text-white px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 border border-white/20"
              rows={4}
              placeholder="Tell us about yourself"
            />
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">Location</label>
            <input
              type="text"
              value={profile.location}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              className="w-full glass text-white px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 border border-white/20"
              placeholder="Your location"
            />
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">Language</label>
            <select
              value={profile.language}
              onChange={(e) => setProfile({ ...profile, language: e.target.value })}
              className="w-full glass text-white px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 border border-white/20"
            >
              {/* European Languages */}
              <optgroup label="European Languages">
                <option value="en">English</option>
                <option value="es">Spanish (Español)</option>
                <option value="fr">French (Français)</option>
                <option value="de">German (Deutsch)</option>
                <option value="it">Italian (Italiano)</option>
                <option value="pt">Portuguese (Português)</option>
                <option value="ru">Russian (Русский)</option>
                <option value="nl">Dutch (Nederlands)</option>
                <option value="pl">Polish (Polski)</option>
                <option value="tr">Turkish (Türkçe)</option>
              </optgroup>
              
              {/* Indian Languages */}
              <optgroup label="Indian Languages">
                <option value="hi">Hindi (हिन्दी)</option>
                <option value="ta">Tamil (தமிழ்)</option>
                <option value="te">Telugu (తెలుగు)</option>
                <option value="kn">Kannada (ಕನ್ನಡ)</option>
                <option value="ml">Malayalam (മലയാളം)</option>
                <option value="mr">Marathi (मराठी)</option>
                <option value="gu">Gujarati (ગુજરાતી)</option>
                <option value="pa">Punjabi (ਪੰਜਾਬੀ)</option>
                <option value="bn">Bengali (বাংলা)</option>
                <option value="or">Odia (ଓଡ଼ିଆ)</option>
                <option value="as">Assamese (অসমীয়া)</option>
              </optgroup>
              
              {/* Asian Languages */}
              <optgroup label="Asian Languages">
                <option value="zh">Chinese (中文)</option>
                <option value="ja">Japanese (日本語)</option>
                <option value="ko">Korean (한국어)</option>
                <option value="th">Thai (ไทย)</option>
                <option value="vi">Vietnamese (Tiếng Việt)</option>
                <option value="id">Indonesian (Bahasa Indonesia)</option>
                <option value="ms">Malay (Bahasa Melayu)</option>
                <option value="fil">Filipino (Tagalog)</option>
              </optgroup>
              
              {/* Middle Eastern Languages */}
              <optgroup label="Middle Eastern Languages">
                <option value="ar">Arabic (العربية)</option>
                <option value="he">Hebrew (עברית)</option>
                <option value="fa">Persian (فارسی)</option>
                <option value="ur">Urdu (اردو)</option>
              </optgroup>
              
              {/* Other Languages */}
              <optgroup label="Other Languages">
                <option value="sw">Swahili (Kiswahili)</option>
                <option value="zu">Zulu (isiZulu)</option>
                <option value="af">Afrikaans</option>
                <option value="sv">Swedish (Svenska)</option>
                <option value="no">Norwegian (Norsk)</option>
                <option value="da">Danish (Dansk)</option>
                <option value="fi">Finnish (Suomi)</option>
                <option value="cs">Czech (Čeština)</option>
                <option value="ro">Romanian (Română)</option>
                <option value="hu">Hungarian (Magyar)</option>
                <option value="el">Greek (Ελληνικά)</option>
              </optgroup>
            </select>
          </div>

          <button
            onClick={handleSave}
            className="w-full glass-strong text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {saved ? 'Saved!' : 'Save Profile'}
          </button>
        </div>
      </div>
    </div>
  )
}

