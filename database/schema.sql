-- ============================================================
-- HMS - Hostel Management System Database Schema
-- MySQL 8.0+
-- All databases use createDatabaseIfNotExist via Spring JPA
-- Run this script to pre-create all schemas with sample data
-- ============================================================

-- ============================================================
-- 1. hms_auth
-- ============================================================
CREATE DATABASE IF NOT EXISTS hms_auth;
USE hms_auth;

CREATE TABLE IF NOT EXISTS users (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    email       VARCHAR(255) NOT NULL UNIQUE,
    phone       VARCHAR(20)  NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    role        ENUM('ADMIN','OWNER','WARDEN','STUDENT','STAFF') NOT NULL,
    active      BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- 2. hms_user
-- ============================================================
CREATE DATABASE IF NOT EXISTS hms_user;
USE hms_user;

CREATE TABLE IF NOT EXISTS user_profiles (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    auth_id             BIGINT NOT NULL,
    first_name          VARCHAR(100) NOT NULL,
    last_name           VARCHAR(100) NOT NULL,
    email               VARCHAR(255) NOT NULL UNIQUE,
    phone               VARCHAR(20)  NOT NULL UNIQUE,
    address             VARCHAR(500),
    city                VARCHAR(100),
    state               VARCHAR(100),
    role                ENUM('ADMIN','OWNER','WARDEN','STUDENT','STAFF'),
    hostel_id           BIGINT,
    id_proof_type       VARCHAR(50),
    id_proof_url        VARCHAR(500),
    profile_image_url   VARCHAR(500),
    emergency_contact   VARCHAR(100),
    emergency_phone     VARCHAR(20),
    created_at          DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- 3. hms_hostel
-- ============================================================
CREATE DATABASE IF NOT EXISTS hms_hostel;
USE hms_hostel;

CREATE TABLE IF NOT EXISTS hostels (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(255) NOT NULL,
    address       VARCHAR(500) NOT NULL,
    city          VARCHAR(100),
    state         VARCHAR(100),
    pincode       VARCHAR(10),
    phone         VARCHAR(20),
    email         VARCHAR(255),
    owner_id      BIGINT,
    total_floors  INT DEFAULT 1,
    description   TEXT,
    type          ENUM('BOYS','GIRLS','CO_ED') DEFAULT 'BOYS',
    active        BOOLEAN NOT NULL DEFAULT TRUE,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS floors (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    hostel_id    BIGINT NOT NULL,
    floor_number INT NOT NULL,
    description  VARCHAR(255),
    total_rooms  INT DEFAULT 0,
    UNIQUE KEY uq_hostel_floor (hostel_id, floor_number)
);

-- ============================================================
-- 4. hms_room
-- ============================================================
CREATE DATABASE IF NOT EXISTS hms_room;
USE hms_room;

CREATE TABLE IF NOT EXISTS rooms (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    hostel_id       BIGINT NOT NULL,
    floor_id        BIGINT,
    room_number     VARCHAR(20) NOT NULL,
    seater_type     ENUM('SINGLE','DOUBLE','QUAD') NOT NULL,
    ac_type         ENUM('AC','NON_AC') NOT NULL DEFAULT 'NON_AC',
    total_beds      INT NOT NULL,
    available_beds  INT NOT NULL DEFAULT 0,
    base_rent       DECIMAL(10,2) NOT NULL,
    status          ENUM('AVAILABLE','FULL','MAINTENANCE') DEFAULT 'AVAILABLE',
    amenities       TEXT,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_hostel_room (hostel_id, room_number)
);

-- ============================================================
-- 5. hms_allocation
-- ============================================================
CREATE DATABASE IF NOT EXISTS hms_allocation;
USE hms_allocation;

CREATE TABLE IF NOT EXISTS allocations (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id       BIGINT NOT NULL,
    room_id          BIGINT NOT NULL,
    hostel_id        BIGINT NOT NULL,
    bed_number       INT NOT NULL,
    allocation_date  DATE NOT NULL,
    vacate_date      DATE,
    status           ENUM('ACTIVE','VACATED','PENDING') DEFAULT 'ACTIVE',
    remarks          TEXT,
    created_at       DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 6. hms_payment
-- ============================================================
CREATE DATABASE IF NOT EXISTS hms_payment;
USE hms_payment;

CREATE TABLE IF NOT EXISTS payments (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id          BIGINT NOT NULL,
    allocation_id       BIGINT NOT NULL,
    hostel_id           BIGINT NOT NULL,
    room_id             BIGINT NOT NULL,
    month               INT NOT NULL,
    year                INT NOT NULL,
    base_rent           DECIMAL(10,2) NOT NULL,
    electricity_units   DOUBLE DEFAULT 0,
    electricity_rate    DECIMAL(10,2) DEFAULT 8.00,
    electricity_amount  DECIMAL(10,2) DEFAULT 0.00,
    total_amount        DECIMAL(10,2) NOT NULL,
    status              ENUM('PENDING','PAID','OVERDUE','PARTIAL') NOT NULL DEFAULT 'PENDING',
    due_date            DATE NOT NULL,
    paid_date           DATE,
    transaction_id      VARCHAR(100),
    remarks             TEXT,
    created_at          DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_student_month_year (student_id, month, year)
);

-- ============================================================
-- 7. hms_complaint
-- ============================================================
CREATE DATABASE IF NOT EXISTS hms_complaint;
USE hms_complaint;

CREATE TABLE IF NOT EXISTS complaints (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id  BIGINT NOT NULL,
    hostel_id   BIGINT NOT NULL,
    room_id     BIGINT,
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    category    ENUM('MAINTENANCE','CLEANLINESS','NOISE','ELECTRICITY','PLUMBING','SECURITY','FOOD','OTHER'),
    status      ENUM('OPEN','IN_PROGRESS','RESOLVED','CLOSED') NOT NULL DEFAULT 'OPEN',
    assigned_to BIGINT,
    resolution  TEXT,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    resolved_at DATETIME
);

-- ============================================================
-- 8. hms_attendance
-- ============================================================
CREATE DATABASE IF NOT EXISTS hms_attendance;
USE hms_attendance;

CREATE TABLE IF NOT EXISTS attendance (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id  BIGINT NOT NULL,
    hostel_id   BIGINT NOT NULL,
    warden_id   BIGINT NOT NULL,
    date        DATE NOT NULL,
    status      ENUM('PRESENT','ABSENT','LEAVE','LATE') NOT NULL,
    remarks     VARCHAR(255),
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_student_date (student_id, date)
);

-- ============================================================
-- 9. hms_visitor
-- ============================================================
CREATE DATABASE IF NOT EXISTS hms_visitor;
USE hms_visitor;

CREATE TABLE IF NOT EXISTS visitors (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id       BIGINT NOT NULL,
    hostel_id        BIGINT NOT NULL,
    visitor_name     VARCHAR(255) NOT NULL,
    visitor_phone    VARCHAR(20)  NOT NULL,
    visitor_relation VARCHAR(100),
    purpose          TEXT,
    entry_time       DATETIME,
    exit_time        DATETIME,
    status           ENUM('PENDING','APPROVED','REJECTED','EXITED') NOT NULL DEFAULT 'PENDING',
    approved_by      BIGINT,
    remarks          TEXT,
    created_at       DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 10. hms_notification
-- ============================================================
CREATE DATABASE IF NOT EXISTS hms_notification;
USE hms_notification;

CREATE TABLE IF NOT EXISTS notifications (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id      BIGINT NOT NULL,
    title        VARCHAR(255) NOT NULL,
    message      TEXT NOT NULL,
    type         ENUM('RENT_DUE','COMPLAINT_UPDATE','ALLOCATION_UPDATE','GENERAL','VISITOR_APPROVAL'),
    is_read      BOOLEAN NOT NULL DEFAULT FALSE,
    reference_id BIGINT,
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (user_id, is_read)
);
