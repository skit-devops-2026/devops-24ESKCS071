// Industry standard action verbs for ATS parsing
const ACTION_VERBS = [
  'built', 'engineered', 'developed', 'designed', 'led', 'architected', 
  'deployed', 'optimized', 'reduced', 'increased', 'scaled', 'implemented', 
  'spearheaded', 'managed', 'streamlined', 'created', 'automated', 'integrated',
  'mentored', 'delivered', 'shipped', 'formulated', 'collaborated'
];

export const calculateAtsScore = ({ personal = {}, experience = [], education = [], skills = [] }) => {
  let score = 0;
  const breakdown = [];
  const suggestions = [];

  // 1. Contact & Identification Completeness (Max: 20 pts)
  let contactPts = 0;
  if (personal.name && personal.name.trim().length > 2) contactPts += 4;
  if (personal.title && personal.title.trim().length > 2) contactPts += 4;
  if (personal.email && personal.email.includes('@')) contactPts += 4;
  if (personal.phone && personal.phone.trim().length > 5) contactPts += 3;
  if (personal.location && personal.location.trim().length > 2) contactPts += 2;
  if (personal.website || personal.linkedin) contactPts += 3;

  score += contactPts;
  breakdown.push({ label: 'Contact & Links', score: contactPts, max: 20 });
  if (contactPts < 20) {
    suggestions.push('Add your phone, location, and portfolio/LinkedIn links.');
  }

  // 2. Professional Summary (Max: 15 pts)
  let summaryPts = 0;
  const summaryWords = (personal.summary || '').trim().split(/\s+/).filter(Boolean);
  if (summaryWords.length >= 25) {
    summaryPts = 15;
  } else if (summaryWords.length >= 12) {
    summaryPts = 10;
  } else if (summaryWords.length > 0) {
    summaryPts = 5;
  }

  score += summaryPts;
  breakdown.push({ label: 'Summary Statement', score: summaryPts, max: 15 });
  if (summaryPts < 15) {
    suggestions.push('Expand your summary to at least 25 words highlighting your key strengths.');
  }

  // 3. Skills Depth & Variety (Max: 20 pts)
  let skillsPts = 0;
  const skillCount = Array.isArray(skills) ? skills.length : 0;
  if (skillCount >= 8) {
    skillsPts = 20;
  } else if (skillCount >= 5) {
    skillsPts = 14;
  } else if (skillCount >= 2) {
    skillsPts = 8;
  }

  score += skillsPts;
  breakdown.push({ label: 'Technical Skills', score: skillsPts, max: 20 });
  if (skillCount < 8) {
    suggestions.push(`Add ${8 - skillCount} more relevant skills/frameworks to match job filters.`);
  }

  // 4. Quantifiable Metrics & Numbers (Max: 20 pts)
  let metricsPts = 0;
  const metricRegex = /\b\d+(\.\d+)?%?|\b\d+[kKmMbB]?\+?|\$\d+/;
  let metricHits = 0;

  experience.forEach(exp => {
    (exp.bullets || []).forEach(b => {
      if (metricRegex.test(b)) metricHits++;
    });
  });

  if (metricHits >= 3) {
    metricsPts = 20;
  } else if (metricHits >= 2) {
    metricsPts = 14;
  } else if (metricHits >= 1) {
    metricsPts = 8;
  }

  score += metricsPts;
  breakdown.push({ label: 'Quantified Impact (%, numbers)', score: metricsPts, max: 20 });
  if (metricsPts < 20) {
    suggestions.push('Include measurable numbers or percentages in bullet points (e.g. "reduced load time by 40%").');
  }

  // 5. Strong Action Verbs (Max: 15 pts)
  let verbPts = 0;
  let verbHits = 0;

  const allText = experience.flatMap(e => e.bullets || []).join(' ').toLowerCase();
  ACTION_VERBS.forEach(v => {
    if (allText.includes(v)) verbHits++;
  });

  if (verbHits >= 4) {
    verbPts = 15;
  } else if (verbHits >= 2) {
    verbPts = 10;
  } else if (verbHits >= 1) {
    verbPts = 5;
  }

  score += verbPts;
  breakdown.push({ label: 'Action Verbs', score: verbPts, max: 15 });
  if (verbHits < 4) {
    suggestions.push('Start bullet points with powerful action verbs like "Led", "Engineered", "Optimized", or "Scaled".');
  }

  // 6. Education Completeness (Max: 10 pts)
  let eduPts = 0;
  if (education.length > 0 && education[0].school && education[0].degree) {
    eduPts = 10;
  } else if (education.length > 0) {
    eduPts = 5;
  }

  score += eduPts;
  breakdown.push({ label: 'Education & Degree', score: eduPts, max: 10 });
  if (eduPts < 10) {
    suggestions.push('Complete your university name and degree information.');
  }

  // Determine badge color and rating tier
  let tier = 'Needs Work';
  let color = 'text-rose-400 bg-rose-500/10 border-rose-500/20';

  if (score >= 85) {
    tier = 'Excellent ATS Match';
    color = 'text-green-400 bg-green-500/10 border-green-500/20';
  } else if (score >= 70) {
    tier = 'Good Candidate';
    color = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
  }

  return {
    score: Math.min(score, 100),
    tier,
    color,
    breakdown,
    suggestions: suggestions.slice(0, 3)
  };
};

export default calculateAtsScore;
