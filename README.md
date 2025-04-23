# ToDo Application

A full-stack ToDo application built with React, Node.js, Express, and MongoDB. The application features user authentication, role-based access control, and a comprehensive admin dashboard.

## Live Demo

Check out the live application here: [ToDoApp Live Demo](https://todoapp-frontend-pied.vercel.app/)

## Features

- User Authentication (Login/Register)
- Role-based Access Control (Admin/User)
- Create, Read, Update, Delete Todos
- Todo Categories and Due Dates
- Admin Dashboard with User Management
- Todo Statistics and Analytics
- Real-time User Activity Tracking

## Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- React Context API
- Axios for API calls
- React Toastify for notifications

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Mongoose ODM

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ToDoApp
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory with the following variables:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:5000
```

## Running the Application

### 1. Start the Backend Server
```bash
cd backend
npm start
```
The server will start on http://localhost:5000

### 2. Start the Frontend Development Server
```bash
cd frontend
npm run dev
```
The frontend will start on http://localhost:5173

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

### Todos
- GET `/api/todos` - Get all todos for current user
- POST `/api/todos` - Create a new todo
- PUT `/api/todos/:id` - Update a todo
- DELETE `/api/todos/:id` - Delete a todo

### Admin Routes
- GET `/api/admin/users` - Get all users (admin only)
- GET `/api/admin/todos` - Get all todos (admin only)
- GET `/api/admin/todos/stats` - Get todo statistics (admin only)
- GET `/api/admin/users/:userId/todos` - Get todos by user (admin only)
- PUT `/api/admin/users/:userId/role` - Update user role (admin only)

## Project Structure

```
ToDoApp/
├── backend/
│   ├── models/         # MongoDB models
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware
│   ├── server.js       # Express server
│   └── .env           # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── pages/      # Page components
│   │   ├── context/    # React context
│   │   └── App.jsx     # Main App component
│   └── .env           # Frontend environment variables
└── README.md
```

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Protected API routes
- CORS configuration
- Input validation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 