# ==========================================
# Frontend Dockerfile (Scoped to SchemeReady/frontend directory)
# ==========================================
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci || npm install

COPY . ./
RUN npm run build

FROM nginx:alpine
RUN rm -rf /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

COPY --from=builder /app/dist /usr/share/nginx/html

ENV PORT=10000
EXPOSE 10000 80

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
