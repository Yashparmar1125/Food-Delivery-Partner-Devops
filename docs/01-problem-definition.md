# Week 1: Problem Definition and Project Scope

**Project Title:** Jenkins-Based Food Delivery Partner Portal  
**Academic Timeline:** 15 Weeks (Target: Weeks 1–4 Foundation)  
**Document Version:** 1.0.0  
**Status:** Approved Baseline  

---

## 1. Executive Summary & Project Title

The **Jenkins-Based Food Delivery Partner Portal** is an enterprise-grade web application and DevOps demonstration platform designed to manage the end-to-end lifecycle of food delivery partners (drivers/couriers). The platform provides a centralized, secure, and audited operational management system for onboarding, verifying, tracking, and maintaining partner profiles, while establishing a modern CI/CD automation pipeline.

---

## 2. Problem Statement

In modern food delivery operations, managing a rapidly fluctuating fleet of delivery personnel involves complex workflows across onboarding, background verification, active status monitoring, regulatory compliance, and disciplinary actions. Traditional or ad-hoc management systems suffer from several severe operational bottlenecks:

1. **Manual and Fragmented Partner Management:** Delivery partner onboarding and record updates are handled across disjointed spreadsheets, paper forms, and isolated chat channels, leading to high human error rates, duplicate records, and significant administrative overhead.
2. **Difficulty Tracking Partner Status:** Real-time visibility into whether a partner is pending verification, active, suspended, or offboarded is absent. Inconsistent status updates create confusion during daily dispatch and support operations.
3. **Poor Searchability & Slow Retrieval:** Operations and support teams struggle to locate specific driver records quickly by vehicle number, phone number, government ID, or geographic zone, delaying resolutions for order disputes and safety incidents.
4. **Lack of Role-Based Workflow Control:** Unregulated status modifications allow unauthorized staff to mark unverified drivers as active or prematurely unsuspend drivers, creating regulatory liability and safety risks.
5. **Limited Operational Visibility & Analytics:** Management lacks aggregated operational summaries (e.g., ratio of active vs. suspended partners, pending verification queues), hindering capacity planning.
6. **Lack of Auditability & Traceability:** Status transitions and sensitive profile modifications lack immutable historical audit logs, making it impossible to establish accountability when compliance violations occur.
7. **Unautomated Delivery & Deployment Friction:** Development workflows lack standardized CI/CD pipelines, automated testing gates, and configuration management, resulting in brittle deployments and manual environment provisioning.

---

## 3. Target Users & Stakeholders

| User / Stakeholder | Core Responsibilities | Operational Needs | Primary Interest / Goal |
|---|---|---|---|
| **System Administrator** | Platform security, user access control, role assignments, system health monitoring, infrastructure configuration. | Centralized role-based access control (RBAC), robust security logging, system health dashboards, automated CI/CD pipelines. | High system availability, zero unauthorized access, reliable automated deployments. |
| **Operations Manager** | Driver lifecycle governance, policy enforcement, fleet capacity planning, operational audits. | Status workflow management, bulk search/filter capabilities, status transition authorization, aggregate operational dashboards. | Fast verification turnaround, strict workflow enforcement, high data integrity. |
| **Support / Operations Staff** | Daily driver support, profile data entry, document verification checks, initial record creation. | Intuitive record creation, fast lookup by phone/name/ID, clear status indicators, validation feedback. | Reduced manual data entry friction, rapid dispute and profile query lookup. |
| **Delivery Partner (Self/Subject)** | Onboarding profile submission, credential submission, status visibility. | Transparent application status updates, accurate profile records. | Fast onboarding verification and clear status visibility. |

---

## 4. Stakeholder Analysis Matrix

| Stakeholder | Responsibility | Needs | Interest Level | Power / Influence |
|---|---|---|---|---|
| **Operations Management** | Fleet oversight & governance | Accurate status summaries, auditable transitions | High | High |
| **System Administrators** | Infrastructure, security, CI/CD | Secure API endpoints, automated testing, containerized deployment | High | High |
| **Support / Verification Team** | Verification checks, partner support | Rapid search, intuitive CRUD forms, clear validation errors | High | Medium |
| **Delivery Partners** | Couriers / Drivers | Clear onboarding status and profile management | Medium | Low |
| **Academic / Project Evaluators** | Technical assessment | Clean architecture, SOLID principles, automated CI/CD pipeline | High | High |

---

## 5. Measurable Project Objectives

1. **Centralize Partner Records:** Provide a single source of truth for all delivery partner data with PostgreSQL persistence and JPA relationships.
2. **Eliminate Unauthorized Status Transitions:** Enforce a deterministic finite state machine (`PENDING` $\to$ `VERIFICATION` $\to$ `ACTIVE` $\to$ `SUSPENDED` $\to$ `DEACTIVATED`) governed by role-based access control.
3. **Sub-second Partner Search:** Enable multi-attribute search (by name, phone, email, vehicle type, and status) with parameterized database queries.
4. **Comprehensive Audit Trail:** Automatically capture every status change with timestamp, actor ID, previous status, next status, and change reason.
5. **Real-time Operational Metrics:** Expose an aggregated dashboard summary endpoint reporting total fleet size, active counts, pending queues, and suspension metrics.
6. **Automated Continuous Integration:** Establish a Jenkins CI pipeline executing compilation, unit testing, integration testing, and code quality verification on every commit.
7. **Infrastructure & Deployment Automation:** Provide Docker containerization, Ansible provisioning, and automated rollback strategies for repeatable server deployments.

---

## 6. Scope Definition

```
+-----------------------------------------------------------------------+
|                              PROJECT SCOPE                            |
+-----------------------------------------------------------------------+
|  IN SCOPE (Academic MVP Foundation)                                  |
|  - Delivery Partner CRUD (Create, Read, Update, Status Update)       |
|  - Multi-criteria Search & Pagination                                 |
|  - Role-Based Status Workflow State Machine                           |
|  - Audit Log & Status History Tracking                                |
|  - Operational Dashboard Aggregations (Summary Metrics)               |
|  - Layered Spring Boot Architecture (REST, Service, JPA, Postgres)  |
|  - OpenAPI / Swagger 3.0 Documentation                                |
|  - Comprehensive JUnit 5 & Mockito Unit / Slice Tests                 |
|  - Git Branching Strategy (main / develop / feature / bugfix)        |
|  - Automated CI/CD (Weeks 7–12), Config Management (Weeks 13–14)      |
+-----------------------------------------------------------------------+
|  OUT OF SCOPE (Explicitly Excluded)                                   |
|  - Real-time GPS driver tracking & live map coordinates              |
|  - Customer food ordering & checkout cart                             |
|  - Payment gateway processing & transaction billing                   |
|  - Restaurant menu management & order fulfillment                     |
|  - Machine learning delivery route optimization                       |
|  - Mobile iOS/Android client applications                             |
+-----------------------------------------------------------------------+
```

---

## 7. Project Constraints

* **15-Week Academic Timeline:** Implementation is strictly phased across 15 structured weekly milestones. Weeks 1–4 are dedicated to architecture, planning, and skeleton setup.
* **Local Development Environment:** Initial development is standardized on local machines running Java 17+, Maven, PostgreSQL, and Git before containerized server migration.
* **Single-Team Delivery:** All roles (Architect, Developer, QA, DevOps) are executed by a small team, necessitating modular design and clean separation of concerns.
* **Resource Optimization:** Architecture prioritizes lightweight, standard Spring Boot starters and relational structures to avoid unnecessary infrastructure bloat.

---

## 8. Measurable Success Criteria

| Criterion | Target Metric | Verification Method |
|---|---|---|
| **CRUD Reliability** | 100% of standard CRUD operations execute without data corruption | Automated JUnit tests & Postman integration collection |
| **Search Performance** | Search queries complete within < 200ms on 10,000 mock records | Database indexing & execution timing benchmarks |
| **Workflow Enforcement** | 0 illegal status transitions permitted (e.g., `PENDING` $\to$ `DEACTIVATED` rejected) | Unit tests verifying state machine validation logic |
| **Code Coverage** | $\ge 80\%$ line and branch test coverage across service layers | JaCoCo code coverage reports in build pipeline |
| **Build Automation** | Clean compilation and zero-failure build execution | Maven build (`mvn clean verify`) |
| **Deployment Readiness** | Containerized execution with healthy status probe | Docker container health check on `/actuator/health` |

---

## 9. MVP Scope Freeze

The Minimum Viable Product (MVP) for the **Food Delivery Partner Portal** is frozen as follows:

1. **Partner Profile Management:** Creation and modification of partner details (Full Name, Email, Phone Number, Vehicle Type, License Number, City, Active Status).
2. **Deterministic Lifecycle Workflow:** State-machine enforced transitions (`PENDING`, `VERIFICATION`, `ACTIVE`, `SUSPENDED`, `DEACTIVATED`) with audit trails.
3. **Search & Filter:** Search by name, phone, status, and vehicle type with pagination.
4. **Summary Dashboard:** Fleet status aggregation metrics.
5. **Secure REST API:** OpenAPI-documented RESTful endpoints backed by PostgreSQL with global exception handling and structured error responses.
