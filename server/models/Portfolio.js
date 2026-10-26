import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  repoUrl: { type: String, default: '' },
  liveDemo: { type: String, default: '' },
  technologies: [{ type: String }],
  stars: { type: Number, default: 0 },
  pinned: { type: Boolean, default: false }
}, { _id: false });

const ExperienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  duration: { type: String, default: '' },
  description: { type: String, default: '' },
  achievements: [{ type: String }]
}, { _id: false });

const EducationSchema = new mongoose.Schema({
  degree: { type: String, default: '' },
  institution: { type: String, default: '' },
  year: { type: String, default: '' },
  score: { type: String, default: '' }
}, { _id: false });

const PortfolioSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    default: null,
    index: true
  },
  slug: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true,
    trim: true, 
    lowercase: true 
  },
  title: { type: String, default: 'My Professional Portfolio' },
  mode: { 
    type: String, 
    enum: ['manual', 'github'], 
    default: 'manual' 
  },
  template: { 
    type: String, 
    enum: ['bento', 'terminal', 'executive'], 
    default: 'bento' 
  },
  personalInfo: {
    fullName: { type: String, required: true },
    title: { type: String, default: 'Full Stack Software Engineer' },
    bio: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    avatarUrl: { type: String, default: '' },
    githubUsername: { type: String, default: '' },
    linkedinUrl: { type: String, default: '' },
    twitterUrl: { type: String, default: '' },
    websiteUrl: { type: String, default: '' },
  },
  skills: {
    languages: [{ type: String }],
    frameworks: [{ type: String }],
    tools: [{ type: String }]
  },
  projects: [ProjectSchema],
  experience: [ExperienceSchema],
  education: [EducationSchema]
}, {
  timestamps: true
});

export const Portfolio = mongoose.models.Portfolio || mongoose.model('Portfolio', PortfolioSchema);
