# TODO API with Authentication

A RESTful API for managing todos with JWT authentication built with Express.js and MongoDB.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/todo-app
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

3. Make sure MongoDB is running on your system

4. Start the server:
```bash
npm run dev
```

## API Endpoints

### Authentication

- POST `/api/auth/register` - Register a new user
  - Body: `{ "email": "user@example.com", "password": "password123" }`

- POST `/api/auth/login` - Login user
  - Body: `{ "email": "user@example.com", "password": "password123" }`

### Todos

All todo endpoints require authentication. Include the JWT token in the Authorization header:
`Authorization: Bearer your-token-here`

- GET `/api/todos` - Get all todos for authenticated user
- POST `/api/todos` - Create a new todo
  - Body: `{ "title": "Todo title", "description": "Todo description" }`
- PATCH `/api/todos/:id` - Update a todo
  - Body: `{ "title": "Updated title", "completed": true }`
- DELETE `/api/todos/:id` - Delete a todo

## Error Handling

The API returns appropriate HTTP status codes and error messages in JSON format:

- 200: Success
- 201: Resource created
- 400: Bad request
- 401: Unauthorized
- 404: Resource not found
- 500: Server error 