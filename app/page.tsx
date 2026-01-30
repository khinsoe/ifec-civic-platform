// app/page.tsx
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-6 text-center">
      
      {/* Logos or Heading */}
      <div className="max-w-3xl w-full space-y-8">
        <div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-blue-900 tracking-tight">
            IFEC Civic Education
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Multilingual Audio Curriculum for Grades 6-9
          </p>
        </div>

        {/* Main Action Buttons */}
        <div className="grid md:grid-cols-2 gap-6 mt-12">
          
          {/* Student Button */}
          <Link 
            href="/listen"
            className="group relative block p-8 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="text-blue-600 mb-4">
              {/* Simple Headphone Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600">Start Learning</h2>
            <p className="mt-2 text-gray-500">Listen to lessons in 8 ethnic languages.</p>
          </Link>

          {/* Teacher/Expert Button */}
          <Link 
            href="/upload"
            className="group relative block p-8 bg-slate-50 border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="text-slate-600 mb-4">
              {/* Simple Upload Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 group-hover:text-slate-700">Expert Upload</h2>
            <p className="mt-2 text-gray-500">For IFEC language administrators only.</p>
          </Link>

        </div>
        
        <div className="pt-10 text-sm text-gray-400">
          © 2026 Interim Federal Education Council
        </div>
      </div>
    </main>
  )
}
