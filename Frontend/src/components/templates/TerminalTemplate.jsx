import React, { useState, useRef, useEffect } from 'react';
import { LuTerminal as Terminal, LuSend as Send, LuCornerDownLeft as CornerDownLeft, LuSparkles as Sparkles } from 'react-icons/lu';

export const TerminalTemplate = ({ portfolio }) => {
  const { personalInfo = {}, skills = {}, projects = [], experience = [], education = [] } = portfolio || {};
  
  const userPrompt = `${personalInfo.githubUsername || 'candidate'}@craftcv:~$`;

  const [history, setHistory] = useState([
    {
      command: 'init',
      output: [
        '================================================================',
        `  CRAFTCV TERMINAL EMULATOR v2.4 (x86_64-pc-linux-gnu)`,
        `  Candidate Profile: ${personalInfo.fullName || 'Aryan Sharma'} [${personalInfo.title || 'Engineer'}]`,
        '================================================================',
        'Type "help" to see available commands or explore the interactive CLI.'
      ]
    },
    {
      command: 'help',
      output: [
        'Available commands:',
        '  bio          Display summary and candidate bio',
        '  skills       Print technical stack and categorized skills',
        '  projects     List featured engineering projects with repository links',
        '  experience   View work history and professional milestones',
        '  education    Show academic background and degrees',
        '  contact      Get email, social links, and website info',
        '  clear        Clear terminal screen'
      ]
    }
  ]);

  const [inputVal, setInputVal] = useState('');
  const terminalEndRef = useRef(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e) => {
    e.preventDefault();
    const rawCmd = inputVal.trim();
    if (!rawCmd) return;

    const cmd = rawCmd.toLowerCase();
    let output = [];

    switch (cmd) {
      case 'help':
        output = [
          'Available commands:',
          '  bio          Display summary and candidate bio',
          '  skills       Print technical stack and categorized skills',
          '  projects     List featured engineering projects with repository links',
          '  experience   View work history and professional milestones',
          '  education    Show academic background and degrees',
          '  contact      Get email, social links, and website info',
          '  clear        Clear terminal screen'
        ];
        break;

      case 'bio':
      case 'about':
        output = [
          `Name:     ${personalInfo.fullName || 'Candidate'}`,
          `Role:     ${personalInfo.title || 'Full Stack Developer'}`,
          `Location: ${personalInfo.location || 'Remote'}`,
          `Bio:      ${personalInfo.bio || 'Passionate software engineer.'}`
        ];
        break;

      case 'skills':
        output = [
          'LANGUAGES:   ' + (skills.languages || []).join(', '),
          'FRAMEWORKS:  ' + (skills.frameworks || []).join(', '),
          'TOOLS/DB:    ' + (skills.tools || []).join(', ')
        ];
        break;

      case 'projects':
        if (projects.length === 0) {
          output = ['No projects registered.'];
        } else {
          output = projects.flatMap((p, idx) => [
            `[${idx + 1}] ${p.title} (${(p.technologies || []).join(', ')}) ★ ${p.stars || 0}`,
            `    ${p.description}`,
            `    Source: ${p.repoUrl || 'N/A'}${p.liveDemo ? ` | Demo: ${p.liveDemo}` : ''}`,
            ''
          ]);
        }
        break;

      case 'experience':
        if (experience.length === 0) {
          output = ['No formal work experience listed.'];
        } else {
          output = experience.flatMap((exp) => [
            `ROLE:    ${exp.role} @ ${exp.company} (${exp.duration})`,
            `DETAILS: ${exp.description}`,
            ''
          ]);
        }
        break;

      case 'education':
        if (education.length === 0) {
          output = ['Education not specified.'];
        } else {
          output = education.map(
            (edu) => `${edu.degree} - ${edu.institution} (${edu.year}) ${edu.score ? `[CGPA: ${edu.score}]` : ''}`
          );
        }
        break;

      case 'contact':
        output = [
          `Email:    ${personalInfo.email || 'N/A'}`,
          `GitHub:   ${personalInfo.githubUsername ? `https://github.com/${personalInfo.githubUsername}` : 'N/A'}`,
          `LinkedIn: ${personalInfo.linkedinUrl || 'N/A'}`,
          `Website:  ${personalInfo.websiteUrl || 'N/A'}`
        ];
        break;

      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      default:
        output = [`bash: command not found: ${rawCmd}. Type "help" for a list of available commands.`];
    }

    setHistory((prev) => [...prev, { command: rawCmd, output }]);
    setInputVal('');
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono p-4 sm:p-8 flex flex-col justify-center items-center selection:bg-green-500 selection:text-black">
      <div className="w-full max-w-4xl bg-neutral-950/90 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[85vh]">
        
        {/* Terminal Header Bar */}
        <div className="bg-neutral-900 border-b border-neutral-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
            <span className="ml-3 text-xs text-neutral-400 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-neutral-400" />
              craftcv-cli: ~/{personalInfo.githubUsername || 'portfolio'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-neutral-400">
            <span className="hidden sm:inline bg-neutral-800 px-2.5 py-1 rounded-md text-[11px] text-neutral-300">
              Interactive Terminal Mode
            </span>
          </div>
        </div>

        {/* Terminal Screen / Content */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {history.map((item, idx) => (
            <div key={idx} className="space-y-1">
              {item.command !== 'init' && (
                <div className="flex items-center gap-2 text-neutral-400">
                  <span className="text-emerald-400 font-semibold">{userPrompt}</span>
                  <span className="text-white">{item.command}</span>
                </div>
              )}
              <div className="text-neutral-300 space-y-0.5 whitespace-pre-wrap pl-2 leading-relaxed">
                {item.output.map((line, lIdx) => (
                  <div key={lIdx} className={line.startsWith('bash:') ? 'text-rose-400' : line.startsWith('LANGUAGES:') ? 'text-cyan-400' : line.startsWith('[') ? 'text-amber-300 font-semibold' : ''}>
                    {line}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Active Input Line */}
          <form onSubmit={handleCommand} className="flex items-center gap-2 pt-2">
            <span className="text-emerald-400 font-semibold shrink-0">{userPrompt}</span>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              autoFocus
              className="flex-1 bg-transparent border-none outline-none text-white font-mono text-xs sm:text-sm caret-emerald-400"
              placeholder="type a command (e.g. projects, skills, bio)..."
            />
            <button type="submit" className="text-neutral-500 hover:text-emerald-400 transition-colors">
              <CornerDownLeft className="w-4 h-4" />
            </button>
          </form>

          <div ref={terminalEndRef} />
        </div>

        {/* Quick Command Help Bar at bottom */}
        <div className="bg-neutral-900/60 border-t border-neutral-800/80 px-4 py-2.5 flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-neutral-500 text-[11px] shrink-0">Quick run:</span>
            {['projects', 'skills', 'bio', 'contact', 'clear'].map((cmd) => (
              <button
                key={cmd}
                onClick={() => {
                  setInputVal(cmd);
                }}
                className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-emerald-400 text-[11px] transition-colors cursor-pointer"
              >
                {cmd}
              </button>
            ))}
          </div>
          <span className="text-[11px] text-neutral-500 hidden sm:inline">Press Enter to execute</span>
        </div>

      </div>
    </div>
  );
};

export default TerminalTemplate;
