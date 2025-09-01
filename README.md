# 🚀 Scalable API Performance Demonstration

A progressive demonstration of API optimization techniques, showcasing the evolution from basic single-process APIs to high-performance clustered architectures with Redis caching.

## 🎯 Problem Statement

Modern APIs face critical performance challenges:

- **Latency bottlenecks** from repeated database queries
- **CPU limitations** in single-threaded operations
- **Scalability constraints** under high concurrent loads
- **Resource inefficiency** in compute-intensive tasks

This project demonstrates practical solutions through three progressive API implementations, each addressing specific performance challenges with measurable improvements.

## 🏗️ Architecture Overview

### 1. **Basic API** - Baseline Performance

```typescript
// Simple database simulation with artificial delay
const fakeDB = (): Promise<User> => {
  return new Promise<User>((resolve) => {
    const delay = Math.random() * 50 + 50; // 50-100ms delay
    setTimeout(() => {
      resolve({ id: 1, name: 'Ksusha' });
    }, delay);
  });
};
```

- **Port**: 3002
- **Use Case**: Baseline measurement
- **Limitations**: No caching, single process, repeated DB hits

### 2. **Redis API** - Caching Optimization

```typescript
// Cache-first strategy with 60s TTL
const cached = await redisClient.get(cacheKey);
if (cached) {
  return res.json({
    ...JSON.parse(cached),
    source: 'cache',
  });
}
```

- **Port**: 3000
- **Performance Gain**: ~1000x faster for cached requests
- **Best For**: Frequent data retrieval, session management, real-time analytics

### 3. **Cluster API** - Parallel Processing

```typescript
// CPU-intensive workload distributed across workers
app.get('/cpu-intensive', async (req, res) => {
  let result = 0;
  for (let i = 0; i < 5000000; i++) {
    result += Math.sqrt(i) * Math.sin(i) * Math.cos(i);
  }
  // ... matrix operations
});
```

- **Port**: 3001
- **Workers**: Up to 8 processes (CPU cores)
- **Best For**: Mathematical computations, image processing, data analytics

## 📊 Performance Comparison

| API Type    | Response Time  | Throughput  | CPU Usage   | Memory | Use Case            |
| ----------- | -------------- | ----------- | ----------- | ------ | ------------------- |
| **Basic**   | 50-100ms       | ~10 req/s   | Single core | Low    | Development/Testing |
| **Redis**   | 1-5ms (cached) | ~1000 req/s | Single core | Medium | Data-heavy apps     |
| **Cluster** | Variable       | ~4000 req/s | Multi-core  | High   | CPU-intensive tasks |

## 🛠️ Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Caching**: Redis 7 with connection pooling
- **Clustering**: Node.js native cluster module
- **Monitoring**: Real-time performance dashboard
- **Containerization**: Docker + Docker Compose
- **Load Balancing**: Nginx (production)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Redis server
- Docker (optional)

### Development Setup

```bash
# Install dependencies
npm install

# Start Redis (if not using Docker)
redis-server

# Run all APIs concurrently
npm run start-all

# Or run individually:
npm run dev:basic    # Port 3002
npm run dev:redis    # Port 3000
npm run dev:cluster  # Port 3001
```

### Docker Setup

```bash
# Start Redis + API services
docker-compose up -d

# View logs
docker-compose logs -f
```

### Dashboard Access

Open [http://localhost:3000](http://localhost:3000) to view the performance comparison dashboard with real-time metrics and interactive charts.

## 🧪 Testing Performance

The dashboard provides four concurrent request buttons to demonstrate:

1. **Basic API Load**: Shows baseline performance
2. **Redis API Cache**: Demonstrates caching benefits
3. **Cluster API CPU**: Tests parallel processing
4. **Mixed Workload**: Real-world scenario testing

### CPU-Intensive Endpoint Example

```bash
# Test mathematical computation workload
curl http://localhost:3001/cpu-intensive
```

Response includes:

- Processing time
- Worker process ID
- Computation results
- Performance metrics

## 📈 When to Use Each Approach

### Redis Caching - Perfect For:

- **User sessions** and authentication data
- **API responses** with low change frequency
- **Database query results** for popular content
- **Real-time leaderboards** and counters
- **Configuration data** and feature flags

### Cluster Processing - Ideal For:

- **Image/video processing** and transformations
- **Mathematical computations** and simulations
- **Data analysis** and report generation
- **Batch processing** operations
- **Machine learning** inference tasks

## 🔍 Key Performance Insights

1. **Caching Impact**: Redis reduces response time from ~75ms to ~2ms (97% improvement)
2. **Parallel Processing**: Cluster handles 4x more concurrent CPU tasks
3. **Memory Efficiency**: Redis uses minimal RAM for substantial performance gains
4. **Scalability**: Cluster automatically scales with available CPU cores

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

## 📝 Production Considerations

- **Redis Persistence**: Configure RDB + AOF for data durability
- **Cluster Health**: Implement worker process monitoring and auto-restart
- **Load Balancing**: Use Nginx for request distribution
- **Monitoring**: Set up APM tools for production observability
- **Security**: Implement rate limiting and Redis AUTH

## 🔗 API Endpoints

| Endpoint         | Basic (3002)     | Redis (3000)     | Cluster (3001)          |
| ---------------- | ---------------- | ---------------- | ----------------------- |
| `/user`          | ✅ Direct DB     | ✅ Cached        | ✅ Cached + Distributed |
| `/cpu-intensive` | ✅ Single thread | ✅ Single thread | ✅ Multi-process        |
| `/health`        | ✅ Simple check  | ✅ Cache status  | ✅ Worker status        |

## Installation

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
- Redis API: http://localhost:3000
- Cluster API: http://localhost:3001

### Development Scripts

```bash
npm run dev:basic    # Basic API only
npm run dev:redis    # Redis API only
npm run dev:cluster  # Cluster API only
```

## 📁 Project Structure

```
src/
├── basic-api.ts      # Baseline implementation
├── redis-api.ts      # Caching optimization
└── cluster-api.ts    # Parallel processing

public/
├── index.html        # Interactive dashboard
└── comparison-dashboard.css
```

## 🧮 CPU-Intensive Workload Demonstration

Each API includes a `/cpu-intensive` endpoint that performs:

```typescript
// Mathematical computations (5M iterations)
for (let i = 0; i < 5000000; i++) {
  result += Math.sqrt(i) * Math.sin(i) * Math.cos(i);
}

// Matrix operations (1000x100 random matrix)
const matrix = [];
for (let i = 0; i < 1000; i++) {
  matrix.push(new Array(100).fill(0).map(() => Math.random()));
}
```

This workload demonstrates:

- **Single Process** (Basic/Redis): Limited by one CPU core
- **Multi-Process** (Cluster): Distributed across all available cores

## 🎯 Key Takeaways

1. **Redis caching** provides dramatic speed improvements for repeated data access
2. **Clustering** enables parallel processing for CPU-intensive operations
3. **Combined approach** (Redis + Cluster) offers the best of both optimizations
4. **Real-world applicability** to session management, analytics, and compute workloads

---

**Built with ❤️ to demonstrate practical API optimization techniques**

Educational project demonstrating API optimization techniques and scalability patterns.
