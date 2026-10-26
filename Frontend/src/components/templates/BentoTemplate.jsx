import { 
  LuGlobe as Globe, 
  LuMail as Mail, 
  LuMapPin as MapPin, 
  LuExternalLink as ExternalLink, 
  LuStar as Star, 
  LuBriefcase as Briefcase, 
  LuGraduationCap as GraduationCap, 
  LuSparkles as Sparkles, 
  LuLayers as Layers, 
  LuTerminal as Terminal, 
  LuCpu as Cpu 
} from 'react-icons/lu';
import { FaGithub as Github, FaLinkedin as Linkedin, FaXTwitter as Twitter } from 'react-icons/fa6';

export const BentoTemplate = ({ portfolio }) => {
  const { personalInfo = {}, skills = {}, projects = [], experience = [], education = [] } = portfolio || {};

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-4 sm:p-8 lg:p-12 font-sans selection:bg-blue-500 selection:text-white">
      {/* Background ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl animate-pulse [animation-delay:2s]"></div>
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-6">
        
        {/* Top Hero Bento Box */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile Info */}
          <div className="lg:col-span-2 bg-neutral-900/80 border border-neutral-800/80 rounded-3xl p-8 backdrop-blur-md relative overflow-hidden flex flex-col justify-between group hover:border-neutral-700 transition-all">
            <div className="space-y-4">
              <div className="flex items-center gap-5">
                {personalInfo.avatarUrl ? (
                  <img
                    src={personalInfo.avatarUrl}
                    alt={personalInfo.fullName}
                    className="w-20 h-20 rounded-2xl object-cover ring-2 ring-blue-500/30 shadow-lg shadow-blue-500/10"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                    {personalInfo.fullName?.charAt(0) || 'U'}
                  </div>
                )}
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    Available for Opportunities
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    {personalInfo.fullName || 'Candidate Name'}
                  </h1>
                  <p className="text-base text-blue-400 font-medium">
                    {personalInfo.title || 'Full Stack Engineer'}
                  </p>
                </div>
              </div>

              <p className="text-neutral-300 text-sm sm:text-base leading-relaxed pt-2 max-w-2xl">
                {personalInfo.bio || 'Building scalable applications and delightful user interfaces.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-neutral-800/60 mt-6 text-xs text-neutral-400">
              {personalInfo.location && (
                <span className="flex items-center gap-1.5 bg-neutral-800/50 px-3 py-1.5 rounded-xl border border-neutral-700/50">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  {personalInfo.location}
                </span>
              )}
              {personalInfo.email && (
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="flex items-center gap-1.5 bg-neutral-800/50 hover:bg-neutral-800 px-3 py-1.5 rounded-xl border border-neutral-700/50 hover:text-white transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  {personalInfo.email}
                </a>
              )}
              {personalInfo.websiteUrl && (
                <a
                  href={personalInfo.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 bg-neutral-800/50 hover:bg-neutral-800 px-3 py-1.5 rounded-xl border border-neutral-700/50 hover:text-white transition-colors"
                >
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  Website
                </a>
              )}
            </div>
          </div>

          {/* Social Links & Quick Connect Bento */}
          <div className="bg-neutral-900/80 border border-neutral-800/80 rounded-3xl p-6 backdrop-blur-md flex flex-col justify-between hover:border-neutral-700 transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Connect
                </h3>
                <span className="text-xs text-neutral-500">Verified Links</span>
              </div>
              <div className="space-y-2.5">
                {personalInfo.githubUsername && (
                  <a
                    href={`https://github.com/${personalInfo.githubUsername}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 rounded-2xl bg-neutral-800/50 hover:bg-neutral-800 border border-neutral-700/50 text-neutral-200 hover:text-white transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <Github className="w-5 h-5 text-white" />
                      <span className="text-xs font-medium">github.com/{personalInfo.githubUsername}</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </a>
                )}
                {personalInfo.linkedinUrl && (
                  <a
                    href={personalInfo.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 rounded-2xl bg-neutral-800/50 hover:bg-neutral-800 border border-neutral-700/50 text-neutral-200 hover:text-white transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <Linkedin className="w-5 h-5 text-blue-400" />
                      <span className="text-xs font-medium">LinkedIn Profile</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </a>
                )}
                {personalInfo.twitterUrl && (
                  <a
                    href={personalInfo.twitterUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 rounded-2xl bg-neutral-800/50 hover:bg-neutral-800 border border-neutral-700/50 text-neutral-200 hover:text-white transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <Twitter className="w-5 h-5 text-sky-400" />
                      <span className="text-xs font-medium">Twitter / X</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </a>
                )}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20 mt-4 text-center">
              <p className="text-xs text-neutral-300 font-medium">
                Want to evaluate my skills?
              </p>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Click the <strong className="text-blue-400">Ask Recruiter AI</strong> button in the bottom right!
              </p>
            </div>
          </div>
        </div>

        {/* Skills Bento Strip */}
        <div className="bg-neutral-900/80 border border-neutral-800/80 rounded-3xl p-6 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-4">
            <Cpu className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
              Technical Stack & Skills
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Languages */}
            <div className="bg-neutral-950/60 p-4 rounded-2xl border border-neutral-800">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-2.5">Languages</span>
              <div className="flex flex-wrap gap-1.5">
                {(skills.languages || ['JavaScript', 'TypeScript', 'Python']).map((lang, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20 font-medium">
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            {/* Frameworks */}
            <div className="bg-neutral-950/60 p-4 rounded-2xl border border-neutral-800">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-2.5">Frameworks & Libraries</span>
              <div className="flex flex-wrap gap-1.5">
                {(skills.frameworks || ['React', 'Node.js', 'Express', 'Tailwind']).map((fr, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/20 font-medium">
                    {fr}
                  </span>
                ))}
              </div>
            </div>

            {/* Tools */}
            <div className="bg-neutral-950/60 p-4 rounded-2xl border border-neutral-800">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-2.5">Tools & Databases</span>
              <div className="flex flex-wrap gap-1.5">
                {(skills.tools || ['MongoDB', 'Git', 'Docker', 'Vite']).map((tool, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Featured Projects Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              Featured Projects ({projects.length})
            </h2>
            <span className="text-xs text-neutral-500">Live Repositories & Architectures</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj, idx) => (
              <div
                key={idx}
                className="bg-neutral-900/80 border border-neutral-800/80 rounded-3xl p-6 backdrop-blur-md flex flex-col justify-between hover:border-neutral-700 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                      {proj.title}
                    </h3>
                    {proj.stars > 0 && (
                      <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {proj.stars}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-300 line-clamp-3 leading-relaxed mb-4">
                    {proj.description}
                  </p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {(proj.technologies || []).map((t, i) => (
                      <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-400 font-mono">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-neutral-800 text-xs">
                    {proj.repoUrl && (
                      <a
                        href={proj.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors"
                      >
                        <Github className="w-4 h-4" />
                        Source Code
                      </a>
                    )}
                    {proj.liveDemo && (
                      <a
                        href={proj.liveDemo}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors ml-auto font-medium"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Experience & Education 2-Column Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Experience */}
          <div className="bg-neutral-900/80 border border-neutral-800/80 rounded-3xl p-6 backdrop-blur-md">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
              <Briefcase className="w-4 h-4 text-blue-400" />
              Work & Practical Experience
            </h3>
            {experience.length > 0 ? (
              <div className="space-y-4">
                {experience.map((exp, i) => (
                  <div key={i} className="border-l-2 border-blue-500/40 pl-4 py-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-white">{exp.role}</h4>
                      <span className="text-xs text-neutral-500">{exp.duration}</span>
                    </div>
                    <p className="text-xs text-blue-400 mb-1">{exp.company}</p>
                    <p className="text-xs text-neutral-300 leading-relaxed mb-2">{exp.description}</p>
                    {exp.achievements?.length > 0 && (
                      <ul className="text-[11px] text-neutral-400 space-y-1 list-disc list-inside">
                        {exp.achievements.map((ach, aIdx) => (
                          <li key={aIdx}>{ach}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-neutral-500">Continuous project development and open source contributions.</p>
            )}
          </div>

          {/* Education */}
          <div className="bg-neutral-900/80 border border-neutral-800/80 rounded-3xl p-6 backdrop-blur-md">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              Education & Academia
            </h3>
            {education.length > 0 ? (
              <div className="space-y-4">
                {education.map((edu, i) => (
                  <div key={i} className="border-l-2 border-emerald-500/40 pl-4 py-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-white">{edu.degree}</h4>
                      <span className="text-xs text-neutral-500">{edu.year}</span>
                    </div>
                    <p className="text-xs text-emerald-400 mb-1">{edu.institution}</p>
                    {edu.score && <p className="text-xs text-neutral-400">Score / CGPA: {edu.score}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-neutral-500">Degree and certifications.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default BentoTemplate;
