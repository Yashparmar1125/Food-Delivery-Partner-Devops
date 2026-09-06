# Jenkins-Based Food Delivery Partner Portal

> **Enterprise-Grade Food Delivery Partner Management System & DevOps Automation Demonstration Platform**

[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)]()
[![Java Version](https://img.shields.io/badge/Java-17%20%2F%2021%20LTS-blue.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Database](https://img.shields.io/badge/PostgreSQL-16%2B-blue.svg)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Phase](https://img.shields.io/badge/Phase-Weeks%201--10%20Delivered-brightgreen.svg)]()

---

## 1. Project Title & Overview

The **Jenkins-Based Food Delivery Partner Portal** is a 15-week engineering and DevOps project designed to manage the comprehensive lifecycle of food delivery partners (drivers and couriers). The platform provides a centralized, secure, and fully audited operational system for onboarding, verifying, tracking, and maintaining partner profiles while demonstrating modern CI/CD automation and configuration management practices.

---

## 2. Problem Statement

Fleet management in food delivery operations is often plagued by operational friction and governance vulnerabilities:
* **Manual & Fragmented Records:** Disjointed data across spreadsheets causes high error rates, duplicate accounts, and administrative bottlenecks.
* **Lack of Status Visibility:** Absence of real-time status tracking causes confusion between pending onboarding, active drivers, and suspended couriers.
* **Slow Search & Lookup:** Support agents struggle to find drivers rapidly during live customer disputes or vehicle incidents.
* **Unauthorized State Transitions:** In unregulated systems, drivers can be prematurely activated or unsuspended without passing background checks.
* **Lack of Auditability:** Missing historical tracking creates regulatory and compliance liability.
* **Manual Deployment Overhead:** Lack of CI/CD pipelines leads to fragile deployments and environment drift.

---

## 3. Project Objectives

* **Centralized Data Model:** Unified PostgreSQL database storing delivery partner records, credentials, and vehicle information.
* **Deterministic State Machine:** Strict lifecycle workflow (`PENDING` $\to$ `VERIFICATION` $\to$ `ACTIVE` $\to$ `SUSPENDED` $\to$ `DEACTIVATED`) enforced with role-based permissions.
* **Sub-Second Search:** High-performance multi-criteria search and pagination by name, phone, vehicle type, and status.
* **Full Audit Trail:** Automated capture of all status transitions and operational modifications.
* **Operational Dashboard:** Real-time summary metrics for active capacity and verification queues.
* **Spring Security & JWT RBAC:** Role-Based Access Control protecting sensitive mutation endpoints.
* **Automated CI/CD:** Complete Jenkins pipeline for build, test, packaging, artifact archiving, and smoke testing gates.
* **Selenium End-to-End Automation:** Headless browser test suite verifying web endpoints and documentation.
* **Continuous Testing & Quality Gates:** JaCoCo code coverage enforcement and regression test suites.

---

## 4. Feature Matrix & Milestone Status

| Feature Area | Description | Implementation Status |
|---|---|---|
| **Problem & Scope Definition** | Business analysis, stakeholder matrix, MVP boundary freeze | **Completed (Week 1)** |
| **Agile & DevOps Planning** | Personas, epics, Gherkin user stories, prioritized backlog, DoD | **Completed (Week 2)** |
| **Architecture & Data Modeling** | Layered architecture, ER diagrams, OpenAPI contracts, TDRs | **Completed (Week 3)** |
| **Project Skeleton & Setup** | Spring Boot 3.x, JPA Entities, DTOs, Actuator, Security skeleton | **Completed (Week 4)** |
| **Partner CRUD APIs & Search** | Full partner creation, retrieval, updates, validation, multi-criteria search | **Completed (Week 5)** |
| **State Machine, Dashboard & JWT** | FSM lifecycle, audit history, fleet dashboard counters, JWT auth & RBAC | **Completed (Week 6)** |
| **Jenkins CI Pipeline Baseline** | Declarative Jenkinsfile, tool validation, compilation, test execution | **Completed (Week 7)** |
| **Advanced Pipeline & Smoke Tests** | Automated deployment gates, health smoke probe scripts, failure rollback | **Completed (Week 8)** |
| **Selenium WebDriver E2E Suite** | Headless Chrome automated browser testing for Swagger UI & health | **Completed (Week 9)** |
| **Continuous Testing & JaCoCo** | Code coverage thresholds ($\ge 65\%$), regression test matrix | **Completed (Week 10)** |
| **Docker Containerization** | Multi-stage Dockerfile and Docker Compose deployment | *Planned (Weeks 11–12)* |
| **Ansible Config Management** | Automated provisioning, health monitoring, zero-downtime rollback | *Planned (Weeks 13–14)* |
| **Final Release & Viva Defense** | End-to-end evaluation, production packaging, live demo & viva | *Planned (Week 15)* |

---

## 5. Technology Stack

### Backend
* **Java:** Java 17 / 21 LTS
* **Framework:** Spring Boot 3.2.5 (Spring Web, Spring Data JPA, Spring Validation, Spring Security, Spring Actuator)
* **Build System:** Apache Maven 3.9+
* **API Documentation:** Springdoc OpenAPI 3.0 / Swagger UI
* **Testing:** JUnit 5, Mockito, MockMvc, Selenium WebDriver, WebDriverManager, H2 In-Memory DB
* **Code Coverage:** JaCoCo Maven Plugin

### Database
* **Database:** PostgreSQL 16+ (Production / Development)
* **Connection Pooling:** HikariCP
* **Object-Relational Mapping:** Hibernate 6.x

### DevOps & Infrastructure
* **Continuous Integration:** Jenkins (Declarative Pipeline `Jenkinsfile`)
* **Automated Smoke Testing:** Bash (`scripts/smoke-test.sh`) & PowerShell (`scripts/smoke-test.ps1`)
* **Containerization:** Docker & Docker Compose *(Weeks 11–12)*
* **Configuration Management:** Ansible Playbooks *(Weeks 13–14)*

---

## 6. System Architecture

The application adopts a clean, layered 3-tier architecture with clear separation of concerns:

```
[ Client / Web UI / Postman / Swagger UI ]
                    │
                    ▼ (HTTP REST / JSON / Bearer JWT)
        [ Spring Security Filter Chain ]
        (JwtAuthenticationFilter, RBAC Rules)
                    │
                    ▼
          [ REST Controller Layer ]
      (/api/v1/partners, /api/v1/dashboard, /api/v1/auth, /api/v1/health)
                    │
                    ▼ (DTOs + Validation)
           [ Service Business Layer ]
      (PartnerService, PartnerStatusService, DashboardService, Audit)
                    │
                    ▼ (JPA Entities)
          [ Data Repository Layer ]
          (Spring Data JPA / Hibernate)
                    │
                    ▼ (JDBC / HikariCP)
          [ PostgreSQL Database ]
```

---

## 7. Local Setup & Running

### Prerequisites
* **JDK:** Version 17 or 21 LTS installed (`java -version`)
* **Maven:** Version 3.9+ installed (`mvn -version`)
* **PostgreSQL:** Version 15+ installed and running on port 5432
* **Chrome / Chromium Browser:** (For Selenium E2E tests)

### Step-by-Step Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Yashparmar1125/Food-Delivery-Partner-Devops.git
   cd Food-Delivery-Partner-Devops
   ```

2. **Configure Environment Variables:**
   ```bash
   cp .env.example .env
   ```
   Configure `.env` with your local database credentials:
   ```properties
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=partner_portal_db
   DB_USERNAME=postgres
   DB_PASSWORD=1125
   ```

3. **Start the Backend:**
   ```bash
   mvn spring-boot:run "-Dspring-boot.run.profiles=dev"
   ```

4. **Access Endpoints & Documentation:**
   * **Swagger UI:** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
   * **Health Check:** [http://localhost:8080/api/v1/health](http://localhost:8080/api/v1/health)
   * **Actuator Health:** [http://localhost:8080/actuator/health](http://localhost:8080/actuator/health)
   * **Default Admin Account:** Username: `admin`, Password: `Admin@123`

---

## 8. Running Automated Tests & Quality Gates

* **Run all tests:**
  ```bash
  mvn test
  ```
* **Run Selenium E2E tests:**
  ```bash
  mvn test -Dtest=SwaggerUiE2ETest
  ```
* **Run Regression test suite:**
  ```bash
  mvn test -Dtest=RegressionSuiteTest
  ```
* **Generate JaCoCo Coverage Report:**
  ```bash
  mvn clean test jacoco:report
  ```
  Open `target/site/jacoco/index.html` to inspect visual coverage.
* **Enforce Quality Gate Check:**
  ```bash
  mvn jacoco:check
  ```

---

## 9. Contributors & License

* **Project Authors:** Academic Engineering & DevOps Pair Team
* **License:** [MIT License](LICENSE)