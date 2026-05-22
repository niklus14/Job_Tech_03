import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Building, Users, Upload, TrendingUp, BarChart2, 
  ChevronRight, AlertTriangle, CheckCircle, Target,
  BookOpen, ArrowRight, Layers, Zap, FileText,
  Link, Key, RefreshCw, Wifi
} from 'lucide-react';
import { API_URL } from '../apiConfig';


function MiniProgress({ value, color = 'blue', width = '100%' }) {
  return (
    <div className="mini-progress" style={{ width }}>
      <div 
        className={`mini-progress-fill ${color}`}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  );
}

function CombinedScoreBadge({ score }) {
  let cls = 'poor';
  if (score >= 80) cls = 'excellent';
  else if (score >= 60) cls = 'good';
  else if (score >= 40) cls = 'fair';
  return <div className={`combined-score ${cls}`}>{score}%</div>;
}

export default function CourseDashboard() {
  const [activeView, setActiveView] = useState('overview');
  const [students, setStudents] = useState([]);
  const [dashStats, setDashStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [syncResult, setSyncResult] = useState(null);
  const [studentImportError, setStudentImportError] = useState('');
  const fileInputRef = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, studentsRes] = await Promise.all([
        axios.get(`${API_URL}/course/dashboard`),
        axios.get(`${API_URL}/course/students`)
      ]);
      setDashStats(statsRes.data);
      setStudents(studentsRes.data);
      return statsRes.data;
    } catch (err) {
      console.error('Course data fetch failed', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData().catch(() => {});
  }, []);

  if (loading || !dashStats) {
    return (
      <div className="animate-fade-in">
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <span className="spinner" style={{ width: 40, height: 40, borderWidth: 3 }}></span>
          <h3 style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading course analytics...</h3>
        </div>
      </div>
    );
  }


  const handleUploadStudents = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setStudentImportError('');
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed)) {
        throw new Error('Student upload file must contain an array of student records.');
      }
      setStudents(parsed);
      const avgProgress = Math.round(parsed.reduce((sum, item) => sum + (item.student?.progress_percentage ?? 0), 0) / Math.max(parsed.length, 1));
      const avgJobReadiness = Math.round(parsed.reduce((sum, item) => sum + (item.job_readiness_score ?? 0), 0) / Math.max(parsed.length, 1));
      const avgCombined = Math.round(parsed.reduce((sum, item) => sum + (item.combined_score ?? 0), 0) / Math.max(parsed.length, 1));
      const skillCounts = parsed.flatMap((item) => item.skill_gaps || []).reduce((counts, skill) => {
        counts[skill] = (counts[skill] || 0) + 1;
        return counts;
      }, {});
      const topMissingSkills = Object.entries(skillCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 4)
        .map(([skill, count]) => ({ skill, count }));

      setDashStats({
        total_students: parsed.length,
        avg_progress: avgProgress,
        avg_job_readiness: avgJobReadiness,
        avg_combined_score: avgCombined,
        top_missing_skills: topMissingSkills
      });
    } catch (err) {
      setStudentImportError(err.message || 'Invalid JSON file.');
    }
    setUploading(false);
  };

  const handleViewStudent = (studentId) => {
    const next = students.find((item) => item.student.student_id === studentId);
    if (next) {
      setSelectedStudent(next);
      setActiveView('detail');
    }
  };

  const handleSyncApi = async () => {
    setLoading(true);
    try {
      const stats = await fetchData();
      setSyncResult({
        message: 'Course dashboard refreshed from live backend data.',
        total_students: stats?.total_students ?? students.length,
        errors: []
      });
    } catch (err) {
      setSyncResult({
        message: 'Live sync failed. Using cached course data.',
        total_students: students.length,
        errors: [err.message]
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <span className="spinner" style={{ width: 40, height: 40, borderWidth: 3 }}></span>
          <h3 style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading course data...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="section-header">
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', border: 'none', paddingBottom: 0 }}>
            <Building size={24} style={{ color: 'var(--accent-secondary)' }} />
            Course & Companies Portal
            <span className="tier-badge enterprise">$60/mo</span>
          </h2>
          <p className="text-secondary">Integrate course progress with job market readiness for your students</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleUploadStudents}
            style={{ display: 'none' }}
          />
          <button
            className="btn-outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Upload size={16} /> {uploading ? 'Uploading...' : 'Upload JSON'}
          </button>
        </div>
      </div>
      {studentImportError && (
        <div className="glass-card" style={{ marginBottom: '1rem', borderLeft: '4px solid var(--danger)', color: 'var(--danger)' }}>
          <strong>Upload Error: </strong>{studentImportError}
        </div>
      )}

      {/* Sub-navigation tabs */}
      <div className="page-tabs">
        <button 
          className={`page-tab ${activeView === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveView('overview')}
        >
          Overview
        </button>
        <button 
          className={`page-tab ${activeView === 'connect' ? 'active' : ''}`}
          onClick={() => setActiveView('connect')}
        >
          <Wifi size={14} /> Connect API
        </button>
        <button 
          className={`page-tab ${activeView === 'students' ? 'active' : ''}`}
          onClick={() => setActiveView('students')}
        >
          Students
        </button>
        <button 
          className={`page-tab ${activeView === 'detail' ? 'active' : ''}`}
          onClick={() => setActiveView('detail')}
          disabled={!selectedStudent}
          style={{ opacity: selectedStudent ? 1 : 0.4 }}
        >
          Student Detail
        </button>
      </div>

      {/* ─── CONNECT API TAB ─── */}
      {activeView === 'connect' && (
        <div className="animate-fade-in">
          <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
            <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-primary)' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Wifi size={18} style={{ color: 'var(--accent-primary)' }} />
                Connect Your LMS
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                This dashboard is backed by the backend student analytics endpoints. Refresh to pull the latest cohort readiness data.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="pill accent" style={{ alignSelf: 'flex-start', padding: '0.75rem 1rem' }}>
                  Backend Analytics
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Upload student JSON data to preview course analytics, or press "Refresh Data" to pull the latest cohort readiness metrics from the backend.
                </div>
                <button
                  className="btn"
                  onClick={handleSyncApi}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <RefreshCw size={16} /> Refresh Data
                </button>
              </div>

              {syncResult && (
                <div style={{
                  marginTop: '1rem', padding: '1rem', borderRadius: '8px',
                  background: 'rgba(16,185,129,0.1)',
                  border: '1px solid rgba(16,185,129,0.3)',
                  fontSize: '0.85rem'
                }}>
                  <div style={{ color: 'var(--success)' }}>
                    ✅ {syncResult.message} (Total: {syncResult.total_students})
                  </div>
                </div>
              )}
            </div>

            <div className="glass-card">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers size={18} style={{ color: 'var(--accent-secondary)' }} />
                Supported Platforms
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                <div style={{
                  padding: '1rem', borderRadius: '10px', border: '1px solid rgba(139,92,246,0.3)',
                  background: 'rgba(139,92,246,0.05)', display: 'flex', alignItems: 'center', gap: '1rem'
                }}>
                  <div style={{ width: 40, height: 40, borderRadius: '8px', background: 'rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    🎓
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Sample Student Data</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Built-in sample students and analytics</div>
                  </div>
                  <span className="pill success" style={{ marginLeft: 'auto', fontSize: '0.7rem' }}>Demo</span>
                </div>
                <div style={{
                  padding: '1rem', borderRadius: '10px', border: '1px solid var(--glass-border)',
                  background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', gap: '1rem', opacity: 0.6
                }}>
                  <div style={{ width: 40, height: 40, borderRadius: '8px', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    📚
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Custom LMS</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Any REST API with student data</div>
                  </div>
                  <span className="pill" style={{ marginLeft: 'auto', fontSize: '0.7rem', background: 'var(--bg-tertiary)' }}>Coming Soon</span>
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <strong>In this demo:</strong> Use the upload button to import a student JSON file. The current sample data is rendered automatically in the dashboard.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── OVERVIEW TAB ─── */}
      {activeView === 'overview' && dashStats && (
        <div className="animate-fade-in">
          {/* Stats Cards */}
          <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
            <div className="glass-card" style={{ textAlign: 'center' }}>
              <div className="metric-label">Total Students</div>
              <div className="metric-value" style={{ fontSize: '2rem', color: 'var(--accent-primary)' }}>
                {dashStats.total_students}
              </div>
              <Users size={20} style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }} />
            </div>
            <div className="glass-card" style={{ textAlign: 'center' }}>
              <div className="metric-label">Avg Course Progress</div>
              <div className="metric-value" style={{ fontSize: '2rem', color: 'var(--accent-secondary)' }}>
                {dashStats.avg_progress}%
              </div>
              <MiniProgress value={dashStats.avg_progress} color="blue" />
            </div>
            <div className="glass-card" style={{ textAlign: 'center' }}>
              <div className="metric-label">Avg Job Readiness</div>
              <div className="metric-value" style={{ 
                fontSize: '2rem', 
                color: dashStats.avg_job_readiness >= 60 ? 'var(--success)' : 'var(--warning)' 
              }}>
                {dashStats.avg_job_readiness}%
              </div>
              <MiniProgress value={dashStats.avg_job_readiness} color={dashStats.avg_job_readiness >= 60 ? 'green' : 'yellow'} />
            </div>
            <div className="glass-card" style={{ textAlign: 'center' }}>
              <div className="metric-label">Combined Score</div>
              <div className="metric-value" style={{ fontSize: '2rem' }}>
                {dashStats.avg_combined_score}%
              </div>
              <MiniProgress 
                value={dashStats.avg_combined_score} 
                color={dashStats.avg_combined_score >= 70 ? 'green' : dashStats.avg_combined_score >= 50 ? 'yellow' : 'red'} 
              />
            </div>
          </div>

          {/* Integration Visualization + Skills Gap */}
          <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
            {/* Holberton Integration Panel */}
            <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-secondary)' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers size={18} style={{ color: 'var(--accent-secondary)' }} />
                Platform Integration
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Holberton School × JobPath Intelligence
              </p>
              
              <div className="integration-panel">
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    width: 80, height: 80, borderRadius: '50%', 
                    background: 'rgba(139, 92, 246, 0.15)', border: '2px solid var(--accent-secondary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 0.75rem'
                  }}>
                    <BookOpen size={28} style={{ color: 'var(--accent-secondary)' }} />
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '1.5rem', color: 'var(--accent-secondary)' }}>
                    {dashStats.avg_progress}%
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Course Progress
                  </div>
                </div>

                <div className="integration-divider">
                  <div className="divider-line"></div>
                  <Zap size={20} style={{ color: 'var(--warning)' }} />
                  <div className="divider-line"></div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    width: 80, height: 80, borderRadius: '50%', 
                    background: 'rgba(59, 130, 246, 0.15)', border: '2px solid var(--accent-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 0.75rem'
                  }}>
                    <Target size={28} style={{ color: 'var(--accent-primary)' }} />
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '1.5rem', color: 'var(--accent-primary)' }}>
                    {dashStats.avg_job_readiness}%
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Job Readiness
                  </div>
                </div>
              </div>

              <div style={{ 
                marginTop: '1.5rem', textAlign: 'center', padding: '1rem', 
                background: 'var(--bg-tertiary)', borderRadius: '10px' 
              }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem' }}>
                  Combined Platform Score
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: dashStats.avg_combined_score >= 70 ? 'var(--success)' : 'var(--warning)' }}>
                  {dashStats.avg_combined_score}%
                </div>
              </div>
            </div>

            {/* Top Missing Skills */}
            <div className="glass-card" style={{ borderLeft: '4px solid var(--danger)' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={18} style={{ color: 'var(--danger)' }} />
                Class-wide Skill Gaps
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Most common skills missing across all students
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {dashStats.top_missing_skills.map((item, i) => (
                  <div key={i} style={{ 
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '0.75rem', background: 'var(--bg-tertiary)', borderRadius: '8px',
                    border: '1px solid var(--glass-border)'
                  }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.skill}</span>
                    <span style={{ 
                      color: 'var(--danger)', fontWeight: 700, fontSize: '0.85rem',
                      background: 'rgba(239, 68, 68, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '6px'
                    }}>
                      {item.count} students
                    </span>
                  </div>
                ))}
                {dashStats.top_missing_skills.length === 0 && (
                  <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No skill gap data available yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── STUDENTS TAB ─── */}
      {activeView === 'students' && (
        <div className="animate-fade-in">
          <div className="glass-card">
            <div style={{ overflowX: 'auto' }}>
              <table className="student-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Course</th>
                    <th>Course Progress</th>
                    <th>Job Readiness</th>
                    <th>Combined</th>
                    <th>Skill Gaps</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((item, i) => (
                    <tr key={i} className="animate-slide-in" style={{ animationDelay: `${i * 0.08}s` }}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{item.student.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          {item.student.email || item.student.student_id}
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem' }}>{item.student.course_name}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <MiniProgress value={item.student.progress_percentage} color="blue" width="60px" />
                          <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--accent-secondary)' }}>
                            {item.student.progress_percentage}%
                          </span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <MiniProgress 
                            value={item.job_readiness_score} 
                            color={item.job_readiness_score >= 60 ? 'green' : item.job_readiness_score >= 40 ? 'yellow' : 'red'}
                            width="60px"
                          />
                          <span style={{ 
                            fontWeight: 600, fontSize: '0.85rem',
                            color: item.job_readiness_score >= 60 ? 'var(--success)' : item.job_readiness_score >= 40 ? 'var(--warning)' : 'var(--danger)'
                          }}>
                            {item.job_readiness_score}%
                          </span>
                        </div>
                      </td>
                      <td>
                        <CombinedScoreBadge score={item.combined_score} />
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.2rem', maxWidth: '200px' }}>
                          {item.skill_gaps.slice(0, 3).map((s, j) => (
                            <span key={j} className="pill danger" style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', margin: 0 }}>{s}</span>
                          ))}
                          {item.skill_gaps.length > 3 && (
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>+{item.skill_gaps.length - 3} more</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <button
                          className="btn-outline btn-sm"
                          onClick={() => handleViewStudent(item.student.student_id)}
                          style={{ whiteSpace: 'nowrap' }}
                        >
                          View <ChevronRight size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── STUDENT DETAIL TAB ─── */}
      {activeView === 'detail' && selectedStudent && (
        <div className="animate-fade-in">
          <button 
            className="btn-outline btn-sm" 
            onClick={() => setActiveView('students')}
            style={{ marginBottom: '1rem' }}
          >
            ← Back to Students
          </button>

          <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
            {/* Student Info */}
            <div className="glass-card">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={18} style={{ color: 'var(--accent-primary)' }} />
                Student Profile
              </h3>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                {selectedStudent.student.name}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                {selectedStudent.student.course_name}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                {selectedStudent.student.skills_acquired.map((s, i) => (
                  <span key={i} className="pill accent" style={{ fontSize: '0.75rem', padding: '0.15rem 0.5rem' }}>{s}</span>
                ))}
              </div>
            </div>

            {/* Integration View */}
            <div className="glass-card" style={{ textAlign: 'center' }}>
              <h3>Platform Integration</h3>
              <div className="integration-panel" style={{ marginTop: '1rem' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.8rem', color: 'var(--accent-secondary)' }}>
                    {selectedStudent.student.progress_percentage}%
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                    Course Progress
                  </div>
                </div>
                <div className="integration-divider">
                  <ArrowRight size={18} style={{ color: 'var(--warning)' }} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.8rem', color: 'var(--accent-primary)' }}>
                    {selectedStudent.job_readiness_score}%
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                    Job Readiness
                  </div>
                </div>
              </div>
              <div style={{ marginTop: '1.5rem' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem' }}>
                  Combined Score
                </div>
                <CombinedScoreBadge score={selectedStudent.combined_score} />
              </div>
            </div>

            {/* Skill Gaps */}
            <div className="glass-card">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={18} style={{ color: 'var(--danger)' }} />
                Skill Gaps
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Skills needed for target jobs in their field
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {selectedStudent.skill_gaps.map((gap, i) => (
                  <div key={i} style={{ 
                    padding: '0.5rem 0.75rem', background: 'rgba(239, 68, 68, 0.08)',
                    borderRadius: '6px', border: '1px solid rgba(239, 68, 68, 0.2)',
                    fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem'
                  }}>
                    <AlertTriangle size={14} style={{ color: 'var(--danger)' }} />
                    {gap}
                  </div>
                ))}
                {selectedStudent.skill_gaps.length === 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)' }}>
                    <CheckCircle size={16} />
                    <span style={{ fontSize: '0.85rem' }}>No significant skill gaps detected!</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Job Matches for this student */}
          {selectedStudent.top_job_matches.length > 0 && (
            <div className="glass-card">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Target size={18} style={{ color: 'var(--accent-primary)' }} />
                Job Matches for {selectedStudent.student.name}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                {selectedStudent.top_job_matches.map((job, i) => (
                  <div key={i} className="job-match-card">
                    <div className="job-match-header">
                      <div>
                        <div className="job-match-title">{job.title}</div>
                        <div className="job-match-company">{job.company} • {job.location}</div>
                      </div>
                      <div className={`job-match-score ${job.match_percentage >= 70 ? 'high' : job.match_percentage >= 40 ? 'medium' : 'low'}`}>
                        {job.match_percentage}%
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
                      <div>
                        <span style={{ color: 'var(--success)' }}>Matched: </span>
                        {job.matched_skills.slice(0, 4).join(', ')}
                      </div>
                      <div>
                        <span style={{ color: 'var(--danger)' }}>Missing: </span>
                        {job.missing_skills.slice(0, 4).join(', ')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
