FROM node:latest

WORKDIR /app

COPY . .

RUN npm install --production

ENTRYPOINT ["node"]
CMD ["src/index.js"]