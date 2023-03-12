FROM openjdk:11-jdk
VOLUME /tmp
EXPOSE 8080
RUN ls
ARG JAR_FILE=BackendAPI/target/torchApplication-0.0.1-SNAPSHOT.jar 
ADD ${JAR_FILE} app.jar
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]