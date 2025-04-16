FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Build the application
RUN npm run build

# Set environment variables explicitly to use service hostnames, not localhost
ENV MONGODB_URI=mongodb://mongo-transaction:27017/transaction-db
ENV NATS_URL=nats://nats:4222

# Command to run the built application, not dev mode
CMD ["node", "dist/main"]