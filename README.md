# Scalable API Performance Comparison

A Node.js project demonstrating three different API implementations with varying levels of optimization, featuring an interactive dashboard for performance comparison.

## Project Overview

This project showcases API scalability techniques through three distinct implementations:

- **Basic API** - Simple Express server with simulated database delays
- **Optimized API** - Redis caching implementation for improved performance
- **Scaled API** - Multi-process cluster architecture with Redis caching

Each implementation can be tested and compared using the included interactive dashboard.

## Architecture

### Basic API (Port 3002)

- Simple Express.js server
- Simulated database operations with 50-100ms delays
- No caching or optimization
- Single process architecture

### Optimized API (Port 3000)

- Express.js with Redis caching
- 60-second cache TTL
- Fallback to simulated database on cache miss
- Single process with caching optimization

### Scaled API (Port 3001)

- Node.js cluster implementation with 8 worker processes
- Redis caching across all workers
- Load distribution across multiple CPU cores
- Automatic worker restart on failure

## Features

### Performance Testing

- Individual API testing with configurable request counts
- High load testing (100 concurrent requests)
- CPU-intensive workload testing
- Comparative performance analysis

### Interactive Dashboard

- Real-time performance metrics visualization
- Response time comparison charts
- Throughput and latency measurements
- Cache hit rate monitoring
- Worker process tracking

### Endpoints

- `GET /user` - Returns user data with optional caching
- `GET /cpu-intensive` - CPU-heavy operations for testing cluster benefits
- `GET /health` - Health check endpoint (Redis and Cluster APIs)

## Quick Start

### Prerequisites

- Node.js (v14+)
- Redis server
- npm

### Installation

```bash
git clone https://github.com/KseniiaRiabova/scalable-api.git
cd scalable-api
npm install
```

### Start Redis

```bash
# Local installation
redis-server

# Docker
docker run -d -p 6379:6379 redis
```

### Run All APIs

```bash
npm run start-all
```

This starts all three APIs simultaneously:

- Basic API: http://localhost:3002
- Optimized API: http://localhost:3000
- Scaled API: http://localhost:3001

### Access Dashboard

Open `public/comparison-dashboard.html` in your browser to access the interactive performance comparison dashboard.

## Development Scripts

### Individual APIs

```bash
npm run dev:basic    # Basic API only
npm run dev:redis    # Optimized API only
npm run dev:cluster  # Scaled API only
```

### Production

```bash
npm run build           # Compile TypeScript
npm run start:basic     # Run compiled Basic API
npm run start:redis     # Run compiled Optimized API
npm run start:cluster   # Run compiled Scaled API
```

## Project Structure

```
scalable-api/
├── src/
│   ├── basic-api.ts      # Basic implementation
│   ├── redis-api.ts      # Redis-optimized implementation
│   └── cluster-api.ts    # Cluster implementation
├── public/
│   ├── comparison-dashboard.html  # Interactive dashboard
│   └── comparison-dashboard.css   # Dashboard styling
├── dist/                 # Compiled JavaScript
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── nodemon.json          # Development configuration
```

## Performance Testing

### Dashboard Testing

Use the interactive dashboard to:

- Test individual APIs with 10 or 100 requests
- Run CPU-intensive tests to demonstrate cluster benefits
- Compare response times across all implementations
- Monitor cache hit rates and worker distribution

### Command Line Testing

```bash
# Basic performance test
curl http://localhost:3002/user

# Load test with autocannon
npx autocannon http://localhost:3001/user -c 10 -d 10
```

## Configuration

### Redis Settings

- **Cache TTL**: 60 seconds
- **Default Port**: 6379
- **Connection**: Automatic reconnection enabled

### Cluster Settings

- **Workers**: 8 processes
- **Load Balancing**: Round-robin
- **Auto-restart**: Enabled for failed workers

## Key Learning Points

### Caching Benefits

The Optimized API demonstrates how Redis caching can dramatically reduce response times for frequently accessed data.

### Cluster Advantages

The Scaled API shows how multi-process architecture can improve throughput, especially for CPU-intensive operations.

### Performance Trade-offs

Compare different approaches to understand when each optimization technique provides the most benefit.

## Technologies Used

- **Node.js & TypeScript** - Runtime and type safety
- **Express.js** - Web framework
- **Redis** - Caching and session storage
- **Node.js Cluster** - Multi-process architecture
- **Chart.js** - Dashboard visualizations

## License

ISC

---

Educational project demonstrating API optimization techniques and scalability patterns.
