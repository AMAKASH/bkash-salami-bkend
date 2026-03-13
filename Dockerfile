# bkash-salami-backend
FROM node:20-alpine

WORKDIR /app

# Copy dependency files first for better layer caching
COPY package.json package-lock.json* ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy application code
COPY . .

# Default port (override with PORT env at runtime)
EXPOSE 8080

# Run as non-root user
USER node

CMD ["node", "app.js"]
