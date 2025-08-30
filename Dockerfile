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

# Remove dev dependencies to reduce image size
RUN npm prune --production

# Expose all ports for the 3 APIs
EXPOSE 3000 3001 3002

# Start all APIs
CMD ["npm", "run", "start-all"]
