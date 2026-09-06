# Food Delivery Partner Portal: Automated Deployment, Health Verification & Rollback (Week 14)

## 1. Overview & Operational Reliability Goals

Week 14 implements high-reliability continuous delivery and incident mitigation through **Ansible automated deployment and self-healing rollback playbooks**.

```
                           [ Jenkins CD / Deployment Pipeline ]
                                            │
                                            ▼
                           ┌─────────────────────────────────┐
                           │   ansible/playbooks/deploy-app  │
                           └────────────────┬────────────────┘
                                            │
                                            ▼
                           ┌─────────────────────────────────┐
                           │  1. Pre-Deployment DB Snapshot  │
                           │  2. Rolling Container Update    │
                           │  3. Health Verification Probes  │
                           └────────────────┬────────────────┘
                                            │
                       ┌────────────────────┴────────────────────┐
                Probe Passed                              Probe Failed / Timeout
                       │                                         │
                       ▼                                         ▼
            ┌─────────────────────┐                   ┌─────────────────────┐
            │ Deployment SUCCESS  │                   │ Trigger RESCUE      │
            │ HTTP 200 / Actuator │                   │ Automated Rollback  │
            └─────────────────────┘                   └──────────┬──────────┘
                                                                 │
                                                                 ▼
                                                      ┌─────────────────────┐
                                                      │  Revert to Previous │
                                                      │  Known-Good Tag     │
                                                      │  Verify Health      │
                                                      │  Alert DevOps Team  │
                                                      └─────────────────────┘
```

---

## 2. Deployment Architecture & Safe Lifecycle Workflow

### 2.1 Pre-Deployment Safety Snapshot
Before terminating or updating the existing application container, the playbook executes:
1. `docker inspect`: Captures the currently running container image sha256/tag (`previous_image_tag`).
2. `pg_dump`: Generates a timestamped database snapshot (`db_predeploy_YYYYMMDD_HHMMSS.sql`) in `/opt/food-delivery-partner/backups/`.

### 2.2 Rolling Compose Restart
The playbook executes `docker compose up -d --remove-orphans`. Docker Compose downloads the newer image layers and recreates the `app` container with minimal socket interruption, maintaining continuous database uptime.

### 2.3 Strict Health Verification Gate
```yaml
- name: Post-deployment health verification probe loop
  ansible.builtin.uri:
    url: "http://localhost:8080/actuator/health"
    method: GET
    status_code: 200
    return_content: yes
  register: health_check_response
  until: health_check_response.status == 200 and health_check_response.json.status == 'UP'
  retries: 18
  delay: 5
```
* The loop polls the Actuator endpoint every 5 seconds up to 18 times (90-second maximum window).
* If Spring Boot encounters a fatal Bean creation error, database timeout, or port conflict, the probe loop expires and triggers the Ansible `rescue` block immediately.

---

## 3. Automated & Manual Rollback Mechanisms

### 3.1 Automated Rollback (Rescue Block)
When a post-deployment probe fails:
1. The failed container is halted: `docker compose stop app`.
2. The previous known-good image is restored.
3. The stack is restarted and probed for clean health.
4. An incident entry is appended to `/opt/food-delivery-partner/logs/deployment-incidents.log`.
5. The pipeline fails with an actionable diagnostic message, alerting the on-call team.

### 3.2 Manual Rollback Runbook
If an operator detects a subtle runtime regression post-deployment (e.g. business logic error), they can trigger an instant manual rollback:

```bash
# Roll back to the automatically detected previous version
ansible-playbook -i ansible/inventory/hosts.ini ansible/playbooks/rollback-app.yml --limit staging

# Roll back to a specific target image version
ansible-playbook -i ansible/inventory/hosts.ini ansible/playbooks/rollback-app.yml \
  --extra-vars "rollback_image=food-delivery-partner-portal:0.9.9" --limit staging
```

---

## 4. CD Pipeline Execution Commands

### 4.1 Deploying Staging Environment via CLI
```bash
ansible-playbook -i ansible/inventory/hosts.ini ansible/playbooks/deploy-app.yml --limit staging
```

### 4.2 Deploying Production Environment via CLI
```bash
ansible-playbook -i ansible/inventory/hosts.ini ansible/playbooks/deploy-app.yml --limit production
```

### 4.3 Viewing Live Deployment Incident Logs
```bash
tail -n 20 /opt/food-delivery-partner/logs/deployment-incidents.log
```

---

## 5. Verification Checklist

- [x] Pre-deployment database dump automatically created prior to container recreation.
- [x] Rolling update minimizes client connection dropouts.
- [x] Dual health probes check both Actuator system health and API operational health.
- [x] Automated rescue block triggers instant rollback on probe failure.
- [x] Standalone rollback playbook provides immediate manual disaster recovery.
