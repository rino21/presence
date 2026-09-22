FROM node:22-alpine

# 1. Mise à jour Alpine + création de l'utilisateur non-root (fusionnés)
RUN apk update && apk upgrade --no-cache \
    && addgroup -S nodejs -g 1001 \
    && adduser -S nodejs -u 1001 -G nodejs

WORKDIR /app

# 2. Copier les fichiers de dépendances
COPY package*.json ./

# 3. Installer les dépendances
RUN npm install

# 4. Copier le reste du code
COPY . .

# 5. Donner la propriété du dossier /app à l'utilisateur non-root
RUN chown -R nodejs:nodejs /app

# 6. Basculer vers l'utilisateur non-root
USER nodejs

EXPOSE 3000

# 7. Commande de démarrage
CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && npx prisma db seed && node server.js"]