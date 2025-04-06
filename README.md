# Stock Management System

A full-stack web application for managing stock inventory, including product management, stock overview, and sales tracking. This project includes user authentication using JWT (JSON Web Token) to secure access to sensitive features.


## Overview
The Stock Management System is designed to help businesses track their inventory efficiently. It allows users to register, log in, manage products (add, edit, delete), view stock levels, and record sales. The application uses a RESTful API with MongoDB for data storage and React for the frontend, secured with JWT-based authentication.

## Features
- **User Authentication**: Register new users and log in with JWT tokens.
- **Product Management**: Add, edit, and delete products with details like name, category, price, stock quantity, and description.
- **Stock Overview**: View current stock levels, sell products, and see analytics (total items sold, total revenue).
- **Search Functionality**: Search products by name or category in Product Management and by name in Stock Overview.
- **Real-Time Updates**: Fetch updated stock data after sales.
- **Responsive Design**: Built with Bootstrap for a mobile-friendly interface.
- **Protected Routes**: Restrict access to login and register pages for authenticated users, and require authentication for core features.

## Technologies Used
- **Frontend**:
  - React (with Vite)
  - Bootstrap (for styling)
  - Axios (for HTTP requests)
  - React Router DOM (for navigation)
  - React Toastify (for notifications)
- **Backend**:
  - Node.js
  - Express.js
  - MongoDB (with Mongoose)
  - JSON Web Token (JWT) for authentication
  - bcrypt (for password hashing)
- **Development Tools**:
  - Git (for version control)
  - npm (package manager)

## Prerequisites
- Node.js (v14.x or later)
- MongoDB (local instance or MongoDB Atlas)
- npm (comes with Node.js)

## Installation

### Clone the Repository
```bash
git clone https://github.com/your-username/stock-management-system.git
cd stock-management-system
