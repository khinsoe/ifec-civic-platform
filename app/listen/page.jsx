// app/listen/page.jsx
'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabase'

export default function StudentListeningPage() {
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Default Filters
  const [selectedLanguage, setSelectedLanguage] = useState('Myanmar')
  const [selectedGrade, setSelectedGrade] = useState('6')

  const languages = ['Myanmar', 'Kachin', 'Karenni', 'Karen', 'Chin', 'Mon', 'Rakhine', 'Shan']

  useEffect(() => {
    async function fetchLessons() {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('is_published', true)
        .eq('language', selectedLanguage)
        .eq('grade_level', parseInt(selectedGrade))
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching lessons:', error)
      } else {
        setLessons(data)
      }
      setLoading(false)
    }

    fetchLessons()
  }, [selectedLanguage, selectedGrade])

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
                </div>

                {/* Audio Player & Download */}
                <div className="w-full md:w-auto flex items-center gap-3">
                  <audio 
                    controls 
                    className="h-10 w-full md:w-64"
                    preload="metadata"
                  >
                    <source src={lesson.audio_url} type="audio/mpeg" />
                    Your browser does not support audio.
                  </audio>

                  {/* DOWNLOAD BUTTON */}
                  <a 
                    href={lesson.audio_url} 
                    download 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 bg-gray-100 text-gray-600 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-colors"
                    title="Download Lesson"
                  >
                    {/* Download Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M12 12.75l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </a>
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}