FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --omit=dev

COPY . .

RUN npm run build

EXPOSE 8080

CMD ["npm", "run", "start:prod"]
