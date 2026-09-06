# Jenkins-Based Food Delivery Partner Portal
## Capstone Viva Defense Presentation & Oral Examination Runbook (Week 15)

---

## 1. Presentation Structure & Speaker Script (10 Slides)

### Slide 1: Title & Project Scope
* **Slide Title:** Jenkins-Based Food Delivery Partner Portal
* **Subtitle:** 15-Week Enterprise Software Engineering & Automated DevOps Platform
* **Speaker Script:**  
  *"Good morning respected evaluators. Today, we present our capstone engineering and DevOps project: the Food Delivery Partner Portal. Over a 15-week Agile curriculum, we developed a production-grade backend coupled with a complete, automated DevOps lifecycle spanning Continuous Integration, Selenium automated browser testing, Docker containerization, and Ansible infrastructure automation."*

### Slide 2: Problem Statement & Operational Context
* **Slide Title:** Operational Challenges in Food Delivery Fleets
* **Bullet Points:**
  - Manual, fragmented spreadsheet tracking prone to duplicate driver records.
  - Absence of deterministic onboarding states leading to unregulated driver activations.
  - Lack of sub-second multi-criteria driver search during live customer disputes.
  - Missing immutable audit trails creating legal and compliance exposure.
  - Manual, error-prone software deployments with no rollback mechanism.

### Slide 3: Solution Architecture & Technology Stack
* **Slide Title:** Layered System Architecture
* **Bullet Points:**
  - Spring Boot 3.2.5 (Java 21 LTS) 3-tier architecture (Controller $\to$ Service $\to$ Repository).
  - PostgreSQL 16 relational database with HikariCP connection pooling.
  - Spring Security with Bearer JWT tokens and strict Role-Based Access Control.
  - OpenAPI 3.0 / Swagger UI documentation and Spring Boot Actuator observability.

### Slide 4: Finite State Machine & Data Model
* **Slide Title:** Deterministic Lifecycle & Audit Logging
* **State Transition Workflow:**
  $$\text{PENDING} \longrightarrow \text{VERIFICATION} \longrightarrow \text{ACTIVE} \longleftrightarrow \text{SUSPENDED} \longrightarrow \text{DEACTIVATED}$$
* **Speaker Script:**  
  *"A core differentiator of our system is its deterministic Finite State Machine. A driver cannot skip onboarding steps; for example, moving directly from PENDING to ACTIVE is strictly rejected with an exception. Every status change is captured in the status_history table with actor and timestamp."*

### Slide 5: Continuous Integration Pipeline (Jenkinsfile)
* **Slide Title:** Declarative Pipeline as Code
* **Stages:**
  1. Environment Validation $\to$ 2. Static Compilation $\to$ 3. Unit & Slice Testing $\to$ 4. Code Quality Gate $\to$ 5. Package JAR $\to$ 6. Archive Artifacts $\to$ 7. Docker Image Build $\to$ 8. Staging Smoke Gate $\to$ 9. Post Actions.

### Slide 6: Automated Testing & JaCoCo Quality Gates
* **Slide Title:** Multi-Layered Testing Pyramid
* **Test Metrics:**
  - 33 Automated Tests with 100% Pass Rate.
  - Unit Tests (JUnit 5 + Mockito) + REST Slice Tests (`@WebMvcTest`).
  - End-to-End Browser Automation via Selenium WebDriver (Headless Chrome).
  - JaCoCo Code Coverage Verification rule enforced in build pipeline.

### Slide 7: Docker Multi-Stage Containerization
* **Slide Title:** Containerization & Image Hardening
* **Highlights:**
  - Multi-stage build (`maven:3.9.6` builder $\to$ `eclipse-temurin:21-jre` runtime).
  - Non-root user execution (`appuser:10001`) adhering to CIS Docker benchmark.
  - Container JVM tuning: `-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0`.
  - Built-in container healthcheck probe polling Actuator.

### Slide 8: Multi-Container Orchestration (Docker Compose)
* **Slide Title:** Orchestration & Health Dependencies
* **Topology:**
  - `postgres`: PostgreSQL 16 container with persistent volume and `pg_isready` probe.
  - `app`: Spring Boot backend with `depends_on: postgres (condition: service_healthy)`.
  - `pgadmin`: DB administration console on profile `tools`.
  - Isolated bridge network `partner_portal_network`.

### Slide 9: Ansible Infrastructure as Code & Self-Healing Rollback
* **Slide Title:** Automated Host Provisioning & Rollback
* **Highlights:**
  - `provision-host.yml`: Automates Docker installation and directory hardening (`0750`/`0600`).
  - `deploy-app.yml`: Automated pre-deployment DB snapshot, rolling update, and health probe loop.
  - `rollback-app.yml`: Self-healing rescue handler reverting container to previous known-good image on probe failure.

### Slide 10: Conclusion & Demo Transition
* **Slide Title:** Project Impact & Live Demonstration
* **Speaker Script:**  
  *"In conclusion, this project bridges enterprise Java engineering with modern Site Reliability Engineering and DevOps best practices. We are now pleased to walk you through our live demonstration and take your questions."*

---

## 2. Live Demonstration Script

1. **Demonstrate Automated Test Suite & Coverage:**
   ```bash
   mvn clean test jacoco:report jacoco:check
   ```
   *Show:* All 33 tests execute and pass cleanly; show `target/site/jacoco/index.html` in browser.

2. **Demonstrate Selenium E2E Test Execution:**
   ```bash
   mvn test -Dtest=SwaggerUiE2ETest
   ```
   *Show:* Headless Chrome initializes, drives the Swagger UI DOM, and asserts UI availability.

3. **Demonstrate Multi-Container Orchestration:**
   ```bash
   docker compose up -d
   docker compose ps
   ```
   *Show:* Both `postgres` and `app` containers show `healthy` status.

4. **Demonstrate REST Endpoints & Swagger UI:**
   - Open: `http://localhost:8080/swagger-ui.html`
   - Execute: `POST /api/v1/auth/login` with `admin` / `Admin@123` to obtain Bearer token.
   - Execute: `POST /api/v1/partners` to create a partner.
   - Execute: `PATCH /api/v1/partners/{id}/status` to test state transitions.
   - Execute: `GET /api/v1/dashboard/summary` to show fleet statistics.

5. **Demonstrate Ansible Playbooks:**
   ```bash
   ansible-playbook -i ansible/inventory/hosts.ini ansible/playbooks/deploy-app.yml --check
   ```
   *Show:* Idempotent deployment validation and healthcheck probe loop.

---

## 3. Comprehensive Viva Oral Examination Q&A (30 Questions & Answers)

### Section A: Spring Boot & Backend Architecture
**Q1: Why did you choose a 3-tier layered architecture for this application?**  
*Answer:* Layered architecture enforces separation of concerns: the Controller layer handles HTTP serialization and validation; the Service layer encapsulates business logic and state machine transitions; the Repository layer manages database persistence through JPA/Hibernate. This isolation ensures high maintainability, reusability, and unit testability.

**Q2: What is the purpose of `@RestControllerAdvice` in your application?**  
*Answer:* `GlobalExceptionHandler` uses `@RestControllerAdvice` to centrally intercept exceptions thrown across all controllers. It translates unhandled runtime exceptions (`ResourceNotFoundException`, `DuplicateResourceException`, `IllegalStateException`, `MethodArgumentNotValidException`) into standard, structured RFC 7807 JSON error responses with proper HTTP status codes.

**Q3: How does your search engine handle dynamic queries without writing raw SQL?**  
*Answer:* We implemented Spring Data JPA `Specification` interface using criteria queries. This allows dynamically combining predicates (filtering by name, phone number, vehicle type, or status) based only on non-null query parameters supplied by the client, combined with `Pageable` for zero-overhead pagination.

**Q4: How do you prevent partial database updates if a status transition fails?**  
*Answer:* Service methods are annotated with `@Transactional`. If an exception occurs during either the partner status update, status history insertion, or audit log creation, Spring's transaction manager automatically rolls back the entire database transaction to prevent corrupt state.

**Q5: Why did you use UUIDs instead of auto-incrementing integer IDs for entities?**  
*Answer:* UUIDs eliminate enumeration vulnerabilities (where malicious users crawl consecutive IDs like `/partners/101`), prevent ID collisions across distributed databases or microservice environments, and allow ID generation prior to database insert.

---

### Section B: Database & PostgreSQL
**Q6: What indexing strategy did you implement on the PostgreSQL database?**  
*Answer:* Unique B-Tree indexes were placed on `email`, `phone_number`, and `vehicle_registration_number` to guarantee sub-millisecond lookups and database-level uniqueness enforcement. Non-unique indexes were placed on `current_status` and foreign key `partner_id` in `status_history`.

**Q7: How does HikariCP improve database performance in Spring Boot?**  
*Answer:* HikariCP is a lightweight, zero-overhead JDBC connection pool. Instead of opening and closing expensive TCP connections for each HTTP request, HikariCP reuses pre-warmed database connections, dramatically reducing latency and connection exhaustion under high concurrency.

**Q8: How does the application prevent duplicate driver registrations?**  
*Answer:* We use defense-in-depth: the Service layer performs pre-insert existence checks using repository methods (`existsByEmail`, `existsByPhoneNumber`), while the PostgreSQL database enforces strict `UNIQUE` table constraints.

**Q9: What happens to status history when a partner record is soft-deleted?**  
*Answer:* The partner record has its `active` flag set to `false` rather than performing a destructive SQL `DELETE`. This preserves historical referential integrity in `status_history` and `audit_logs` for compliance auditing.

---

### Section C: Spring Security & JWT RBAC
**Q10: Explain the lifecycle of a JWT Bearer token in your system.**  
*Answer:* When a client posts credentials to `/api/v1/auth/login`, Spring Security authenticates the user. `JwtUtils` generates a cryptographically signed HMAC-SHA256 token containing username, assigned roles, and expiration timestamp. For subsequent requests, `JwtAuthenticationFilter` intercepts the `Authorization: Bearer <token>` header, validates the signature, extracts user details, and populates the `SecurityContextHolder`.

**Q11: How is Role-Based Access Control enforced on individual endpoints?**  
*Answer:* Endpoints are protected in `SecurityConfig` and method security. For instance, creating or deleting partners requires `ROLE_ADMIN`, status transitions require `ROLE_ADMIN` or `ROLE_OPS_MANAGER`, while viewing dashboard metrics is accessible to `ROLE_VIEWER`.

**Q12: Why are passwords not stored in plaintext?**  
*Answer:* Passwords are encrypted using BCrypt (`BCryptPasswordEncoder`) with a salt rounds work factor of 12. BCrypt includes a unique cryptographic salt per password and is deliberately computationally intensive to prevent rainbow table attacks.

**Q13: Why did you make the session management STATELESS?**  
*Answer:* By configuring `SessionCreationPolicy.STATELESS`, Spring Boot creates no server-side HTTP sessions. This eliminates memory overhead on the server and allows the application to scale horizontally behind a load balancer without sticky sessions.

---

### Section D: Jenkins CI/CD & Automation
**Q14: What is the difference between a Freestyle job and a Declarative Pipeline in Jenkins?**  
*Answer:* Freestyle jobs are configured manually in the Jenkins web UI, making them hard to version-control or audit. A Declarative Pipeline (`Jenkinsfile`) treats pipeline definitions as code stored directly in the Git repository, allowing peer reviews, automated branch builds, and immutable CI tracking.

**Q15: What stages exist in your Jenkinsfile and what are their purposes?**  
*Answer:* 
1. Checkout: Clones Git repository.
2. Environment Validation: Verifies JDK, Maven, and Docker runtimes.
3. Static Analysis & Compilation: Compiles source code.
4. Unit & Slice Testing: Executes JUnit 5 tests.
5. Code Quality Gate: Enforces JaCoCo coverage thresholds.
6. Package: Generates executable JAR.
7. Archive: Persists artifacts.
8. Docker Build: Packages container image.
9. Staging Deployment & Smoke Test: Deploys to staging and validates health probe.

**Q16: How do you prevent sensitive credentials from leaking in the Jenkinsfile?**  
*Answer:* Secrets are stored inside the Jenkins Credentials Store and bound to pipeline environment variables using `withCredentials([usernamePassword(...)])`. They are masked in build logs and never hardcoded in version control.

**Q17: What triggers automated Jenkins builds?**  
*Answer:* Builds are triggered via GitHub Webhooks on git push events to `develop` and `main` branches, or scheduled polling triggers.

---

### Section E: Automated Testing & JaCoCo Quality Gates
**Q18: What is the difference between `@SpringBootTest` and `@WebMvcTest`?**  
*Answer:* `@SpringBootTest` boots the entire Spring ApplicationContext including database repositories and services, suitable for integration tests. `@WebMvcTest` is a slice test that loads only the controller and MVC infrastructure, mocking service dependencies with `@MockBean` for fast, lightweight testing.

**Q19: How did you implement automated browser testing with Selenium?**  
*Answer:* We configured Selenium WebDriver 4.18.1 with BoniGarcia WebDriverManager to automatically resolve ChromeDriver. Tests run in headless Chrome (`--headless=new --no-sandbox`) against a random Spring Boot port (`@LocalServerPort`), asserting live DOM elements and Swagger UI interactivity.

**Q20: How does JaCoCo measure code coverage and enforce quality gates?**  
*Answer:* JaCoCo injects a Java runtime agent during Maven test execution to track bytecode execution (instruction, branch, and line counters). The `jacoco:check` goal evaluates measured coverage against our predefined threshold ($\ge 50\%$ line coverage); if coverage falls below this, the Maven build fails and halts the CI pipeline.

**Q21: Why do you exclude DTOs and configuration classes from JaCoCo checks?**  
*Answer:* DTOs consist primarily of boilerplate getters, setters, and constructors, and configuration classes contain declarative beans. Including them distorts test metrics without providing meaningful business logic verification.

---

### Section F: Docker & Multi-Stage Builds
**Q22: What is the primary advantage of a multi-stage Docker build?**  
*Answer:* Multi-stage builds separate the build environment from the runtime environment. The build stage contains Maven, JDK compilers, and local caches (1GB+), while the final runtime image copies only the compiled JAR into a minimal JRE image (~250MB), dramatically shrinking attack surface and image size.

**Q23: Why is running containers as a non-root user important?**  
*Answer:* By default, Docker containers run as `root`. If a vulnerability allows container escape, the attacker acquires root privileges on the host OS. Running as `appuser` (UID 10001) restricts permissions strictly to the application directory.

**Q24: How does `-XX:+UseContainerSupport` benefit Java in Docker?**  
*Answer:* Prior to Java 10, JVMs detected the total physical RAM and CPU count of the host machine rather than Docker cgroup limits, causing JVMs to allocate excessive heap and get terminated by the Linux Out-Of-Memory (OOM) Killer. `-XX:+UseContainerSupport` ensures heap sizing obeys container memory constraints.

**Q25: What is the purpose of the Docker HEALTHCHECK instruction?**  
*Answer:* It enables Docker to monitor internal application health using `curl http://localhost:8080/actuator/health`. If the process deadlocks or disconnects from the database, Docker flags the container as `unhealthy`, enabling automated restart policies.

---

### Section G: Docker Compose & Orchestration
**Q26: Why is `condition: service_healthy` superior to standard `depends_on` in Docker Compose?**  
*Answer:* Standard `depends_on` only waits for the container process to launch, which causes the backend to fail if PostgreSQL is still initializing its socket. `condition: service_healthy` delays starting the backend until PostgreSQL passes its `pg_isready` healthcheck probe.

**Q27: How is data persisted across container rebuilds?**  
*Answer:* PostgreSQL data is stored on a named Docker volume (`partner_portal_postgres_data`) mounted at `/var/lib/postgresql/data`. Volumes exist independently of container lifecycles, ensuring data persists through `docker compose down` and image upgrades.

---

### Section H: Ansible & Infrastructure as Code
**Q28: What is idempotency in Ansible?**  
*Answer:* An idempotent playbook produces the exact same system state regardless of how many times it is executed. If a package, directory, or configuration file already matches the desired state, Ansible skips modification (`changed=0`), preventing unintended configuration drift.

**Q29: Describe the automated rollback mechanism implemented in your deployment playbook.**  
*Answer:* `deploy-app.yml` wraps deployment steps in a `block`/`rescue` structure. After deploying the container, it executes a health verification loop against `/actuator/health`. If the probe fails after 18 retries, the `rescue` block automatically halts the broken container, reverts to the previous image tag, restarts the stack, and logs an incident report.

**Q30: How does Ansible protect database credentials and secrets?**  
*Answer:* Secrets are injected into templates (`.env.j2`) which are written with file permissions `0600` owned exclusively by the `partnerapp` user. In production environments, sensitive variables are further encrypted using Ansible Vault.
