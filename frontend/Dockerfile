# Utilise une image de base Node.js pour builder Vue.js
FROM node:20 AS builder

# Définit le répertoire de travail
WORKDIR /app

# Copie les fichiers de dépendances et installe les modules
COPY package.json package-lock.json ./
RUN npm install

# Copie le code source et build l'application Vue.js
COPY . .
RUN npm run build

# Utilise Nginx pour servir l'application Vue.js
FROM nginx:alpine

# Copie les fichiers de build vers le dossier de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose le port 80 pour accéder au site
EXPOSE 80

# Lance Nginx
CMD ["nginx", "-g", "daemon off;"]
