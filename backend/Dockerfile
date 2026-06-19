FROM node:20-alpine

WORKDIR /app

# Add OpenSSL for Prisma
RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

COPY . .
RUN npm run build

EXPOSE 8000
CMD ["npm", "start"]