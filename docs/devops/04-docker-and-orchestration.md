# Chapter 4: Docker Containerization & Multi-Container Orchestration

**Project:** Food Delivery Partner Portal & Fleet Management Platform  
**Component:** Multi-Stage Dockerfile & Docker Compose Stack  

---

## 1. Executive Summary & Purpose

Containerization packages an application alongside its runtime dependencies, system libraries, and configuration files into an immutable, portable artifact.

In the **Food Delivery Partner Portal**, Docker and Docker Compose eliminate the classic problem of *"it works on my machine, but fails in production."* The exact same container image validated in the Jenkins CI pipeline is pushed to GitHub Container Registry (GHCR) and deployed to the cloud environment.

---

## 2. Multi-Stage Docker Build Architecture (`Dockerfile`)

Rather than shipping compilers, source code, and intermediate build tools to production, our [Dockerfile](../../Dockerfile) employs a **multi-stage build pattern**:

```
┌────────────────────────────────────────────────────────┐
│                   STAGE 1: BUILDER                     │
│  Base Image: maven:3.9.6-eclipse-temurin-21-jammy     │
│  ├── 1. COPY pom.xml .                                 │
│  ├── 2. RUN mvn dependency:go-offline -B               │
│  ├── 3. COPY src ./src                                 │
│  └── 4. RUN mvn clean package -DskipTests -B           │
└───────────────────────────┬────────────────────────────┘
                            │ (Extracts ONLY target/partner-portal.jar)
                            ▼
┌────────────────────────────────────────────────────────┐
│                   STAGE 2: RUNTIME                     │
│  Base Image: eclipse-temurin:21-jre-jammy (~250MB)     │
│  ├── 1. Install curl for health probes                 │
│  ├── 2. Create non-root user: appuser:appgroup (10001) │
│  ├── 3. COPY --from=builder /build/.../app.jar .       │
│  ├── 4. Configure JVM Container Ergonomics             │
│  └── 5. Define HEALTHCHECK instruction                 │
└────────────────────────────────────────────────────────┘
```

### Key Technical Decisions:
1. **Layer Caching Optimization:**
   * By copying `pom.xml` and running `mvn dependency:go-offline` *before* copying `src/`, Docker caches the Maven dependency layer.
   * If a developer only changes Java source code, Docker reuses the cached dependencies layer, completing builds in seconds instead of downloading dependencies repeatedly.
2. **Minimal Attack Surface:**
   * The runtime stage uses `eclipse-temurin:21-jre-jammy` containing only the lightweight Java Runtime Environment (JRE). The JDK compiler, Maven binary, package manager caches, and source files are excluded from the final image.
3. **CIS Docker Benchmark Non-Root Execution:**
   * Runs as unprivileged system user `appuser` (UID `10001`, GID `10001`).
   * Even in the theoretical event of a remote code execution vulnerability, an attacker cannot break out of the container or escalate to host-level root permissions.
4. **JVM Container Ergonomics:**
   ```bash
   JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:+ExitOnOutOfMemoryError -Djava.security.egd=file:/dev/./urandom"
   ```
   * `-XX:+UseContainerSupport`: Instructs the JVM to read cgroup limits rather than host hardware specs.
   * `-XX:MaxRAMPercentage=75.0`: Dynamically allocates 75% of the container's memory limit to the Java heap, reserving 25% for native memory and metaspace.
   * `-XX:+ExitOnOutOfMemoryError`: Automatically terminates a crashed container so Docker can restart it immediately.
5. **Built-in Healthcheck Probe:**
   ```dockerfile
   HEALTHCHECK --interval=30s --timeout=5s --start-period=45s --retries=3 \
       CMD curl -f http://localhost:8080/actuator/health || exit 1
   ```
   * Native container health monitoring informs Docker daemon of container status without requiring external probes.

---

## 3. Multi-Container Orchestration (`docker-compose.yml`)

The production application stack is orchestrated via [docker-compose.yml](../../docker-compose.yml), comprising isolated services on a custom bridge network:

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: partner-portal-db
    restart: unless-stopped
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USERNAME} -d ${DB_NAME}"]
      interval: 10s
      timeout: 5s
      retries: 5
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '1.0'

  app:
    image: ${IMAGE_NAME}:${IMAGE_TAG}
    container_name: partner-portal-backend
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
    ports:
      - "8080:8080"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/actuator/health"]
      interval: 15s
      timeout: 5s
      retries: 5
      start_period: 35s
    deploy:
      resources:
        limits:
          memory: 768M
          cpus: '1.5'
```

### Orchestration Capabilities:
* **Service Health Dependency (`condition: service_healthy`):** The Spring Boot application container will not start until PostgreSQL has completed initialization and passes `pg_isready`.
* **Persistent Named Volumes (`postgres_data`):** Database tables, indexes, and write-ahead logs (WAL) persist across container restarts and host reboots.
* **Network Isolation (`partner-network`):** Containers communicate over an isolated internal DNS bridge network. PostgreSQL is not exposed to the public internet; only the Spring Boot backend interacts with it.
* **Resource Limits:** Hard caps on CPU and memory prevent memory leaks from starving the host OS.
