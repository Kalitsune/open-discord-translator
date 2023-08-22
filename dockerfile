FROM node:latest

WORKDIR /app

COPY --chown=nonroot:nonroot  . .

RUN npm install --production

ENTRYPOINT ["node"]
CMD ["src/index.js"]