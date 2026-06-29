# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

# Production stage
FROM node:20-alpine

# AWS Lambda Web Adapter — bridges Lambda invocations to your HTTP server
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.8.4 /lambda-adapter /opt/extensions/lambda-adapter

WORKDIR /app

RUN apk add --no-cache curl

COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src

ENV PORT=8000
EXPOSE 8000

CMD ["node", "src/index.js"]
