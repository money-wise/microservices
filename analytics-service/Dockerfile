FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Build the application
RUN npm run build

# Set environment variables explicitly to use service hostnames, not localhost
ENV NATS_URL=nats://nats:4222

# Command to run the built application, not dev mode
CMD ["node", "dist/main"]