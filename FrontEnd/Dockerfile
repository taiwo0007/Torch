FROM node:9.6.2-alpine as build
WORKDIR /app
COPY ./package*.json ./
RUN npm ci --legacy-peer-deps
#RUN npm install -g @angular/cli@15.2.2 --legacy-peer-deps
COPY ./ ./
RUN npm run prod

FROM nginx:1.23.0-alpine
EXPOSE 8080
COPY nginx.conf /etc/nginx/nginx.conf
RUN ls -d */
COPY --from=build /app/dist/torch-front-end/ /usr/share/nginx/html
