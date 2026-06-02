# ---------- BUILD ----------
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Forzamos build production (aunque tu script "build" esté en development)
RUN npm run build -- --configuration=production

# ---------- RUNTIME ----------
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Tu outputPath es "www"
COPY --from=build /app/www/ /usr/share/nginx/html/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
