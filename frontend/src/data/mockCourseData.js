const dashboardStats = {
  total_students: 28,
  avg_progress: 72,
  avg_job_readiness: 64,
  avg_combined_score: 68,
  top_missing_skills: [
    { skill: 'SQL', count: 15 },
    { skill: 'React', count: 12 },
    { skill: 'Cloud Security', count: 9 },
    { skill: 'Test Automation', count: 8 }
  ]
};

const students = [
  {
    student: {
      student_id: 'S-001',
      name: 'Leyla Rizayeva',
      email: 'leyla@azcareer.com',
      course_name: 'Fullstack Bootcamp',
      progress_percentage: 82,
      skills_acquired: ['JavaScript', 'React', 'Node.js', 'REST APIs']
    },
    job_readiness_score: 74,
    combined_score: 76,
    skill_gaps: ['TypeScript', 'GraphQL', 'Unit Testing'],
    top_job_matches: [
      {
        title: 'Fullstack Developer',
        company: 'NovaTech',
        location: 'Baku',
        match_percentage: 78,
        matched_skills: ['React', 'Node.js', 'REST APIs'],
        missing_skills: ['TypeScript', 'GraphQL']
      },
      {
        title: 'Product Engineer',
        company: 'BrightApps',
        location: 'Baku',
        match_percentage: 71,
        matched_skills: ['JavaScript', 'React'],
        missing_skills: ['UI/UX', 'Testing']
      }
    ]
  },
  {
    student: {
      student_id: 'S-002',
      name: 'Kamran Ahmadov',
      email: 'kamran@azcareer.com',
      course_name: 'Data Analytics',
      progress_percentage: 65,
      skills_acquired: ['Excel', 'SQL', 'Power BI']
    },
    job_readiness_score: 58,
    combined_score: 60,
    skill_gaps: ['Statistics', 'Data Visualization', 'Python'],
    top_job_matches: [
      {
        title: 'Data Analyst',
        company: 'Azeri Analytics',
        location: 'Baku',
        match_percentage: 62,
        matched_skills: ['SQL', 'Power BI'],
        missing_skills: ['Statistics', 'Python']
      }
    ]
  },
  {
    student: {
      student_id: 'S-003',
      name: 'Nigar Huseynova',
      email: 'nigar@azcareer.com',
      course_name: 'Cybersecurity Fundamentals',
      progress_percentage: 91,
      skills_acquired: ['Network Security', 'Firewall Management', 'Threat Hunting']
    },
    job_readiness_score: 81,
    combined_score: 83,
    skill_gaps: ['SIEM', 'Incident Response', 'Cloud Security'],
    top_job_matches: [
      {
        title: 'Security Operations Engineer',
        company: 'InfoGuard',
        location: 'Baku',
        match_percentage: 82,
        matched_skills: ['Network Security', 'Threat Hunting'],
        missing_skills: ['SIEM', 'Incident Response']
      }
    ]
  }
];

export { dashboardStats, students };
