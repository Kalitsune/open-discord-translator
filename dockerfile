FROM node:latest

LABEL org.opencontainers.image.title="Open Discord Translator"
LABEL org.opencontainers.image.description="A Discord bot that translates messages."
LABEL org.opencontainers.image.name="open-discord-translator"
LABEL org.opencontainers.image.authors="Kalitsune <hi@kalitsune.cloud>"
LABEL org.opencontainers.image.source="https://github.com/Kalitsune/open-discord-translator"

WORKDIR /app

COPY . .

RUN npm install --production

CMD ["npm", "start"]