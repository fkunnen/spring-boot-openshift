FROM openjdk:9-jdk-slim
MAINTAINER frank_kunnen@hotmail.com
VOLUME /tmp

EXPOSE 8080

COPY build/libs/spring-boot-openshift.jar app.jar
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]