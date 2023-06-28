# Stage 1: Build the application
FROM node:16-alpine AS builder
WORKDIR /app
COPY . .
RUN yarn install --frozen-lockfile
RUN yarn build

# Stage 2: Create the production image
FROM node:16-alpine AS final

# Install required dependencies
RUN apk add --no-cache chromium ca-certificates
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium-browser

# Install the Nest CLI globally
RUN yarn global add @nestjs/cli

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.env .
COPY package.json .
COPY yarn.lock .

# Generate the Prisma client
RUN yarn install --frozen-lockfile --production
RUN npx prisma generate

EXPOSE 8080
CMD npm run prisma:generate && npm run prisma:migrate:deploy && npm run start:prod
