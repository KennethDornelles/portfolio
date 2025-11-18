# Stage 1: Dependencies - Install all dependencies
FROM node:20-alpine AS dependencies

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install all dependencies (for build stage)
RUN npm ci

# ---

# Stage 2: Build - Build the application
FROM node:20-alpine AS build

WORKDIR /usr/src/app

# Copy dependencies from dependencies stage
COPY --from=dependencies /usr/src/app/node_modules ./node_modules

# Copy package files and source code
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY src ./src

# Generate Prisma Client
RUN npm run prisma:generate

# Build the application
RUN npm run build

# Remove dev dependencies
RUN npm prune --production

# ---

# Stage 3: Production - Create a lean production image
FROM node:20-alpine AS production

# Install curl for healthcheck
RUN apk add --no-cache curl

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

# Create a non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Copy package files
COPY --chown=nestjs:nodejs package*.json ./

# Copy production dependencies from build stage
COPY --chown=nestjs:nodejs --from=build /usr/src/app/node_modules ./node_modules

# Copy Prisma schema for migrations
COPY --chown=nestjs:nodejs src/database/prisma ./src/database/prisma

# Copy the built application from build stage
COPY --chown=nestjs:nodejs --from=build /usr/src/app/dist ./dist

# Switch to non-root user
USER nestjs

# Expose the application port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/health/liveness || exit 1

# Command to run the application
CMD ["node", "dist/main"]
