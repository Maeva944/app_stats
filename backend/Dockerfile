# Utilise une image de base Node.js
FROM node:20

# Crée un répertoire pour l'application
WORKDIR /app

# Copie les fichiers de dépendances
COPY package.json package-lock.json ./

# Installe les dépendances
RUN npm install

# Copie le reste du code de l'application
COPY . .

# Expose le port utilisé par Express
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["npm", "start"]
