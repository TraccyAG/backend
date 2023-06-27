FROM node:14-alpine

RUN apk add --no-cache \
      chromium \
      ca-certificates

# This is to prevent the build from getting stuck on "Taking snapshot of full filesystem"
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true 

WORKDIR /usr/src/myapp
COPY package.json yarn.lock ./
RUN yarn

COPY . .

# Needed because we set PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV SCULLY_PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium-browser

# build_prod_scully is set in package.json to: "ng build --configuration=production && yarn scully --scanRoutes"
RUN yarn build_prod_scully 