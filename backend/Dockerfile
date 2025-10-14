# Stage 1: Development - Install dependencies and build the app
FROM node:20-alpine AS development

WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application source code
COPY . .

# Generate Prisma Client
RUN npm run prisma:generate

# Build the application
RUN npm run build

# ---

# Stage 2: Production - Create a lean production image
FROM node:20-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy Prisma schema
COPY src/database/prisma ./src/database/prisma

# Generate Prisma Client
RUN npx prisma generate --schema=./src/database/prisma/schema.prisma

# Copy the built application from the development stage
COPY --from=development /usr/src/app/dist ./dist

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/main"]
