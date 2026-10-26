export const DEFAULT_PORTFOLIO = {
  slug: 'aryan-sharma',
  title: 'Aryan Sharma | Full Stack Engineer',
  template: 'bento',
  personalInfo: {
    fullName: 'Aryan Sharma',
    title: 'Full Stack Engineer & Distributed Systems Enthusiast',
    bio: 'Crafting responsive user interfaces and high-throughput backend services. Passionate about interactive web experiences, microservices, and AI-driven workflows.',
    email: 'aryan@example.com',
    phone: '+91 98765 43210',
    location: 'Jaipur, India',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    githubUsername: 'aryan-sharma',
    linkedinUrl: 'https://linkedin.com/in/aryan-sharma',
    twitterUrl: 'https://twitter.com/aryan_sharma',
    websiteUrl: 'https://craftcv.dev',
  },
  skills: {
    languages: ['JavaScript', 'TypeScript', 'Python', 'C++', 'SQL'],
    frameworks: ['React', 'Next.js', 'Node.js', 'Express', 'Tailwind CSS'],
    tools: ['MongoDB', 'Docker', 'Git', 'Vite', 'Postman', 'Figma']
  },
  projects: [
    {
      title: 'CraftCV Portfolio Engine',
      description: 'Full-stack platform featuring 1-click GitHub profile ingestion, interactive 3D and CLI themes, and an autonomous Recruiter AI digital twin.',
      repoUrl: 'https://github.com/aryan/craftcv',
      liveDemo: 'https://craftcv.dev',
      technologies: ['React 19', 'Node.js', 'Express', 'MongoDB', 'Three.js'],
      stars: 48,
      pinned: true
    },
    {
      title: 'Distributed Real-Time Stream Processor',
      description: 'High-throughput event streaming engine handling up to 50k events/sec with fault-tolerant worker nodes and metrics dashboard.',
      repoUrl: 'https://github.com/aryan/stream-processor',
      liveDemo: '',
      technologies: ['Node.js', 'Redis', 'WebSockets', 'Docker'],
      stars: 32,
      pinned: true
    },
    {
      title: 'Neural Vision Pipeline',
      description: 'Deep learning pipeline for object tracking and anomaly detection in industrial automation video streams.',
      repoUrl: 'https://github.com/aryan/neural-vision',
      liveDemo: '',
      technologies: ['Python', 'PyTorch', 'OpenCV', 'FastAPI'],
      stars: 27,
      pinned: false
    }
  ],
  experience: [
    {
      company: 'NextGen Cloud Labs',
      role: 'Full Stack Engineering Intern',
      duration: 'May 2025 - Aug 2025',
      description: 'Designed and deployed responsive web portals and REST APIs serving 10,000+ monthly active users.',
      achievements: [
        'Reduced client bundle load times by 42% through code-splitting and asset optimization.',
        'Engineered automated database migrations and Mongoose indexing, cutting average query latency by 65%.'
      ]
    }
  ],
  education: [
    {
      degree: 'B.Tech in Computer Science & Engineering',
      institution: 'Swami Keshvanand Institute of Technology (SKIT)',
      year: '2022 - 2026',
      score: '8.8 CGPA'
    }
  ],
  aiSettings: {
    enabled: true,
    welcomeMessage: 'Hi! I am Aryan\'s AI Recruiter Assistant. Ask me anything about their engineering experience, projects, or tech stack!',
    customPitch: 'Aryan is an adaptable full-stack engineer who builds scalable systems from interactive React frontends to robust Node.js and MongoDB backends.'
  }
};

const STORAGE_KEY = 'craftcv_portfolio_draft';

export const loadDraftPortfolio = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to load draft from localStorage:', err);
  }
  return DEFAULT_PORTFOLIO;
};

export const saveDraftPortfolio = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save draft to localStorage:', err);
  }
};
