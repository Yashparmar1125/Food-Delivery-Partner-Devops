# Jenkins-Based Food Delivery Partner Portal
> **Enterprise 15-Week Capstone Engineering & DevOps Lifecycle Platform**

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/Yashparmar1125/Food-Delivery-Partner-Devops)
[![Test Suite](https://img.shields.io/badge/tests-33%20passed-success.svg)](https://github.com/Yashparmar1125/Food-Delivery-Partner-Devops)
[![JaCoCo Coverage](https://img.shields.io/badge/coverage-%E2%89%A550%25%20gate%20met-blue.svg)](https://github.com/Yashparmar1125/Food-Delivery-Partner-Devops)
[![Release](https://img.shields.io/badge/release-v1.0.0-orange.svg)](RELEASE_NOTES.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

---

## 1. Executive Summary

The **Jenkins-Based Food Delivery Partner Portal** is an end-to-end, enterprise-grade fleet lifecycle management platform engineered over a comprehensive 15-week Agile and DevOps capstone curriculum. The system centralizes onboarding, identity verification, multi-criteria driver search, deterministic state machine workflows, and real-time operational dashboard analytics, backed by modern CI/CD automation, headless browser testing, containerization, and infrastructure configuration management.

---

## 2. Problem Statement & Business Impact

High-velocity food delivery platforms frequently experience operational bottlenecks and regulatory risks:
* **Fragmented Driver Records:** Spreadsheets cause duplicate accounts, data inconsistency, and onboarding delays.
* **Unregulated Driver Lifecycle:** Premature driver activations without verification background checks lead to safety liabilities.
* **Slow Dispatch Lookup:** Support teams struggle to rapidly identify couriers during live disputes or accidents.
* **Missing Auditability:** Absence of historical logs creates compliance failure risks under transportation laws.
* **Fragile Deployments:** Manual server installations result in configuration drift, downtime, and painful rollbacks.

---

## 3. Project Objectives & Core Features

* **Centralized PostgreSQL 16 Data Model:** Unified schema with UUID primary keys and strict uniqueness constraints.
* **Deterministic Finite State Machine:** Strict workflow (`PENDING` $\to$ `VERIFICATION` $\to$ `ACTIVE` $\leftrightarrow$ `SUSPENDED` $\to$ `DEACTIVATED`).
* **Sub-Second Search Engine:** Spring Data JPA `Specification` multi-criteria search (name, phone, vehicle, status) with pagination.
* **Automated Audit Logging:** Immutable capture of state changes in `status_history` and operational actions in `audit_logs`.
* **Real-Time Fleet Dashboard:** High-performance aggregation counters tracking active couriers and verification queues.
* **Spring Security & JWT RBAC:** Role-Based Access Control (`ROLE_ADMIN`, `ROLE_OPS_MANAGER`, `ROLE_VIEWER`) with BCrypt encryption.
* **Declarative Jenkins CI/CD:** 8-stage pipeline (`Jenkinsfile`) automating build, test, quality gates, artifact archiving, and smoke tests.
* **Headless Selenium WebDriver:** Automated browser verification for Swagger UI and live interactive API documentation.
* **JaCoCo Quality Gates:** Automated code coverage verification enforcing $\ge 50\%$ line coverage on business logic.
* **Multi-Stage Docker Containerization:** Hardened runtime with non-root security (`appuser:10001`) and Actuator probes.
* **Multi-Container Docker Compose:** Production stack orchestrating Spring Boot, PostgreSQL 16, and optional pgAdmin4.
* **Ansible Infrastructure as Code:** Automated host provisioning, rolling deployment, health verification, and instant rollback.

---

## 4. 15-Week Curriculum Milestone Status

| Week | Feature Area & Milestone Deliverables | Status |
|---|---|---|
| **Week 1** | Problem definition, stakeholder matrix, MVP boundary freeze | **Completed** |
| **Week 2** | Agile planning, personas, user stories (Gherkin), DoD, backlog prioritization | **Completed** |
| **Week 3** | 3-tier layered architecture, ER diagrams, OpenAPI contracts, TDRs | **Completed** |
| **Week 4** | Spring Boot skeleton, JPA entities, DTOs, Actuator, Git templates, baseline commit | **Completed** |
| **Week 5** | Partner CRUD REST endpoints, database validation, dynamic multi-criteria search | **Completed** |
| **Week 6** | State machine lifecycle, audit history, fleet dashboard counters, JWT auth & RBAC | **Completed** |
| **Week 7** | Declarative Jenkinsfile pipeline, Jenkins controller container, CI setup guide | **Completed** |
| **Week 8** | Staging deployment gates, automated cross-platform smoke tests (Bash/PowerShell) | **Completed** |
| **Week 9** | Selenium WebDriver 4.18.1 integration, headless Chrome browser E2E test suite | **Completed** |
| **Week 10** | JaCoCo code coverage plugin, regression test suite, coverage quality gate stage | **Completed** |
| **Week 11** | Hardened multi-stage Dockerfile, non-root runtime, .dockerignore, container guide | **Completed** |
| **Week 12** | Multi-container Docker Compose orchestration, healthcheck dependencies, CD stage | **Completed** |
| **Week 13** | Ansible configuration management, modular roles (`docker_host`, `app_provisioning`) | **Completed** |
| **Week 14** | Ansible automated rolling deployment, health verification probes, and rollback playbook | **Completed** |
| **Week 15** | Academic evaluation report, viva defense presentation runbook, release packaging v1.0.0 | **Completed** |

---

## 5. Technology Stack

* **Backend & API:** Java 21 LTS, Spring Boot 3.2.5 (Web, Data JPA, Security, Actuator, Validation), Springdoc OpenAPI 3.0 / Swagger UI
* **Database & Persistence:** PostgreSQL 16, Hibernate 6.x, HikariCP Connection Pool, Flyway / JPA Schema Generation
* **Testing & Quality Assurance:** JUnit 5, Mockito, MockMvc, Selenium WebDriver 4.18.1, WebDriverManager 5.7.0, JaCoCo 0.8.11
* **Continuous Integration & CD:** Jenkins LTS (Declarative Pipeline as Code), Git / GitHub Webhooks, Smoke Testing Probes
* **Containerization & Orchestration:** Docker (Multi-stage builds, non-root security), Docker Compose (healthcheck dependencies)
* **Configuration Management & IaC:** Ansible 2.15+ (Idempotent playbooks, modular roles, automated rollback handlers)

---

## 6. System Architecture

```
[ Client / Web UI / Postman / Swagger UI ]
                    │
                    ▼ (HTTP REST / JSON / Bearer JWT)
        [ Spring Security Filter Chain ]
        (JwtAuthenticationFilter, RBAC Authorization)
                    │
                    ▼
          [ REST Controller Layer ]
      (/api/v1/partners, /api/v1/dashboard, /api/v1/auth, /api/v1/health)
                    │
                    ▼ (DTOs + Jakarta Validation)
           [ Service Business Layer ]
      (PartnerService, PartnerStatusService, DashboardService, Audit)
                    │
                    ▼ (JPA Entities / Hibernate ORM)
          [ Data Repository Layer ]
          (Spring Data JPA / HikariCP Connection Pool)
                    │
                    ▼ (JDBC / TCP Port 5432)
          [ PostgreSQL 16 Relational Database ]
```

---

## 7. Documentation Directory Catalog

Comprehensive technical guides and architectural runbooks are cataloged in `docs/`:

1. [Problem Definition & Business Goals](docs/01-problem-definition.md)
2. [Agile Backlog & DevOps Lifecycle Plan](docs/02-agile-devops-plan.md)
3. [System Requirements & Layered Architecture](docs/03-requirements-architecture.md)
4. [Jenkins CI Pipeline Setup & Webhooks](docs/04-jenkins-ci-setup.md)
5. [Advanced Jenkins Deployment Pipeline & Smoke Testing](docs/05-jenkins-deployment-pipeline.md)
6. [Selenium Automated Browser Testing Guide](docs/06-selenium-automated-testing.md)
7. [Continuous Testing & JaCoCo Quality Gates](docs/07-continuous-testing-quality-gates.md)
8. [Docker Containerization Architecture & Security](docs/08-docker-containerization.md)
9. [Multi-Container Docker Compose Orchestration](docs/09-docker-compose-orchestration.md)
10. [Ansible Infrastructure Provisioning & Host Hardening](docs/10-ansible-infrastructure-provisioning.md)
11. [Ansible Automated Deployment, Verification & Rollback](docs/11-ansible-deployment-and-rollback.md)
12. [Comprehensive 15-Week Academic Evaluation Report](docs/12-final-academic-evaluation-report.md)
13. [Academic Viva Defense Presentation Guide & 30+ Oral Q&A](docs/13-viva-defense-presentation-runbook.md)

---

## 8. Getting Started & Deployment Runbook

### Option 1: Multi-Container Docker Compose (Recommended)
```bash
# Clone the repository
git clone https://github.com/Yashparmar1125/Food-Delivery-Partner-Devops.git
cd Food-Delivery-Partner-Devops

# Start application and database containers
docker compose up -d

# Verify container health
docker compose ps
```

### Option 2: Local Maven Development Run
```bash
# Set up environment variables
cp .env.example .env

# Run application with Spring Boot dev profile
mvn spring-boot:run "-Dspring-boot.run.profiles=dev"
```

### Option 3: Ansible Automated Staging Deployment
```bash
ansible-playbook -i ansible/inventory/hosts.ini ansible/playbooks/deploy-app.yml --limit staging
```

### Accessing Endpoints
* **Swagger UI:** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
* **Application Health Probe:** [http://localhost:8080/api/v1/health](http://localhost:8080/api/v1/health)
* **Spring Boot Actuator Health:** [http://localhost:8080/actuator/health](http://localhost:8080/actuator/health)
* **Default Admin Account:** Username: `admin` | Password: `Admin@123`
* **Default Ops Manager Account:** Username: `ops_manager` | Password: `Ops@123`

---

## 9. Running Automated Tests & Quality Gates

```bash
# Run complete test suite (Unit, Slice, Regression, Selenium)
mvn test

# Run Selenium E2E headless browser suite specifically
mvn test -Dtest=SwaggerUiE2ETest

# Run JaCoCo code coverage report and quality gate check
mvn clean test jacoco:report jacoco:check
```

---

## 10. DevOps Tooling & Infrastructure Manuals

Comprehensive architectural and operational guides for all DevOps tools implemented across this project:

* 📘 [**Master DevOps Engineering & Tooling Manual**](docs/DEVOPS_TOOLING_MANUAL.md) — Architectural overview, tool topology, and end-to-end integration flow.
* 🛠️ [**Chapter 1: Ansible Automation**](docs/devops/01-ansible-automation.md) — IaC, host provisioning, idempotent playbooks, deployment, and rollback.
* ⚙️ [**Chapter 2: Jenkins CI/CD Pipeline Deep Dive**](docs/devops/02-jenkins-pipeline-deep-dive.md) — Detailed technical analysis of all 8 pipeline stages.
* 🧪 [**Chapter 3: Continuous Testing & Quality Gates**](docs/devops/03-testing-strategy-and-quality-gates.md) — Testing pyramid (JUnit 5, JaCoCo, Selenium, Smoke Tests).
* 🐳 [**Chapter 4: Docker & Container Orchestration**](docs/devops/04-docker-and-orchestration.md) — Multi-stage builds, non-root runtime, and Docker Compose topology.
* 🛡️ [**Chapter 5: Supplementary DevOps Tools**](docs/devops/05-supplementary-devops-tools.md) — Aqua Trivy vulnerability scanning, GHCR, Vite PWA, and Nginx SSL/TLS.

---

## 11. Contributors & License

* **Authors:** Academic Engineering & DevOps Pair Team
* **License:** [MIT License](LICENSE)