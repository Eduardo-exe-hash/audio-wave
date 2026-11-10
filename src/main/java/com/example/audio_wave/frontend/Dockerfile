# Estágio 1: Build da aplicação React + Vite
FROM node:20-alpine AS build

WORKDIR /app

# Copia os arquivos de dependência e instala
COPY package*.json ./
RUN npm install

# Copia o código fonte e gera o build estático
COPY . .
RUN npm run build

# Estágio 2: Servidor Web de Produção com Nginx
FROM nginx:alpine

# Copia a configuração personalizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos compilados do estágio anterior para a pasta pública do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]