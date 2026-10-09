# Node JS Task

A small REST API built with Node.js, Express, and MongoDB (through Mongoose) for registering users and managing their expenses.

## How the project works

When the application starts, `app.js` loads environment variables, configures Express JSON parsing, starts a MongoDB connection, registers the `/users` and `/expenses` routers, and listens for HTTP requests. Each router forwards a request to a controller. Controllers call service functions, which read or write MongoDB documents using the Mongoose models. The registration and expense-creation routes also run request validation middleware.

```text
HTTP request
  -> Express route
  -> validation middleware (where configured)
  -> controller
  -> service
  -> Mongoose model
  -> MongoDB
```

## Requirements

- Node.js and npm
- A MongoDB instance accessible by the application

## Configuration

Create a `.env` file in the project root:

```env
PORT=8080
MONGODB_URI=mongodb://127.0.0.1:27017/node-js-task
```

`PORT` is optional; the application uses port `8080` if it is not set. `MONGODB_URI` must point to a reachable MongoDB database. Keep real connection strings and credentials out of source control.

## Install and start

From the project root:

```bash
npm install
npm start
```

The start script runs `node app.js`. On startup, the server logs its port and logs a message when the MongoDB connection succeeds. The root endpoint can be used as a basic server check:

```bash
curl http://localhost:8080/
```

Expected response:

```text
working
```

The current `npm test` script is a placeholder and exits with an error; no automated test suite is configured yet.

## API

All endpoints use the server's configured port (default `8080`). Send JSON request bodies with `Content-Type: application/json` where a request body is shown below.

### Health check

#### `GET /`

Returns plain text to indicate that the HTTP server is responding.

Example response:

```text
working
```

### Users

#### `POST /users/register`

Registers a user.

Request body:

```json
{
  "name": "Alex Example",
  "email": "alex@example.com"
}
```

Validation requires `name` to be a string and `email` to be a string matching a basic email-address pattern.

The intended success response is JSON with `status: true` and the message `"User created successfully"`. The current implementation has a service/controller return-value issue: a newly created user is not returned by the service, so a new registration currently responds with HTTP `400`; a duplicate email can instead be treated as success. See [Known implementation gaps](#known-implementation-gaps).

### Expenses

Expense documents have these fields:

| Field | Type | Description |
|---|---|---|
| `userId` | MongoDB ObjectId | ID of the associated user |
| `title` | String | Expense title |
| `amount` | Number | Expense amount; creation validation requires a positive number |
| `categary` | String | Category field (spelled `categary` in the current code and API) |
| `description` | String | Optional description |

#### `POST /expenses`

Creates an expense for an existing user.

Request body:

```json
{
  "userId": "64f1234567890abcdef12345",
  "title": "Lunch",
  "amount": 18.5,
  "categary": "Food",
  "description": "Lunch with the team"
}
```

The intended success response is JSON with `status: true` and the message `"Expense added successfully"`. The current validation rejects a valid MongoDB user ID, so this route cannot currently create an expense using a valid ID. It also does not return the created expense in the response.

#### `GET /expenses`

Lists expenses. The service is written to support these filters and pagination values:

| Query parameter | Default | Description |
|---|---:|---|
| `page` | `1` | 1-based page number |
| `limit` | `10` | Number of results per page; intended maximum is `100` |
| `userId` | — | Filter by associated user ID |
| `categary` | — | Filter by category |

Example intended request:

```text
GET /expenses?page=1&limit=10&userId=64f1234567890abcdef12345&categary=Food
```

The service is designed to return `{ "data": [...], "pagination": { "page": 1, "limit": 10, "total": 0, "totalPages": 0 } }`. However, the current controller passes `req.body` rather than query parameters, attempts to reassign `const` pagination variables in the service, and does not include the service result in its response. The endpoint currently returns an error rather than a usable list.

#### `GET /expenses/:id`

Gets one expense by its MongoDB document ID.

Example intended request:

```text
GET /expenses/64f1234567890abcdef12345
```

The service is written to look up an `expenseId` and return the matching expense, but the current controller passes the request body instead of the `:id` route parameter and does not include the found expense in its response. As a result, this route does not currently retrieve an expense by the URL ID.

#### `PUT /expenses/:id`

Updates an expense. The service supports updating `userId`, `title`, `amount`, `categary`, and `description`, leaving omitted values unchanged.

Example intended request:

```text
PUT /expenses/64f1234567890abcdef12345
Content-Type: application/json

{
  "title": "Team lunch",
  "amount": 22
}
```

The current controller does not pass the URL ID to the service; the service instead looks for `expenseId` in the request body. There is no update-request validation, and the response does not contain the updated expense.

#### `DELETE /expenses/:id`

Deletes an expense by ID.

Example intended request:

```text
DELETE /expenses/64f1234567890abcdef12345
```

The current controller passes the request body rather than the URL ID. The service expects `expenseId`, so the route parameter is not currently used and the deleted document is not returned to the client.

## Data models

- **User**: `name` (String), `email` (String).
- **Expense**: `userId` (ObjectId), `title` (String), `amount` (Number), `categary` (String), `description` (String).

The schemas do not currently declare required fields, email uniqueness, timestamps, or a Mongoose relationship/population rule. In particular, there is no `createdAt` field configured even though the expense-list service sorts by it.

## Current API limitations

These are existing implementation issues that affect the API behavior documented above:

- User registration's service returns the pre-creation lookup result rather than the newly created user. It returns an `Error` object for duplicate email instead of throwing it, and the controller treats any truthy result as success.
- Expense creation validation rejects valid `userId` values because its ObjectId condition is inverted.
- Expense list pagination attempts to assign to variables declared with `const`; the list controller also reads `req.body` instead of query parameters and does not return the service result.
- Expense detail, update, and delete controllers do not pass the `:id` route parameter to their services.
- Expense controllers return success messages without the expense documents; their error responses currently use HTTP `500` and `status: true`.
- MongoDB connection errors are caught and converted to an `Error` return value, but are not thrown or otherwise handled by the caller. The server can therefore start listening even if the database connection fails.
- The `categary` spelling is used consistently by the current expense code; changing it would require a coordinated API/schema migration.

