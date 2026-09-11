# SchemeReady (Udyam Saarthi AI) 🏛️🇮🇳

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/vishnurvchettiar/SIH1)

> **Smart India Hackathon (SIH) 2026**  
> **Problem Statement**: Proactive Application Readiness & Channel Partner Routing for NSFDC Beneficiary Concessional Finance  
> **Target Ministry**: Ministry of Social Justice and Empowerment (MoSJE) / National Scheduled Castes Finance and Development Corporation (NSFDC)  

---

## 🌟 Executive Summary
SchemeReady shifts the paradigm from passive scheme discovery to **active application readiness and verified channel partner routing**. While NSFDC provides concessional loans (4%–8% p.a., up to 90% project cost) to SC beneficiaries with family income up to ₹5.00 Lakhs, beneficiaries **cannot apply directly to NSFDC**. Direct loan applications are rejected; funds must flow through over 100 Channel Partners (SCAs, RRBs, Public Sector Banks).

SchemeReady solves this by providing:
1. **Conversational & Voice Onboarding** (with 7 regional language support: English, हिन्दी, ಕನ್ನಡ, தமிழ், తెలుగు, मराठी, বাংলা).
2. **Dynamic Random OTP Authentication** via WhatsApp and browser notifications.
3. **Comprehensive Beneficiary Profile Dossier** (10th/12th marks, CIBIL score, ITR acknowledgment).
4. **AI Business Survival & Viability Predictor** (92% survival probability, DSCR = 2.46, market forecast).
5. **DigiLocker Verification & Interactive PDF Viewer Modal** (Govt watermark, QR verification, Tahsildar sign).
6. **Dynamic Document Checklist with Pending Remediation Alert**.
7. **Explainable Scheme Matcher** (cites official NSFDC guidelines).
8. **Smart Channel Partner Routing** (highlighting 0% overdue & low-NPA branches).
9. **EMI Amortization Simulator** (with 3–12 month moratorium gestation buffers).
10. **Application Pack & PM-SURAJ Handoff Gateway**.

---

## 🚀 1-Click Cloud Deployment on Render

Deploy the entire full-stack platform (Frontend + .NET 8 Backend + PostgreSQL) with a single click:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/vishnurvchettiar/SIH1)

See [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) for full deployment documentation.

---

## 💻 Local Development Quick Start

### Backend (.NET 8 Web API)
```bash
cd SchemeReady/backend
dotnet run --urls "http://localhost:5000"
```
* **Swagger API UI**: http://localhost:5000/swagger

### Frontend (React + Vite + Tailwind CSS)
```bash
cd SchemeReady/frontend
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```
* **Web Portal**: http://localhost:5173
