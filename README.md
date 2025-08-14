# Scalable API - Node.js Performance Optimization Showcase

> **Note:** This project was created for a LinkedIn Article. [Article link will be added here]

## 📖 Overview

This project demonstrates the evolution of a simple Express.js API into a more scalable, optimized application. It showcases various optimization techniques and architectural patterns used to improve API performance, throughput, and resource utilization.

## Project Evolution

### Phase 1: Basic Express API (`index1.ts`)

- Started with a simple TypeScript Express.js application
- Single endpoint (`/user`) with simulated database connection
- Basic error handling and response structure
- Demonstrated fundamental API development patterns

### Phase 2: Redis Integration (`src/index.ts`)

- **Caching Layer**: Added Redis for data caching with 60-second TTL
- **Rate Limiting**: Implemented Redis-based rate limiting (5 requests/minute per IP)
- **Performance Boost**: Significantly reduced response times for cached data
- **Shared State**: Prepared foundation for distributed architecture

### Phase 3: Cluster Implementation (`src/cluster.ts`)

- **Multi-Process Architecture**: Utilized Node.js cluster module to leverage all CPU cores
- **Rate Limiting**: Increased to 100 requests/minute per IP for cluster testing
- **Load Distribution**: Automatic load balancing across worker processes
- **High Availability**: Worker process restart on failure
- **Scalability**: Horizontal scaling within a single machine

## 🛠️ Technologies Used

### Core Technologies

- **Node.js** - Runtime environment
- **TypeScript** - Type-safe JavaScript development
- **Express.js** - Web application framework

### Performance & Scalability

- **Redis** - In-memory data structure store for caching and rate limiting
- **Node.js Cluster** - Multi-process architecture for CPU utilization
- **Express Rate Limit** - API rate limiting middleware

### Development Tools

- **ts-node** - TypeScript execution for development
- **nodemon** - Auto-restart during development
- **ESLint** - Code linting and formatting
- **Autocannon** - HTTP benchmarking tool for performance testing

## 📁 Project Structure

```
scalable-api/
├── index1.ts             # Phase 1: Basic Express API (no Redis)
├── src/
│   ├── index.ts          # Phase 2: Redis integration (caching + rate limiting)
│   └── cluster.ts        # Phase 3: Cluster implementation with Redis
├── dist/                 # Compiled JavaScript output
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── .eslintrc.js         # ESLint configuration
└── README.md            # Project documentation
```

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Redis server (local installation or Docker)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/KseniiaRiabova/scalable-api.git
   cd scalable-api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start Redis server**

   ```bash
   # Local Redis installation
   redis-server

   # Or using Docker
   docker run -d -p 6379:6379 redis
   ```

### Running the Application

#### Development Mode

```bash
# Single-process application
npm run dev

# Multi-process cluster application
npm run dev:cluster
```

#### Production Mode

```bash
# Build the application
npm run build

# Run single-process version
npm start

# Run cluster version
npm run start:cluster
```

## 📊 Performance Testing

### Using Autocannon

```bash
# Basic load test
autocannon http://localhost:3000/user

# Custom test with 10 connections for 30 seconds
autocannon -c 10 -d 30 http://localhost:3000/user

# High-load test
autocannon -c 100 -d 10 http://localhost:3000/user
```

### Available Endpoints

- `GET /user` - Returns user data (with caching)
- `GET /health` - Health check endpoint
- `GET /worker` - Worker process information (cluster mode only)

### Testing Cache Behavior

**Important Note**: When testing caching behavior, the tool you use matters:

- **Browser Testing**: May show `304 Not Modified` responses due to browser-level HTTP caching, even when Redis cache is working
- **Postman/API Tools**: Shows actual server response (`200 OK`) when data comes from Redis cache
- **Autocannon**: Best for load testing as it bypasses browser caching quirks

For accurate cache testing, use Postman or curl to see the true server-side caching behavior.

## 🔧 Configuration

### Rate Limiting

- **Window**: 60 seconds
- **Limit**: 100 requests per IP per window
- **Store**: Redis (shared across all workers)

### Caching

- **TTL**: 60 seconds
- **Store**: Redis
- **Strategy**: Cache-aside pattern

### Cluster Configuration

- **Workers**: Automatically scales to number of CPU cores
- **Load Balancing**: Round-robin (Node.js default)
- **Restart Policy**: Automatic worker restart on failure

## 📈 Performance Improvements

### Before Optimization (Phase 1: Basic Express)

- Single-threaded execution
- No caching (1-second response time due to simulated DB delay)
- No rate limiting
- Limited concurrent request handling

### After Optimization (Phase 3: Clustered + Redis)

- Multi-threaded execution (8 workers on 8-core system)
- Redis caching (sub-millisecond cached responses)
- Redis-based distributed rate limiting
- ~3,700 requests/second throughput

## Key Learning Points

1. **Caching Strategy**: Redis dramatically improves response times for frequently accessed data
2. **Rate Limiting**: Protects API from abuse while maintaining good user experience
3. **Clustering**: Maximizes hardware utilization without changing application logic
4. **Monitoring**: Health checks and worker information for operational visibility
5. **TypeScript**: Provides type safety and better developer experience

## Scalability Patterns Demonstrated

- **Vertical Scaling**: Cluster module utilizes all available CPU cores
- **Caching Layer**: Reduces database load and improves response times
- **Rate Limiting**: Prevents system overload and ensures fair usage
- **Graceful Shutdown**: Proper cleanup of resources on process termination
- **Health Monitoring**: Endpoints for system health verification

## Production Considerations

This project demonstrates foundational scalability patterns. For production deployment, consider:

- **Horizontal Scaling**: Multiple server instances behind a load balancer
- **Database Optimization**: Connection pooling, query optimization, read replicas
- **Monitoring & Logging**: Application performance monitoring (APM) tools
- **Security**: HTTPS, authentication, input validation, security headers
- **Error Handling**: Comprehensive error tracking and alerting
- **Environment Configuration**: Separate configs for different environments

## 🤝 Contributing

This project serves as an educational showcase. Feel free to fork and experiment with different optimization techniques!

## 📝 License

ISC License - see LICENSE file for details

---

**Created for educational purposes to demonstrate API optimization techniques and scalability patterns in Node.js applications.**
