FROM node:18-alpine 

WORKDIR /app

COPY package*.json ./
RUN npm install --production

RUN apk add --no-cache postgresql-client

COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]