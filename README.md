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

**Frontend (Client)**

1. Navigate to the `client` directory:
   ```bash
   cd client
2. Install the necessary dependencies:
   ```bash
    npm install
### Backend (Server)
1. Navigate to the server directory:
   ```bash
   cd ../server
3. Install the necessary dependencies:
   ```bash
   npm install
### Usage
## Frontend
1. Navigate to the frontend directory and start the development server:
   ```bash
    cd frontend
    npm run dev
  Open your browser and go to http://localhost:5173.

2. Register a User:

    - Visit http://localhost:5173/register.
    - Enter a username and password, then submit to create an account.

3. Log In:

    - Go to http://localhost:5173/login.
    - Enter your credentials and log in.

4. Home Page:
    - After logging in, you’ll see options to navigate to "Product Management" or "Stock Overview".

5. Product Management:
    - Add, edit, or delete products.
    - Search for products by name or category.

6. Stock Overview:
    - View current stock levels.
    - Sell products using the "Sell" button.
    - Check analytics for total items sold and revenue.

7. Logout:
    - Click "Logout" in the navbar to end your session.


## Backend
1. Navigate to the backend directory and start the server:
   ```bash
    cd backend
    node server.js
  Ensure the server is running at http://localhost:5000 to handle API requests. to the server directory and start the server:
  
