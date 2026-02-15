# 

# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.21.1
FROM node:${NODE_VERSION}-slim AS base

WORKDIR /app
ENV NODE_ENV=production

# ---------- Build stage ----------
FROM base AS build
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
    build-essential node-gyp pkg-config python-is-python3

COPY .npmrc package-lock.json package.json ./
RUN npm ci
COPY . .

# ---------- Runtime stage ----------
FROM base

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
    chromium \
    chromium-sandbox \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnss3 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxrandr2 \
    xdg-utils \
    wget \
    && rm -rf /var/lib/apt/lists/*



    

COPY --from=build /app /app

ENV PUPPETEER_EXECUTABLE_PATH="/usr/bin/chromium"

EXPOSE 3000
CMD ["npm", "run", "start"]
