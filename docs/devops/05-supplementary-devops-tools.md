# Chapter 5: Supplementary DevOps Tooling Deep Dive

**Project:** Food Delivery Partner Portal & Fleet Management Platform  
**Component:** Security Scanning, Registries, Frontend Tooling, and Web Ingress  

---

## 1. Executive Summary & Purpose

In addition to the primary orchestration engines (Ansible, Jenkins, Docker, and Selenium), an enterprise-grade cloud system relies on specialized supporting tools for **security scanning**, **artifact distribution**, **frontend optimization**, and **network ingress**.

This chapter details the purpose, implementation, and operational role of each supplementary tool.

---

## 2. Aqua Security Trivy (Vulnerability & Security Scanner)

### 2.1 Purpose & Role in DevSecOps
**Trivy** is a comprehensive, open-source security scanner that detects:
1. Vulnerabilities in software dependencies (CVEs).
2. Misconfigurations in infrastructure code (IaC).
3. Secret leaks in filesystem code.

### 2.2 Pipeline Integration
In our `Jenkinsfile`, Trivy is integrated at two distinct quality gates:
1. **Filesystem Dependency Scan (Stage 3):**
   ```bash
   docker run --rm -v $(pwd):/workspace aquasec/trivy fs /workspace/pom.xml \
       --severity HIGH,CRITICAL --scanners vuln --exit-code 0
   ```
   * Scans `pom.xml` dependency declarations against known vulnerability databases (NVD, GitHub Security Advisory).
2. **Container Image Scan (Stage 6):**
   ```bash
   docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image \
       --severity HIGH,CRITICAL --scanners vuln ${IMAGE_NAME}:${BUILD_NUMBER}
   ```
   * Inspects the compiled container filesystem, examining both base OS Ubuntu Jammy packages and packaged JAR dependencies before images are pushed to production.

---

## 3. GitHub & GitHub Container Registry (GHCR)

### 3.1 Purpose & Architecture
**GitHub Container Registry (GHCR)** is an Open Container Initiative (OCI)-compliant container registry hosted on GitHub infrastructure (`ghcr.io`).

### 3.2 Key Advantages Over Local Building:
* **Decoupling Build from Deployment:** Jenkins builds and tests the image once, pushes it to GHCR, and production VMs pull the verified image. The production VM never runs compilers or Maven builds.
* **Granular Token Permissions:** Uses fine-grained personal access tokens with `read:packages` on deployment hosts and `write:packages` on Jenkins, enforcing strict privilege separation.
* **Immutable Versioning:** Each build is tagged with a unique, monotonically increasing build number (`:42`, `:43`) as well as `:latest`, enabling instant rollback to any prior release.

---

## 4. Vite & Progressive Web App (PWA) Toolchain

### 4.1 Purpose & Architecture
The frontend is built using **Vite 6** with **TypeScript** and **vite-plugin-pwa (Workbox)**.

### 4.2 Key Capabilities:
* **Instant Cold Starts & Fast HMR:** Leverages native ES modules during development for millisecond-level feedback loops.
* **Tree-Shaking & Minification:** Rolls up production JavaScript into optimized chunks with Gzip/Brotli compression.
* **Offline Resilience via Service Workers:**
  * Uses `vite-plugin-pwa` to generate `sw.js` with Workbox runtime caching.
  * Precaches 54 static application routes and assets (~930 KiB), allowing delivery partners to access their profile and review past trips even during intermittent mobile cellular disconnects.

---

## 5. Nginx Reverse Proxy & Let's Encrypt SSL/TLS Ingress

### 5.1 Purpose & Architecture
**Nginx** operates as the front-facing HTTP/HTTPS reverse proxy on the Azure Linux virtual machine (`20.2.68.23`), sitting between the public internet and backend Docker containers.

### 5.2 Server Blocks Configured:
1. `api.dpa.yashparmar.in`: Proxies REST API and Actuator traffic to the Spring Boot backend container (`http://127.0.0.1:8080`).
2. `jenkins.dpa.yashparmar.in`: Proxies CI/CD web traffic and incoming webhooks to the Jenkins container (`http://127.0.0.1:8081`).

### 5.3 Automated Let's Encrypt TLS:
* **Certbot Automated Renewal:** TLS 1.3 certificates are provisioned via Let's Encrypt with automated renewal timers.
* **HSTS & Security Headers:**
  ```nginx
  add_header Strict-Transport-Security "max-age=63072000; includeSubDomains" always;
  add_header X-Frame-Options "SAMEORIGIN" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-XSS-Protection "1; mode=block" always;
  add_header Referrer-Policy "no-referrer-when-downgrade" always;
  ```
* **CORS Governance:** Passes appropriate `Access-Control-Allow-Origin` headers allowing the frontend PWA at `https://dpa.yashparmar.in` to communicate with the REST API.
