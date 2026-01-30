// app/page.tsx
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden relative">
      
      {/* Background Decoration (Blobs) */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 max-w-4xl w-full space-y-10">
        
        {/* Hero Section */}
        <div className="space-y-4 animate-fade-in-down">
          <div className="inline-block px-4 py-1.5 rounded-full border border-blue-400/30 bg-blue-400/10 text-blue-300 text-sm font-semibold mb-4 backdrop-blur-sm">
            🚀 For Grades 6-9
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-200 drop-shadow-sm">
            IFEC Civic Education
          </h1>
          <p className="text-xl md:text-2xl text-blue-100/80 max-w-2xl mx-auto leading-relaxed">
            Empowering students with multilingual audio lessons on federalism, rights, and democracy.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-12 px-4">
          
          {/* Student Card */}
          <Link 
            href="/listen"
            className="group relative overflow-hidden p-8 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-md hover:bg-white/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20 text-left"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
            </div>
            <div className="bg-blue-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-blue-300 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Start Learning</h2>
            <p className="text-blue-100/70">Access lessons in 8 ethnic languages. Listen online or download for later.</p>
            <div className="mt-6 flex items-center text-blue-300 font-semibold group-hover:translate-x-2 transition-transform">
              Go to Classroom <span>→</span>
            </div>
          </Link>

          {/* Teacher Card */}
          <Link 
            href="/upload"
            className="group relative overflow-hidden p-8 rounded-3xl bg-slate-800/50 border border-white/10 backdrop-blur-md hover:bg-slate-800/70 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl text-left"
          >
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/></svg>
            </div>
            <div className="bg-slate-600/30 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-slate-300 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Expert Upload</h2>
            <p className="text-slate-400">Secure portal for IFEC administrators to upload audio and scripts.</p>
             <div className="mt-6 flex items-center text-slate-400 font-semibold group-hover:translate-x-2 transition-transform">
              Access Portal <span>→</span>
            </div>
          </Link>

        </div>
        
        <div className="pt-12 text-sm text-slate-500">
          © 2026 Interim Federal Education Council • Educational Use Only
        </div>
      </div>
    </main>
  )
}
