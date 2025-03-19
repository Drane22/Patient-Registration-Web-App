# Patient Registration App

A full-stack web application for managing patient information in healthcare facilities. Built with React, Node.js, Express, and MySQL.

## Features

- Patient registration with comprehensive information capture
- Patient list view with search functionality
- Detailed patient profiles
- Patient check-in system
- Soft delete functionality with restore option
- Responsive Material-UI design
- AES-256-CBC encryption for sensitive patient data with secure key management, ensuring data privacy & compliance

## Prerequisites

- Node.js (v14 or higher)
- MySQL
- npm or yarn package manager

## Installation

1. Clone the repository
2. Install server dependencies:
   ```bash
   npm install
   ```
3. Install client dependencies:
   ```bash
   cd client
   npm install
   ```
4. Create a `.env` file in the root directory with the following variables:
   ```
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=your_database_name
   DB_HOST=localhost
   DB_PORT=3306
   PORT=5000
   JWT_SECRET=your_jwt_secret_key
   ENCRYPTION_KEY=your_32_byte_encryption_key
   ```

## Running the Application

1. Start the server:
   ```bash
   npm run start
   ```
2. In a separate terminal, start the client:
   ```bash
   cd client
   npm run start
   ```

## Project Structure

- `/client` - React frontend application
- `/config` - Server configuration files
- `/models` - Sequelize models for MySQL database
- `/routes` - Express route handlers
- `/utils` - Utility functions
