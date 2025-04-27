# DTS Developer Technical Test

This project is a solution developed as part of the [HMCTS Developer Technical Test](https://github.com/hmcts/dts-developer-challenge).

## The Stack

This project utilizes the following technologies:

- **Frontend**: 
  - Next.js/React for the frontend framework
  - Zod for schema form client side validation.

- **Backend**: 
  - Next.js app router route handlers to handle API endpoints (works as rest api).
  - Drizzle ORM
  - Neon DB (PostgreSQL for edge) is db to easily host on vercel

- **Testing**: 
  - Jest is used for unit testing both the frontend and backend.
  - React Testing Library for unit testing both the frontend and backend.

## API Endpoints

### `POST /api/tasks/create`

This endpoint is used to create a new task

#### Request

URL: `/api/tasks/create`  
Method: `POST`  
Content-Type: `application/json`
Request Body:
```json
{
  "title": "Task title",            // (string, required) The title of the task
  "description": "Task description", // (string, optional) A description of the task
  "status": "not_started", // (string enum, required) ["not_started" | "in_progress" | "complete"]
  "due": "2025-05-01T12:00:00Z" // (string, required) The due date and time of the task in ISO format
}
```
```

#### Request

##### Success (HTTP 201 Created)

