# Use official Node LTS
FROM node:18-bullseye-slim

# Install libs needed for canvas/@napi-rs/canvas and other native deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files first for caching
COPY package.json package-lock.json* ./

RUN npm ci --only=production

COPY . .

EXPOSE 3000
CMD ["npm", "start"]
