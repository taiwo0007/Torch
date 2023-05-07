FROM openjdk:16-jdk
VOLUME /tmp
EXPOSE 8080
ADD /target/*.jar app.jar
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]


# FROM node:16-alpine3.16 as build
# WORKDIR /app
# COPY ./FrontEnd/package*.json ./
# RUN npm ci --legacy-peer-deps
# COPY ./FrontEnd/ ./
# RUN npm run prod

# FROM nginx:1.23.0-alpine
# EXPOSE 8080
# COPY nginx.conf /etc/nginx/nginx.conf
# RUN ls -d */
# COPY --from=build /app/dist/torch-front-end/ /usr/share/nginx/html