# ---- Build stage ----
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copiamos primero pom para aprovechar cache
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw mvnw
RUN chmod +x mvnw

# Descarga dependencias (cache)
RUN ./mvnw -q -DskipTests dependency:go-offline

# Copiamos el código y compilamos
COPY src src
RUN ./mvnw -DskipTests clean package

# ---- Run stage ----
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copia el jar generado
COPY --from=build /app/target/*.jar app.jar

# Render usa la variable PORT. Spring debe leerla con server.port=${PORT:8080}
EXPOSE 8080

ENTRYPOINT ["java","-jar","/app/app.jar"]
