import React from 'react';
import { LuMail as Mail, LuPhone as Phone, LuMapPin as MapPin, LuGlobe as Globe, LuExternalLink as ExternalLink } from 'react-icons/lu';
import { FaGithub as Github, FaLinkedin as Linkedin } from 'react-icons/fa6';

export const ExecutiveTemplate = ({ portfolio }) => {
  const { personalInfo = {}, skills = {}, projects = [], experience = [], education = [] } = portfolio || {};

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 py-10 px-4 sm:px-6 font-sans">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl border border-neutral-200 overflow-hidden print:shadow-none print:border-none">
        
        {/* Header */}
        <header className="p-8 sm:p-10 border-b border-neutral-200 bg-neutral-50/50">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 tracking-tight">
                {personalInfo.fullName || 'Candidate Name'}
              </h1>
              <p className="text-lg text-neutral-600 font-medium mt-1">
                {personalInfo.title || 'Full Stack Software Engineer'}
              </p>
            </div>
            {personalInfo.avatarUrl && (
              <img
                src={personalInfo.avatarUrl}
                alt={personalInfo.fullName}
                className="w-20 h-20 rounded-full object-cover border-2 border-neutral-300 shadow-sm"
              />
            )}
          </div>

          <p className="text-neutral-700 text-sm leading-relaxed mt-4 max-w-2xl">
            {personalInfo.bio}
          </p>

          <div className="flex flex-wrap gap-y-2 gap-x-5 mt-6 pt-4 border-t border-neutral-200 text-xs text-neutral-600">
            {personalInfo.email && (
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-neutral-500" />
                {personalInfo.email}
              </span>
            )}
            {personalInfo.phone && (
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-neutral-500" />
                {personalInfo.phone}
              </span>
            )}
            {personalInfo.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                {personalInfo.location}
              </span>
            )}
            {personalInfo.githubUsername && (
              <a
                href={`https://github.com/${personalInfo.githubUsername}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-blue-600 hover:underline"
              >
                <Github className="w-3.5 h-3.5" />
                github.com/{personalInfo.githubUsername}
              </a>
            )}
            {personalInfo.linkedinUrl && (
              <a
                href={personalInfo.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-blue-600 hover:underline"
              >
                <Linkedin className="w-3.5 h-3.5" />
                LinkedIn
              </a>
            )}
          </div>
        </header>

        {/* Content Body */}
        <div className="p-8 sm:p-10 space-y-8">
          
          {/* Skills Section */}
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-500 border-b border-neutral-200 pb-1.5 mb-4">
              Technical Competencies
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <strong className="block text-neutral-800 font-semibold mb-1">Languages:</strong>
                <p className="text-neutral-600">{(skills.languages || []).join(', ')}</p>
              </div>
              <div>
                <strong className="block text-neutral-800 font-semibold mb-1">Frameworks:</strong>
                <p className="text-neutral-600">{(skills.frameworks || []).join(', ')}</p>
              </div>
              <div>
                <strong className="block text-neutral-800 font-semibold mb-1">Tools & Platforms:</strong>
                <p className="text-neutral-600">{(skills.tools || []).join(', ')}</p>
              </div>
            </div>
          </section>

          {/* Featured Projects */}
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-500 border-b border-neutral-200 pb-1.5 mb-4">
              Engineering Projects
            </h2>
            <div className="space-y-5">
              {projects.map((proj, idx) => (
                <div key={idx}>
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-sm font-bold text-neutral-900">
                      {proj.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs">
                      {proj.repoUrl && (
                        <a href={proj.repoUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                          Source <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {proj.liveDemo && (
                        <a href={proj.liveDemo} target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline flex items-center gap-1">
                          Demo <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-neutral-700 mt-1 leading-relaxed">
                    {proj.description}
                  </p>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    <span className="font-semibold text-neutral-600">Stack:</span> {(proj.technologies || []).join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Experience */}
          {experience.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-500 border-b border-neutral-200 pb-1.5 mb-4">
                Professional Experience
              </h2>
              <div className="space-y-4">
                {experience.map((exp, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-sm font-bold text-neutral-900">{exp.role}</h3>
                      <span className="text-xs text-neutral-500">{exp.duration}</span>
                    </div>
                    <p className="text-xs font-medium text-neutral-700">{exp.company}</p>
                    <p className="text-xs text-neutral-600 mt-1">{exp.description}</p>
                    {exp.achievements?.length > 0 && (
                      <ul className="text-xs text-neutral-600 list-disc list-inside mt-1.5 space-y-0.5">
                        {exp.achievements.map((ach, aIdx) => (
                          <li key={aIdx}>{ach}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-500 border-b border-neutral-200 pb-1.5 mb-4">
                Education
              </h2>
              <div className="space-y-3">
                {education.map((edu, idx) => (
                  <div key={idx} className="flex justify-between items-baseline">
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900">{edu.degree}</h3>
                      <p className="text-xs text-neutral-600">{edu.institution}</p>
                    </div>
                    <div className="text-right text-xs text-neutral-500">
                      <div>{edu.year}</div>
                      {edu.score && <div className="text-neutral-700 font-medium">CGPA: {edu.score}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>

      </div>
    </div>
  );
};

export default ExecutiveTemplate;
