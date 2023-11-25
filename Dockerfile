FROM ghcr.io/puppeteer/puppeteer:21.5.2

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR .

COPY package*.json ./
RUN npm install -g nodemon
RUN npm install
COPY . .
CMD [ "nodemon", "index.js" ]
