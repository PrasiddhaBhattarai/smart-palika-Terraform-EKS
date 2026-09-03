# --------------------------------------------------
# Stage 1: Build Frontend
# --------------------------------------------------
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the project
RUN npm run build

# --------------------------------------------------
# Stage 2: Nginx
# --------------------------------------------------
FROM nginx:alpine

# Set default backend URL environment variable
# ENV BACKEND_URL=http://backend-service:3000
ENV BACKEND_URL=http://backend-service:3000

# Copy static files to Nginx html directory
COPY --from=builder /app/dist/ /usr/share/nginx/html/

# Copy nginx config template
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Copy entrypoint script and make it executable
COPY entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
