# Food Delivery Partner Portal: Docker Containerization Architecture (Week 11)

## 1. Overview & Architectural Goals

Week 11 transitions the **Food Delivery Partner Portal** from bare-metal / local JAR execution to a containerized, cloud-ready artifact using a **multi-stage Docker build pattern**.

```
┌────────────────────────────────────────────────────────┐
│                   STAGE 1: BUILDER                     │
│  Base: maven:3.9.6-eclipse-temurin-21-jammy            │
│  ├── 1. pom.xml layer dependency pre-fetching          │
│  ├── 2. src/ compilation & packaging                   │
│  └── 3. Generates target/partner-portal.jar            │
└───────────────────────────┬────────────────────────────┘
                            │ (COPY compiled JAR artifact only)
                            ▼
┌────────────────────────────────────────────────────────┐
│                   STAGE 2: RUNTIME                     │
│  Base: eclipse-temurin:21-jre-jammy (~250MB minimal)   │
│  ├── Hardened non-root user (appuser:appgroup 10001)   │
│  ├── Lightweight curl utility for health checks        │
│  ├── Optimized JVM container ergonomics                │
│  └── Exposed port 8080 with Actuator Healthcheck       │
└────────────────────────────────────────────────────────┘
```

---

## 2. Multi-Stage Build Breakdown

### 2.1 Stage 1: Dependency Cache & Compilation
```dockerfile
FROM maven:3.9.6-eclipse-temurin-21-jammy AS builder
WORKDIR /build
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests -B
```
* **Layer Caching:** By copying `pom.xml` and executing `mvn dependency:go-offline` prior to copying `src/`, Docker caches the Maven dependencies layer. Subsequent code changes rebuild in seconds without re-downloading hundreds of megabytes of third-party libraries.
* **Test Isolation:** Unit and regression tests run in the CI pipeline prior to packaging; `-DskipTests` ensures rapid, deterministic container compilation.

### 2.2 Stage 2: Hardened Runtime Environment
```dockerfile
FROM eclipse-temurin:21-jre-jammy AS runtime
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*
RUN groupadd --system --gid 10001 appgroup \
    && useradd --system --uid 10001 --gid appgroup --no-create-home --shell /bin/false appuser
WORKDIR /app
COPY --from=builder --chown=appuser:appgroup /build/target/partner-portal.jar app.jar
```
* **Minimal Attack Surface:** Uses `eclipse-temurin:21-jre-jammy` containing only the Java Runtime Environment, omitting compilers, build tools, package managers, and development headers.
* **Non-Root Execution:** Adheres to CIS Docker Benchmark Recommendation 4.1. Process runs as system user `appuser` (UID 10001). Even if the application were compromised via an unpatched CVE, the attacker cannot escalate to root permissions on the host.

---

## 3. JVM Container Tuning & Ergonomics

Spring Boot 3 runs within JVM 21 LTS, which features native cgroup v1 and cgroup v2 awareness:

| Flag | Purpose | Rationale |
|---|---|---|
| `-XX:+UseContainerSupport` | Enables JVM container memory & CPU detection | Prevents JVM from allocating heap based on total host physical RAM |
| `-XX:MaxRAMPercentage=75.0` | Restricts heap to 75% of container RAM limit | Reserves 25% of RAM for metaspace, thread stacks, off-heap buffers, and OS overhead |
| `-XX:+ExitOnOutOfMemoryError` | Immediate process exit on `java.lang.OutOfMemoryError` | Allows Docker/Kubernetes health monitor to immediately restart crashed container |
| `-Djava.security.egd=file:/dev/./urandom` | Non-blocking cryptographic seed | Accelerates JWT token generation without blocking on `/dev/random` entropy |

---

## 4. Container Healthcheck Probes

```dockerfile
HEALTHCHECK --interval=30s --timeout=5s --start-period=45s --retries=3 \
    CMD curl -f http://localhost:8080/actuator/health || exit 1
```
* **Interval:** Probes the service every 30 seconds.
* **Timeout:** Fails if the HTTP request does not respond within 5 seconds.
* **Start Period:** Grace window of 45 seconds allowing Spring Boot Hibernate schema validation and HikariCP connection pool initialization before marking container unhealthy.
* **Retries:** 3 consecutive failures transitions container state to `unhealthy`.

---

## 5. Build & Execution Commands

### 5.1 Build Container Image
```bash
docker build -t food-delivery-partner-portal:1.0.0 .
```

### 5.2 Tag Image for Registry
```bash
docker tag food-delivery-partner-portal:1.0.0 food-delivery-partner-portal:latest
```

### 5.3 Run Container Locally
```bash
docker run -d \
  --name partner-portal-app \
  -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=dev \
  -e DB_HOST=host.docker.internal \
  -e DB_PORT=5432 \
  -e DB_NAME=partner_portal_db \
  -e DB_USERNAME=postgres \
  -e DB_PASSWORD=1125 \
  --memory="512m" \
  --cpus="1.0" \
  food-delivery-partner-portal:1.0.0
```

### 5.4 Inspect Container Health & Logs
```bash
# Check container status (including health status)
docker ps --filter name=partner-portal-app

# Inspect detailed health check logs
docker inspect --format='{{json .State.Health}}' partner-portal-app

# Stream container application logs
docker logs -f partner-portal-app
```

---

## 6. Verification Checklist

- [x] Multi-stage build separates compiler tools from runtime footprint.
- [x] Non-root user `appuser` (UID 10001) enforced.
- [x] JVM container support and memory limits calibrated.
- [x] Actuator health probe configured with retry limits and start period.
- [x] `.dockerignore` filters out `.git`, `target/`, IDE folders, and `.env`.
