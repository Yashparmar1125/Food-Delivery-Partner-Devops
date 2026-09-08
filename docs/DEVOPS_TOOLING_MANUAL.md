# Food Delivery Partner Portal: DevOps Engineering & Tooling Manual

**Project Title:** Enterprise Food Delivery Partner Portal & Fleet Management Platform  
**System Architecture:** Cloud-Native Spring Boot 3 + PostgreSQL 16 + React 19 PWA  
**Document Classification:** Master DevOps & Infrastructure Engineering Manual  

---

## 1. Executive DevOps Overview

The **Food Delivery Partner Portal** employs an automated, immutable, and defense-in-depth DevOps architecture designed to achieve high release velocity, guaranteed reproducible builds, and operational resilience.

Every code commit triggers an automated pipeline spanning static code analysis, supply-chain dependency audits, parallel continuous integration, browser-based end-to-end testing, containerized packaging, automated security scanning, and remote zero-downtime deployment.

```mermaid
flowchart TD
    subgraph Developer["1. Development & Version Control"]
        Dev["Engineer Workstation"] -->|"git push origin main"| Git["GitHub Repository"]
    end

    subgraph CI["2. Continuous Integration & DevSecOps (Jenkins)"]
        Git -->|"Webhook / SCM Poll"| J_Pre["Stage 1: Secret Scan"]
        J_Pre --> J_Env["Stage 2: Toolchain Verification"]
        J_Env --> J_Parallel["Stage 3: Parallel CI"]
        
        subgraph Parallel_CI["Parallel Build & Test"]
            J_BE["Backend CI: Maven + JUnit 5 + JaCoCo (>=65%)"]
            J_FE["Frontend CI: TypeScript + Vite PWA Build"]
        end
        J_Parallel --> J_BE
        J_Parallel --> J_FE

        J_BE --> J_E2E["Stage 4: Headless Selenium E2E"]
        J_FE --> J_E2E
        J_E2E --> J_Arch["Stage 5: Converge & Archive Artifacts"]
        J_Arch --> J_Docker["Stage 6: Docker Multi-Stage Build & Trivy Scan"]
        J_Docker -->|"Push Image"| GHCR["GitHub Container Registry (GHCR)"]
    end

    subgraph CD["3. Continuous Deployment & Infrastructure as Code"]
        J_Docker --> J_Deploy["Stage 7: Remote SSH Deployment / Ansible"]
        J_Deploy -->|"Pull & Run"| CloudHost["Azure Production VM (20.2.68.23)"]
        
        subgraph VM_Runtime["Docker Compose Production Stack"]
            NGINX["Nginx Reverse Proxy (SSL / TLS Ingress)"]
            APP["Spring Boot Backend Container (:8080)"]
            DB["PostgreSQL 16 Alpine Container (:5432)"]
            NGINX --> APP
            APP --> DB
        end
        CloudHost --> VM_Runtime
    end

    subgraph Verification["4. Automated Quality Gate & Monitoring"]
        CloudHost --> J_Smoke["Stage 8: Automated Smoke Test & TLS Audit"]
        J_Smoke --> HealthCheck["/actuator/health (UP)"]
        J_Smoke --> AppHealth["/api/v1/health (UP)"]
    end
```

---

## 2. Comprehensive Toolchain Matrix

| Category | Tool | Purpose in Project | Key Configuration / Artifact |
| :--- | :--- | :--- | :--- |
| **CI/CD Automation** | **Jenkins LTS** | Central pipeline orchestrator running multi-stage declarative pipelines | `Jenkinsfile`, `docker-compose.jenkins.yml` |
| **Configuration Mgmt** | **Ansible** | Declarative host configuration, Docker provisioning, app deployment & rollback | `ansible/playbooks/`, `ansible/inventory/hosts.ini` |
| **Containerization** | **Docker** | Multi-stage, reproducible, unprivileged container runtime | `Dockerfile`, `.dockerignore` |
| **Orchestration** | **Docker Compose** | Multi-container micro-topology with healthchecks and network isolation | `docker-compose.yml`, `.env` |
| **Unit & Slice Tests** | **JUnit 5 & Mockito** | Automated unit tests, state boundary assertions, and mock API tests | `src/test/java/**`, `RegressionSuiteTest.java` |
| **Code Coverage Gate** | **JaCoCo** | Bytecode instrumentation calculating line coverage threshold (`>= 65%`) | `target/site/jacoco/`, `pom.xml` |
| **E2E Browser Testing** | **Selenium WebDriver** | Headless browser integration testing verifying UI DOM and Swagger docs | `com.project.partnerportal.e2e.*` |
| **Smoke Testing** | **Bash / PowerShell** | Post-deployment HTTP probing and health evaluation with exponential backoff | `scripts/smoke-test.sh`, `scripts/smoke-test.ps1` |
| **Vulnerability Scanning** | **Aqua Security Trivy** | Shift-left DevSecOps scanning for filesystem dependencies and container CVEs | Integrated in `Jenkinsfile` Stages 3 & 6 |
| **Container Registry** | **GHCR** | Secure, versioned, OCI-compliant image distribution repository | `ghcr.io/yashparmar1125/food-delivery-partner-portal` |
| **Build System (Backend)** | **Apache Maven** | Dependency management, compilation, test execution, and JAR packaging | `pom.xml` |
| **Build System (Frontend)** | **Vite & TypeScript** | Strict static typechecking, tree-shaking, and PWA Service Worker caching | `frontend/vite.config.ts`, `frontend/tsconfig.json` |
| **Web Ingress & SSL** | **Nginx & Let's Encrypt** | Edge reverse proxy, HTTP-to-HTTPS redirect, HSTS, and SSL certificates | `/etc/nginx/sites-available/*` |
| **Cloud Hosting** | **Microsoft Azure VM** | Linux Ubuntu LTS host executing the production containers | Standard B2s instance (`20.2.68.23`) |

---

## 3. Tool Navigation & Detailed Guides

To explore deep architectural specifications, step-by-step implementations, and runbooks for each tool, refer to the dedicated chapters:

1. [**Ansible Infrastructure as Code & Deployment Automation**](./devops/01-ansible-automation.md)
   * *Architecture, inventory, playbooks (`provision-host.yml`, `deploy-app.yml`, `rollback-app.yml`), idempotency, and CIS host hardening.*
2. [**Jenkins CI/CD Pipeline & Complete 8-Stage Deep Dive**](./devops/02-jenkins-pipeline-deep-dive.md)
   * *Pipeline architecture, agent configuration, secrets management, and thorough breakdown of all 8 pipeline execution stages.*
3. [**Automated Testing Strategy & Quality Gates**](./devops/03-testing-strategy-and-quality-gates.md)
   * *The testing pyramid: JUnit 5 unit tests, Mockito slice tests, JaCoCo coverage enforcement, headless Selenium E2E, and automated smoke testing.*
4. [**Docker Containerization & Multi-Container Orchestration**](./devops/04-docker-and-orchestration.md)
   * *Multi-stage `Dockerfile` mechanics, unprivileged execution (`appuser`), JVM container ergonomics, and `docker-compose.yml` service orchestration.*
5. [**Supplementary DevOps Tooling Deep Dive**](./devops/05-supplementary-devops-tools.md)
   * *Aqua Trivy security audits, GitHub Container Registry (GHCR), Vite PWA frontend toolchain, and Nginx reverse proxy with automated Let's Encrypt TLS.*
