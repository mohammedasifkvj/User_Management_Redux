# User Management System

## Overview
This is a **User Management System** built with **MERN stack** where users can sign up, log in, and manage their accounts. The frontend is built using **React.js** with **Redux** for state management, and the backend is powered by **Node.js** with **Express.js** and **MongoDB**.

## Features
- User Authentication (Sign Up, Login, Logout)
- Role-Based Access Control (Admin/User)
- User Profile Management
- CRUD Operations (Create, Read, Update, Delete Users)
- Secure API with JWT Authentication
- Redux Toolkit for Global State Management

## Tech Stack
### Frontend
- React.js
- Redux Toolkit
- React Router
- Axios for API Requests
- TailwindCSS (for styling)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for Password Hashing
- dotenv for Environment Variables

## Installation
### Prerequisites
Make sure you have **Node.js** and **MongoDB** installed on your system.

### Clone the Repository
```sh
git clone https://github.com/mohammedasifkvj/User_Management_Redux
cd User_Management_Redux
```

### Backend Setup
1. Navigate to the `backend` folder:
```sh
cd server
```
2. Install dependencies:
```sh
npm install
```
3. Create a `.env` file in the `server` directory and add the following:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```
4. Start the backend server:
```sh
npm run dev
```

### Frontend Setup
1. Navigate to the `frontend` folder:
```sh
cd ../frontend
```
2. Install dependencies:
```sh
npm install
```
3. Start the frontend server:
```sh
npm start
```

## API Endpoints
| Method | Endpoint        | Description          |
|--------|----------------|----------------------|
| POST   | /api/auth/register | Register a new user |
| POST   | /api/auth/login    | Login user         |
| GET    | /api/users        | Get all users (Admin) |
| GET    | /api/users/:id    | Get user by ID     |
| PUT    | /api/users/:id    | Update user        |
| DELETE | /api/users/:id    | Delete user        |

## Folder Structure
```
user-management-system/
│── frontend/             # React Frontend
│   ├── src/
│   │   ├── components/  # Reusable Components
│   │   ├── pages/       # Pages (Login, Register, Dashboard)
│   │   ├── redux/       # Redux Toolkit Store, Slices
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   └── .env
│
│── backend/             # Node.js Backend
│   ├── models/          # Mongoose Models
│   ├── routes/          # Express Routes
│   ├── controllers/     # Business Logic
│   ├── middleware/      # Authentication Middleware
│   ├── config/          # Database Configuration
│   ├── server.js        # Entry Point
│   ├── package.json
│   └── .env
│
└── README.md
```