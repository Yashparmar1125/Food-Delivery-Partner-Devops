# ==============================================================================
# STAGE 1: Build Environment
# ==============================================================================
FROM maven:3.9.6-eclipse-temurin-21-jammy AS builder

LABEL maintainer="Academic Engineering & DevOps Pair Team"
LABEL description="Build environment for Food Delivery Partner Portal"

WORKDIR /build

# Cache Maven dependencies before copying source code
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy application source tree and package executable JAR
COPY src ./src
RUN mvn clean package -DskipTests -B

# ==============================================================================
# STAGE 2: Hardened Production Runtime
# ==============================================================================
FROM eclipse-temurin:21-jre-jammy AS runtime

LABEL maintainer="Academic Engineering & DevOps Pair Team"
LABEL description="Hardened production container for Food Delivery Partner Portal"
LABEL version="1.0.0"

# Install curl for container healthcheck probe and clean up apt cache
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# Create unprivileged application system user and group (UID/GID 10001)
RUN groupadd --system --gid 10001 appgroup \
    && useradd --system --uid 10001 --gid appgroup --no-create-home --shell /bin/false appuser

WORKDIR /app

# Copy compiled JAR from build stage with correct non-root ownership
COPY --from=builder --chown=appuser:appgroup /build/target/partner-portal.jar app.jar

# Container configuration and performance tuning
ENV SPRING_PROFILES_ACTIVE=prod \
    SERVER_PORT=8080 \
    JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:+ExitOnOutOfMemoryError -Djava.security.egd=file:/dev/./urandom"

# Switch to unprivileged execution
USER appuser:appgroup

EXPOSE 8080

# Built-in container healthcheck probe against Spring Boot Actuator
HEALTHCHECK --interval=30s --timeout=5s --start-period=45s --retries=3 \
    CMD curl -f http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
