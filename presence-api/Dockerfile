FROM node:22-alpine

# 1. Mise à jour Alpine + création de l'utilisateur non-root (fusionnés)
RUN apk update && apk upgrade --no-cache \
    && addgroup -S nodejs -g 1001 \
    && adduser -S nodejs -u 1001 -G nodejs

WORKDIR /app

# 2. Copier les fichiers de dépendances
COPY package*.json ./

# 3. Installer les dépendances (y compris prisma CLI dans node_modules/.bin)
RUN npm install

# 4. Copier le reste du code
COPY . .

# 5. Générer le client Prisma AU BUILD (plus besoin de npx au runtime)
RUN ./node_modules/.bin/prisma generate

# 6. Supprimer npm, npx et corepack (inutiles au runtime, sources des CVE)
RUN rm -rf /usr/local/lib/node_modules/npm \
           /usr/local/lib/node_modules/corepack \
           /usr/local/bin/npm \
           /usr/local/bin/npx \
           /usr/local/bin/corepack

# 7. Donner la propriété du dossier /app à l'utilisateur non-root
RUN chown -R nodejs:nodejs /app

# 8. Basculer vers l'utilisateur non-root
USER nodejs

EXPOSE 3000

# 9. Commande de démarrage (utilise directement le binaire prisma local)
CMD ["sh", "-c", "./node_modules/.bin/prisma migrate deploy && ./node_modules/.bin/prisma db seed && node server.js"]