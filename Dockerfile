FROM ghcr.io/puppeteer/puppeteer:21.5.2

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

COPY package*.json ./
COPY . .

# Temporarily set the user to root
USER root

# Remove existing node_modules
RUN rm -rf node_modules

RUN npm install

# Set the user back to a non-root user
USER node

CMD [ "node", "index.js" ]
