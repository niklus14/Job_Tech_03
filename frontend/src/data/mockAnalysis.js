const jobCategories = [
  {
    id: 'cybersecurity',
    label: 'Cybersecurity',
    emoji: '🛡️',
    skills: ['Network Security', 'Incident Response', 'SIEM', 'Threat Hunting', 'Penetration Testing', 'Cloud Security', 'Vulnerability Assessment', 'Zero Trust', 'Firewall Management', 'Endpoint Security']
  },
  {
    id: 'backend',
    label: 'Backend',
    emoji: '🧠',
    skills: ['Node.js', 'Python', 'Java', 'Databases', 'REST APIs', 'Microservices', 'Docker', 'Kubernetes', 'SQL', 'Caching']
  },
  {
    id: 'ai-engineer',
    label: 'AI Engineer',
    emoji: '🤖',
    skills: ['Prompt Engineering', 'LLMs', 'NLP', 'Computer Vision', 'PyTorch', 'TensorFlow', 'Model Deployment', 'MLOps', 'Data Pipelines', 'Feature Engineering']
  },
  {
    id: 'fullstack',
    label: 'Fullstack',
    emoji: '💻',
    skills: ['React', 'Vue', 'Node.js', 'GraphQL', 'REST APIs', 'TypeScript', 'UI/UX', 'Databases', 'Testing', 'DevOps']
  },
  {
    id: 'data-analyst',
    label: 'Data Analyst',
    emoji: '📊',
    skills: ['SQL', 'Excel', 'Power BI', 'Tableau', 'Statistics', 'Data Visualization', 'Python', 'Data Cleaning', 'Reporting', 'Business Intelligence']
  },
  {
    id: 'qa',
    label: 'QA',
    emoji: '🧪',
    skills: ['Test Automation', 'Selenium', 'Cypress', 'Test Plans', 'Bug Reporting', 'Performance Testing', 'API Testing', 'Regression Testing', 'Jira', 'Quality Metrics']
  },
  {
    id: 'frontend',
    label: 'Frontend',
    emoji: '🎨',
    skills: ['React', 'Vue', 'HTML', 'CSS', 'JavaScript', 'TypeScript', 'Responsive Design', 'Accessibility', 'Web Performance', 'Animations']
  },
  {
    id: 'mobile',
    label: 'Mobile',
    emoji: '📱',
    skills: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Mobile UI', 'Offline Support', 'Push Notifications', 'App Store', 'Performance', 'API Integration']
  },
  {
    id: 'ml-ds',
    label: 'ML / Data Science',
    emoji: '📈',
    skills: ['Machine Learning', 'Data Modeling', 'Scikit-learn', 'Pandas', 'TensorFlow', 'Statistics', 'Feature Engineering', 'Model Evaluation', 'Time Series', 'Data Storytelling']
  }
];

const jobTemplates = {
  cybersecurity: [
    { title: 'Cybersecurity Analyst', company: 'Azeri Secure', location: 'Baku', required_skills: ['Threat Hunting', 'SIEM', 'Incident Response', 'Network Security'] },
    { title: 'Security Operations Engineer', company: 'InfoGuard', location: 'Baku', required_skills: ['Vulnerability Assessment', 'Firewall Management', 'Cloud Security', 'Endpoint Security'] },
    { title: 'Cloud Security Specialist', company: 'Caspian Tech', location: 'Baku', required_skills: ['Cloud Security', 'Zero Trust', 'Compliance', 'Incident Response'] }
  ],
  backend: [
    { title: 'Backend Developer', company: 'DataForge', location: 'Baku', required_skills: ['Node.js', 'Databases', 'REST APIs', 'Docker'] },
    { title: 'Platform Engineer', company: 'Silicon Labs', location: 'Baku', required_skills: ['Kubernetes', 'Microservices', 'Python', 'Caching'] },
    { title: 'API Engineer', company: 'Azeri Labs', location: 'Baku', required_skills: ['Java', 'Microservices', 'SQL', 'Testing'] }
  ],
  'ai-engineer': [
    { title: 'AI Engineer', company: 'NeuroFlow', location: 'Baku', required_skills: ['TensorFlow', 'PyTorch', 'Model Deployment', 'Data Pipelines'] },
    { title: 'NLP Engineer', company: 'TextWise', location: 'Baku', required_skills: ['NLP', 'LLMs', 'Feature Engineering', 'Python'] },
    { title: 'ML Systems Developer', company: 'AIDA', location: 'Baku', required_skills: ['MLOps', 'Prompt Engineering', 'Cloud Security', 'Data Engineering'] }
  ],
  fullstack: [
    { title: 'Fullstack Developer', company: 'WebNest', location: 'Baku', required_skills: ['React', 'Node.js', 'TypeScript', 'GraphQL'] },
    { title: 'Product Engineer', company: 'BrightApps', location: 'Baku', required_skills: ['UI/UX', 'JavaScript', 'REST APIs', 'Testing'] },
    { title: 'Applications Engineer', company: 'NovaTech', location: 'Baku', required_skills: ['React', 'Databases', 'DevOps', 'Kubernetes'] }
  ],
  'data-analyst': [
    { title: 'Data Analyst', company: 'Insightar', location: 'Baku', required_skills: ['SQL', 'Power BI', 'Data Visualization', 'Statistics'] },
    { title: 'Business Intelligence Analyst', company: 'MarketPulse', location: 'Baku', required_skills: ['Tableau', 'SQL', 'Reporting', 'Excel'] },
    { title: 'Reporting Analyst', company: 'Azeri Analytics', location: 'Baku', required_skills: ['Data Cleaning', 'Python', 'SQL', 'Business Intelligence'] }
  ],
  qa: [
    { title: 'QA Engineer', company: 'TestDrive', location: 'Baku', required_skills: ['Test Automation', 'Bug Reporting', 'API Testing', 'Regression Testing'] },
    { title: 'Quality Analyst', company: 'SoftAssure', location: 'Baku', required_skills: ['Selenium', 'Test Plans', 'Performance Testing', 'Jira'] },
    { title: 'QA Automation Specialist', company: 'ClearCode', location: 'Baku', required_skills: ['Cypress', 'Test Automation', 'Regression Testing', 'Quality Metrics'] }
  ],
  frontend: [
    { title: 'Frontend Developer', company: 'PixelFlow', location: 'Baku', required_skills: ['React', 'HTML', 'CSS', 'Web Performance'] },
    { title: 'UI Engineer', company: 'UXia', location: 'Baku', required_skills: ['Responsive Design', 'JavaScript', 'Accessibility', 'Animations'] },
    { title: 'Visual Frontend Developer', company: 'FrameLab', location: 'Baku', required_skills: ['Vue', 'TypeScript', 'CSS', 'Performance'] }
  ],
  mobile: [
    { title: 'Mobile Developer', company: 'AppZone', location: 'Baku', required_skills: ['React Native', 'API Integration', 'Mobile UI', 'Offline Support'] },
    { title: 'Flutter Engineer', company: 'PocketTech', location: 'Baku', required_skills: ['Flutter', 'Performance', 'Push Notifications', 'App Store'] },
    { title: 'iOS Developer', company: 'SmartApps', location: 'Baku', required_skills: ['Swift', 'Mobile UI', 'API Integration', 'App Store'] }
  ],
  'ml-ds': [
    { title: 'Data Scientist', company: 'CoreData', location: 'Baku', required_skills: ['Machine Learning', 'Data Modeling', 'Python', 'Model Evaluation'] },
    { title: 'ML Engineer', company: 'InsightAI', location: 'Baku', required_skills: ['Scikit-learn', 'Feature Engineering', 'Model Deployment', 'Statistics'] },
    { title: 'Analytics Scientist', company: 'DeepMetrics', location: 'Baku', required_skills: ['Time Series', 'Pandas', 'Data Storytelling', 'Machine Learning'] }
  ]
};

const SAMPLE_CVS = [
  { filename: 'cv_az_backend.pdf', label: 'Backend CV' },
  { filename: 'cv_az_data_analytics.pdf', label: 'Data Analyst CV' },
  { filename: 'cv_az_cyber.pdf', label: 'Cybersecurity CV' }
];

const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

function hashString(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) % 1e9;
  }
  return hash;
}

function seededRandom(seed) {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function shuffle(array, rng) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function pickMany(array, count, rng) {
  return shuffle(array, rng).slice(0, Math.min(count, array.length));
}

function getCategoryById(id) {
  return jobCategories.find((category) => category.id === id);
}

function generateLevels(skills, rng) {
  return skills.map((skill) => {
    const levelIndex = Math.min(LEVELS.length - 1, Math.floor(rng() * LEVELS.length));
    return { skill, level: LEVELS[levelIndex] };
  });
}

function buildJobMatches(selectedCategories, extractedSkills, overallScore, rng) {
  const categoryJobs = selectedCategories.length > 0 ? selectedCategories : Object.keys(jobTemplates);
  const jobs = [];

  categoryJobs.forEach((categoryId) => {
    const templates = jobTemplates[categoryId] || [];
    templates.forEach((template) => jobs.push({ ...template, categoryId }));
  });

  const primaryJobs = shuffle(jobs, rng).slice(0, 10).map((job, index) => {
    const matchedSkills = job.required_skills.filter((skill) => extractedSkills.some((item) => item.skill === skill));
    const missingSkills = job.required_skills.filter((skill) => !matchedSkills.includes(skill));
    const matchScore = Math.min(99, Math.max(35, Math.round(45 + matchedSkills.length * 12 - missingSkills.length * 4 + rng() * 14)));
    return {
      ...job,
      matched_skills: matchedSkills,
      missing_skills: missingSkills,
      match_percentage: Math.round((matchScore + overallScore) / 2),
      url: 'https://example.com/job/' + encodeURIComponent(job.title.replace(/\s+/g, '-').toLowerCase())
    };
  });

  return primaryJobs;
}

function buildLearningPath(missingSkills, overallScore) {
  const selected = missingSkills.slice(0, 6);
  const path = [];
  let currentScore = overallScore;
  const increments = [6, 10, 14];
  const durations = ['30 days', '60 days', '90 days'];

  selected.forEach((skill, index) => {
    const phase = Math.floor(index / 2);
    if (!path[phase]) {
      path[phase] = { phase: durations[phase], skills: [], after_learning_score: currentScore };
    }
    path[phase].skills.push(skill);
  });

  return path.map((phase, index) => {
    const delta = increments[index];
    const nextScore = Math.min(98, phase.after_learning_score + delta);
    return {
      phase: phase.phase,
      skills: phase.skills,
      after_learning_score: nextScore,
      increase: delta
    };
  });
}

function deriveSkillGapSimulation(missingSkills, overallScore, rng) {
  return missingSkills.slice(0, 3).map((skill, index) => {
    const increase = 5 + Math.floor(rng() * 8) + index * 2;
    return {
      skill,
      projected_score: Math.min(99, overallScore + increase),
      increase
    };
  });
}

function generateMockAnalysis(fileName = 'resume.pdf', selectedCategories = ['cybersecurity']) {
  const identity = `${fileName}-${selectedCategories.join('|')}`;
  const seed = hashString(identity);
  const rng = seededRandom(seed);
  const categories = selectedCategories.length > 0 ? selectedCategories : ['cybersecurity'];

  const combinedSkills = categories
    .map(getCategoryById)
    .filter(Boolean)
    .flatMap((cat) => cat.skills);

  const uniqueSkills = Array.from(new Set(combinedSkills));
  const extractedSkillCount = Math.min(12, Math.max(6, Math.floor(rng() * (uniqueSkills.length - 4)) + 6));
  const chosenSkills = pickMany(uniqueSkills, extractedSkillCount, rng);
  const extracted_skills = generateLevels(chosenSkills, rng);

  const category_scores = categories.map((categoryId) => {
    const score = Math.round(55 + rng() * 28);
    return { categoryId, label: getCategoryById(categoryId)?.label || categoryId, score };
  });

  const overallScore = Math.round(
    Math.min(98,
      45 + categories.length * 4 + extracted_skills.length * 2 + rng() * 12
    )
  );

  const top_matches = buildJobMatches(categories, extracted_skills, overallScore, rng);
  const topJobCount = Math.min(10, top_matches.length);
  const mainMatches = top_matches.slice(0, topJobCount);

  const missingSkills = Array.from(
    new Set(mainMatches.flatMap((job) => job.missing_skills)).values()
  ).slice(0, 8);

  const learning_path = buildLearningPath(missingSkills, overallScore);
  const skill_gap_simulation = deriveSkillGapSimulation(missingSkills, overallScore, rng);

  return {
    fileName,
    selected_categories: categories.map((id) => getCategoryById(id)).filter(Boolean),
    extracted_skills,
    category_scores,
    overall_score: overallScore,
    semantic_score: Math.min(98, Math.max(40, overallScore - 5 + Math.floor(rng() * 11))),
    skill_match_score: Math.min(98, Math.max(40, overallScore - 2 + Math.floor(rng() * 9))),
    top_matches: mainMatches,
    missing_skills: missingSkills,
    learning_path,
    skill_gap_simulation,
    last_updated: new Date().toISOString(),
    report_link: `https://jobpath.local/report/${encodeURIComponent(fileName.replace(/\s+/g, '-').toLowerCase())}`
  };
}

export { jobCategories, SAMPLE_CVS, generateMockAnalysis, LEVELS };
