FROM node:17.6.0-slim

WORKDIR /app

COPY . .

RUN yarn install

EXPOSE 3000

CMD ["/bin/bash","entrypoint.sh"]