#!/usr/bin/env bash
# HMS - Start all microservices (macOS / Linux)
# Run from project root AFTER config-server, eureka-server, and api-gateway are up.
# Usage:  ./start-all.sh

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BACKEND_DIR="$SCRIPT_DIR/backend"

SERVICES=(
    "auth-service"
    "user-service"
    "hostel-service"
    "room-service"
    "allocation-service"
    "payment-service"
    "complaint-service"
    "attendance-service"
    "visitor-service"
    "notification-service"
)

echo "Starting HMS Microservices..."

# Detect terminal app for opening new windows (macOS only).
# Falls back to running services in the background with logs to ./logs/
LOG_DIR="$SCRIPT_DIR/logs"
mkdir -p "$LOG_DIR"

if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS: open each service in a new Terminal tab
    for svc in "${SERVICES[@]}"; do
        if [ -d "$BACKEND_DIR/$svc" ]; then
            echo "  → opening tab for $svc"
            osascript <<EOF
tell application "Terminal"
    do script "cd '$BACKEND_DIR/$svc' && mvn spring-boot:run"
end tell
EOF
            sleep 1
        fi
    done
else
    # Linux / generic: run in background, log to file
    for svc in "${SERVICES[@]}"; do
        if [ -d "$BACKEND_DIR/$svc" ]; then
            echo "  → starting $svc (log: $LOG_DIR/$svc.log)"
            (cd "$BACKEND_DIR/$svc" && nohup mvn spring-boot:run > "$LOG_DIR/$svc.log" 2>&1 &)
            sleep 1
        fi
    done
fi

cat <<EOF

All services started.
Eureka Dashboard: http://localhost:8761
API Gateway:      http://localhost:9090
Frontend:         http://localhost:3000

To stop all services:
  pkill -f 'spring-boot:run'
EOF
