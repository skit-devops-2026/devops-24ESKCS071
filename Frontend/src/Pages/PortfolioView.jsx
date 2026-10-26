import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { portfolioApi } from '../lib/api';
import BentoTemplate from '../components/templates/BentoTemplate';
import TerminalTemplate from '../components/templates/TerminalTemplate';
import ExecutiveTemplate from '../components/templates/ExecutiveTemplate';
import { 
  LuArrowLeft as ArrowLeft, 
  LuLoaderCircle as Loader2, 
  LuSparkles as Sparkles, 
  LuShare2 as Share2, 
  LuCheck as Check,
  LuTerminal as TerminalIcon,
  LuLayers as BentoIcon,
  LuFileText as ExecutiveIcon,
  LuGraduationCap as GraduationCap
} from 'react-icons/lu';
import { DEFAULT_PORTFOLIO, loadDraftPortfolio } from '../lib/portfolioStore';

export const PortfolioView = () => {
  const { id } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTheme, setActiveTheme] = useState('bento');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPortfolio = async () => {
      setLoading(true);

      // Check if candidate has active builder edits in localStorage
      let liveResume = null;
      try {
        const stored = localStorage.getItem('craftcv_current_resume');
        if (stored) liveResume = JSON.parse(stored);
      } catch (e) {}

      // If id is demo, load default profile (merged with live resume if present)
      if (id === 'demo' || id === 'aryan-sharma' || id === 'me') {
        const base = loadDraftPortfolio() || DEFAULT_PORTFOLIO;
        if (liveResume && liveResume.personal?.name) {
          const merged = {
            ...base,
            personalInfo: {
              ...base.personalInfo,
              fullName: liveResume.personal.name || base.personalInfo.fullName,
              title: liveResume.personal.title || base.personalInfo.title,
              bio: liveResume.personal.summary || base.personalInfo.bio,
              email: liveResume.personal.email || base.personalInfo.email,
              phone: liveResume.personal.phone || base.personalInfo.phone,
              location: liveResume.personal.location || base.personalInfo.location,
              websiteUrl: liveResume.personal.website || base.personalInfo.websiteUrl,
              linkedinUrl: liveResume.personal.linkedin || base.personalInfo.linkedinUrl,
            },
            skills: {
              ...base.skills,
              languages: (liveResume.skills || []).slice(0, 5),
              frameworks: (liveResume.skills || []).slice(5, 10),
              tools: (liveResume.skills || []).slice(10)
            },
            experience: liveResume.experience && liveResume.experience.length > 0 
              ? liveResume.experience.map(exp => ({
                  company: exp.company,
                  role: exp.role,
                  duration: `${exp.start || ''} - ${exp.end || ''}`,
                  description: Array.isArray(exp.bullets) ? exp.bullets.join('. ') : (exp.bullets || '')
                }))
              : base.experience
          };
          setPortfolio(merged);
          setActiveTheme(merged.template || 'bento');
        } else {
          setPortfolio(base);
          setActiveTheme(base.template || 'bento');
        }
        setLoading(false);
        return;
      }

      try {
        const res = await portfolioApi.get(id);
        if (res.success && res.data) {
          setPortfolio(res.data);
          setActiveTheme(res.data.template || 'bento');
        } else {
          setPortfolio(DEFAULT_PORTFOLIO);
        }
      } catch (err) {
        console.warn('Could not load portfolio from server, showing sample profile:', err);
        setPortfolio(DEFAULT_PORTFOLIO);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center gap-4 font-sans">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
        <p className="text-sm text-neutral-400">Loading hosted developer portfolio...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Top Floating Control Bar */}
      <header className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between gap-3 pointer-events-none">
        
        {/* Left: Back to Builder */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <Link
            to="/builder"
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-neutral-900/90 hover:bg-neutral-800 text-white text-xs font-medium border border-neutral-700/80 shadow-2xl backdrop-blur-md transition-all cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">Back to Builder</span>
            <span className="sm:hidden">Builder</span>
          </Link>
        </div>

        {/* Center: Live Theme Switcher Pills */}
        <div className="pointer-events-auto flex items-center bg-black/85 backdrop-blur-xl p-1 rounded-full border border-white/15 shadow-2xl text-xs">
          <button
            type="button"
            onClick={() => setActiveTheme('bento')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all cursor-pointer font-medium ${
              activeTheme === 'bento' 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' 
                : 'text-white/60 hover:text-white'
            }`}
          >
            <BentoIcon size={13} />
            <span className="hidden md:inline">Bento Grid</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTheme('terminal')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all cursor-pointer font-medium ${
              activeTheme === 'terminal' 
                ? 'bg-emerald-600 text-white shadow-md font-mono' 
                : 'text-white/60 hover:text-white font-mono'
            }`}
          >
            <TerminalIcon size={13} />
            <span className="hidden md:inline">CLI Terminal</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTheme('executive')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all cursor-pointer font-medium ${
              activeTheme === 'executive' 
                ? 'bg-neutral-200 text-black shadow-md' 
                : 'text-white/60 hover:text-white'
            }`}
          >
            <ExecutiveIcon size={13} />
            <span className="hidden md:inline">Executive</span>
          </button>
        </div>

        {/* Right: Share Link & AI Viva Link */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <Link
            to="/interview"
            title="Practice viva questions on this portfolio"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-purple-200 text-xs font-semibold backdrop-blur-md shadow-xl transition-all cursor-pointer"
          >
            <GraduationCap size={14} className="text-purple-300" />
            <span>AI Viva Prep</span>
          </Link>

          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white text-black hover:bg-white/90 text-xs font-semibold shadow-xl backdrop-blur-md transition-all cursor-pointer"
          >
            {copied ? <Check size={13} className="text-emerald-600" /> : <Share2 size={13} />}
            <span>{copied ? 'Link Copied!' : 'Share URL'}</span>
          </button>
        </div>
      </header>

      {/* Render Active Template */}
      <main className="pt-2">
        {activeTheme === 'terminal' ? (
          <TerminalTemplate portfolio={portfolio} />
        ) : activeTheme === 'executive' ? (
          <ExecutiveTemplate portfolio={portfolio} />
        ) : (
          <BentoTemplate portfolio={portfolio} />
        )}
      </main>
    </div>
  );
};

export default PortfolioView;
