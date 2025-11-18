# Stage 1: Dependencies - Install all dependencies
FROM node:20-alpine AS dependencies

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm ci

# ---

# Stage 2: Build - Build the Angular application
FROM node:20-alpine AS build

WORKDIR /usr/src/app

# Copy dependencies from dependencies stage
COPY --from=dependencies /usr/src/app/node_modules ./node_modules

# Copy source code
COPY . .

# Build the application for production
RUN npm run build -- --configuration=production

# ---

# Stage 3: Production - Serve with Nginx
FROM nginx:alpine AS production

# Install wget for healthcheck
RUN apk add --no-cache wget

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built application from build stage
COPY --from=build /usr/src/app/dist/frontend/browser /usr/share/nginx/html

# Create nginx user for security
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80 || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
