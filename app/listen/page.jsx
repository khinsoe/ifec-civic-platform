// app/listen/page.jsx
'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabase'

export default function StudentListeningPage() {
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
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

      if (error) console.error('Error fetching lessons:', error)
      else setLessons(data)
      setLoading(false)
    }
    fetchLessons()
  }, [selectedLanguage, selectedGrade])

  // Helper to make the UI colorful based on Grade
  const getGradeColor = (grade) => {
    const colors = {
      '6': 'from-blue-500 to-cyan-400',
      '7': 'from-emerald-500 to-teal-400',
      '8': 'from-orange-500 to-amber-400',
      '9': 'from-purple-500 to-indigo-400'
    }
    return colors[grade] || 'from-blue-500 to-blue-400'
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* 1. HERO SECTION: Welcoming Header */}
      <div className={`relative bg-gradient-to-r ${getGradeColor(selectedGrade)} pb-32 pt-12 px-6 shadow-xl`}>
        <div className="max-w-6xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
            Civic Education Hub
          </h1>
          <p className="text-lg md:text-xl text-white/90 font-medium">
            Learn about your rights and responsibilities.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-24 relative z-10">
        
        {/* 2. CONTROL PANEL: Floating White Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-10 animate-fade-in-up">
          
          {/* Language Selector */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Choose Your Language</h3>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all transform hover:scale-105 ${
                    selectedLanguage === lang
                      ? `bg-gradient-to-r ${getGradeColor(selectedGrade)} text-white shadow-md ring-2 ring-offset-2 ring-blue-200`
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Grade Selector */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Select Grade Level</h3>
            <div className="flex gap-2 bg-gray-100 p-1 rounded-xl w-full md:w-fit">
              {['6', '7', '8', '9'].map((grade) => (
                <button
                  key={grade}
                  onClick={() => setSelectedGrade(grade)}
                  className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                    selectedGrade === grade
                      ? 'bg-white text-gray-800 shadow-sm'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  Grade {grade}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. LESSON GRID: Modern Cards instead of List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
          {loading ? (
             // Loading Skeletons
            [1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-2xl animate-pulse"></div>
            ))
          ) : lessons.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-bold text-gray-600">No lessons yet!</h3>
              <p className="text-gray-400">Check back later for {selectedLanguage} Grade {selectedGrade} content.</p>
            </div>
          ) : (
            lessons.map((lesson) => (
              <div 
                key={lesson.id} 
                className="group bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1"
              >
                {/* Card Header */}
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getGradeColor(lesson.grade_level.toString())}`}>
                    Chapter {lesson.title.split(':')[0] || '1'}
                  </span>
                  <span className="text-xs text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded-md">
                    {new Date(lesson.created_at).toLocaleDateString()}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-800 mb-2 leading-tight min-h-[3rem]">
                  {lesson.title}
                </h3>
                
                {/* Audio Player */}
                <div className="bg-gray-50 rounded-xl p-2 mb-4">
                  <audio controls className="w-full h-8" preload="metadata">
                    <source src={lesson.audio_url} type="audio/mpeg" />
                  </audio>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-auto">
                  {/* Download Button */}
                  <a 
                    href={lesson.audio_url} 
                    download 
                    target="_blank"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-50 text-blue-600 font-bold text-sm hover:bg-blue-100 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    MP3
                  </a>

                  {/* Read Script Button (Only if PDF exists) */}
                  {lesson.pdf_url ? (
                    <a 
                      href={lesson.pdf_url} 
                      target="_blank"
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 text-red-600 font-bold text-sm hover:bg-red-100 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                      Read
                    </a>
                  ) : (
                    <div className="flex-1"></div> // Spacer to keep buttons aligned
                  )}
                </div>

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}