# HMS - Hostel Management System

A production-ready, microservices-based Hostel Management System built with Spring Boot (backend) and React + Vite (frontend).

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     React Frontend (Port 3000)                  │
└───────────────────────────────┬─────────────────────────────────┘
                                │ HTTP
┌───────────────────────────────▼─────────────────────────────────┐
│                   API Gateway (Port 8080)                       │
│              JWT Auth Filter + CORS + Routing                   │
└────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬──────────┘
     │     │     │     │     │     │     │     │     │
  auth  user hostel room alloc pay  comp  att  visit notif
  8081 8082 8083 8084 8085 8086 8087 8088 8089 8090
     │     │     │     │     │     │     │     │     │
  ┌──▼─────▼─────▼─────▼─────▼─────▼─────▼─────▼─────▼──┐
  │           Eureka Service Discovery (Port 8761)        │
  └────────────────────────────────────────────────────────┘
  ┌──────────────────────────────────────────────────────────┐
  │           Config Server (Port 8888)                      │
  └──────────────────────────────────────────────────────────┘
```

---

## Prerequisites

- **Java 17+**
- **Maven 3.8+**
- **MySQL 8.0+** (running on port 3306)
- **Node.js 18+** and **npm**

---

## MySQL Setup

Ensure MySQL is running with:
- Host: `localhost`
- Port: `3306`
- Username: `root`
- Password: `2478553`

All databases are auto-created by Spring JPA (`createDatabaseIfNotExist=true`).

To pre-populate with sample data, run:

```sql
mysql -u root -p2478553 < database/schema.sql
mysql -u root -p2478553 < database/sample-data.sql
```

---

## Running the Backend

Start services **in this exact order**:

### 1. Config Server (Port 8888)
```bash
cd backend/config-server
mvn spring-boot:run
```

### 2. Eureka Server (Port 8761)
```bash
cd backend/eureka-server
mvn spring-boot:run
```

### 3. API Gateway (Port 8080)
```bash
cd backend/api-gateway
mvn spring-boot:run
```

### 4. Microservices (any order, all in parallel)
```bash
cd backend/auth-service       && mvn spring-boot:run
cd backend/user-service       && mvn spring-boot:run
cd backend/hostel-service     && mvn spring-boot:run
cd backend/room-service       && mvn spring-boot:run
cd backend/allocation-service && mvn spring-boot:run
cd backend/payment-service    && mvn spring-boot:run
cd backend/complaint-service  && mvn spring-boot:run
cd backend/attendance-service && mvn spring-boot:run
cd backend/visitor-service    && mvn spring-boot:run
cd backend/notification-service && mvn spring-boot:run
```

### PowerShell: Start all services at once (after Config+Eureka+Gateway are up)
```powershell
$services = @("auth-service","user-service","hostel-service","room-service","allocation-service","payment-service","complaint-service","attendance-service","visitor-service","notification-service")
foreach ($svc in $services) {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'backend\$svc'; mvn spring-boot:run"
}
```

---

## Running the Frontend

```bash
cd frontend/hms-ui
npm install
npm run dev
```

App runs at: **http://localhost:3000**

---

## Service Registry

Visit Eureka dashboard after startup: **http://localhost:8761**

---

## Default Login Credentials

All passwords: **`password123`**

| Role    | Email              |
|---------|--------------------|
| ADMIN   | admin@hms.com      |
| OWNER   | owner@hms.com      |
| WARDEN  | warden@hms.com     |
| STUDENT | student1@hms.com   |
| STUDENT | student2@hms.com   |
| STAFF   | staff@hms.com      |

---

## API Endpoints Summary

All requests go through the API Gateway at `http://localhost:9090`

### Auth Service (`/api/auth`)
| Method | Endpoint              | Description        |
|--------|-----------------------|--------------------|
| POST   | /api/auth/login       | Login              |
| POST   | /api/auth/register    | Register new user  |
| GET    | /api/auth/user/{id}   | Get user by ID     |
| PUT    | /api/auth/user/{id}/activate   | Activate user  |
| PUT    | /api/auth/user/{id}/deactivate | Deactivate user|

### User Service (`/api/users`)
| Method | Endpoint                    | Description            |
|--------|-----------------------------|------------------------|
| POST   | /api/users                  | Create user profile    |
| GET    | /api/users                  | List all users (paged) |
| GET    | /api/users/{id}             | Get user by ID         |
| GET    | /api/users/auth/{authId}    | Get by auth ID         |
| GET    | /api/users/hostel/{id}      | Users by hostel        |
| PUT    | /api/users/{id}             | Update user            |
| DELETE | /api/users/{id}             | Delete user            |
| POST   | /api/users/{id}/id-proof    | Upload ID proof        |

### Hostel Service (`/api/hostels`)
| Method | Endpoint                        | Description       |
|--------|---------------------------------|-------------------|
| POST   | /api/hostels                    | Create hostel     |
| GET    | /api/hostels                    | List hostels      |
| GET    | /api/hostels/{id}               | Get hostel        |
| PUT    | /api/hostels/{id}               | Update hostel     |
| DELETE | /api/hostels/{id}               | Delete hostel     |
| GET    | /api/hostels/owner/{ownerId}    | By owner          |
| POST   | /api/hostels/{id}/floors        | Add floor         |
| GET    | /api/hostels/{id}/floors        | Get floors        |

### Room Service (`/api/rooms`)
| Method | Endpoint                              | Description      |
|--------|---------------------------------------|------------------|
| POST   | /api/rooms                            | Create room      |
| GET    | /api/rooms/{id}                       | Get room         |
| GET    | /api/rooms/hostel/{hostelId}          | Rooms by hostel  |
| GET    | /api/rooms/hostel/{hostelId}/available| Available rooms  |
| PUT    | /api/rooms/{id}                       | Update room      |
| PUT    | /api/rooms/{id}/beds?change=-1        | Update beds      |
| DELETE | /api/rooms/{id}                       | Delete room      |

### Allocation Service (`/api/allocations`)
| Method | Endpoint                              | Description         |
|--------|---------------------------------------|---------------------|
| POST   | /api/allocations                      | Allocate student    |
| PUT    | /api/allocations/{id}/vacate          | Vacate student      |
| GET    | /api/allocations/{id}                 | Get allocation      |
| GET    | /api/allocations/student/{id}/active  | Active allocation   |
| GET    | /api/allocations/hostel/{id}          | By hostel           |
| GET    | /api/allocations/room/{id}            | By room             |

### Payment Service (`/api/payments`)
| Method | Endpoint                                    | Description          |
|--------|---------------------------------------------|----------------------|
| POST   | /api/payments                               | Create payment       |
| GET    | /api/payments/{id}                          | Get payment          |
| GET    | /api/payments/student/{studentId}           | Student payments     |
| GET    | /api/payments/hostel/{hostelId}             | Hostel payments      |
| GET    | /api/payments/hostel/{id}/pending           | Pending payments     |
| PUT    | /api/payments/{id}/pay                      | Mark paid            |
| PUT    | /api/payments/{id}/electricity              | Add electricity bill |

### Complaint Service (`/api/complaints`)
| Method | Endpoint                                        | Description       |
|--------|-------------------------------------------------|-------------------|
| POST   | /api/complaints                                 | Raise complaint   |
| GET    | /api/complaints/{id}                            | Get complaint     |
| GET    | /api/complaints/student/{id}                    | By student        |
| GET    | /api/complaints/hostel/{id}                     | By hostel         |
| GET    | /api/complaints/warden/{id}                     | By warden         |
| PUT    | /api/complaints/{id}/assign?wardenId=3          | Assign            |
| PUT    | /api/complaints/{id}/resolve?resolution=fixed   | Resolve           |
| PUT    | /api/complaints/{id}/close                      | Close             |

### Attendance Service (`/api/attendance`)
| Method | Endpoint                                   | Description         |
|--------|--------------------------------------------|---------------------|
| POST   | /api/attendance                            | Mark attendance     |
| POST   | /api/attendance/bulk                       | Bulk mark           |
| PUT    | /api/attendance/{id}                       | Update attendance   |
| GET    | /api/attendance/student/{id}               | Student records     |
| GET    | /api/attendance/hostel/{id}/date/{date}    | By hostel+date      |
| GET    | /api/attendance/student/{id}/stats         | Stats               |

### Visitor Service (`/api/visitors`)
| Method | Endpoint                               | Description        |
|--------|----------------------------------------|--------------------|
| POST   | /api/visitors                          | Register visitor   |
| PUT    | /api/visitors/{id}/approve             | Approve            |
| PUT    | /api/visitors/{id}/reject              | Reject             |
| PUT    | /api/visitors/{id}/exit                | Mark exit          |
| GET    | /api/visitors/student/{id}             | By student         |
| GET    | /api/visitors/hostel/{id}              | By hostel          |
| GET    | /api/visitors/hostel/{id}/pending      | Pending approvals  |

### Notification Service (`/api/notifications`)
| Method | Endpoint                               | Description        |
|--------|----------------------------------------|--------------------|
| POST   | /api/notifications/send                | Send notifications |
| GET    | /api/notifications/user/{id}           | All for user       |
| GET    | /api/notifications/user/{id}/unread    | Unread             |
| GET    | /api/notifications/user/{id}/count     | Unread count       |
| PUT    | /api/notifications/{id}/read           | Mark read          |
| PUT    | /api/notifications/user/{id}/read-all  | Mark all read      |

---

## Project Structure

```
Hostel Management System/
├── backend/
│   ├── config-server/          # Spring Cloud Config Server (8888)
│   ├── eureka-server/          # Netflix Eureka Registry (8761)
│   ├── api-gateway/            # Spring Cloud Gateway (8080)
│   ├── auth-service/           # JWT Auth + User credentials (8081)
│   ├── user-service/           # User profiles + ID proofs (8082)
│   ├── hostel-service/         # Hostel + Floor management (8083)
│   ├── room-service/           # Room management (8084)
│   ├── allocation-service/     # Bed allocation (8085)
│   ├── payment-service/        # Rent + Electricity billing (8086)
│   ├── complaint-service/      # Complaint lifecycle (8087)
│   ├── attendance-service/     # Attendance tracking (8088)
│   ├── visitor-service/        # Visitor entry/approval (8089)
│   └── notification-service/   # In-app notifications + scheduler (8090)
├── frontend/
│   └── hms-ui/                 # React + Vite + Tailwind frontend
└── database/
    ├── schema.sql              # All DB schemas
    └── sample-data.sql         # Sample data for testing
```

---

## Key Features

- **JWT Authentication** — stateless, token-based auth via API Gateway filter
- **Role-Based UI** — sidebar navigation adapts per role (ADMIN/OWNER/WARDEN/STUDENT/STAFF)
- **Dark Mode** — toggle between light/dark themes, persisted in localStorage
- **Rent Scheduler** — automatic rent reminders 5 days before due date (daily 9 AM cron)
- **Electricity Billing** — separate electricity calculation per room
- **Circuit Breaker** — Resilience4j fallbacks on inter-service calls (Allocation → Room)
- **Service Discovery** — all services register with Eureka, API Gateway load-balances via `lb://`
- **Multi-hostel Support** — manage unlimited hostels, each with floors and rooms
- **Bed-level Allocation** — track individual bed assignments, not just rooms
- **Real-time Notifications** — polling every 30 seconds with unread badge count

---

## Technology Stack

| Layer       | Technology                              |
|-------------|-----------------------------------------|
| Frontend    | React 18, Vite, Tailwind CSS, Redux Toolkit, Recharts |
| API Gateway | Spring Cloud Gateway 2023.0.0           |
| Services    | Spring Boot 3.2.0, Java 17              |
| Discovery   | Netflix Eureka                          |
| Config      | Spring Cloud Config Server (native)     |
| Security    | Spring Security + JJWT 0.11.5           |
| Database    | MySQL 8.0 (one DB per service)          |
| ORM         | Spring Data JPA / Hibernate             |
| HTTP Client | OpenFeign (inter-service communication) |
| Resilience  | Resilience4j (circuit breaker fallbacks)|
