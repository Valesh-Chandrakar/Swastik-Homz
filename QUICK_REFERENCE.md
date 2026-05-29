# 📚 Swastik Homz HMS — Complete Reference

One-stop guide for running, debugging, and managing this project on **Windows** and **macOS**.

---

## 📑 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Prerequisites](#2-prerequisites)
3. [First-Time Setup](#3-first-time-setup)
4. [Daily Startup](#4-daily-startup)
5. [Login Credentials](#5-login-credentials)
6. [URLs & Ports](#6-urls--ports)
7. [Database Operations](#7-database-operations)
8. [User Management Scripts](#8-user-management-scripts)
9. [Git & GitHub](#9-git--github)
10. [Stopping Services](#10-stopping-services)
11. [Troubleshooting](#11-troubleshooting)

---

## 1. Project Overview

**Swastik Homz Raipur** — A hostel management system built with:

- **Backend:** 13 Spring Boot microservices (Config Server, Eureka, API Gateway + 10 business services)
- **Frontend:** React 18 + Vite + Tailwind CSS + Redux Toolkit
- **Database:** MySQL 8 (one DB per service)
- **Auth:** JWT-based, role-based access (ADMIN / OWNER / WARDEN / STUDENT / STAFF)

```
Project Root/
├── backend/              # All Spring Boot services
│   ├── config-server/    # Port 8888
│   ├── eureka-server/    # Port 8761
│   ├── api-gateway/      # Port 9090
│   ├── auth-service/     # Port 8081
│   ├── user-service/     # Port 8082
│   ├── hostel-service/   # Port 8083
│   ├── room-service/     # Port 8084
│   ├── allocation-service/   # Port 8085
│   ├── payment-service/  # Port 8086
│   ├── complaint-service/    # Port 8087
│   ├── attendance-service/   # Port 8088
│   ├── visitor-service/  # Port 8089
│   └── notification-service/ # Port 8090
├── frontend/hms-ui/      # React app (port 3000)
├── database/             # schema.sql, sample-data.sql, seed scripts
├── start-all.ps1         # Windows: starts all 10 microservices
├── start-all.sh          # macOS/Linux: starts all 10 microservices
└── QUICK_REFERENCE.md    # ← you are here
```

---

## 2. Prerequisites

### Windows

Install:
- **Java 21+** (Java 24 also works — Lombok 1.18.36 is configured)
- **Maven 3.8+**
- **Node.js 18+**
- **MySQL 8.0+** running on localhost:3306

Verify:
```powershell
java -version
mvn -version
node -v
mysql --version
```

If `mysql` is not found, add to PATH for current session:
```powershell
$env:PATH += ";C:\Program Files\MySQL\MySQL Server 8.0\bin"
```

Or permanently: **Win → "Environment Variables" → User Path → New → paste the bin path**.

### macOS

Install via Homebrew:
```bash
# Install Homebrew if needed: https://brew.sh
brew install openjdk@21 maven node mysql
brew services start mysql

# Set JAVA_HOME (zsh — macOS default)
echo 'export JAVA_HOME=$(/usr/libexec/java_home -v 21)' >> ~/.zshrc
echo 'export PATH=$JAVA_HOME/bin:$PATH' >> ~/.zshrc
source ~/.zshrc
```

Verify:
```bash
java -version    # openjdk 21.x.x
mvn -version     # Apache Maven 3.x
node -v          # v18+ or v20+
mysql --version  # mysql Ver 8.x
```

---

## 3. First-Time Setup

### Step 1 — Clone the repo

```bash
# Windows or Mac (same)
git clone https://github.com/<your-username>/swastik-homz-hms.git
cd swastik-homz-hms
```

### Step 2 — Set MySQL password

The project configs assume `root` / `2478553`. Either match this password, or update configs.

**Option A — Set MySQL root password to `2478553`:**

Windows: use MySQL Workbench → Server → Users and Privileges → change root password.

macOS:
```bash
mysql -u root -p
> ALTER USER 'root'@'localhost' IDENTIFIED BY '2478553';
> FLUSH PRIVILEGES;
> exit
```

**Option B — Find/replace `2478553` in all configs with your password:**

Windows (PowerShell):
```powershell
Get-ChildItem -Path backend -Recurse -Filter "application.yml" |
  ForEach-Object { (Get-Content $_.FullName) -replace 'password: 2478553', 'password: YOUR_PWD' | Set-Content $_.FullName }
Get-ChildItem -Path backend/config-server/src/main/resources/configs -Filter "*.yml" |
  ForEach-Object { (Get-Content $_.FullName) -replace 'password: 2478553', 'password: YOUR_PWD' | Set-Content $_.FullName }
```

macOS:
```bash
grep -rl "password: 2478553" backend/ | xargs sed -i '' 's/password: 2478553/password: YOUR_PWD/g'
```

### Step 3 — Initialize databases (optional)

JPA auto-creates databases on first run, but to pre-create them with sample structure:

```bash
# Windows
mysql -u root -p2478553 -e "source database/schema.sql"

# Mac
mysql -u root -p2478553 < database/schema.sql
```

### Step 4 — Make scripts executable (Mac only)

```bash
chmod +x start-all.sh database/seed-accounts.sh
```

### Step 5 — Install frontend dependencies

```bash
cd frontend/hms-ui
npm install
cd ../..
```

---

## 4. Daily Startup

You need **5 terminal windows/tabs**. Start them in this order:

### Windows (PowerShell)

```powershell
# Terminal 1 — Config Server
cd "backend\config-server"; mvn spring-boot:run
# Wait for: "Started ConfigServerApplication"

# Terminal 2 — Eureka Server
cd "backend\eureka-server"; mvn spring-boot:run
# Wait for: "Started EurekaServerApplication"

# Terminal 3 — API Gateway
cd "backend\api-gateway"; mvn spring-boot:run
# Wait for: "Started ApiGatewayApplication"

# Terminal 4 — All 10 microservices (one command)
.\start-all.ps1
# Wait ~60s for them all to register with Eureka

# Terminal 5 — Frontend
cd "frontend\hms-ui"; npm run dev
```

### macOS (Terminal.app)

```bash
# Tab 1 — Config Server
cd backend/config-server && mvn spring-boot:run

# Tab 2 — Eureka Server (Cmd+T for new tab)
cd backend/eureka-server && mvn spring-boot:run

# Tab 3 — API Gateway
cd backend/api-gateway && mvn spring-boot:run

# Tab 4 — All microservices (auto-opens 10 more tabs)
./start-all.sh

# Tab 5 — Frontend
cd frontend/hms-ui && npm run dev
```

### Verify everything is up

| Check | URL | Expected |
|---|---|---|
| Eureka | http://localhost:8761 | 10 services listed (auth-service, user-service, etc.) |
| Gateway | http://localhost:9090/actuator/health | `{"status":"UP"}` |
| Frontend | http://localhost:3000 | Login page loads |

---

## 5. Login Credentials

Pattern: `<role>@hms.com` / `<role>12`

| Role | Email | Password |
|---|---|---|
| **Admin** | admin@hms.com | admin12 |
| **Owner** | owner@hms.com | owner12 |
| **Warden** | warden@hms.com | warden12 |
| **Staff** | staff@hms.com | staff12 |
| **Student** | student@hms.com | student12 |

---

## 6. URLs & Ports

| Service | URL | Port |
|---|---|---|
| Frontend (React) | http://localhost:3000 | 3000 |
| API Gateway | http://localhost:9090 | 9090 |
| Eureka Dashboard | http://localhost:8761 | 8761 |
| Config Server | http://localhost:8888 | 8888 |
| Auth Service | (via gateway) | 8081 |
| User Service | (via gateway) | 8082 |
| Hostel Service | (via gateway) | 8083 |
| Room Service | (via gateway) | 8084 |
| Allocation Service | (via gateway) | 8085 |
| Payment Service | (via gateway) | 8086 |
| Complaint Service | (via gateway) | 8087 |
| Attendance Service | (via gateway) | 8088 |
| Visitor Service | (via gateway) | 8089 |
| Notification Service | (via gateway) | 8090 |
| MySQL | localhost | 3306 |

---

## 7. Database Operations

### View all auth users

```bash
mysql -u root -p2478553 -e "SELECT id, email, role, active FROM hms_auth.users;"
```

### Clear all auth users (start fresh)

```bash
mysql -u root -p2478553 -e "TRUNCATE TABLE hms_auth.users;"
```

### Drop and recreate everything

```bash
# Windows / Mac
mysql -u root -p2478553 -e "
DROP DATABASE IF EXISTS hms_auth;
DROP DATABASE IF EXISTS hms_user;
DROP DATABASE IF EXISTS hms_hostel;
DROP DATABASE IF EXISTS hms_room;
DROP DATABASE IF EXISTS hms_allocation;
DROP DATABASE IF EXISTS hms_payment;
DROP DATABASE IF EXISTS hms_complaint;
DROP DATABASE IF EXISTS hms_attendance;
DROP DATABASE IF EXISTS hms_visitor;
DROP DATABASE IF EXISTS hms_notification;
"
# JPA recreates them on next service startup
```

### Delete a specific user

```bash
mysql -u root -p2478553 -e "DELETE FROM hms_auth.users WHERE email='someone@hms.com';"
```

---

## 8. User Management Scripts

### Create / re-seed all 5 accounts

**Windows:**
```powershell
cd database
.\seed-accounts.ps1
```

**macOS:**
```bash
cd database
./seed-accounts.sh
```

### Manually register one user (curl / Invoke-RestMethod)

**Windows:**
```powershell
Invoke-RestMethod -Uri http://localhost:9090/api/auth/register `
  -Method POST -ContentType application/json `
  -Body '{"email":"admin@hms.com","phone":"9000000001","password":"admin12","role":"ADMIN"}'
```

**macOS / Linux:**
```bash
curl -X POST http://localhost:9090/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@hms.com","phone":"9000000001","password":"admin12","role":"ADMIN"}'
```

### Roles available
`ADMIN` · `OWNER` · `WARDEN` · `STAFF` · `STUDENT`

### Phone format
Must be exactly **10 digits**, starting with 6, 7, 8, or 9 (Indian mobile pattern).

### See the actual error from a failed registration

**Windows:**
```powershell
try {
  Invoke-RestMethod -Uri http://localhost:9090/api/auth/register -Method POST -ContentType application/json -Body '{"email":"x@y.com","phone":"9000000099","password":"test12","role":"STUDENT"}'
} catch {
  $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
  $reader.ReadToEnd()
}
```

**macOS:**
```bash
curl -v -X POST http://localhost:9090/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"x@y.com","phone":"9000000099","password":"test12","role":"STUDENT"}'
```

---

## 9. Git & GitHub

### Initial push (once)

```bash
cd "<project-root>"
git init
git branch -M main
git add .
git commit -m "Initial commit: Swastik Homz Raipur HMS"

# Using GitHub CLI:
gh auth login
gh repo create swastik-homz-hms --public --source=. --remote=origin --description "Hostel Management System - microservices + React"
git push -u origin main

# OR manually (create empty repo at https://github.com/new first):
git remote add origin https://github.com/<USERNAME>/swastik-homz-hms.git
git push -u origin main
```

### Daily git workflow

```bash
git status                     # see changes
git add .                      # stage all
git add path/to/specific.file  # or stage specific
git commit -m "feat: ..."      # commit
git push                       # push to GitHub

git pull                       # pull latest before starting work
```

### Clone on another machine (e.g. MacBook)

```bash
git clone https://github.com/<USERNAME>/swastik-homz-hms.git
cd swastik-homz-hms
# Then follow "First-Time Setup" (section 3) above
```

---

## 10. Stopping Services

### Windows

```powershell
# Kill all Java processes (graceful)
Get-Process java -ErrorAction SilentlyContinue | Stop-Process -Force

# Kill Node (frontend)
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Or close each PowerShell window manually (Ctrl+C, then close)
```

### macOS / Linux

```bash
# Kill all running Spring Boot services
pkill -f 'spring-boot:run'

# Kill frontend
pkill -f 'vite'

# Or in each tab: Ctrl+C
```

### Stop a specific port

**Windows:**
```powershell
netstat -ano | findstr :8080
taskkill /PID <pid> /F
```

**macOS:**
```bash
lsof -i :8080
kill -9 <PID>
```

---

## 11. Troubleshooting

| Problem | Solution |
|---|---|
| `Lombok TypeTag :: UNKNOWN` | Pom files pin Lombok 1.18.36 + Java 21 target. Run `mvn clean spring-boot:run` to refresh. |
| `Address already in use` | A service is still running. `netstat -ano \| findstr :PORT` (Win) / `lsof -i :PORT` (Mac), then kill it. |
| Services not in Eureka | Wait 60 seconds. Then refresh http://localhost:8761. Make sure Eureka started first. |
| Frontend can't reach backend | API Gateway must be on port **9090**. Check `frontend/hms-ui/vite.config.js` proxy target. |
| `npm run dev` "Missing script: dev" | You're in the wrong folder — `cd` into `frontend/hms-ui` (not `frontend/`). |
| Login fails with "Invalid credentials" | Run the seed script (`seed-accounts.ps1` or `.sh`) to recreate accounts. |
| `Email already registered` (400) | `DELETE FROM hms_auth.users WHERE email='...';` then re-register. |
| `mysql: command not found` | Windows: add `C:\Program Files\MySQL\MySQL Server 8.0\bin` to PATH. Mac: `brew link --force mysql`. |
| Page refreshes infinitely | Old bug, now fixed — pull latest from main. The axios interceptor no longer redirects when already on login. |
| Two error toasts on invalid login | Old bug, fixed via stable toast IDs. Pull latest. |
| "Profile not found" after register | Click the Profile from header avatar → fill out the "Complete Your Profile" form. |
| Hostel dropdown empty on login | API Gateway needs the public-path fix for `/api/hostels` (already applied). Restart api-gateway. |

---

## 📝 Quick Cheat Sheet

```bash
# === DAILY STARTUP ===
# 1. config-server      → mvn spring-boot:run  (tab 1)
# 2. eureka-server      → mvn spring-boot:run  (tab 2)
# 3. api-gateway        → mvn spring-boot:run  (tab 3)
# 4. ./start-all.sh     OR     .\start-all.ps1 (tab 4)
# 5. npm run dev in frontend/hms-ui            (tab 5)

# === LOGIN ===
# admin@hms.com / admin12
# http://localhost:3000

# === RE-SEED USERS ===
# Windows:  .\database\seed-accounts.ps1
# Mac:      ./database/seed-accounts.sh

# === STOP EVERYTHING ===
# Windows:  Get-Process java | Stop-Process -Force
# Mac:      pkill -f 'spring-boot:run'

# === GIT PUSH ===
# git add . && git commit -m "msg" && git push
```

---

## ✨ Latest Bug Fixes & Features

- ✅ Dashboard wired to real APIs (live stats across all hostels)
- ✅ Added "Vacant Rooms" stat tile
- ✅ Hostel phone field now accepts landlines (8–15 chars)
- ✅ Separate `/students` (STUDENT only) and `/users` (other roles) pages
- ✅ Emergency contact mandatory for students (red-bordered section)
- ✅ Profile removed from sidebar — click avatar in header to access
- ✅ Single toast on login errors (StrictMode dedup)
- ✅ Auto-select first hostel on login screen
- ✅ "Complete Your Profile" form for newly registered users
- ✅ Electricity consumption tracker for students (charts + monthly bills)
- ✅ Fixed infinite refresh loop on login page
- ✅ Lombok + Java 24 compatibility (1.18.36 + `--release 21`)
- ✅ Pink/rose girls-hostel theme throughout

---

**Last updated:** 2026-05-25
