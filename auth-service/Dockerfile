# Base image for building
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./

# Install dependencies with full build tools
RUN npm install

COPY . .

# Build the application
RUN npm run build

# Production image - use non-Alpine image to avoid bcrypt compatibility issues
FROM node:18-slim

WORKDIR /app

# Copy only necessary files from builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Set environment variables explicitly
ENV NODE_ENV=production
ENV NATS_URL=nats://nats:4222
ENV MONGODB_URI=mongodb://mongo-auth:27017/auth-db

# Command to run the application
CMD ["node", "dist/main"]