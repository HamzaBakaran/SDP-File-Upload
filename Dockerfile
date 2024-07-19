FROM maven:3.8.5-openjdk-17 as build
COPY . .
RUN mvn clean package -DskipTests

FROM openjdk:17.0.1-jdk-slim
COPY --from=build /target/SDP-File-Upload-0.0.1-SNAPSHOT.jar SDP-File-Upload.jar
EXPOSE 8080

ENTRYPOINT ["java","-jar","SDP-File-Upload.jar"]