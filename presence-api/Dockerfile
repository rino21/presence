FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

# CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && node server.js"]
CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && npx prisma db seed && node server.js"]

# command: sh -c "npx prisma generate && npx prisma migrate deploy && node server.js & npx prisma studio --hostname 0.0.0.0 --port 5555"