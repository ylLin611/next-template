# Base image
FROM node:22-alpine3.21 AS base
# RUN apk add --no-cache tzdata
RUN npm install -g pnpm@10.11.1

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Build the app
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# 环境变量

# Production image
FROM base AS runner
WORKDIR /app

ENV PORT=5555 
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 5555
CMD ["sh", "-c", "PORT=5555 node server.js"]
