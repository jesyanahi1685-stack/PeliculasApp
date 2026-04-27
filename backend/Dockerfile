# backend/Dockerfile
FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache openssl

# Instalar dependencias primero (cache layer)
COPY package*.json ./
RUN npm ci

# Copiar código fuente
COPY . .

# Generar Prisma Client
RUN npx prisma generate

EXPOSE 3001

# En dev: nodemon | En prod: node
CMD ["npm", "run", "dev"]
