## Stage 1: Build the application
#FROM node:18-alpine3.16 AS builder
#WORKDIR /app
#COPY . .
#RUN yarn install --frozen-lockfile
#RUN yarn build

# Stage 2: Create the production image
FROM node:18-alpine3.16 AS builder

# Install required dependencies
RUN apk add --no-cache chromium ca-certificates
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium-browser

# Install the Nest CLI globally
RUN yarn global add @nestjs/cli

WORKDIR /app
COPY package.json .
COPY . .
# Install app dependencies
RUN yarn
RUN yarn run build
RUN ls

EXPOSE 8080
CMD npm run prisma:generate && npm run prisma:migrate:deploy && yarn && yarn start:prod
