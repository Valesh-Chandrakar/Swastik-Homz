# Running on macOS

Complete setup guide for cloning and running the project on a MacBook.

---

## 1. Prerequisites (one-time install via Homebrew)

Install Homebrew if you don't have it: https://brew.sh

```bash
# Java 21 (works with the project's <java.version>21</java.version>)
brew install openjdk@21
echo 'export JAVA_HOME=$(/usr/libexec/java_home -v 21)' >> ~/.zshrc
echo 'export PATH=$JAVA_HOME/bin:$PATH' >> ~/.zshrc

# Maven
brew install maven

# Node.js (18+)
brew install node

# MySQL 8
brew install mysql
brew services start mysql

# (Optional) GitHub CLI
brew install gh

# Reload shell config
source ~/.zshrc
```

Verify everything:

```bash
java -version    # openjdk 21.x.x
mvn -version     # Apache Maven 3.x
node -v          # v18+ or v20+
mysql --version  # mysql Ver 8.x
```

---

## 2. Clone the repo

```bash
gh auth login        # one-time, if using gh
gh repo clone <your-username>/swastik-homz-hms
cd swastik-homz-hms

# Or with plain git:
git clone https://github.com/<your-username>/swastik-homz-hms.git
cd swastik-homz-hms
```

---

## 3. Set up MySQL

Set the root password (or use your existing one). The project's configs assume:

```
host=localhost  port=3306  user=root  password=2478553
```

If your local MySQL has a different password, either:

**A.** Change MySQL root password to `2478553`:
```bash
mysql_secure_installation   # follow prompts, set password to 2478553
```

**B.** Or update the project configs — open `backend/*/src/main/resources/application.yml` for every service and change `password: 2478553` to your password (10 services + config-server/configs).

Then create the schemas:

```bash
mysql -u root -p2478553 < database/schema.sql
```

(All 10 databases get auto-created on first run anyway, but this pre-creates tables.)

---

## 4. Make the shell scripts executable

```bash
chmod +x start-all.sh
chmod +x database/seed-accounts.sh
```

---

## 5. Start backend (3 separate terminal tabs)

### Terminal 1 — Config Server
```bash
cd backend/config-server && mvn spring-boot:run
```

### Terminal 2 — Eureka Server
```bash
cd backend/eureka-server && mvn spring-boot:run
```

### Terminal 3 — API Gateway
```bash
cd backend/api-gateway && mvn spring-boot:run
```

Wait until each one shows `Started ...Application in X seconds`.

---

## 6. Start all microservices (one command)

```bash
./start-all.sh
```

On macOS this opens 10 new Terminal tabs, one per service. Give it ~60–90 seconds.

Verify at **http://localhost:8761** — you should see all 10 services registered with Eureka.

---

## 7. Seed login accounts

Once auth-service is up:

```bash
./database/seed-accounts.sh
```

This creates the 5 demo accounts:

| Role | Email | Password |
|---|---|---|
| Admin | admin@hms.com | admin12 |
| Owner | owner@hms.com | owner12 |
| Warden | warden@hms.com | warden12 |
| Staff | staff@hms.com | staff12 |
| Student | student@hms.com | student12 |

---

## 8. Start the frontend

```bash
cd frontend/hms-ui
npm install        # first time only
npm run dev
```

Open **http://localhost:3000** and log in as **admin@hms.com / admin12** 🎯

---

## Daily restart (after first install)

```bash
# Tab 1
cd backend/config-server && mvn spring-boot:run

# Tab 2
cd backend/eureka-server && mvn spring-boot:run

# Tab 3
cd backend/api-gateway && mvn spring-boot:run

# Wait ~30s, then:
./start-all.sh

# After another ~60s:
cd frontend/hms-ui && npm run dev
```

---

## Stop everything

```bash
pkill -f 'spring-boot:run'   # kills all Spring Boot services
# Frontend: Ctrl+C in the npm run dev tab
```

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `JAVA_HOME not set` | `export JAVA_HOME=$(/usr/libexec/java_home -v 21)` and add to `~/.zshrc` |
| `Address already in use` | `lsof -i :8080` → `kill -9 <PID>` |
| Lombok `TypeTag :: UNKNOWN` | Make sure Java 21 is active (`java -version`). Pom files already pin Lombok 1.18.36. |
| MySQL `Access denied` | Update `password:` in every `application.yml` to match your local MySQL root password |
| `mysql: command not found` | `brew link --force mysql` or add `/opt/homebrew/opt/mysql/bin` to PATH |
| Services not in Eureka | Wait 60s. Restart the service. Check eureka URL in its `application.yml`. |
| Frontend "Invalid credentials" | Run `./database/seed-accounts.sh` to register accounts |
| `npm run dev` fails | You must be inside `frontend/hms-ui` — not `frontend/` |

---

## Apple Silicon (M1/M2/M3) notes

Everything works natively on ARM:
- Homebrew installs to `/opt/homebrew` instead of `/usr/local`
- Use `arch -arm64 brew install ...` if anything tries to run x86
- MySQL ARM builds work fine; no Rosetta needed
