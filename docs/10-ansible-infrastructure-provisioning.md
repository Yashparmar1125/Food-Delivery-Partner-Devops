# Food Delivery Partner Portal: Ansible Infrastructure Provisioning & Host Hardening (Week 13)

## 1. Architectural Overview & Philosophy

Week 13 introduces **Infrastructure as Code (IaC)** and automated configuration management using **Ansible**. Rather than manually logging into virtual machines to install runtimes and configure firewalls, Ansible orchestrates host preparation deterministically through declarative playbooks.

```
┌────────────────────────────────────────────────────────┐
│                   ANSIBLE CONTROLLER                   │
│  (Jenkins CI / Local DevOps Engineer Workstation)      │
│  ├── ansible.cfg (timeout, SSH pipelining)             │
│  ├── inventory/hosts.ini (staging, prod nodes)         │
│  └── playbooks/provision-host.yml                      │
└───────────────────────────┬────────────────────────────┘
                            │ SSH (Port 22, Key Auth)
                            ▼
┌────────────────────────────────────────────────────────┐
│                      TARGET HOST                       │
│  ├── Role 1: docker_host                               │
│  │   ├── Official Docker CE GPG keyring & apt repo     │
│  │   ├── Containerd & Docker Compose plugin            │
│  │   └── /etc/docker/daemon.json (log rotation/limits) │
│  │                                                     │
│  └── Role 2: app_provisioning                          │
│      ├── Non-root system user 'partnerapp' (UID/GID)   │
│      ├── Directory structure (/opt/food-delivery-...)  │
│      ├── Template instantiation of .env (mode 0600)    │
│      └── Custom Docker bridge network creation         │
└────────────────────────────────────────────────────────┘
```

---

## 2. Directory Structure & Modular Roles

The Ansible workspace is structured following standard industry best practices:

```
ansible/
├── ansible.cfg                          # Connection, privilege escalation and callback defaults
├── inventory/
│   ├── hosts.ini                        # Grouped host definitions (staging, production, local)
│   └── group_vars/
│       ├── all.yml                      # Global variables (paths, ports, package lists)
│       └── staging.yml                  # Staging specific overrides
├── roles/
│   ├── docker_host/                     # Reusable Docker Engine installation & hardening
│   │   ├── tasks/main.yml
│   │   └── handlers/main.yml
│   └── app_provisioning/                # Application filesystem, user, and secret setup
│       ├── tasks/main.yml
│       └── templates/.env.j2
└── playbooks/
    └── provision-host.yml               # Master orchestration playbook
```

---

## 3. Security Hardening & Idempotency

### 3.1 Idempotency Guarantee
Every Ansible module utilized (`apt`, `file`, `template`, `systemd`, `user`) guarantees idempotency. Executing `provision-host.yml` once brings the host to the desired state; re-running it produces zero changes (`changed=0`), eliminating configuration drift.

### 3.2 Privilege Separation & Secret Protection
* **Dedicated User:** Services run under unprivileged system user `partnerapp` belonging to system group `partnerapp`.
* **Permissions Boundary:** The base directory `/opt/food-delivery-partner` is set to `0750` (`rwxr-x---`), and sensitive `.env` files are restricted to `0600` (`rw-------`) with ownership locked to `partnerapp`. Root or unauthorized users cannot read database credentials or JWT signing keys.
* **Log Rotation:** The Docker daemon is configured with `json-file` log rotation capped at 50MB per file and a maximum of 3 files, preventing container stdout logs from consuming host root partitions.

---

## 4. Execution Playbook Runbook

### 4.1 Check Ansible Inventory Connectivity
```bash
ansible -i ansible/inventory/hosts.ini partner_portal -m ping
```

### 4.2 Dry-Run (Check Mode)
Simulates changes without modifying the target host:
```bash
ansible-playbook -i ansible/inventory/hosts.ini ansible/playbooks/provision-host.yml --check --diff
```

### 4.3 Execute Host Provisioning
```bash
# Provision staging environment
ansible-playbook -i ansible/inventory/hosts.ini ansible/playbooks/provision-host.yml --limit staging

# Provision local machine (development testing)
ansible-playbook -i ansible/inventory/hosts.ini ansible/playbooks/provision-host.yml --limit local -K
```

---

## 5. Verification Checklist

- [x] Modular Ansible role separation (`docker_host`, `app_provisioning`).
- [x] Host assertion verifies memory requirements prior to software installation.
- [x] Jinja2 template dynamically renders environment configurations.
- [x] Daemon hardening with log rotation and live-restore enabled.
- [x] File permission boundaries enforced (`0750` directories, `0600` secrets).
