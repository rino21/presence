FROM node:22-alpine

# 1. Mise à jour des paquets Alpine (corrige les CVE OpenSSL)
RUN apk update && apk upgrade --no-cache

# 2. Créer un utilisateur non-root et un groupe dédié
RUN addgroup -S nodejs -g 1001 \
    && adduser -S nodejs -u 1001 -G nodejs

WORKDIR /app

# 3. Copier les fichiers de dépendances
COPY package*.json ./

# 4. Installer les dépendances (en root pour l'instant, puis on changera)
RUN npm install

# 5. Copier le reste du code
COPY . .

# 6. Donner la propriété du dossier /app à l'utilisateur non-root
RUN chown -R nodejs:nodejs /app

# 7. Basculer vers l'utilisateur non-root
USER nodejs

EXPOSE 3000

# 8. Commande de démarrage (identique à l'originale)
CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && npx prisma db seed && node server.js"]