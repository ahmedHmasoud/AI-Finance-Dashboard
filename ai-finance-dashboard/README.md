# AI Finance Dashboard

A full-stack finance dashboard application built with MongoDB, Express.js, React, Node.js, and PostgreSQL.

## Project Structure

```
ai-finance-dashboard/
├── client/        # React frontend
└── server/        # Express.js backend with PostgreSQL
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL (v12 or higher)
- MongoDB (optional - for certain features)

## Setup Instructions

### Backend Setup
1. Install PostgreSQL if not already installed
2. Create a new database for your project
3. Navigate to server directory:
   ```powershell
   cd server
   ```
4. Install dependencies:
   ```powershell
   npm install
   ```
5. Create a `.env` file in the server directory with:
   ```
   PORT=5000
   NODE_ENV=development
   DB_HOST=localhost
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=your_database_name
   JWT_SECRET=your_jwt_secret
   ```
6. Start the server:
   ```powershell
   npm run dev
   ```

### Frontend Setup
1. Navigate to client directory:
   ```powershell
   cd client
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Start the development server:
   ```powershell
   npm start
   ```

## Development

- Frontend runs on: http://localhost:3000
- Backend runs on: http://localhost:5000

## Features

- RESTful API with Express.js
- PostgreSQL database with Sequelize ORM
- JWT authentication
- Secure password hashing
- Helmet for security headers
- Morgan for request logging
- CORS enabled

## Testing

Run tests using:
```powershell
npm test
```

## Environment Variables

Create a `.env` file in the server directory with the following variables:
```
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=your_database_name
JWT_SECRET=your_jwt_secret
```

## Security

The application includes several security measures:
- Password hashing with bcrypt
- JWT authentication
- Helmet security headers
- CORS configuration
- Input validation

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE
