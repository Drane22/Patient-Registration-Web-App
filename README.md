# Patient Registration App

A full-stack web application for managing patient information in healthcare facilities. Built with React, Node.js, Express, and MySQL.

## Features

- Patient registration with comprehensive information capture
- Patient list view with search functionality
- Detailed patient profiles
- Patient check-in system
- Soft delete functionality with restore option
- Responsive Material-UI design

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

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.