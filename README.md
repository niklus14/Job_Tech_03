# Antidata: JobPath Platform 🚀
Antidata JobPath is an advanced AI-driven Career Intelligence Platform that connects local job seekers in Azerbaijan to market needs using state-of-the-art Machine Learning and LLM techniques.
It allows students and professionals to upload their CVs, calculates a precise fit for real open jobs, highlights skill gaps, and recommends data-driven Learning Paths to enhance their employability.
## 🌟 Key Features
1. **Hybrid AI CV Analysis:**
   - **Local ML Filtering:** Rapidly parses and correlates CV data against ~85 active job descriptions using `spaCy` NLP, `SBERT` SentenceTransformers, and `scikit-learn` Random Forest algorithms.
   - **Deep LLM Refinement:** Employs **Llama 3.3 70B** (via Groq API) to deeply analyze contextual experience, verify true proficiency levels, and output a highly exact `Semantic Score`, `Skill Match Score`, and `Overall Fit`.
   - **Target Fields:** Currently heavily focused on **Cybersecurity**, with expanding infrastructure for **Machine Learning**, **Fullstack Software Engineering**, and **Data Analysis**.
2. **Personalized Learning Paths:**
   - Instead of static course advice, the engine assesses the score impact of missing skills and projects how taking specific courses and micro-certifications will boost the overall matching score.
3. **Multi-Dashboard Interface:**
   - **Individual Dashboard:** Deep intelligence tailored for candidates.
   - **Course/Cohort Dashboard:** View cohort-level progression metrics for educators and bootcamps.
   - **Market Dashboard:** Holistic macro-level view of Azerbaijan's hiring market trends.
4. **Dynamic & Premium User Experience:**
   - Built with modern React (`Vite`), leveraging beautifully orchestrated glassmorphism and real-time interaction feedback.
---
## 🛠 Tech Stack
**Frontend:**
- React (Vite)
- JavaScript (JSX)
- Vanilla CSS (Custom Design System with Glassmorphism)
- Lucide React Icons
**Backend:**
- Python & FastAPI
- Pandas & Scikit-learn
- spaCy & SBERT (`all-MiniLM-L6-v2`)
- Llama 3.3 70B via Groq API
- Uvicorn
---
## ⚡ Setup and Execution
To run this platform locally, follow these steps.
### 1. Backend Setup
Make sure you have your python virtual environment sourced and dependencies installed.
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```
Before running, you must set your API keys. Create a `.env` file in the `backend/` directory:
```bash
GROQ_API_KEY=your_groq_api_key_here
```
**Run the Backend Server:**
```bash
# Serves the fastAPI app onto port 8001
uvicorn main:app --reload --port 8001
```
### 2. Frontend Setup
In a new terminal window, navigate to the frontend folder.
```bash
cd frontend
npm install
```
**Run the Frontend App:**
```bash
# Serves the Vite React app onto port 5173
npm run dev -- --host
```
### 3. Open the App!
Navigate to `http://localhost:5173` in your browser.
---
## 📈 Roadmap
- [x] Initial CV Parsing & Extractor Framework
- [x] Real-time SBERT Vector Matcher
- [x] Integrate Groq Llama-3.3 for Deep NLP logic
- [ ] Implement live external integrations to collect jobs continuously
- [ ] Fully enable "Machine Learning", "Fullstack", and "Data Analysis" tracks.
