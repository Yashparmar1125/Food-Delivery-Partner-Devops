# Release Notes: Food Delivery Partner Portal v1.0.0
**Release Tag:** `v1.0.0`  
**Date:** September 2026  
**Build Status:** [![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/Yashparmar1125/Food-Delivery-Partner-Devops) [![Coverage](https://img.shields.io/badge/coverage->=50%-blue.svg)](https://github.com/Yashparmar1125/Food-Delivery-Partner-Devops) [![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

---

## 1. Overview

We are proud to announce the general availability of **Food Delivery Partner Portal v1.0.0**, marking the complete delivery of the 15-week academic engineering and DevOps curriculum. The platform delivers an enterprise-grade backend for food delivery fleet onboarding and management coupled with modern CI/CD automation, testing, and deployment orchestration.

---

## 2. Key Features & Milestone Deliverables

### Phase 1: Foundation, Architecture & Skeleton (Weeks 1–4)
* Formal problem specification, stakeholder matrix, MVP boundary definition, and 15-week Agile roadmap.
* 3-tier layered architecture (Spring Boot 3.2.5, Spring Data JPA, Hibernate, Actuator, OpenAPI/Swagger UI).
* Relational database schema with UUID keys and foreign key constraints on PostgreSQL 16.
* Git repository initialization with branch protection and conventional commit templates.

### Phase 2: Core MVP Features, State Machine & RBAC (Weeks 5–6)
* Complete partner CRUD APIs with uniqueness validation across email, phone, and vehicle registration.
* Dynamic multi-criteria search engine (Spring Data JPA `Specification`) supporting name, phone, vehicle type, and status filtering with pagination and sorting.
* Deterministic Finite State Machine (`PENDING` $\to$ `VERIFICATION` $\to$ `ACTIVE` $\leftrightarrow$ `SUSPENDED` $\to$ `DEACTIVATED`) with audit logging.
* Real-time operational dashboard summary metrics (`/api/v1/dashboard/summary`).
* Stateless JWT authentication with BCrypt password hashing and granular Role-Based Access Control (`ROLE_ADMIN`, `ROLE_OPS_MANAGER`, `ROLE_VIEWER`).

### Phase 3: Automated CI/CD & Browser Testing (Weeks 7–9)
* Declarative 8-stage Jenkins pipeline (`Jenkinsfile`) with tool validation, compilation, and automated test triggers.
* Containerized Jenkins controller setup (`docker-compose.jenkins.yml`).
* Automated staging deployment gate and cross-platform smoke testing scripts (Bash and PowerShell).
* Automated end-to-end browser testing suite with Selenium WebDriver 4.18.1 and headless Chrome for Swagger UI verification.

### Phase 4: Continuous Testing, Quality Gates & Containerization (Weeks 10–12)
* Automated code coverage analysis via `jacoco-maven-plugin:0.8.11` enforcing quality gate thresholds.
* Full regression test suite verifying end-to-end partner onboarding, status transitions, and queries.
* Production-hardened multi-stage `Dockerfile` with non-root security (`appuser:10001`), JVM container optimization, and Actuator healthcheck probes.
* Multi-container orchestration (`docker-compose.yml`) coordinating Spring Boot, PostgreSQL 16, and optional pgAdmin4 on an isolated bridge network with healthcheck dependencies.

### Phase 5: Infrastructure as Code & Final Release (Weeks 13–15)
* Ansible configuration management suite (`ansible/`) for automated host provisioning and system hardening.
* Zero-downtime deployment playbook (`deploy-app.yml`) with automated pre-deployment DB dumps and health probe verification.
* Automated and manual rollback playbooks (`rollback-app.yml`) for instant incident recovery.
* Comprehensive 15-week academic evaluation report (`docs/12-final-academic-evaluation-report.md`).
* Oral examination defense presentation script and 30+ viva Q&A runbook (`docs/13-viva-defense-presentation-runbook.md`).

---

## 3. Quickstart Deployment Guide

### Option A: Local Docker Compose (Recommended)
```bash
git clone https://github.com/Yashparmar1125/Food-Delivery-Partner-Devops.git
cd Food-Delivery-Partner-Devops
docker compose up -d
```
* Access Swagger UI: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
* Access Actuator Health: [http://localhost:8080/actuator/health](http://localhost:8080/actuator/health)
* Default Admin Credentials: Username: `admin` | Password: `Admin@123`

### Option B: Local Maven Run
```bash
mvn spring-boot:run "-Dspring-boot.run.profiles=dev"
```

### Option C: Ansible Automated Deployment
```bash
ansible-playbook -i ansible/inventory/hosts.ini ansible/playbooks/deploy-app.yml --limit staging
```

---

## 4. Verification Metrics
* **Total Automated Tests:** 33 / 33 Passing (100% Success Rate)
* **Code Coverage:** Quality Gate Threshold ($\ge 50\%$) Met
* **Security Rating:** OWASP / Non-Root Compliant
