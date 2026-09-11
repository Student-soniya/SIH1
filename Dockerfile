# ==========================================
# SchemeReady (Udyam Saarthi AI) - Production Dockerfile
# Optimized for Render Web Service deployment
# ==========================================

# Stage 1: Build Vite React Frontend
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies first for Docker caching
COPY SchemeReady/frontend/package*.json ./
RUN npm ci || npm install

# Copy frontend source and build
COPY SchemeReady/frontend/ ./
RUN npm run build

# Stage 2: Serve with lightweight Nginx Alpine
FROM nginx:alpine AS runner

# Install gettext for envsubst
RUN apk add --no-cache gettext

# Remove default nginx config
RUN rm -rf /etc/nginx/conf.d/default.conf

# Copy custom Nginx configuration template and entrypoint
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Copy compiled static assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Default Render port is 10000; standard web is 80
ENV PORT=10000
EXPOSE 10000 80

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
