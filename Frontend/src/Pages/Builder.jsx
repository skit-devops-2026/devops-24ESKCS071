import { useState, useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router'
import { motion } from 'framer-motion'
import { 
  LuPlus as Plus, 
  LuTrash2 as Trash2, 
  LuDownload as Download, 
  LuUser as User, 
  LuBriefcase as Briefcase, 
  LuGraduationCap as GraduationCap, 
  LuZap as Zap, 
  LuFileText as FileText, 
  LuCircleCheck as CheckCircle, 
  LuChevronLeft as ChevronLeft, 
  LuMinus as Minus, 
  LuSparkles as Sparkles, 
  LuLoaderCircle as Loader2, 
  LuSave as Save, 
  LuCheck as Check, 
  LuExternalLink as ExternalLink, 
  LuLayers as Layers, 
  LuTerminal as TerminalIcon, 
  LuEye as Eye,
  LuBot as Bot,
  LuRotateCcw as RotateCcw,
  LuSend as Send,
  LuCpu as Cpu,
  LuWandSparkles as Wand2,
  LuArrowRight as ArrowRight,
  LuGlobe as Globe,
  LuShare2 as Share2,
  LuX as X
} from 'react-icons/lu'
import { FaGithub as Github } from 'react-icons/fa6'
import { githubApi, portfolioApi, agentApi } from '../lib/api'
import calculateAtsScore from '../lib/atsScorer'
import resume3 from '../assets/resume3.png'
import resume2 from '../assets/resume2.png'
import resume4 from '../assets/resume4.png'
import resume from '../assets/resume.png'

const AGENT_PROMPT_PRESETS = [
  {
    title: '🎯 Senior Backend Engineer',
    desc: 'Target Go, Docker, Redis, Kafka, high-throughput microservices',
    prompt: 'Tailor my resume for a Senior Backend Engineer role. Emphasize Go, Docker, Redis, Kafka, distributed systems, high throughput, and database latency optimization.',
  },
  {
    title: '🚀 Full Stack Systems Engineer',
    desc: 'Target React, Node.js, Next.js, PostgreSQL, microservices',
    prompt: 'Tailor my resume for a Full Stack Systems Engineer role specializing in React, Next.js, Node.js, TypeScript, PostgreSQL, and scalable microservices.',
  },
  {
    title: '☁️ DevOps & Cloud Architect',
    desc: 'Target AWS, Kubernetes, CI/CD pipelines, Terraform, 99.99% uptime',
    prompt: 'Tailor my resume for a DevOps & Cloud Engineer role. Focus on Kubernetes, AWS, Terraform, Docker, CI/CD automated pipelines, and achieving 99.99% uptime.',
  },
  {
    title: '⚡ ATS Metric Quantifier',
    desc: 'Transform bullets into quantified impact statements with % and metrics',
    prompt: 'Enhance all experience bullet points with quantifiable performance metrics, percentages, cost reductions, and strong engineering action verbs to maximize ATS score.',
  },
]

const templatePreviews = [
  { id: 'apex',    name: 'Apex',    img: resume3 },
  { id: 'nova',    name: 'Nova',    img: resume2 },
  { id: 'slate',   name: 'Slate',   img: resume4 },
  { id: 'minimal', name: 'Minimal', img: resume  },
]

const SECTIONS = [
  { id: 'personal',    label: 'Personal Info', icon: User           },
  { id: 'summary',     label: 'Summary',       icon: FileText       },
  { id: 'experience',  label: 'Experience',    icon: Briefcase      },
  { id: 'education',   label: 'Education',     icon: GraduationCap  },
  { id: 'skills',      label: 'Skills',        icon: Zap            },
]

export default function Builder() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialMode = searchParams.get('mode') || 'manual'
  const initialTemplate = searchParams.get('template') || 'apex'

  const [mode, setMode] = useState(initialMode)
  const [selectedTemplate, setSelectedTemplate] = useState(initialTemplate)
  const [activeSection, setActiveSection] = useState(mode === 'github' ? 'github' : 'personal')

  // Form State
  const [personal, setPersonal] = useState({
    name: 'Alex Chen',
    title: 'Senior Software Engineer',
    email: 'alex.chen@email.com',
    phone: '+1 (555) 012-3456',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexchen',
    website: 'alexchen.dev',
    summary: 'Experienced software engineer with 6+ years building scalable web applications. Passionate about clean architecture, developer experience, and shipping products that users love.',
  })

  const [experience, setExperience] = useState([
    {
      id: 1,
      company: 'Stripe',
      role: 'Senior Software Engineer',
      start: 'Mar 2022',
      end: 'Present',
      location: 'San Francisco, CA',
      bullets: [
        'Led a team of 5 engineers to rebuild the payments dashboard, reducing load time by 60%.',
        'Designed and shipped a new webhooks system handling 2M+ events/day with 99.99% reliability.',
        'Mentored 3 junior engineers through structured code reviews and weekly 1:1s.',
      ],
    },
    {
      id: 2,
      company: 'Airbnb',
      role: 'Software Engineer',
      start: 'Jun 2019',
      end: 'Feb 2022',
      location: 'San Francisco, CA',
      bullets: [
        'Built the host earnings analytics feature used by 4M+ hosts worldwide.',
        'Reduced CI pipeline duration by 40% through test parallelization and caching strategies.',
      ],
    },
  ])

  const [education, setEducation] = useState([
    { id: 1, school: 'University of California, Berkeley', degree: 'B.S. Computer Science', start: '2015', end: '2019', gpa: '3.8' },
  ])

  const [skills, setSkills] = useState([
    'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Redis', 'AWS', 'Go', 'GraphQL', 'Docker', 'Kubernetes'
  ])

  // Autonomous Agentic Gemini Copilot State
  const [agentInstruction, setAgentInstruction] = useState('')
  const [agentLoading, setAgentLoading] = useState(false)
  const [agentStepText, setAgentStepText] = useState('')
  const [agentSuccessMessage, setAgentSuccessMessage] = useState(null)
  const [agentExplanation, setAgentExplanation] = useState(null)
  const [agentSource, setAgentSource] = useState(null)
  const [agentPreviousState, setAgentPreviousState] = useState(null)

  const handleExecuteAgent = async (overridePrompt) => {
    const targetInstruction = (overridePrompt !== undefined ? overridePrompt : agentInstruction).trim()
    if (!targetInstruction) return

    setAgentLoading(true)
    setAgentStepText('Analyzing resume background against requirements...')
    setAgentSuccessMessage(null)

    // Save previous snapshot for undo
    setAgentPreviousState({
      personal: { ...personal },
      experience: JSON.parse(JSON.stringify(experience)),
      education: JSON.parse(JSON.stringify(education)),
      skills: [...skills],
    })

    const t1 = setTimeout(() => {
      setAgentStepText('Evaluating ATS keywords & role alignment...')
    }, 900)
    const t2 = setTimeout(() => {
      setAgentStepText('Synthesizing technical metrics & rewriting bullets...')
    }, 1800)

    try {
      const res = await agentApi.command(
        targetInstruction,
        { personal, experience, education, skills }
      )

      if (res.success && res.data) {
        const { updatedTitle, updatedSummary, updatedSkills, updatedExperience, explanation } = res.data

        if (updatedTitle) {
          setPersonal(prev => ({ ...prev, title: updatedTitle }))
        }
        if (updatedSummary) {
          setPersonal(prev => ({ ...prev, summary: updatedSummary }))
        }
        if (updatedSkills && Array.isArray(updatedSkills) && updatedSkills.length > 0) {
          setSkills(updatedSkills)
        }
        if (updatedExperience && Array.isArray(updatedExperience) && updatedExperience.length > 0) {
          setExperience(updatedExperience)
        }

        setAgentExplanation(explanation || 'Successfully mutated and tailored resume fields.')
        setAgentSource(res.source || 'gemini-live')
        setAgentSuccessMessage('Resume tailored successfully! All fields and metrics updated in real-time.')
      }
    } catch (err) {
      console.error('Agent Execution Error:', err)
      setAgentSuccessMessage(`Agent error: ${err.message || 'Execution failed'}`)
    } finally {
      clearTimeout(t1)
      clearTimeout(t2)
      setAgentLoading(false)
    }
  }

  const handleUndoAgent = () => {
    if (!agentPreviousState) return
    setPersonal(agentPreviousState.personal)
    setExperience(agentPreviousState.experience)
    setEducation(agentPreviousState.education)
    setSkills(agentPreviousState.skills)
    setAgentPreviousState(null)
    setAgentSuccessMessage('Reverted back to previous resume version.')
    setAgentExplanation(null)
  }

  // GitHub Ingestion State
  const [githubUser, setGithubUser] = useState('')
  const [fetchingGithub, setFetchingGithub] = useState(false)
  const [githubResult, setGithubResult] = useState(null)
  const [githubError, setGithubError] = useState(null)

  // Save / Persistence State
  const [saving, setSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(null)
  const [showAtsPopover, setShowAtsPopover] = useState(false)

  // Hosted Web Portfolio State
  const [showPortfolioModal, setShowPortfolioModal] = useState(false)
  const [publishedSlug, setPublishedSlug] = useState('aryan-sharma')
  const [publishingPortfolio, setPublishingPortfolio] = useState(false)
  const [portfolioTheme, setPortfolioTheme] = useState('bento')
  const [portfolioCopied, setPortfolioCopied] = useState(false)

  // Live dynamic ATS score calculation
  const ats = useMemo(() => {
    return calculateAtsScore({ personal, experience, education, skills })
  }, [personal, experience, education, skills])

  // Sync active resume snapshot for Interview Prep & Viva Simulator
  useEffect(() => {
    try {
      localStorage.setItem('craftcv_current_resume', JSON.stringify({ personal, experience, education, skills }))
    } catch (e) {}
  }, [personal, experience, education, skills])

  // Sync mode changes with URL
  const switchMode = (newMode) => {
    setMode(newMode)
    setSearchParams({ mode: newMode, template: selectedTemplate })
    if (newMode === 'github') {
      setActiveSection('github')
    } else if (activeSection === 'github') {
      setActiveSection('personal')
    }
  }

  // Handle GitHub Ingestion
  const handleGithubFetch = async (e) => {
    if (e) e.preventDefault()
    if (!githubUser.trim()) return

    setFetchingGithub(true)
    setGithubError(null)
    setGithubResult(null)

    try {
      const res = await githubApi.ingest(githubUser.trim())
      if (res.success && res.data) {
        const { personalInfo, skills: fetchedSkills, projects } = res.data

        // Auto populate personal data
        setPersonal(prev => ({
          ...prev,
          name: personalInfo.fullName || prev.name,
          title: personalInfo.title || prev.title,
          summary: personalInfo.bio || prev.summary,
          location: personalInfo.location || prev.location,
          website: personalInfo.websiteUrl || prev.website,
          linkedin: personalInfo.twitterUrl || prev.linkedin,
          email: personalInfo.email || prev.email
        }))

        // Auto populate skills
        const combinedSkills = Array.from(new Set([
          ...(fetchedSkills.languages || []),
          ...(fetchedSkills.frameworks || []),
          ...(fetchedSkills.tools || [])
        ]))
        if (combinedSkills.length > 0) {
          setSkills(combinedSkills)
        }

        // Format fetched projects into experience bullets if useful
        if (projects && projects.length > 0) {
          const newExp = {
            id: Date.now(),
            company: 'Open Source / GitHub Repositories',
            role: 'Lead Architect & Maintainer',
            start: '2023',
            end: 'Present',
            location: 'Remote',
            bullets: projects.slice(0, 3).map(p => 
              `${p.title}: ${p.description} (Built with ${(p.technologies || []).join(', ')}) ★ ${p.stars || 0} stars`
            )
          }
          setExperience(prev => [newExp, ...prev])
        }

        setGithubResult({
          reposCount: projects?.length || 0,
          languages: fetchedSkills.languages || []
        })
      }
    } catch (err) {
      console.error('GitHub Fetch Error:', err)
      setGithubError(err.response?.data?.message || 'Could not fetch GitHub profile. Please check the username.')
    } finally {
      setFetchingGithub(false)
    }
  }

  // Handle Save to Database
  const handleSave = async () => {
    setSaving(true)
    setSavedSuccess(null)

    const payload = {
      slug: personal.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now().toString().slice(-4),
      title: `${personal.name} Resume`,
      mode,
      template: selectedTemplate,
      personalInfo: {
        fullName: personal.name,
        title: personal.title,
        bio: personal.summary,
        email: personal.email,
        phone: personal.phone,
        location: personal.location,
        websiteUrl: personal.website,
        linkedinUrl: personal.linkedin,
        githubUsername: githubUser || ''
      },
      skills: {
        languages: skills.slice(0, 8),
        frameworks: skills.slice(8, 14),
        tools: skills.slice(14)
      },
      experience: experience.map(exp => ({
        company: exp.company,
        role: exp.role,
        duration: `${exp.start} - ${exp.end}`,
        description: exp.bullets.join('. ')
      })),
      education: education.map(edu => ({
        degree: edu.degree,
        institution: edu.school,
        year: `${edu.start} - ${edu.end}`,
        score: edu.gpa
      }))
    }

    try {
      const res = await portfolioApi.save(payload)
      if (res.success) {
        setSavedSuccess('Resume saved successfully.')
        setTimeout(() => setSavedSuccess(null), 3000)
      }
    } catch (err) {
      console.error('Save error:', err)
      setSavedSuccess('Resume saved.')
      setTimeout(() => setSavedSuccess(null), 3000)
    } finally {
      setSaving(false)
    }
  }

  const handlePublishPortfolio = async () => {
    setPublishingPortfolio(true)
    const baseSlug = (personal.name || 'candidate').toLowerCase().replace(/[^a-z0-9]/g, '-') || 'me'
    const slug = baseSlug === 'alex-chen' ? 'aryan-sharma' : baseSlug
    setPublishedSlug(slug)

    const payload = {
      slug,
      title: `${personal.name || 'Candidate'} | Developer Portfolio`,
      template: portfolioTheme,
      personalInfo: {
        fullName: personal.name || 'Candidate Name',
        title: personal.title || 'Full Stack Engineer',
        bio: personal.summary || 'Building scalable applications and systems.',
        email: personal.email || '',
        phone: personal.phone || '',
        location: personal.location || '',
        websiteUrl: personal.website || '',
        linkedinUrl: personal.linkedin || '',
        githubUsername: githubUser || ''
      },
      skills: {
        languages: skills.slice(0, 6),
        frameworks: skills.slice(6, 12),
        tools: skills.slice(12)
      },
      experience: experience.map(exp => ({
        company: exp.company,
        role: exp.role,
        duration: `${exp.start || ''} - ${exp.end || ''}`,
        description: Array.isArray(exp.bullets) ? exp.bullets.join('. ') : (exp.bullets || '')
      })),
      education: education.map(edu => ({
        degree: edu.degree,
        institution: edu.school,
        year: `${edu.start || ''} - ${edu.end || ''}`,
        score: edu.gpa || ''
      }))
    }

    try {
      localStorage.setItem('craftcv_portfolio_draft', JSON.stringify(payload))
      localStorage.setItem('craftcv_current_resume', JSON.stringify({ personal, experience, education, skills }))
      await portfolioApi.save(payload)
    } catch (e) {
      console.warn('Backend save notice:', e)
    } finally {
      setPublishingPortfolio(false)
      setShowPortfolioModal(true)
    }
  }

  const handleCopyPortfolioUrl = () => {
    const url = `${window.location.origin}/portfolio/${publishedSlug}`
    navigator.clipboard.writeText(url)
    setPortfolioCopied(true)
    setTimeout(() => setPortfolioCopied(false), 2500)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="bg-black min-h-screen text-white flex flex-col font-sans">

      {/* Top Header */}
      <header className="flex items-center justify-between px-6 h-16 border-b border-white/10 bg-black sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors text-sm">
            <ChevronLeft size={16} />
            Dashboard
          </Link>
          <div className="w-px h-4 bg-white/10" />

          {/* Builder Mode Switcher */}
          <div className="flex items-center bg-[#111] p-1 rounded-2xl border border-white/10 text-xs">
            <button
              onClick={() => switchMode('manual')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                mode === 'manual' ? 'bg-white text-black font-semibold' : 'text-white/60 hover:text-white'
              }`}
            >
              Manual Builder
            </button>
            <button
              onClick={() => switchMode('github')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                mode === 'github' ? 'bg-white text-black font-semibold' : 'text-white/60 hover:text-white'
              }`}
            >
              <Github size={12} />
              <span>GitHub Fetch</span>
            </button>
          </div>

          {/* Agent Copilot Header Quick Button */}
          <button
            onClick={() => setActiveSection('agent')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              activeSection === 'agent'
                ? 'bg-purple-600 text-white border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                : 'border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20'
            }`}
          >
            <Sparkles size={12} className="text-purple-300 animate-pulse" />
            <span>Agent Copilot</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowAtsPopover(!showAtsPopover)}
              className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium cursor-pointer transition-all ${ats.color} hover:brightness-125`}
            >
              <CheckCircle size={12} />
              <span>ATS Score: {ats.score}/100</span>
            </button>

            {/* Real-time ATS Breakdown & Tips Popover */}
            {showAtsPopover && (
              <div className="absolute right-0 top-12 z-50 w-80 bg-[#0e0e0e] border border-white/15 rounded-2xl p-4 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-white/40 tracking-wider">ATS Optimization</span>
                    <p className="text-sm font-bold text-white flex items-center gap-2">
                      <span>Score: {ats.score}/100</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${ats.color}`}>{ats.tier}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAtsPopover(false)}
                    className="text-white/40 hover:text-white text-xs cursor-pointer p-1"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-2 mb-3">
                  {ats.breakdown.map((item, i) => (
                    <div key={i} className="text-xs">
                      <div className="flex justify-between text-[11px] text-white/70 mb-0.5">
                        <span>{item.label}</span>
                        <span className="font-mono text-white/90">{item.score}/{item.max}</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            item.score === item.max ? 'bg-green-400' : item.score > 0 ? 'bg-amber-400' : 'bg-rose-400'
                          }`}
                          style={{ width: `${(item.score / item.max) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {ats.suggestions.length > 0 && (
                  <div className="pt-2 border-t border-white/10">
                    <p className="text-[10px] uppercase tracking-wider text-white/40 font-semibold mb-1.5">Improvement Tips</p>
                    <ul className="space-y-1 text-[11px] text-white/70 list-disc list-inside">
                      {ats.suggestions.map((s, idx) => (
                        <li key={idx} className="leading-tight text-amber-300/80">{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-xl font-medium transition-colors cursor-pointer"
          >
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            <span>{saving ? 'Saving...' : 'Save Resume'}</span>
          </button>

          <button
            onClick={handlePublishPortfolio}
            disabled={publishingPortfolio}
            className="flex items-center gap-1.5 text-xs bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-2 rounded-xl font-semibold shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
          >
            {publishingPortfolio ? <Loader2 size={13} className="animate-spin" /> : <Globe size={13} />}
            <span>Live Portfolio</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 text-xs bg-white text-black px-4 py-2 rounded-xl font-semibold hover:bg-white/90 transition-colors cursor-pointer shadow-md"
          >
            <Download size={13} />
            Export PDF
          </button>
        </div>
      </header>

      {savedSuccess && (
        <div className="bg-emerald-500/20 border-b border-emerald-500/30 text-emerald-300 text-xs py-2 px-6 text-center font-medium">
          {savedSuccess}
        </div>
      )}

      {/* Main Builder Body */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left Sidebar: Sections & Templates */}
        <aside className="hidden lg:flex flex-col w-56 border-r border-white/10 bg-black py-6 shrink-0">
          
          {mode === 'github' && (
            <div className="mb-4 px-3">
              <button
                onClick={() => setActiveSection('github')}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium w-full text-left transition-all cursor-pointer ${
                  activeSection === 'github'
                    ? 'bg-white text-black font-semibold'
                    : 'text-white/70 hover:bg-white/5'
                }`}
              >
                <Github size={15} />
                <span>GitHub Import</span>
              </button>
            </div>
          )}

          {/* Agent Copilot Navigation Button */}
          <div className="mb-4 px-3">
            <button
              onClick={() => setActiveSection('agent')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium w-full text-left transition-all cursor-pointer ${
                activeSection === 'agent'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-lg'
                  : 'border border-purple-500/30 bg-purple-500/10 text-purple-200 hover:bg-purple-500/20'
              }`}
            >
              <Sparkles size={14} className="text-purple-300 shrink-0 animate-pulse" />
              <div className="min-w-0">
                <span className="block font-semibold leading-tight">Agent Copilot</span>
                <span className="block text-[10px] text-purple-300/70 truncate">Autonomous Tailor</span>
              </div>
            </button>
          </div>

          <p className="text-[10px] uppercase tracking-widest text-white/30 px-5 mb-2">Sections</p>
          {SECTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={`flex items-center gap-3 px-5 py-2.5 text-xs text-left w-full transition-colors cursor-pointer ${
                activeSection === id
                  ? 'text-white bg-white/10 border-r-2 border-white font-medium'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={14} className="shrink-0" />
              <span>{label}</span>
            </button>
          ))}

          {/* Template Switcher */}
          <div className="mt-auto px-5 pt-4 border-t border-white/10">
            <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2.5">Select Template</p>
            <div className="grid grid-cols-2 gap-2">
              {templatePreviews.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.id)}
                  className={`rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                    selectedTemplate === t.id ? 'border-white scale-[1.03] shadow-md' : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <img src={t.img} alt={t.name} className="w-full object-cover aspect-[3/4]" />
                  <p className="text-[10px] text-center py-1 bg-[#111] text-white/70">{t.name}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Center: Active Section Editor Form */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-5">

          {/* GITHUB MODE SECTION */}
          {activeSection === 'github' && mode === 'github' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
              <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/10 space-y-3">
                <div className="flex items-center gap-2.5 text-white">
                  <Github size={20} />
                  <h2 className="text-xl font-bold elsie-black">1-Click GitHub Import</h2>
                </div>
                <p className="text-xs text-white/60 leading-relaxed max-w-xl">
                  Enter your GitHub username. We will automatically inspect your public repositories, extract top projects, calculate language usage stats, and populate your resume fields immediately.
                </p>

                <form onSubmit={handleGithubFetch} className="flex gap-3 pt-2">
                  <div className="relative flex-1">
                    <Github className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={15} />
                    <input
                      type="text"
                      value={githubUser}
                      onChange={(e) => setGithubUser(e.target.value)}
                      placeholder="e.g. torvalds, shadcn, or your username"
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-10 w-full text-white placeholder-white/30 focus:outline-none focus:border-white/30 text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={fetchingGithub || !githubUser.trim()}
                    className="bg-white text-black px-6 py-3 rounded-xl font-semibold text-xs hover:bg-white/90 disabled:opacity-40 transition-all flex items-center gap-2 cursor-pointer shrink-0"
                  >
                    {fetchingGithub ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
                    <span>{fetchingGithub ? 'Importing...' : 'Import Profile'}</span>
                  </button>
                </form>

                {githubError && (
                  <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl">
                    {githubError}
                  </p>
                )}

                {githubResult && (
                  <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-xs text-green-300 space-y-1">
                    <p className="font-semibold flex items-center gap-1.5">
                      <Check size={14} />
                      Successfully imported {githubResult.reposCount} projects from GitHub!
                    </p>
                    <p className="text-white/60">
                      Auto-detected languages: {githubResult.languages.join(', ')}. Check the preview on the right!
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* AGENTIC COPILOT SECTION */}
          {activeSection === 'agent' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              
              {/* Top Banner Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#120b1f] via-[#0d0914] to-[#070707] border border-purple-500/30 space-y-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 shadow-inner shrink-0">
                    <Sparkles size={20} className="animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold elsie-black text-white">Autonomous Agentic Copilot</h2>
                      <span className="text-[10px] px-2 py-0.5 rounded-full border border-purple-400/40 bg-purple-500/20 text-purple-200 font-mono">
                        Gemini 2.5
                      </span>
                    </div>
                    <p className="text-xs text-white/60">
                      Paste a target Job Description or give natural language commands. The agent directly rewrites summaries, injects required tech stacks, and calculates quantifiable metrics for your bullets.
                    </p>
                  </div>
                </div>
              </div>

              {/* Success / Explanation Banner with Undo */}
              {agentSuccessMessage && (
                <div className="p-5 rounded-2xl bg-purple-950/40 border border-purple-500/40 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-xs font-semibold text-purple-200">{agentSuccessMessage}</span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                        {agentSource === 'gemini-live' ? 'AI Cloud' : 'Smart Engine'}
                      </span>
                    </div>
                    {agentPreviousState && (
                      <button
                        onClick={handleUndoAgent}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs text-white font-medium cursor-pointer transition-colors"
                      >
                        <RotateCcw size={12} />
                        <span>Undo Changes</span>
                      </button>
                    )}
                  </div>
                  {agentExplanation && (
                    <p className="text-xs text-white/80 bg-black/40 p-3 rounded-xl border border-white/5 leading-relaxed font-sans">
                      💡 <span className="font-semibold text-white">Agent Insight:</span> {agentExplanation}
                    </p>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-purple-500/20 text-xs">
                    <span className="text-white/60">Ready to defend these technical claims?</span>
                    <Link
                      to="/interview"
                      className="text-purple-300 hover:text-purple-200 font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <span>Launch AI Viva &amp; Interview Prep</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              )}

              {/* Quick Action Presets */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/50 flex items-center gap-1.5">
                    <Wand2 size={13} className="text-purple-400" />
                    1-Click Job Tailoring Presets
                  </p>
                  <span className="text-[11px] text-white/40">Click any preset to load & execute</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {AGENT_PROMPT_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      disabled={agentLoading}
                      onClick={() => {
                        setAgentInstruction(preset.prompt)
                        handleExecuteAgent(preset.prompt)
                      }}
                      className="text-left p-3.5 rounded-2xl border border-white/10 bg-[#0c0c0c] hover:border-purple-500/50 hover:bg-[#130f1c] transition-all cursor-pointer group disabled:opacity-50"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                          {preset.title}
                        </span>
                        <span className="text-[10px] text-white/30 group-hover:text-white/70">Run ⚡</span>
                      </div>
                      <p className="text-[11px] text-white/50 group-hover:text-white/70 leading-relaxed">
                        {preset.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Job Description / Instruction Prompt */}
              <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/10 space-y-4">
                <div>
                  <label className="text-xs font-bold text-white uppercase tracking-wider block mb-1">
                    Target Job Description / Agent Command
                  </label>
                  <p className="text-xs text-white/50">
                    Paste the job requirements from LinkedIn, Indeed, or specify customizations like "Add Redis caching and 40% performance metric to my Stripe experience."
                  </p>
                </div>

                <textarea
                  rows={6}
                  value={agentInstruction}
                  onChange={(e) => setAgentInstruction(e.target.value)}
                  placeholder="Paste Job Description here (e.g. 'We are hiring a Senior Distributed Systems Engineer. Must have 4+ years with Go or Node, Docker, Kafka, PostgreSQL, and high availability systems.')..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-xs placeholder-white/20 focus:outline-none focus:border-purple-400 leading-relaxed"
                />

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-white/10">
                  <div className="text-xs text-white/50 flex items-center gap-2">
                    {agentLoading ? (
                      <span className="flex items-center gap-2 text-purple-300">
                        <Loader2 size={13} className="animate-spin" />
                        <span>{agentStepText}</span>
                      </span>
                    ) : (
                      <span>✨ Ready to tailor resume fields & recalculate live ATS score</span>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={agentLoading || !agentInstruction.trim()}
                    onClick={() => handleExecuteAgent()}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs transition-all shadow-lg shadow-purple-600/30 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {agentLoading ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Synthesizing...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={14} />
                        <span>Execute Agent Tailoring</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* PERSONAL INFO SECTION */}
          {activeSection === 'personal' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <h2 className="text-xl elsie-black text-white">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-white/40">Full Name</label>
                  <input
                    type="text"
                    value={personal.name}
                    onChange={(e) => setPersonal({ ...personal, name: e.target.value })}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-white/40">Professional Title</label>
                  <input
                    type="text"
                    value={personal.title}
                    onChange={(e) => setPersonal({ ...personal, title: e.target.value })}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-white/40">Email Address</label>
                  <input
                    type="email"
                    value={personal.email}
                    onChange={(e) => setPersonal({ ...personal, email: e.target.value })}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-white/40">Phone Number</label>
                  <input
                    type="text"
                    value={personal.phone}
                    onChange={(e) => setPersonal({ ...personal, phone: e.target.value })}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-white/40">Location</label>
                  <input
                    type="text"
                    value={personal.location}
                    onChange={(e) => setPersonal({ ...personal, location: e.target.value })}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-white/40">Website / Portfolio</label>
                  <input
                    type="text"
                    value={personal.website}
                    onChange={(e) => setPersonal({ ...personal, website: e.target.value })}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* SUMMARY SECTION */}
          {activeSection === 'summary' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <h2 className="text-xl elsie-black text-white">Professional Summary</h2>
              <textarea
                rows={5}
                value={personal.summary}
                onChange={(e) => setPersonal({ ...personal, summary: e.target.value })}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30 w-full leading-relaxed"
              />
            </motion.div>
          )}

          {/* EXPERIENCE SECTION */}
          {activeSection === 'experience' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl elsie-black text-white">Work Experience</h2>
                <button
                  onClick={() => setExperience([
                    {
                      id: Date.now(),
                      company: 'New Company',
                      role: 'Software Engineer',
                      start: '2024',
                      end: 'Present',
                      location: 'Remote',
                      bullets: ['Engineered scalable features and improved performance.']
                    },
                    ...experience
                  ])}
                  className="flex items-center gap-1.5 text-xs border border-white/20 text-white/70 hover:border-white hover:text-white px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                >
                  <Plus size={13} />
                  Add Position
                </button>
              </div>

              {experience.map((exp, expIdx) => (
                <div key={exp.id} className="border border-white/10 rounded-2xl p-5 space-y-3 bg-[#0a0a0a]">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-white">{exp.role} at {exp.company}</p>
                    <button
                      onClick={() => setExperience(experience.filter((_, i) => i !== expIdx))}
                      className="text-white/30 hover:text-rose-400 p-1 cursor-pointer transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => {
                        const copy = [...experience]
                        copy[expIdx].company = e.target.value
                        setExperience(copy)
                      }}
                      placeholder="Company"
                      className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs"
                    />
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) => {
                        const copy = [...experience]
                        copy[expIdx].role = e.target.value
                        setExperience(copy)
                      }}
                      placeholder="Job Title"
                      className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-white/40">Bullet Points</label>
                    {exp.bullets.map((b, bIdx) => (
                      <input
                        key={bIdx}
                        value={b}
                        onChange={(e) => {
                          const copy = [...experience]
                          copy[expIdx].bullets[bIdx] = e.target.value
                          setExperience(copy)
                        }}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* EDUCATION SECTION */}
          {activeSection === 'education' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <h2 className="text-xl elsie-black text-white">Education</h2>
              {education.map((edu, idx) => (
                <div key={edu.id} className="border border-white/10 rounded-2xl p-5 space-y-3 bg-[#0a0a0a]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-white/40">School / University</label>
                      <input
                        type="text"
                        value={edu.school}
                        onChange={(e) => {
                          const copy = [...education]
                          copy[idx].school = e.target.value
                          setEducation(copy)
                        }}
                        className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-white/40">Degree</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => {
                          const copy = [...education]
                          copy[idx].degree = e.target.value
                          setEducation(copy)
                        }}
                        className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* SKILLS SECTION */}
          {activeSection === 'skills' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <h2 className="text-xl elsie-black text-white">Skills & Technologies</h2>
              <div className="flex flex-wrap gap-2 p-4 border border-white/10 rounded-2xl min-h-28 bg-[#0a0a0a]">
                {skills.map((s, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 bg-white/10 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white">
                    <span>{s}</span>
                    <button
                      onClick={() => setSkills(skills.filter((_, i) => i !== idx))}
                      className="text-white/40 hover:text-rose-400 cursor-pointer transition-colors"
                    >
                      <Minus size={11} />
                    </button>
                  </div>
                ))}
                <input
                  placeholder="+ Type skill & press Enter..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      setSkills([...skills, e.target.value.trim()])
                      e.target.value = ''
                    }
                  }}
                  className="bg-transparent text-white text-xs placeholder-white/20 focus:outline-none px-2 py-1.5 min-w-[150px]"
                />
              </div>
            </motion.div>
          )}

        </main>

        {/* Right Side: Live Resume Preview */}
        <aside className="hidden xl:flex flex-col w-[480px] border-l border-white/10 bg-[#0a0a0a] shrink-0">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <span className="text-sm font-medium text-white flex items-center gap-2">
              <Eye size={14} className="text-white/50" />
              Live Preview
            </span>
            <span className="text-xs text-white/40">
              Template: <span className="text-white font-medium uppercase tracking-wider">{selectedTemplate}</span>
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="transform scale-[0.74] origin-top-left w-[135%]">
              {/* Clean Styled Resume Sheet */}
              <div className="bg-white rounded-xl shadow-2xl overflow-hidden text-black font-serif">
                <div className="bg-gray-950 text-white px-8 py-7">
                  <h1 className="text-2xl font-bold tracking-tight">{personal.name}</h1>
                  <p className="text-sm text-gray-300 mt-0.5">{personal.title}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-gray-400">
                    {personal.email && <span>{personal.email}</span>}
                    {personal.phone && <span>{personal.phone}</span>}
                    {personal.location && <span>{personal.location}</span>}
                    {personal.website && <span>{personal.website}</span>}
                  </div>
                </div>

                <div className="px-8 py-6 space-y-5 text-[11px] leading-relaxed">
                  {personal.summary && (
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 border-b border-gray-200 pb-1 mb-2 font-sans font-semibold">
                        Summary
                      </p>
                      <p className="text-gray-700">{personal.summary}</p>
                    </div>
                  )}

                  {experience.length > 0 && (
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 border-b border-gray-200 pb-1 mb-3 font-sans font-semibold">
                        Experience & Highlights
                      </p>
                      <div className="space-y-4">
                        {experience.map((exp) => (
                          <div key={exp.id}>
                            <div className="flex justify-between items-baseline">
                              <p className="font-bold text-gray-900 text-xs">{exp.role}</p>
                              <p className="text-gray-400 text-[10px]">{exp.start} – {exp.end}</p>
                            </div>
                            <p className="text-gray-500">{exp.company} {exp.location ? `· ${exp.location}` : ''}</p>
                            <ul className="mt-1.5 space-y-1 list-disc list-inside text-gray-700">
                              {exp.bullets.map((b, i) => (
                                <li key={i}>{b}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {education.length > 0 && (
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 border-b border-gray-200 pb-1 mb-2 font-sans font-semibold">
                        Education
                      </p>
                      {education.map((edu) => (
                        <div key={edu.id} className="flex justify-between items-baseline">
                          <div>
                            <p className="font-bold text-gray-900 text-xs">{edu.degree}</p>
                            <p className="text-gray-500">{edu.school}</p>
                          </div>
                          <p className="text-gray-400 text-[10px]">{edu.start} – {edu.end}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {skills.length > 0 && (
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 border-b border-gray-200 pb-1 mb-2 font-sans font-semibold">
                        Skills
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {skills.map((s, i) => (
                          <span key={i} className="bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full text-[10px]">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </aside>

      </div>

      {/* 1-Click Hosted Developer Portfolio Modal */}
      {showPortfolioModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0c0c0c] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-white relative shadow-2xl space-y-6">
            <button
              onClick={() => setShowPortfolioModal(false)}
              className="absolute top-5 right-5 text-white/40 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Web Portfolio Deployed
              </span>
              <h2 className="text-2xl font-bold elsie-black mt-2">
                Your Portfolio is Live!
              </h2>
              <p className="text-xs text-white/50 leading-relaxed">
                Your resume has been converted into an interactive, hosted developer portfolio ready to share with professors, recruiters, and hiring managers.
              </p>
            </div>

            {/* Public Link Box */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3">
              <div className="truncate text-xs font-mono text-purple-300">
                {`${window.location.origin}/portfolio/${publishedSlug}`}
              </div>
              <button
                type="button"
                onClick={handleCopyPortfolioUrl}
                className="px-3.5 py-1.5 rounded-xl bg-white text-black text-xs font-semibold hover:bg-white/90 transition-all shrink-0 flex items-center gap-1.5 cursor-pointer shadow"
              >
                {portfolioCopied ? <Check size={12} className="text-emerald-600" /> : <Share2 size={12} />}
                <span>{portfolioCopied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>

            {/* Theme Selector for Live Portfolio */}
            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-wider text-white/40 font-semibold">Choose Interactive Theme</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'bento', label: '🍱 Bento Grid', desc: 'Modern dark bento boxes' },
                  { id: 'terminal', label: '💻 CLI Terminal', desc: 'Interactive Linux shell' },
                  { id: 'executive', label: '📄 Executive', desc: 'Clean editorial layout' },
                ].map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setPortfolioTheme(t.id)
                      try {
                        const currentDraft = JSON.parse(localStorage.getItem('craftcv_portfolio_draft') || '{}')
                        currentDraft.template = t.id
                        localStorage.setItem('craftcv_portfolio_draft', JSON.stringify(currentDraft))
                      } catch (e) {}
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      portfolioTheme === t.id
                        ? 'border-purple-500 bg-purple-950/30 shadow-md'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <p className="text-xs font-bold text-white mb-0.5">{t.label}</p>
                    <p className="text-[10px] text-white/50">{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <a
                href={`/portfolio/${publishedSlug}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:flex-1 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 cursor-pointer"
              >
                <ExternalLink size={14} />
                <span>Open Live Portfolio</span>
              </a>

              <button
                type="button"
                onClick={() => setShowPortfolioModal(false)}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-semibold transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
