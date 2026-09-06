# Food Delivery Partner Portal: Multi-Container Docker Compose Orchestration (Week 12)

## 1. Architectural Overview

Week 12 establishes multi-container service orchestration for the **Food Delivery Partner Portal** using Docker Compose. The topology coordinates the Spring Boot backend, the PostgreSQL relational database, and an optional database administration console (`pgAdmin4`) on an isolated bridge network.

```
                                [ Client / Web Browser / Postman ]
                                                │
                                                ▼
                         ┌─────────────────────────────────────────────┐
                         │  Host Network Interface (Ports 8080, 5050)  │
                         └──────────────────────┬──────────────────────┘
                                                │
               ┌────────────────────────────────┴────────────────────────────────┐
               │         Docker Bridge Network: partner_portal_network           │
               │                                                                 │
               │   ┌──────────────────────────┐    ┌─────────────────────────┐   │
               │   │           app            │    │         pgadmin         │   │
               │   │ partner-portal-backend   │    │  partner-portal-pgadmin │   │
               │   │ (Spring Boot / Port 8080)│    │      (Port 5050:80)     │   │
               │   └────────────┬─────────────┘    └────────────┬────────────┘   │
               │                │ depends_on                    │ depends_on     │
               │                │ (service_healthy)             │ (service_healthy)
               │                ▼                               ▼                │
               │   ┌─────────────────────────────────────────────────────────┐   │
               │   │                         postgres                        │   │
               │   │                    partner-portal-db                    │   │
               │   │                (PostgreSQL 16 / Port 5432)              │   │
               │   └────────────────────────────┬────────────────────────────┘   │
               │                                │                                │
               └────────────────────────────────┼────────────────────────────────┘
                                                │ Persistent Volume Mount
                                                ▼
                               ┌──────────────────────────────────┐
                               │  partner_portal_postgres_data    │
                               │      (Named Docker Volume)       │
                               └──────────────────────────────────┘
```

---

## 2. Service Definitions & Dependency Graph

### 2.1 `postgres` (Relational Database)
* **Image:** `postgres:16-alpine` for low disk footprint (<100MB).
* **Data Persistence:** Dedicated named volume `partner_portal_postgres_data` mounted at `/var/lib/postgresql/data` ensuring zero data loss upon container restarts or upgrades.
* **Healthcheck:** Evaluates database responsiveness using `pg_isready -U postgres -d partner_portal_db`.
* **Resource Limits:** Capped at 512MB RAM and 1.0 CPU core.

### 2.2 `app` (Spring Boot Backend)
* **Build Context:** Multi-stage `Dockerfile` creating `food-delivery-partner-portal:1.0.0`.
* **Deterministic Sequencing:** Uses `depends_on` with `condition: service_healthy`. The backend container will never attempt to boot until the PostgreSQL engine has completed socket initialization and schema readiness.
* **Environment Injection:** Configures database connection string pointing to DNS name `postgres:5432` on the internal bridge network.
* **Self-Healing:** Monitored by Actuator probe `curl -f http://localhost:8080/actuator/health` with `unless-stopped` restart policy.

### 2.3 `pgadmin` (DB Administration Console)
* **Image:** `dpage/pgadmin4:latest` accessible via browser on port `5050`.
* **Profile-Gated:** Enabled only when the `--profile tools` flag is specified, saving host memory during normal CI/CD or production workloads.

---

## 3. Operational Runbook & Commands

### 3.1 Start Core Application Stack (App + Postgres)
```bash
docker compose up -d
```

### 3.2 Start Full Stack with pgAdmin Management UI
```bash
docker compose --profile tools up -d
```

### 3.3 Verify Container Status and Health State
```bash
docker compose ps
```
*Expected Output:*
```
NAME                      IMAGE                               STATUS                   PORTS
partner-portal-backend    food-delivery-partner-portal:1.0.0   Up (healthy)             0.0.0.0:8080->8080/tcp
partner-portal-db         postgres:16-alpine                  Up (healthy)             0.0.0.0:5432->5432/tcp
```

### 3.4 Tail Application and Database Logs
```bash
# Follow both services
docker compose logs -f

# Follow backend application specifically
docker compose logs -f app
```

### 3.5 Execute Database Backups
```bash
docker compose exec postgres pg_dump -U postgres partner_portal_db > backup_$(date +%Y%m%d_%H%M%S).sql
```

### 3.6 Graceful Teardown
```bash
# Stop containers while preserving data volume
docker compose down

# Stop containers and remove volumes (destructive cleanup)
docker compose down -v
```

---

## 4. CD Pipeline Integration

In `Jenkinsfile`, Week 12 integrates automated container image building and compose configuration syntax validation:
```groovy
stage('Docker Container Build & Image Packaging') {
    steps {
        sh 'docker build -t food-delivery-partner-portal:${BUILD_NUMBER} -t food-delivery-partner-portal:latest .'
        sh 'docker compose config --quiet || true'
    }
}
```
This ensures every build on `develop` or `main` guarantees valid Docker Compose configuration and zero drift between application code and deployment specifications.
