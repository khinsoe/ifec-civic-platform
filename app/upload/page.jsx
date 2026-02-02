// app/upload/page.jsx
'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabase'

export default function UploadPage() {
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(null) // Stores the ID of the lesson being deleted
  const [existingLessons, setExistingLessons] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    grade: '6',
    language: 'Myanmar',
    accessCode: ''
  })
  const [audioFile, setAudioFile] = useState(null)
  const [pdfFile, setPdfFile] = useState(null)

  // Expanded Language List
  const languages = ['Myanmar', 'Kachin', 'Karenni', 'Karen', 'Chin', 'Mon', 'Rakhine', 'Shan', 'Ta-ang']
  const SECRET_CODE = 'IFEC2026'

  // 1. Fetch existing lessons when the page loads (or when Access Code is entered)
  useEffect(() => {
    fetchLessons()
  }, [])

  const fetchLessons = async () => {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (!error && data) setExistingLessons(data)
  }

  // 2. Handle Deletion
  const handleDelete = async (lesson) => {
    if (formData.accessCode !== SECRET_CODE) {
      alert('❌ You must enter the correct Admin Code to delete files.')
      return
    }

    const confirmDelete = window.confirm(`Are you sure you want to delete "${lesson.title}"?\nThis cannot be undone.`)
    if (!confirmDelete) return

    setDeleting(lesson.id)

    try {
      // A. Delete Audio from Storage
      if (lesson.audio_url) {
        const audioPath = lesson.audio_url.split('/civic_podcasts/')[1]
        if (audioPath) await supabase.storage.from('civic_podcasts').remove([audioPath])
      }

      // B. Delete PDF from Storage (if exists)
      if (lesson.pdf_url) {
        const pdfPath = lesson.pdf_url.split('/civic_podcasts/')[1]
        if (pdfPath) await supabase.storage.from('civic_podcasts').remove([pdfPath])
      }

      // C. Delete Row from Database
      const { error } = await supabase.from('lessons').delete().eq('id', lesson.id)
      if (error) throw error

      alert('🗑️ Lesson deleted successfully.')
      
      // Refresh the list
      fetchLessons()

    } catch (error) {
      console.error('Delete error:', error)
      alert('Error deleting: ' + error.message)
    } finally {
      setDeleting(null)
    }
  }

  // 3. Handle Upload (Existing Logic)
  const handleUpload = async (e) => {
    e.preventDefault()

    if (formData.accessCode !== SECRET_CODE) {
      alert('❌ Access Denied: Incorrect Admin Code.')
      return
    }
    if (!audioFile) return alert('Please select an MP3 file.')

    setUploading(true)
    try {
      // Upload Audio
      const audioExt = audioFile.name.split('.').pop()
      const audioName = `${formData.language}/${formData.grade}_${formData.title.replace(/\s+/g, '_')}_AUDIO.${audioExt}`
      const { error: audioError } = await supabase.storage.from('civic_podcasts').upload(audioName, audioFile, { upsert: true })
      if (audioError) throw audioError
      const { data: { publicUrl: audioUrl } } = supabase.storage.from('civic_podcasts').getPublicUrl(audioName)

      // Upload PDF
      let pdfUrl = null
      if (pdfFile) {
        const pdfExt = pdfFile.name.split('.').pop()
        const pdfName = `${formData.language}/${formData.grade}_${formData.title.replace(/\s+/g, '_')}_PDF.${pdfExt}`
        const { error: pdfError } = await supabase.storage.from('civic_podcasts').upload(pdfName, pdfFile, { upsert: true })
        if (pdfError) throw pdfError
        const { data: { publicUrl } } = supabase.storage.from('civic_podcasts').getPublicUrl(pdfName)
        pdfUrl = publicUrl
      }

      // Insert into DB
      const { error: dbError } = await supabase.from('lessons').insert([{
        title: formData.title,
        grade_level: parseInt(formData.grade),
        language: formData.language,
        audio_url: audioUrl,
        pdf_url: pdfUrl,
        is_published: true
      }])
      if (dbError) throw dbError

      alert('✅ Upload successful!')
      setFormData(prev => ({ ...prev, title: '', grade: '6' }))
      setAudioFile(null)
      setPdfFile(null)
      fetchLessons() // Refresh the list below

    } catch (error) {
      alert('Error uploading file: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10">
      
      {/* SECTION 1: UPLOAD FORM */}
      <div className="bg-white shadow-xl rounded-2xl p-8 mb-12 border border-blue-100">
        <h1 className="text-3xl font-extrabold mb-6 text-slate-800">Admin Upload Portal</h1>
        <form onSubmit={handleUpload} className="space-y-6">
          
          <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
            <label className="block text-sm font-bold text-yellow-800 mb-1">🔑 Admin Access Code</label>
            <input type="password" required className="block w-full p-2 border border-yellow-300 rounded-md" 
              placeholder="Enter IFEC Code to Upload or Delete" 
              value={formData.accessCode} onChange={(e) => setFormData({...formData, accessCode: e.target.value})} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Lesson Title</label>
              <input type="text" required className="mt-1 block w-full p-3 border rounded-lg bg-gray-50 focus:bg-white transition-colors" placeholder="e.g. Chapter 1: Democratic Rights" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700">Language</label>
                <select className="mt-1 block w-full p-3 border rounded-lg bg-gray-50" value={formData.language} onChange={(e) => setFormData({...formData, language: e.target.value})}>
                  {languages.map((lang) => <option key={lang} value={lang}>{lang}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Grade</label>
                <select className="mt-1 block w-full p-3 border rounded-lg bg-gray-50" value={formData.grade} onChange={(e) => setFormData({...formData, grade: e.target.value})}>
                  {[6, 7, 8, 9].map((g) => <option key={g} value={g}>Grade {g}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Audio (MP3)</label>
              <input type="file" accept="audio/*" required className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" onChange={(e) => setAudioFile(e.target.files[0])} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Script (PDF)</label>
              <input type="file" accept="application/pdf" className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100" onChange={(e) => setPdfFile(e.target.files[0])} />
            </div>
          </div>

          <button type="submit" disabled={uploading} className={`w-full py-4 px-4 rounded-xl shadow-lg text-lg font-bold text-white transition-all transform hover:scale-[1.01] ${uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700'}`}>
            {uploading ? 'Uploading...' : 'Upload Lesson'}
          </button>
        </form>
      </div>

      {/* SECTION 2: MANAGE / DELETE FILES */}
      <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-2">
          <span>📂</span> Manage Existing Lessons
        </h2>
        
        {existingLessons.length === 0 ? (
          <p className="text-gray-400 italic">No lessons uploaded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400 text-sm uppercase">
                  <th className="py-3 px-2">Grade</th>
                  <th className="py-3 px-2">Language</th>
                  <th className="py-3 px-2">Title</th>
                  <th className="py-3 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {existingLessons.map((lesson) => (
                  <tr key={lesson.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-2 font-bold text-gray-500">{lesson.grade_level}</td>
                    <td className="py-4 px-2 text-blue-600 font-medium">{lesson.language}</td>
                    <td className="py-4 px-2 font-medium text-gray-800">{lesson.title}</td>
                    <td className="py-4 px-2 text-right">
                      <button 
                        onClick={() => handleDelete(lesson)}
                        disabled={deleting === lesson.id}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors border border-red-100"
                      >
                        {deleting === lesson.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  )
}