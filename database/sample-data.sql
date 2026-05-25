-- ============================================================
-- HMS - Sample Data
-- Passwords are BCrypt-encoded "password123"
-- ============================================================

-- ============================================================
-- hms_auth: Users (all passwords = "password123")
-- ============================================================
USE hms_auth;

INSERT INTO users (email, phone, password, role, active) VALUES
('admin@hms.com',   '9000000001', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHuy', 'ADMIN',   TRUE),
('owner@hms.com',   '9000000002', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHuy', 'OWNER',   TRUE),
('warden@hms.com',  '9000000003', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHuy', 'WARDEN',  TRUE),
('student1@hms.com','9000000004', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHuy', 'STUDENT', TRUE),
('student2@hms.com','9000000005', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHuy', 'STUDENT', TRUE),
('student3@hms.com','9000000006', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHuy', 'STUDENT', TRUE),
('staff@hms.com',   '9000000007', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHuy', 'STAFF',   TRUE);

-- ============================================================
-- hms_user: User Profiles
-- ============================================================
USE hms_user;

INSERT INTO user_profiles (auth_id, first_name, last_name, email, phone, address, city, state, role, hostel_id, emergency_contact, emergency_phone) VALUES
(1, 'Admin',   'User',    'admin@hms.com',    '9000000001', '123 Admin St',   'Mumbai', 'Maharashtra', 'ADMIN',   NULL, 'Admin Family', '9000000011'),
(2, 'Rajesh',  'Kumar',   'owner@hms.com',    '9000000002', '456 Owner Ave',  'Mumbai', 'Maharashtra', 'OWNER',   1,    'Rajesh Family','9000000012'),
(3, 'Priya',   'Singh',   'warden@hms.com',   '9000000003', '789 Warden Rd',  'Mumbai', 'Maharashtra', 'WARDEN',  1,    'Priya Family', '9000000013'),
(4, 'Amit',    'Sharma',  'student1@hms.com', '9000000004', '12 Student Lane','Pune',   'Maharashtra', 'STUDENT', 1,    'Sharma Family','9000000014'),
(5, 'Sneha',   'Patel',   'student2@hms.com', '9000000005', '34 College Road','Pune',   'Maharashtra', 'STUDENT', 1,    'Patel Family', '9000000015'),
(6, 'Rahul',   'Verma',   'student3@hms.com', '9000000006', '56 Hostel Nagar','Nashik',  'Maharashtra', 'STUDENT', 1,    'Verma Family', '9000000016'),
(7, 'Kavita',  'Joshi',   'staff@hms.com',    '9000000007', '78 Staff Colony','Mumbai', 'Maharashtra', 'STAFF',   1,    'Joshi Family', '9000000017');

-- ============================================================
-- hms_hostel: Hostels and Floors
-- ============================================================
USE hms_hostel;

INSERT INTO hostels (name, address, city, state, pincode, phone, email, owner_id, total_floors, description, type, active) VALUES
('Sunrise Boys Hostel',    '15 College Road, Andheri',   'Mumbai', 'Maharashtra', '400069', '022-12345678', 'sunrise@hms.com',   2, 4, 'Modern hostel with all facilities for boys',   'BOYS',   TRUE),
('Green Valley Girls PG',  '22 University Ave, Dadar',   'Mumbai', 'Maharashtra', '400014', '022-87654321', 'greenvalley@hms.com',2, 3, 'Safe and comfortable PG for girls',           'GIRLS',  TRUE),
('City Co-Ed Residency',   '5 Station Road, Thane',      'Thane',  'Maharashtra', '400601', '0251-112233',  'citycoed@hms.com',  2, 5, 'Premium co-ed hostel near IT hub',            'CO_ED',  TRUE);

INSERT INTO floors (hostel_id, floor_number, description, total_rooms) VALUES
(1, 0, 'Ground Floor - Common area and office', 4),
(1, 1, 'First Floor',  8),
(1, 2, 'Second Floor', 8),
(1, 3, 'Third Floor',  8),
(2, 0, 'Ground Floor', 4),
(2, 1, 'First Floor',  6),
(2, 2, 'Second Floor', 6),
(3, 1, 'First Floor',  10),
(3, 2, 'Second Floor', 10);

-- ============================================================
-- hms_room: Rooms
-- ============================================================
USE hms_room;

INSERT INTO rooms (hostel_id, floor_id, room_number, seater_type, ac_type, total_beds, available_beds, base_rent, status, amenities) VALUES
(1, 1, '101', 'SINGLE', 'AC',     1, 0, 8000.00, 'FULL',      'WiFi, AC, Attached Bathroom'),
(1, 1, '102', 'DOUBLE', 'NON_AC', 2, 1, 5000.00, 'AVAILABLE', 'WiFi, Fan, Shared Bathroom'),
(1, 1, '103', 'QUAD',   'NON_AC', 4, 2, 3500.00, 'AVAILABLE', 'WiFi, Fan, Shared Bathroom'),
(1, 2, '201', 'SINGLE', 'AC',     1, 1, 8000.00, 'AVAILABLE', 'WiFi, AC, Attached Bathroom'),
(1, 2, '202', 'DOUBLE', 'AC',     2, 0, 6500.00, 'FULL',      'WiFi, AC, Shared Bathroom'),
(1, 2, '203', 'QUAD',   'NON_AC', 4, 3, 3500.00, 'AVAILABLE', 'WiFi, Fan, Common Bathroom'),
(1, 3, '301', 'DOUBLE', 'NON_AC', 2, 2, 5000.00, 'AVAILABLE', 'WiFi, Fan'),
(1, 3, '302', 'QUAD',   'AC',     4, 1, 5500.00, 'AVAILABLE', 'WiFi, AC, Common Bathroom'),
(2, 5, '101', 'SINGLE', 'AC',     1, 1, 9000.00, 'AVAILABLE', 'WiFi, AC, Attached Bathroom, TV'),
(2, 5, '102', 'DOUBLE', 'AC',     2, 0, 7000.00, 'FULL',      'WiFi, AC, Shared Bathroom'),
(3, 8, '101', 'QUAD',   'NON_AC', 4, 4, 4000.00, 'AVAILABLE', 'WiFi, Fan');

-- ============================================================
-- hms_allocation: Allocations
-- ============================================================
USE hms_allocation;

INSERT INTO allocations (student_id, room_id, hostel_id, bed_number, allocation_date, status, remarks) VALUES
(4, 1, 1, 1, '2025-01-01', 'ACTIVE', 'Initial allocation'),
(5, 2, 1, 1, '2025-01-05', 'ACTIVE', 'Initial allocation'),
(6, 3, 1, 1, '2025-01-10', 'ACTIVE', 'Initial allocation');

-- ============================================================
-- hms_payment: Payments (May 2025)
-- ============================================================
USE hms_payment;

INSERT INTO payments (student_id, allocation_id, hostel_id, room_id, month, year, base_rent, electricity_units, electricity_rate, electricity_amount, total_amount, status, due_date, paid_date, transaction_id) VALUES
(4, 1, 1, 1, 5, 2025, 8000.00, 120.0, 8.00, 960.00, 8960.00, 'PAID',    '2025-05-05', '2025-05-03', 'TXN001234'),
(5, 2, 1, 2, 5, 2025, 5000.00,  80.0, 8.00, 640.00, 5640.00, 'PENDING', '2025-05-05', NULL,         NULL),
(6, 3, 1, 3, 5, 2025, 3500.00,  60.0, 8.00, 480.00, 3980.00, 'OVERDUE', '2025-05-05', NULL,         NULL),
(4, 1, 1, 1, 4, 2025, 8000.00, 110.0, 8.00, 880.00, 8880.00, 'PAID',    '2025-04-05', '2025-04-04', 'TXN001100'),
(5, 2, 1, 2, 4, 2025, 5000.00,  75.0, 8.00, 600.00, 5600.00, 'PAID',    '2025-04-05', '2025-04-07', 'TXN001101');

-- ============================================================
-- hms_complaint: Complaints
-- ============================================================
USE hms_complaint;

INSERT INTO complaints (student_id, hostel_id, room_id, title, description, category, status, assigned_to, resolution) VALUES
(4, 1, 1, 'AC not working',          'The AC in room 101 stopped working since last night',   'ELECTRICITY',  'RESOLVED',    3, 'AC repaired and serviced'),
(5, 1, 2, 'Water leakage in bathroom','There is a water leakage in the attached bathroom',    'PLUMBING',     'IN_PROGRESS', 3, NULL),
(6, 1, 3, 'Noisy neighbors',         'Students in room 104 make a lot of noise after 11 PM', 'NOISE',        'OPEN',        NULL, NULL),
(4, 1, 1, 'WiFi not working',        'WiFi has been down for 2 days in the room',             'MAINTENANCE',  'RESOLVED',    3, 'Router replaced, issue fixed'),
(5, 1, 2, 'Broken window',           'The window latch in room 102 is broken',                'MAINTENANCE',  'OPEN',        NULL, NULL);

-- ============================================================
-- hms_attendance: Sample Attendance (May 2025)
-- ============================================================
USE hms_attendance;

INSERT INTO attendance (student_id, hostel_id, warden_id, date, status, remarks) VALUES
(4, 1, 3, '2025-05-20', 'PRESENT', NULL),
(5, 1, 3, '2025-05-20', 'PRESENT', NULL),
(6, 1, 3, '2025-05-20', 'ABSENT',  'Not in hostel'),
(4, 1, 3, '2025-05-21', 'PRESENT', NULL),
(5, 1, 3, '2025-05-21', 'LEAVE',   'Approved leave'),
(6, 1, 3, '2025-05-21', 'PRESENT', NULL),
(4, 1, 3, '2025-05-22', 'PRESENT', NULL),
(5, 1, 3, '2025-05-22', 'PRESENT', NULL),
(6, 1, 3, '2025-05-22', 'LATE',    'Came back at 11 PM'),
(4, 1, 3, '2025-05-23', 'PRESENT', NULL),
(5, 1, 3, '2025-05-23', 'PRESENT', NULL),
(6, 1, 3, '2025-05-23', 'PRESENT', NULL);

-- ============================================================
-- hms_visitor: Sample Visitor Logs
-- ============================================================
USE hms_visitor;

INSERT INTO visitors (student_id, hostel_id, visitor_name, visitor_phone, visitor_relation, purpose, entry_time, exit_time, status, approved_by) VALUES
(4, 1, 'Suresh Sharma',  '9111111111', 'Father',  'Monthly visit',        '2025-05-20 10:00:00', '2025-05-20 13:00:00', 'EXITED',   3),
(5, 1, 'Meena Patel',    '9222222222', 'Mother',  'Delivering home food',  '2025-05-21 11:00:00', '2025-05-21 12:30:00', 'EXITED',   3),
(6, 1, 'Rohan Verma',    '9333333333', 'Brother', 'Casual visit',          NULL,                  NULL,                  'PENDING',  NULL),
(4, 1, 'Anita Sharma',   '9444444444', 'Sister',  'Bring study material',  NULL,                  NULL,                  'APPROVED', 3);

-- ============================================================
-- hms_notification: Sample Notifications
-- ============================================================
USE hms_notification;

INSERT INTO notifications (user_id, title, message, type, is_read, reference_id) VALUES
(4, 'Rent Due Reminder',       'Your rent for 5/2025 is due on May 5th. Please pay to avoid late fees.',  'RENT_DUE',          FALSE, 2),
(5, 'Rent Due Reminder',       'Your rent for 5/2025 is due on May 5th. Please pay to avoid late fees.',  'RENT_DUE',          FALSE, 3),
(6, 'Rent Overdue',            'Your rent for 5/2025 is overdue. Please pay immediately.',                 'RENT_DUE',          FALSE, 4),
(4, 'Complaint Resolved',      'Your complaint "AC not working" has been resolved.',                        'COMPLAINT_UPDATE',  TRUE,  1),
(4, 'Room Allocated',          'You have been allocated Room 101, Bed 1 in Sunrise Boys Hostel.',           'ALLOCATION_UPDATE', TRUE,  1),
(5, 'Complaint Update',        'Your complaint "Water leakage" is now In Progress.',                        'COMPLAINT_UPDATE',  FALSE, 2),
(3, 'New Complaint Assigned',  'A new complaint has been assigned to you: "Noisy neighbors"',               'COMPLAINT_UPDATE',  FALSE, 3),
(6, 'Visitor Request Pending', 'Your visitor Rohan Verma is waiting for approval at the gate.',             'VISITOR_APPROVAL',  FALSE, 3);
