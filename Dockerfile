FROM node

RUN mkdir /app
WORKDIR /app

COPY package.json /app
COPY .env /app
COPY ormconfig.json /app

RUN node -v
RUN npm install