# Step 1: Use the official Maven image with JDK 17 to build the project
FROM maven:3.8.4-openjdk-17 AS build

# Set the working directory inside the container to /app
WORKDIR /app

# Copy the pom.xml file (contains dependencies and project info) into the container
COPY pom.xml .

# Download all project dependencies so that later builds are faster
RUN mvn dependency:go-offline

# Copy the actual source code into the container
COPY src ./src

# Build the project and create a .jar file
RUN mvn clean package -DskipTests


# Step 2: Use a smaller JDK image just to run the app (not for building)
FROM openjdk:17-jdk-slim

# Set the working directory inside the container to /app
WORKDIR /app

# Copy the built jar file from the "build" stage into this container
COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar app.jar

# Tell Docker that this container will listen on port 8080
EXPOSE 8080

# Command to run the jar file when the container starts
ENTRYPOINT ["java", "-jar", "app.jar"]