import { useState } from 'react';
import { Upload, AlertCircle, CheckCircle, FileText, Zap } from 'lucide-react';
import AnalysisResult from './components/AnalysisResult';

export default function ProfileSection({ userTier }) {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [targetCategory, setTargetCategory] = useState('cybersecurity');

  const categories = [
    'cybersecurity',
    'frontend-developer',
    'data-analyst',
    'devops-engineer',
    'full-stack-developer',
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      if (files[0].type === 'application/pdf') {
        setFile(files[0]);
        setError(null);
      } else {
        setError('Please upload a PDF file');
      }
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      if (e.target.files[0].type === 'application/pdf') {
        setFile(e.target.files[0]);
        setError(null);
      } else {
        setError('Please upload a PDF file');
      }
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please select a PDF file');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('tier', userTier);
    formData.append('target_category', targetCategory);

    try {
      const response = await fetch('http://localhost:8000/individual/upload-cv', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Analysis failed');
      }

      const data = await response.json();
      setAnalysisResult(data);
      setFile(null);
    } catch (err) {
      setError(err.message);
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-profile">
      {analysisResult ? (
        <AnalysisResult result={analysisResult} userTier={userTier} onNewAnalysis={() => setAnalysisResult(null)} />
      ) : (
        <div className="profile-upload">
          <div className="upload-container">
            <h2 className="section-title">Upload Your CV</h2>
            <p className="section-description">
              Analyze your CV against current market demands. Get personalized recommendations to improve your career readiness.
            </p>

            {/* Category Selection */}
            <div className="category-select">
              <label>Target Role Category:</label>
              <select
                value={targetCategory}
                onChange={(e) => setTargetCategory(e.target.value)}
                className="select-input"
                disabled={loading}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.replace(/-/g, ' ').toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* File Upload Area */}
            <div
              className={`upload-area ${dragActive ? 'active' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="upload-icon">
                <Upload size={48} />
              </div>
              <h3>Drag and drop your CV</h3>
              <p>or</p>
              <label className="file-input-label">
                Browse Files
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileInput}
                  disabled={loading}
                  className="file-input"
                />
              </label>
              <p className="upload-hint">PDF files only, max 10MB</p>
            </div>

            {/* Selected File Display */}
            {file && (
              <div className="file-selected">
                <FileText size={20} />
                <div className="file-info">
                  <div className="file-name">{file.name}</div>
                  <div className="file-size">{(file.size / 1024).toFixed(2)} KB</div>
                </div>
                <button
                  className="remove-file"
                  onClick={() => setFile(null)}
                  disabled={loading}
                >
                  ✕
                </button>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="alert alert-error">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            {/* Analyze Button */}
            <button
              className={`btn btn-primary ${loading ? 'loading' : ''}`}
              onClick={handleAnalyze}
              disabled={!file || loading}
            >
              {loading ? (
                <>
                  <div className="spinner" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap size={20} />
                  Analyze CV
                </>
              )}
            </button>

            {/* Tier Info */}
            {userTier === 'free' && (
              <div className="tier-info">
                <AlertCircle size={18} />
                <div>
                  <div className="tier-title">Free Tier Limited</div>
                  <div className="tier-description">
                    You have 3 analyses per day. Upgrade to Pro for unlimited analyses and AI recommendations.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Information Cards */}
          <div className="info-grid">
            <div className="info-card glass-card">
              <CheckCircle className="info-icon" size={24} />
              <h4>Instant Analysis</h4>
              <p>Get immediate feedback on your skills and market fit</p>
            </div>
            <div className="info-card glass-card">
              <Zap className="info-icon" size={24} />
              <h4>AI Insights</h4>
              <p>Receive AI-powered recommendations tailored to your profile</p>
            </div>
            <div className="info-card glass-card">
              <FileText className="info-icon" size={24} />
              <h4>Detailed Report</h4>
              <p>Comprehensive analysis of your skills vs market demand</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
