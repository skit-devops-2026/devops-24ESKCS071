import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router'
import { 
  LuFileText as FileText, 
  LuDownload as Download, 
  LuStar as Star, 
  LuPlus as Plus, 
  LuTrendingUp as TrendingUp, 
  LuClock as Clock, 
  LuCircleCheck as CheckCircle, 
  LuX as X, 
  LuSparkles as Sparkles, 
  LuPenLine as Edit3, 
  LuArrowRight as ArrowRight,
  LuGlobe as Globe,
  LuExternalLink as ExternalLink
} from 'react-icons/lu'
import { FaGithub as Github } from 'react-icons/fa6'
import Navbar from '@/components/Navbar'
import resume2 from '../assets/resume2.png'
import resume3 from '../assets/resume3.png'
import resume4 from '../assets/resume4.png'

const stats = [
  { icon: FileText, value: '3',   label: 'Resumes Created' },
  { icon: Download, value: '12',  label: 'Total Downloads' },
  { icon: Star,     value: '87%', label: 'Avg. ATS Score'  },
]

const resumes = [
  { name: 'Software Engineer Resume',  template: 'Apex',  lastEdited: '2 hours ago', atsScore: 92, img: resume3, mode: 'github' },
  { name: 'Product Manager — Meta',    template: 'Nova',  lastEdited: 'Yesterday',   atsScore: 88, img: resume2, mode: 'manual' },
  { name: 'Full Stack Dev — Startup',  template: 'Slate', lastEdited: '3 days ago',  atsScore: 81, img: resume4, mode: 'github' },
]

export default function Dashboard() {
  const [showModal, setShowModal] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    try {
      const userStr = localStorage.getItem('craftcv_user')
      if (userStr) {
        setCurrentUser(JSON.parse(userStr))
      }
    } catch (e) {}
  }, [])

  const handleSelectMode = (mode) => {
    setShowModal(false)
    navigate(`/builder?mode=${mode}`)
  }

  const userName = currentUser?.name ? currentUser.name.split(' ')[0] : 'Alex'

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 md:px-8 pt-12 pb-24">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl elsie-black text-white leading-tight">
              Good morning, {userName}.
            </h1>
            <p className="text-white/50 text-sm mt-1">Here's where you left off.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-2xl font-medium hover:bg-white/90 transition-colors self-start sm:self-auto whitespace-nowrap cursor-pointer shadow-md"
          >
            <Plus size={16} />
            New Resume
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map(({ icon: Icon, value, label }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 flex flex-col gap-3"
            >
              <Icon size={22} className="text-white/40" />
              <p className="text-4xl elsie-black text-white leading-none">{value}</p>
              <p className="text-white/50 text-sm">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Feature Grid: AI Viva Simulator + 1-Click Hosted Portfolio */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Feature 1: AI Viva Simulator */}
          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-purple-950/40 via-[#0d0a14] to-[#0a0a0a] border border-purple-500/30 flex flex-col justify-between gap-6 shadow-xl relative overflow-hidden">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full border border-purple-400/40 bg-purple-500/20 text-purple-300 font-semibold">
                  AI Defense
                </span>
                <span className="text-xs text-white/50">Gemini 2.5 Powered</span>
              </div>
              <h3 className="text-xl font-bold elsie-black text-white">
                AI Interview &amp; Viva Simulator
              </h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Generate rigorous technical viva questions, CS fundamentals, and project deep-dives grounded in your resume claims.
              </p>
            </div>

            <Link
              to="/interview"
              className="flex items-center justify-between px-5 py-2.5 rounded-2xl bg-white text-black font-semibold text-xs hover:bg-white/90 transition-all shadow-md cursor-pointer self-start sm:self-auto"
            >
              <span>Launch Viva Simulator</span>
              <ArrowRight size={14} className="ml-2" />
            </Link>
          </div>

          {/* Feature 2: 1-Click Hosted Portfolio */}
          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-blue-950/40 via-[#0a0d16] to-[#0a0a0a] border border-blue-500/30 flex flex-col justify-between gap-6 shadow-xl relative overflow-hidden">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full border border-blue-400/40 bg-blue-500/20 text-blue-300 font-semibold">
                  Web Portfolio
                </span>
                <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live Hosted
                </span>
              </div>
              <h3 className="text-xl font-bold elsie-black text-white">
                1-Click Hosted Developer Portfolio
              </h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Transform your resume into a live personal portfolio website featuring Bento Grid, Linux CLI Terminal, and Executive Classic themes.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <Link
                to="/portfolio/aryan-sharma"
                target="_blank"
                className="flex items-center justify-between px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs transition-all shadow-lg shadow-blue-500/25 cursor-pointer"
              >
                <span>View Live Portfolio</span>
                <ExternalLink size={13} className="ml-2" />
              </Link>
              <Link
                to="/builder"
                className="px-4 py-2.5 rounded-2xl border border-white/10 hover:border-white/30 text-white/80 hover:text-white text-xs font-semibold transition-all cursor-pointer"
              >
                Customize
              </Link>
            </div>
          </div>
        </div>

        {/* Your Resumes */}
        <h2 className="text-2xl elsie-black text-white mt-12 mb-6">Your Resumes</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {resumes.map((r) => (
            <div
              key={r.name}
              className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden hover:border-white/30 transition-all group"
            >
              {/* Preview Image */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={r.img}
                  alt={r.name}
                  className="w-full h-full object-cover group-hover:brightness-110 transition duration-300"
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <Link
                    to={`/builder?mode=${r.mode}&template=${r.template.toLowerCase()}`}
                    className="border border-white/40 rounded-xl px-3.5 py-1.5 text-white text-xs hover:bg-white/10 transition-colors"
                  >
                    Edit
                  </Link>
                  <Link
                    to="/portfolio/aryan-sharma"
                    target="_blank"
                    className="bg-white text-black font-semibold rounded-xl px-3.5 py-1.5 text-xs hover:bg-white/90 transition-colors flex items-center gap-1 shadow"
                  >
                    <span>Portfolio</span>
                    <ExternalLink size={12} />
                  </Link>
                </div>
              </div>

              {/* Card Meta */}
              <div className="p-5 flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm text-white">{r.name}</p>
                  <p className="text-white/40 text-xs mt-0.5">Edited {r.lastEdited} · {r.template}</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-lg">
                  <CheckCircle size={11} />
                  <span>{r.atsScore}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </main>

      {/* Creation Mode Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-xl w-full text-white relative shadow-2xl"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-5 right-5 text-white/40 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                New Project
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold elsie-black mt-1 mb-2">
                How would you like to build?
              </h2>
              <p className="text-sm text-white/50 mb-6">
                Choose the workflow that best fits your needs. Both options support all templates.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Option 1: Manual Builder */}
                <div
                  onClick={() => handleSelectMode('manual')}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer group"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white mb-4 group-hover:scale-105 transition-transform">
                      <Edit3 size={20} />
                    </div>
                    <h3 className="text-base font-bold text-white mb-1.5 flex items-center gap-1.5">
                      Manual Builder
                    </h3>
                    <p className="text-xs text-white/50 leading-relaxed">
                      Fill in profile details from scratch, craft custom bullet points, and choose templates.
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/10 flex items-center text-xs font-semibold text-white/80 group-hover:text-white">
                    <span>Build Manually</span>
                    <ArrowRight size={14} className="ml-auto group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Option 2: 1-Click GitHub */}
                <div
                  onClick={() => handleSelectMode('github')}
                  className="bg-gradient-to-tr from-white/5 to-white/10 hover:from-white/10 hover:to-white/15 border border-white/20 hover:border-white/40 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer group relative overflow-hidden"
                >
                  <div className="absolute top-3 right-3 text-[10px] font-bold bg-white text-black px-2 py-0.5 rounded-full">
                    Instant
                  </div>
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                      <Github size={20} />
                    </div>
                    <h3 className="text-base font-bold text-white mb-1.5 flex items-center gap-1.5">
                      1-Click GitHub
                    </h3>
                    <p className="text-xs text-white/50 leading-relaxed">
                      Enter GitHub handle to auto-fetch repositories, top starred projects, and language skills.
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/10 flex items-center text-xs font-semibold text-white group-hover:text-white">
                    <span>Build via GitHub</span>
                    <ArrowRight size={14} className="ml-auto group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
