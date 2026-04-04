#  Finance Backend API

This is the backend for a finance tracking app built as an internship screening assignment. It focuses on secure authentication, role-based access, transaction handling, and financial summaries.

## Overview

This project helps manage income and expense records and gives a quick view of financial activity through summary endpoints. The backend is built with Node.js, Express, MongoDB, and Mongoose.

## Main Features

- JWT authentication with protected routes
- Role-based authorization for viewer, analyst, and admin users
- Password hashing with bcrypt
- Transaction management for income and expense records
- Pagination on transaction listing
- Soft delete for transactions, with restore support
- Account activation and deactivation for users
- Rate limiting to protect the API from abuse
- Summary endpoints for overview, category-wise totals, monthly data, and recent transactions
- CORS support and centralized MongoDB connection handling

## Role Access

### Admin
- Create, update, delete, and restore transactions
- Create users and manage roles
- Activate or deactivate users
- View all transaction and summary data

### Analyst
- View all transactions
- View all summary endpoints
- Cannot create, update, or delete transactions

### Viewer
- View summary endpoints
- See high-level financial insights
- Cannot manage transactions or users

## API Endpoints and Responses

### Authentication

#### `POST /api/auth/login`
Logs in a user and returns a JWT token.

Response:
- `200 OK`: Login successful, token, and basic user details
- `400 Bad Request`: Email or password missing
- `401 Unauthorized`: Invalid credentials
- `403 Forbidden`: Account is deactivated

### Users

#### `POST /api/user/create`
Creates a new user. Admin only.

Response:
- `201 Created`: Newly created user object
- `400 Bad Request`: User already exists or validation failed
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Not allowed for this role

#### `GET /api/user/all`
Returns all users without passwords.

Response:
- `200 OK`: Array of users
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Not allowed for this role

#### `PUT /api/user/update-role/:id`
Updates a user role. Admin only.

Response:
- `200 OK`: Updated user object
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Not allowed for this role

#### `PUT /api/user/update-status/:id`
Activates or deactivates a user. Admin only.

Response:
- `200 OK`: Updated user object
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Not allowed for this role

#### `DELETE /api/user/delete/:id`
Deletes a user. Admin only.

Response:
- `200 OK`: Deleted user object
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Not allowed for this role

### Transactions

#### `POST /api/transaction/add`
Creates a new income or expense transaction. Admin only.

Response:
- `201 Created`: Newly created transaction
- `400 Bad Request`: Validation error
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Not allowed for this role

#### `GET /api/transaction/all`
Returns paginated transactions. Admin and analyst only.

Query params:
- `page`: page number
- `limit`: items per page

Response:
- `200 OK`: `count`, `total`, `page`, `totalPages`, and `data`
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Not allowed for this role

#### `PUT /api/transaction/update/:id`
Updates a transaction. Admin only.

Response:
- `200 OK`: Updated transaction object
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Not allowed for this role

#### `DELETE /api/transaction/delete/:id`
Soft deletes a transaction. Admin only.

Response:
- `200 OK`: Success message with deleted transaction data
- `404 Not Found`: Transaction not found
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Not allowed for this role

#### `GET /api/transaction/trash`
Returns soft-deleted transactions. Admin only.

Response:
- `200 OK`: Array of deleted transactions
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Not allowed for this role

#### `PUT /api/transaction/restore/:id`
Restores a soft-deleted transaction. Admin only.

Response:
- `200 OK`: Restored transaction object
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Not allowed for this role

### Summary

#### `GET /api/summary/overview`
Returns total income, total expense, and balance.

Response:
- `200 OK`: `{ totalIncome, totalExpense, balance }`

#### `GET /api/summary/category-wise`
Returns totals grouped by category.

Response:
- `200 OK`: Array of category totals

#### `GET /api/summary/recent-transactions`
Returns the latest transactions.

Response:
- `200 OK`: Array of recent transactions

#### `GET /api/summary/monthly-summary`
Returns income and expense totals grouped by month.

Response:
- `200 OK`: Array of monthly summary objects

## Implementation Notes

- Transaction listing supports pagination through `page` and `limit` query params
- Soft deleted transactions are excluded from normal listings and summaries
- Protected routes require a valid Bearer token
- Admin-only routes are guarded by role checks
- Monthly and category summaries are built using MongoDB aggregation

## Testing Credentials

Use these accounts to test the different roles:

### Viewer
```json
{
  "email": "viewer@test.com",
  "password": "password123"
}
```

### Analyst
```json
{
  "email": "analyst@test.com",
  "password": "password123"
}
```

### Admin
```json
{
  "email": "admin@test.com",
  "password": "password123"
}
```

## Setup

1. Install dependencies with `npm install`
2. Add a `.env` file with `MONGODB_URI`, `JWT_SECRET`, and `PORT`
3. Start the server with `npm run server`

The server runs on `http://localhost:3000` by default.



**Created by:** AdiCoder \
**Last Updated:** April 2026  
