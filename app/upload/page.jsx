// app/upload/page.jsx
'use client'
import { useState } from 'react'
import { supabase } from '../../utils/supabase'

export default function UploadPage() {
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    grade: '6',
    language: 'Myanmar',
    accessCode: '' // New Field for Security
  })
  const [file, setFile] = useState(null)

  const languages = ['Myanmar', 'Kachin', 'Karenni', 'Karen', 'Chin', 'Mon', 'Rakhine', 'Shan']
  const SECRET_CODE = 'IFEC2026' // <--- CHANGE THIS IF YOU WANT A DIFFERENT PASSWORD

  const handleUpload = async (e) => {
    e.preventDefault()

    // 1. Security Check
    if (formData.accessCode !== SECRET_CODE) {
      alert('❌ Access Denied: Incorrect Admin Code.')
      return
    }

    if (!file) return alert('Please select an MP3 file.')

    setUploading(true)

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${formData.language}/${formData.grade}_${formData.title.replace(/\s+/g, '_')}_${Date.now()}.${fileExt}`
      
      const { data: fileData, error: storageError } = await supabase
        .storage
        .from('civic_podcasts')
        .upload(fileName, file)

      if (storageError) throw storageError

      const { data: { publicUrl } } = supabase
        .storage
        .from('civic_podcasts')
        .getPublicUrl(fileName)

      const { error: dbError } = await supabase
        .from('lessons')
        .insert([
          {
            title: formData.title,
            grade_level: parseInt(formData.grade),
            language: formData.language,
            audio_url: publicUrl,
            is_published: true
          }
        ])

      if (dbError) throw dbError

      alert('✅ Upload successful!')
      // Reset form but keep the access code so they can upload more
      setFormData(prev => ({ ...prev, title: '', grade: '6' }))
      setFile(null)

    } catch (error) {
      console.error('Error uploading:', error)
      alert('Error uploading file: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-10 bg-white shadow-lg rounded-lg mt-10 border border-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-blue-900">IFEC Expert Upload Portal</h1>
      
      <form onSubmit={handleUpload} className="space-y-5">
        
        {/* Security Field */}
        <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
          <label className="block text-sm font-bold text-yellow-800">Admin Access Code</label>
          <input
            type="password"
            required
            className="mt-1 block w-full p-2 border border-yellow-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
            placeholder="Enter IFEC Code"
            value={formData.accessCode}
            onChange={(e) => setFormData({...formData, accessCode: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Lesson Title</label>
          <input
            type="text"
            required
            className="mt-1 block w-full p-2 border rounded-md"
            placeholder="e.g. Chapter 1: Democratic Rights"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Language</label>
            <select
              className="mt-1 block w-full p-2 border rounded-md"
              value={formData.language}
              onChange={(e) => setFormData({...formData, language: e.target.value})}
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Grade Level</label>
            <select
              className="mt-1 block w-full p-2 border rounded-md"
              value={formData.grade}
              onChange={(e) => setFormData({...formData, grade: e.target.value})}
            >
              {[6, 7, 8, 9].map((g) => (
                <option key={g} value={g}>Grade {g}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Audio File (MP3)</label>
          <input
            type="file"
            accept="audio/*"
            required
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        <button
          type="submit"
          disabled={uploading}
          className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-blue-700 hover:bg-blue-800 focus:outline-none transition-all ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {uploading ? 'Uploading...' : 'Secure Upload'}
        </button>
      </form>
    </div>
  )
}