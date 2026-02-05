-- Create Database
CREATE DATABASE IF NOT EXISTS task_manager_db;
USE task_manager_db;

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS users;

-- Users Table
CREATE TABLE users (
                       id BIGINT AUTO_INCREMENT PRIMARY KEY,
                       username VARCHAR(50) UNIQUE NOT NULL,
                       email VARCHAR(100) UNIQUE NOT NULL,
                       password VARCHAR(255) NOT NULL,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                       INDEX idx_username (username),
                       INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tasks Table
CREATE TABLE tasks (
                       id BIGINT AUTO_INCREMENT PRIMARY KEY,
                       task_name VARCHAR(200) NOT NULL,
                       description TEXT,
                       priority ENUM('LOW', 'MEDIUM', 'HIGH') DEFAULT 'MEDIUM',
                       status ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED') DEFAULT 'PENDING',
                       due_date DATE NOT NULL,
                       reminder_time DATETIME,
                       created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                       user_id BIGINT NOT NULL,
                       FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                       INDEX idx_user_id (user_id),
                       INDEX idx_due_date (due_date),
                       INDEX idx_status (status),
                       INDEX idx_priority (priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Sample Data
-- Password: admin123 (BCrypt encoded)
INSERT INTO users (username, email, password) VALUES
    ('admin', 'admin@taskmanager.com', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQj6vRBJFhBmxfOcyPf2y');

-- Sample Tasks
INSERT INTO tasks (task_name, description, priority, status, due_date, user_id) VALUES
                                                                                    ('Complete Project Documentation', 'Write comprehensive documentation for the task management system', 'HIGH', 'IN_PROGRESS', DATE_ADD(CURDATE(), INTERVAL 3 DAY), 1),
                                                                                    ('Code Review', 'Review pull requests from team members', 'MEDIUM', 'PENDING', DATE_ADD(CURDATE(), INTERVAL 5 DAY), 1),
                                                                                    ('Database Optimization', 'Optimize database queries for better performance', 'HIGH', 'PENDING', DATE_ADD(CURDATE(), INTERVAL 7 DAY), 1),
                                                                                    ('Team Meeting', 'Weekly sync with the development team', 'LOW', 'COMPLETED', CURDATE(), 1),
                                                                                    ('Update Dependencies', 'Update all project dependencies to latest versions', 'MEDIUM', 'PENDING', DATE_ADD(CURDATE(), INTERVAL 10 DAY), 1),
                                                                                    ('Fix Bug #234', 'Fix the login redirect issue reported by users', 'HIGH', 'IN_PROGRESS', DATE_ADD(CURDATE(), INTERVAL 2 DAY), 1),
                                                                                    ('Prepare Presentation', 'Create slides for quarterly review meeting', 'MEDIUM', 'PENDING', DATE_ADD(CURDATE(), INTERVAL 14 DAY), 1),
                                                                                    ('Security Audit', 'Conduct security audit of the application', 'HIGH', 'PENDING', DATE_ADD(CURDATE(), INTERVAL 20 DAY), 1);

