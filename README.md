
# 📌 Task Management System

**Infosys Internship Project**

## 📖 Project Overview

This project is a **Task Management System** developed as part of the **Infosys Internship Program**.
The application is designed to demonstrate **full-stack development skills**, secure application design, and industry-standard coding practices using **Spring Boot** and **React**.

The system allows users to **manage tasks efficiently**, receive **email reminders**, and **download task reports**, ensuring better productivity and organization.

---

## 🎯 Objectives of the Project

* Understand enterprise-level application architecture
* Implement secure authentication and authorization
* Perform CRUD operations using RESTful APIs
* Integrate frontend and backend effectively
* Apply real-world security best practices
* Gain hands-on experience with modern UI/UX

---

## 🛠 Functional Features

* User registration and login
* JWT-based authentication
* Create, view, update, and delete tasks
* Task priority and status management
* Email reminders for due tasks
* Downloadable task reports
* Responsive and user-friendly interface

---

## 📁 Project Structure

```
task-management-system/
├── backend/                    # Spring Boot Application
│   ├── src/main/java/
│   │   └── com/taskmanager/
│   │       ├── config/         # Security and CORS configuration
│   │       ├── controller/     # REST APIs
│   │       ├── dto/            # Data Transfer Objects
│   │       ├── entity/         # JPA Entities
│   │       ├── exception/      # Global Exception Handling
│   │       ├── repository/     # Data Access Layer
│   │       └── service/        # Business Logic Layer
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
│
├── frontend/                   # React Application
│   ├── src/
│   │   ├── components/         # UI Components
│   │   ├── services/           # API Services
│   │   ├── utils/              # Utility Functions
│   │   └── App.js
│   ├── package.json
│   └── .env
│
├── database/
│   └── schema.sql              # Database Schema
│
├── start.bat                   # Windows startup script
├── start.sh                    # Linux / Mac startup script
└── README.md
```

---

## 🔐 Security Implementation

The project follows standard security practices used in enterprise applications:

* JWT-based authentication for stateless security
* BCrypt password encryption
* Role-based authorization
* CSRF disabled for REST APIs
* CORS configuration for frontend-backend communication
* SQL injection prevention using Spring Data JPA
* Input validation to avoid malformed requests
* XSS protection mechanisms

---

## 🎨 User Interface Features

* Responsive design (mobile, tablet, desktop)
* Dark and Light mode with persistence
* Real-time clock display
* Color-coded task priorities
* Task status indicators
* Toast notifications for user actions
* Loading indicators for API calls

---

## 📧 Email Reminder Feature

* Automated email reminders are sent based on task due dates
* Helps users track deadlines efficiently
* Demonstrates backend scheduling and email service integration

---

## 📄 Report Download Feature

* Users can download their task details as a report
* Useful for review and productivity tracking
* Can be extended to PDF or Excel formats

---

## 📊 Technology Stack

### Backend

* Java 17
* Spring Boot 3.2.0
* Spring Security
* Spring Data JPA
* MySQL 8.0
* Maven

### Frontend

* React 18
* Axios
* Tailwind CSS
* Lucide Icons
* Node.js

---

## ⚙️ Setup Instructions

### Prerequisites

* Java 17 or higher
* Node.js
* MySQL 8.0
* Maven

---

### Backend Setup

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

---

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

### Database Configuration

* Create a MySQL database
* Execute `database/schema.sql`
* Configure database credentials in `application.properties`

---

## 📚 Learning Outcomes

* Hands-on experience with Spring Boot and React
* Understanding RESTful API development
* Secure application development practices
* Frontend-backend integration
* Real-world project exposure following industry standards

---

## 👨‍💻 Intern Details

**Project Developed By:** Vignesh
**Internship Program:** Infosys Internship
**Domain:** Java Developer Intern

---

## ✅ Conclusion

This project demonstrates a **practical implementation of a secure, scalable, and user-friendly task management system**, aligning with the expectations and learning goals of the **Infosys Internship Program**.

---



