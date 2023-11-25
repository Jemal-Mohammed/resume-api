FROM ghcr.io/puppeteer/puppeteer:21.5.2

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

COPY package*.json ./
COPY . .

# Remove existing node_modules
RUN rm -rf node_modules

# Set the user to root temporarily for permissions fix
USER root

# Fix permissions
RUN npm cache clean --force && \
    npm install --unsafe-perm=true && \
    chown -R node:node /usr/src/app

# Set the user back to a non-root user
USER node

CMD [ "node", "index.js" ]
