# angular
FROM node:latest as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# nginx
FROM nginx:latest
COPY --from=build /app/dist/app /usr/share/nginx/html