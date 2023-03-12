FROM openjdk:11-jdk
VOLUME /tmp
RUN ls /BackendAPI/target/
COPY BackendAPI/target/torchApplication-0.0.1-SNAPSHOT.jar app.jar
RUN ls /BackendAPI/target
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]
