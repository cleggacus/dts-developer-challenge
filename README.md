> Project hosted at: [https://dts-developer-challenge.vercel.app/](https://dts-developer-challenge.vercel.app/)

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

```
{
  title: (string, required) The title of the task
  description: (string, optional) A description of the task
  status: (string enum, required) ["not_started" | "in_progress" | "complete"]
  due: (string, required) The due date and time of the task in ISO format
}
```

#### Request

##### Success (HTTP 201 Created)

```json
{
  "id": "1",
  "title": "Task title",
  "description": "Task description",
  "status": "not_started",
  "due": "2025-05-01T12:00:00Z",
  "createdAt": "2025-04-26T12:00:00Z",
  "updatedAt": "2025-04-26T12:00:00Z"
}
```

##### Failure (HTTP 400 Bad Request)

```json
{
  "error": {
    "title": ["title is required"],
    "status": ["status must be not_started, in_progress, or complete"],
    "due": ["invalid date-time string"]
  }
}
```

##### Failure (HTTP 500 Internal Server Error)

```json
{
  "error": {
    "root": ["Server error"]
  }
}
```

### DELETE /api/tasks/delete

This endpoint is used to delete a task by its ID.

#### Request

URL: `/api/tasks/delete`
Method: `DELETE`
Content-Type: `application/json`
Request Body:

```
{
  id: (string, required) uuid of task
}
```

#### Response

##### Success (HTTP 200 OK)

```json
{
  "id": "7fs7238d-sdfi-3asdf-asdf-asdfasdf34",
  "title": "Complete the task documentation",
  "description": "Write detailed documentation for the API",
  "status": "not_started",
  "due": "2025-05-01T12:00:00Z",
  "createdAt": "2025-04-26T12:10:00Z",
  "updatedAt": "2025-04-26T12:10:00Z"
}
```

##### Failure (HTTP 400 Bad Request)

```json
{
  "error": {
    "id": ["Required"]
  }
}
```

##### Failure (HTTP 404 Bad Request)

```json
{
  "error": {
    "root": ["Cant find task"]
  }
}
```

##### Failure (HTTP 500 Internal Server Error)

```json
{
  "error": {
    "root": ["Server error"]
  }
}
```

### GET /api/tasks/get

This endpoint retrieves a task by its ID

#### Request

URL: `/api/tasks/get`
Method: `GET`
Content-Type: `application/json`
Request Body:

```
{
  id: (string, required) uuid of task
}
```

#### Response

##### Success (HTTP 200 OK)

```json
{
  "id": "7fs7238d-sdfi-3asdf-asdf-asdfasdf34",
  "title": "Complete the task documentation",
  "description": "Write detailed documentation for the API",
  "status": "not_started",
  "due": "2025-05-01T12:00:00Z",
  "createdAt": "2025-04-26T12:10:00Z",
  "updatedAt": "2025-04-26T12:10:00Z"
}
```

##### Failure (HTTP 400 Bad Request)

```json
{
  "error": {
    "id": ["Required"]
  }
}
```

##### Failure (HTTP 404 Bad Request)

```json
{
  "error": {
    "root": ["Cant find task"]
  }
}
```

##### Failure (HTTP 500 Internal Server Error)

```json
{
  "error": {
    "root": ["Server error"]
  }
}
```

### GET /api/tasks/list

This endpoint retrieves a list of all tasks

#### Request

URL: `/api/tasks/list`
Method: `GET`
Content-Type: `application/json`

#### Response

##### Success (HTTP 200 OK)

```json
[
  {
    "id": "7fs7238d-sdfi-3asdf-asdf-asdfasdf34",
    "title": "Complete the task documentation",
    "description": "Write detailed documentation for the API",
    "status": "not_started",
    "due": "2025-05-01T12:00:00Z",
    "createdAt": "2025-04-26T12:10:00Z",
    "updatedAt": "2025-04-26T12:10:00Z"
  },
  {
    "id": "asdfasdf-sdfi-3asdf-asdf-asdfasdf34",
    "title": "Fix bugs in the app",
    "description": "Fix critical bugs in the app",
    "status": "in_progress",
    "due": "2025-05-02T16:00:00Z",
    "createdAt": "2025-04-25T14:00:00Z",
    "updatedAt": "2025-04-26T10:00:00Z"
  }
]
```

##### Failure (HTTP 500 Internal Server Error)

```json
{
  "error": {
    "root": ["Server error"]
  }
}
```

### PUT /api/tasks/update

This endpoint is used to update an existing task

#### Request

URL: `/api/tasks/update`
Method: `PUT`
Content-Type: `application/json`
Request Body:

```
{
  id: (string, required) The uuid of task
  title: (string, optional) The title of the task
  description: (string, optional) A description of the task
  status: (string enum, optional) ["not_started" | "in_progress" | "complete"]
  due: (string, optional) The due date and time of the task in ISO format
}

```

#### Response

##### Success (HTTP 200 OK)

```json
{
  "id": "7fs7238d-sdfi-3asdf-asdf-asdfasdf34",
  "title": "Complete the task documentation",
  "description": "Write detailed documentation for the API",
  "status": "not_started",
  "due": "2025-05-01T12:00:00Z",
  "createdAt": "2025-04-26T12:10:00Z",
  "updatedAt": "2025-04-26T12:10:00Z"
}
```

##### Failure (HTTP 400 Bad Request)

```json
{
  "error": {
    "id": ["id is required"],
    "title": ["title is required"],
    "status": ["status must be not_started, in_progress, or complete"],
    "due": ["invalid date-time string"]
  }
}
```

##### Failure (HTTP 404 Not Found)

```json
{
  "error": {
    "root": ["Cant find task"]
  }
}
```

##### Failure (HTTP 500 Internal Server Error)

```json
{
  "error": {
    "root": ["Server error"]
  }
}
```
