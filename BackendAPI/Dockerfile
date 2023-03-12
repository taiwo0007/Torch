FROM openjdk:11-jdk
VOLUME /tmp
ADD /target/torchApplication-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]