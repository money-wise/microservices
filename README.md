# Money Wise Microservices

A financial management application built with a microservices architecture using NestJS.

## Architecture Overview

This project consists of the following microservices:

- **API Gateway**: Entry point for client applications
- **Auth Service**: Handles user authentication and authorization
- **Transaction Service**: Manages financial transactions
- **Budget Service**: Handles budget creation and tracking
- **Analytics Service**: Provides financial analytics and reporting
- **AI Insights Service**: Offers AI-powered financial insights

All microservices communicate with each other via NATS message broker.

## Prerequisites

- Docker and Docker Compose
- Node.js (v16 or higher) - only for local development
- Yarn or npm - only for local development

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd money-wise/microservices
```

### 2. Environment Setup

Create or update the `.env` file with the necessary configuration values:

```
# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=24h

# Service URLs
API_GATEWAY_URL=http://localhost:3000

# Uncomment and update when deploying to AWS
# AWS_ACCESS_KEY=your_aws_access_key
# AWS_SECRET_KEY=your_aws_secret_key
# AWS_REGION=us-east-1
# S3_BUCKET=finance-app-receipts
```

### 3. Running the Application with Docker

The entire application is designed to run with Docker Compose:

```bash
# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

Docker Compose will:

- Build all service images
- Start the NATS message broker
- Start all microservices with the correct configuration
- Set up the necessary network for inter-service communication

## Service Ports

- API Gateway: 3000
- Auth Service: Uses NATS (no direct HTTP port)
- Transaction Service: Uses NATS (no direct HTTP port)
- Budget Service: Uses NATS (no direct HTTP port)
- Analytics Service: Uses NATS (no direct HTTP port)
- AI Insights Service: Uses NATS (no direct HTTP port)

## Local Development (Recommended)

If you need to develop or test services individually:

### Install dependencies for each service

```bash
cd api-gateway && yarn install
cd ../auth-service && yarn install
cd ../transaction-service && yarn install
cd ../budget-service && yarn install
cd ../analytics-service && yarn install
cd ../ai-insights-service && yarn install
```

### Mongodb setup

- [Install Mongodb GUI](https://www.mongodb.com/try/download/compass)
- Create appropriate dbs locally ie auth-db, budget-db, transaction-db

### Running services individually

```bash
# API Gateway
cd api-gateway && yarn run start:dev

# Auth Service
cd auth-service && yarn run start:dev

# Transaction Service
cd transaction-service && yarn run start:dev

# Budget Service
cd budget-service && yarn run start:dev

# Analytics Service
cd analytics-service && yarn run start:dev

# AI Insights Service
cd ai-insights-service && yarn run start:dev
```

### Installing and running nat-server

- macOS

```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install NATS server
brew install nats-server

# Start NATS server
nats-server
```

- Windows

```bash
# Install Chocolatey if you don't have it
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install NATS server
choco install nats-server

# Start NATS server
nats-server
```

- Ubuntu/Debian

```bash
# Download and install the latest release
curl -L https://github.com/nats-io/nats-server/releases/download/v2.10.11/nats-server-v2.10.11-linux-amd64.tar.gz -o nats-server.tar.gz
tar -xzf nats-server.tar.gz
cd nats-server-v2.10.11-linux-amd64
sudo cp nats-server /usr/local/bin

# Start NATS server
nats-server
```

### Running tests

```bash
cd <service-name> && yarn run test
```

## Deployment

For production deployment:

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy the stack
docker-compose -f docker-compose.prod.yml up -d
```
