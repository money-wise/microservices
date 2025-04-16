FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Build the application
RUN npm run build

# Set NATS connection explicitly
ENV NATS_URL=nats://nats:4222

# Use the correct command to run the built application
CMD ["node", "dist/main"]