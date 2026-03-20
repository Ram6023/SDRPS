# 🎓 Student Dropout Risk Prediction System (DropoutAI)
### An AI-Driven Retention Protocol for Higher Education

[![Live Demo](https://img.shields.io/badge/Live%20Application-Vercel-000000?style=for-the-badge&logo=vercel)](https://student-dropout-risk-prediction.vercel.app/)
[![Project Status](https://img.shields.io/badge/COE%20Program-Active-emerald?style=for-the-badge)](https://github.com/Ram6023/Student-Dropout-Risk-Prediction-System)
[![Tech Stack](https://img.shields.io/badge/Architecture-FastAPI%20%7C%20React%20%7C%20TS-6366f1?style=for-the-badge)](https://github.com/Ram6023/Student-Dropout-Risk-Prediction-System)

---

## 🏛️ Project Overview
This initiative was developed under the **Centre of Excellence (COE)** program as a mission-critical tool for academic institutions. **DropoutAI** leverages a multi-vector heuristic machine learning model to proactively identify students at risk of attrition, enabling institutions to implement targeted intervention strategies before dropout occurs.

Our platform transforms raw academic and financial data into a **Premium Intelligence Dashboard**, providing administrators with a clear, actionable diagnostic of their student body's health.

---

## ✨ Enterprise Features

- **🚀 Neural Risk Forecasting**: Real-time diagnostic engine generating accurate dropout probability scores.
- **📊 360° Analytical Dashboard**: A high-end visualization suite for monitoring cohort trends, critical alerts, and attendance metrics.
- **🔍 Diagnostic Vector Analysis**: Deep-dive assessment across four critical success pillars (Attendance, Pre-requisite CGPA, Financial Compliance).
- **📥 Unified Data Ingestion**: Secure mass-processing support for institutional CSV records to analyze entire departments in seconds.
- **💎 Glassmorphism 2.0 UI**: An elite, dark-mode administrative interface powered by Framer Motion, featuring progressive blur headers and adaptive layouts.
- **💡 Automated Intervention Protocols**: Intelligent, context-aware recommendations generated based on specific risk signatures.

---

## 🛠️ Technological Infrastructure

### **Frontend & Visual Systems**
- **Core**: React 18 + Vite (optimized for sub-second page loads).
- **Type Safety**: TypeScript implementation across all data interfaces.
- **Design System**: Tailwind CSS v4 featuring ultra-modern utility-first styling.
- **Motion**: Framer Motion for high-fidelity micro-interactions and transitions.

### **Backend & Intelligence Layer**
- **Framework**: FastAPI (High-performance asynchronous Python REST API).
- **Core Model**: Weighted Sigmoid Regression Heuristic (Proprietary weights optimized for educational datasets).
- **Processing**: Pandas and NumPy for high-concurrency data manipulation.
- **Integrity**: Pydantic for rigid schema enforcement and validation.

---

## 📂 Project Structure

```text
COE PROJECT/
├── api/                    # Vercel Serverless Functions
│   ├── main.py             # API Entry point
│   └── model.py            # ML Prediction Logic
├── backend/                # Local Development Backend
│   ├── main.py
│   ├── model.py
│   └── requirements.txt
├── frontend/               # React (Vite) Application
│   ├── api/                # Shadow API for Vercel
│   ├── src/
│   │   ├── components/     # UI Components (Command Center, Analytics)
│   │   ├── pages/          # Application Pages (Home.tsx)
│   │   ├── services/       # API Communication Layer
│   │   └── index.css       # Styling & Tailwind Imports
│   ├── package.json
│   └── vite.config.ts
├── dropout_model.pkl       # Trained ML Model Artifact
├── features.pkl            # Feature Engineering Metadata
├── Dropout_Risk_Model.ipynb # Research & Model Training Notebook
└── requirements.txt        # Root dependencies
```

---

## 📈 Risk Assessment Metrics

The system categorizes dropout probability into four distinct tiers, allowing for prioritized institutional response:

| Probability Range | Risk Level | Status | Administrative Action |
| :--- | :--- | :--- | :--- |
| **0.0% - 29.9%** | **Low** | ✅ Stable | Standard academic monitoring. |
| **30.0% - 59.9%** | **Moderate** | ⚠️ Watchlist | Early-stage mentor allocation. |
| **60.0% - 84.9%** | **High** | 🚨 At Risk | Immediate counselor intervention required. |
| **85.0% - 100.0%** | **Critical** | ⛔ Urgent | Emergency faculty-parent collaboration. |

---

## 🚀 Deployment & Local Setup

### **1. Environment Provisioning**
```bash
git clone https://github.com/Ram6023/Student-Dropout-Risk-Prediction-System.git
cd Student-Dropout-Risk-Prediction-System
```

### **2. API Infrastructure (Backend)**
```bash
# Recommended: python -m venv venv
pip install -r requirements.txt
uvicorn api.main:app --host 0.0.0.0 --port 8000
```

### **3. Application Interface (Frontend)**
```bash
cd frontend
npm install
npm run dev
```

---

## 👥 COE Program Development Team

This system was conceptualized and engineered for the COE program by:

*   **🎓 SRIRAM**
*   **🎓 PRAVALIKA REDDY**
*   **🎓 SRINIVAS**

---

**Developed for the Centre of Excellence (COE) | © 2026 DropoutAI Systems**
