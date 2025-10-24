FROM node:20-alpine

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 8004

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "8004"]