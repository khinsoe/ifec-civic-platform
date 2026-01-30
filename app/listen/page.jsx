// app/listen/page.jsx
'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabase' // Adjust path if needed

export default function StudentListeningPage() {
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Default Filters
  const [selectedLanguage, setSelectedLanguage] = useState('Myanmar')
  const [selectedGrade, setSelectedGrade] = useState('6')

  const languages = ['Myanmar', 'Kachin', 'Karenni', 'Karen', 'Chin', 'Mon', 'Rakhine', 'Shan']

  // 1. Fetch Data whenever filters change
  useEffect(() => {
    async function fetchLessons() {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('is_published', true) // Only show published
        .eq('language', selectedLanguage)
        .eq('grade_level', parseInt(selectedGrade))
        .order('created_at', { ascending: false }) // Newest first

      if (error) {
        console.error('Error fetching lessons:', error)
      } else {
        setLessons(data)
      }
      setLoading(false)
    }

    fetchLessons()
  }, [selectedLanguage, selectedGrade]) // Re-run when these change

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-900">IFEC Civic Education</h1>
          <p className="text-gray-600 mt-2">Multilingual Audio Learning Platform</p>
        </header>

        {/* Filter Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          
          {/* Language Tabs */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Select Language</h3>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedLanguage === lang
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Grade Tabs */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Select Grade</h3>
            <div className="flex gap-4 border-b border-gray-200">
              {['6', '7', '8', '9'].map((grade) => (
                <button
                  key={grade}
                  onClick={() => setSelectedGrade(grade)}
                  className={`pb-2 px-4 text-sm font-medium transition-colors border-b-2 ${
                    selectedGrade === grade
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Grade {grade}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Podcast List */}
        <div className="space-y-4">
          {loading ? (
            <p className="text-center text-gray-500 animate-pulse">Loading lessons...</p>
          ) : lessons.length === 0 ? (
            <div className="text-center p-10 bg-white rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500">No lessons found for {selectedLanguage} (Grade {selectedGrade}).</p>
            </div>
          ) : (
            lessons.map((lesson) => (
              <div key={lesson.id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center gap-4 hover:shadow-md transition-shadow">
                
                {/* Lesson Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                      Grade {lesson.grade_level}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(lesson.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">{lesson.title}</h3>
                  {lesson.description && (
                    <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
                  )}
                </div>

                {/* Audio Player */}
                <div className="w-full md:w-1/3">
                  <audio 
                    controls 
                    className="w-full h-10"
                    preload="metadata" // Saves bandwidth
                  >
                    <source src={lesson.audio_url} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}