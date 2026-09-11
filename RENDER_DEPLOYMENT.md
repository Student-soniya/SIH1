# 🚀 Deploying SchemeReady (Udyam Saarthi AI) on Render

This repository is fully configured for seamless, 1-click deployment on **Render** (https://render.com).

---

## ⚡ Option 1: 1-Click Render Blueprint (Recommended)

1. Log into your **[Render Dashboard](https://dashboard.render.com/)**.
2. Click **New +** in the top right and select **Blueprint**.
3. Connect your GitHub repository (`Student-soniya/SIH1` or `vishnurvchettiar/SIH1`).
4. Render will detect `render.yaml` and automatically create:
   - **`schemeready-frontend`**: React + Vite web service.
   - **`schemeready-backend`**: .NET 8 ASP.NET Core API web service.
   - **`schemeready-db`**: Managed PostgreSQL database (Free Tier).
5. Click **Apply**. Both services and the database will build and deploy automatically!

---

## 🌐 Option 2: Deploy Frontend Only (Fastest, < 1 min)

If you just want the SchemeReady UI with all its AI features, 7-language localization, dynamic OTP, and built-in offline matching:

1. In Render, click **New +** -> **Web Service**.
2. Connect your repository.
3. Settings:
   - **Language**: `Docker`
   - **Dockerfile Path**: `Dockerfile` (or leave default `./Dockerfile`)
   - **Docker Context**: `.` (leave default)
   - **Plan**: Free
4. Click **Deploy Web Service**.

> **Note**: Nginx dynamically binds to Render's injected `$PORT` (10000) and handles HTML5 Single Page Application routing cleanly!

---

## ⚙️ Option 3: Deploy as Static Site (Alternative Free Frontend)

1. In Render, click **New +** -> **Static Site**.
2. Connect your repository.
3. Settings:
   - **Root Directory**: `SchemeReady/frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Under **Redirects/Rewrites**:
   - Source: `/*`
   - Destination: `/index.html`
   - Action: `Rewrite`
5. Click **Create Static Site**.

---

## 🔧 Option 4: Deploy Backend API Separately

1. In Render, click **New +** -> **Web Service**.
2. Connect your repository.
3. Settings:
   - **Language**: `Docker`
   - **Dockerfile Path**: `Dockerfile.backend`
   - **Docker Context**: `.`
4. Under **Environment Variables**:
   - `PORT`: `10000`
   - `ASPNETCORE_ENVIRONMENT`: `Production`
   - `SCHEMEREADY_CORS_ORIGINS`: `*`
   - `SCHEMEREADY_JWT_SIGNING_KEY`: `SchemeReady_YourProductionSecretKey_32CharsMin!`
   - `SCHEMEREADY_JWT_ISSUER`: `https://schemeready.onrender.com`
   - `SCHEMEREADY_JWT_AUDIENCE`: `https://schemeready.onrender.com`
   - `SCHEMEREADY_DOCUMENT_ROOT`: `/app/data/documents`
   - `DATABASE_URL`: *(Paste your Render PostgreSQL external connection string)*
5. Click **Deploy Web Service**.

---

## 🎯 Option 5: Unified Full-Stack (Single Web Service)

To run **both** the .NET API and React UI inside a **single** Render Free Web Service:
1. Set **Dockerfile Path**: `Dockerfile.fullstack`
2. Set **Docker Context**: `.`
3. Deploy! Nginx proxies `/api/` to the internal .NET 8 process while serving the frontend on `/`.

---

## 🧪 Local Testing with Docker Compose

```bash
docker compose up --build
```
- Frontend: `http://localhost:3000`
- Backend API & Swagger: `http://localhost:5000/swagger`
- PostgreSQL: `localhost:5432`
