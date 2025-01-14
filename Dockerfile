FROM node:22-alpine
LABEL authors="levanhoang792@gmail.com"

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

RUN npm i -g serve

COPY . .

RUN npm run build

EXPOSE 30000

CMD ["serve", "-s", "dist", "-l", "30000"]