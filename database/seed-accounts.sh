#!/usr/bin/env bash
# HMS - Re-seed auth accounts via the running auth-service.
# Run AFTER: config-server, eureka, api-gateway, auth-service are all up.
# Usage:  ./seed-accounts.sh

set -e

GATEWAY="http://localhost:9090/api/auth/register"

echo "Clearing existing auth users..."
mysql -u root -p2478553 -e "DELETE FROM hms_auth.users;" 2>/dev/null || \
    echo "  (skipped — mysql command not found, table may already be empty)"
mysql -u root -p2478553 -e "ALTER TABLE hms_auth.users AUTO_INCREMENT = 1;" 2>/dev/null || true

declare -a ACCOUNTS=(
    'admin@hms.com|9000000001|admin12|ADMIN'
    'owner@hms.com|9000000002|owner12|OWNER'
    'warden@hms.com|9000000003|warden12|WARDEN'
    'staff@hms.com|9000000007|staff12|STAFF'
    'student@hms.com|9000000004|student12|STUDENT'
)

echo ""
echo "Registering accounts via $GATEWAY ..."
for entry in "${ACCOUNTS[@]}"; do
    IFS='|' read -r email phone password role <<< "$entry"
    body=$(printf '{"email":"%s","phone":"%s","password":"%s","role":"%s"}' \
        "$email" "$phone" "$password" "$role")

    response=$(curl -s -o /tmp/hms_seed_response -w "%{http_code}" \
        -X POST "$GATEWAY" \
        -H 'Content-Type: application/json' \
        -d "$body")

    if [ "$response" = "200" ]; then
        printf "  \033[32m[OK ]\033[0m %-22s pw=%-12s role=%s\n" "$email" "$password" "$role"
    else
        msg=$(cat /tmp/hms_seed_response 2>/dev/null || echo "")
        printf "  \033[31m[ERR]\033[0m %-22s status=%s %s\n" "$email" "$response" "$msg"
    fi
done

echo ""
echo "Done. Try logging in at http://localhost:3000"
echo "Credentials:"
echo "  admin@hms.com   / admin12"
echo "  owner@hms.com   / owner12"
echo "  warden@hms.com  / warden12"
echo "  staff@hms.com   / staff12"
echo "  student@hms.com / student12"
