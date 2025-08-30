# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose all ports for the 3 APIs
EXPOSE 3000 3001 3002

# Start all APIs
CMD ["npm", "run", "start-all"]
