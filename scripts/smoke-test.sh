#!/usr/bin/env bash
# ==============================================================================
# Food Delivery Partner Portal - Deployment Smoke Test Script
# ==============================================================================
set -euo pipefail

TARGET_HOST="${1:-http://localhost:8080}"
MAX_RETRIES="${2:-15}"
RETRY_INTERVAL="${3:-2}"

echo "======================================================================"
echo "Starting Automated Smoke Test against target: ${TARGET_HOST}"
echo "======================================================================"

check_endpoint() {
    local endpoint="$1"
    local expected_keyword="$2"
    local url="${TARGET_HOST}${endpoint}"
    local attempt=1

    echo "Testing endpoint: ${url}"

    while [ "$attempt" -le "$MAX_RETRIES" ]; do
        local response
        if response=$(curl -s -f -m 5 "${url}" 2>/dev/null); then
            if echo "$response" | grep -q "$expected_keyword"; then
                echo "SUCCESS: Endpoint ${endpoint} returned expected keyword '${expected_keyword}' on attempt ${attempt}."
                return 0
            fi
        fi
        echo "Attempt ${attempt}/${MAX_RETRIES} failed. Retrying in ${RETRY_INTERVAL}s..."
        sleep "$RETRY_INTERVAL"
        attempt=$((attempt + 1))
    done

    echo "ERROR: Endpoint ${endpoint} failed smoke test after ${MAX_RETRIES} attempts."
    return 1
}

# 1. Probe Spring Boot Actuator Health Probe
check_endpoint "/actuator/health" "UP"

# 2. Probe API Health Probe
check_endpoint "/api/v1/health" "UP"

# 3. Probe OpenAPI Schema Docs
check_endpoint "/api-docs" "openapi"

echo "======================================================================"
echo "ALL SMOKE TESTS PASSED! Target deployment is healthy and operational."
echo "======================================================================"
exit 0
