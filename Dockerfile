# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose all ports for the 3 APIs
EXPOSE 3000 3001 3002

# Start all APIs (use a simpler approach for production)
CMD ["sh", "-c", "npm run start:basic & npm run start:redis & npm run start:cluster & wait"]
