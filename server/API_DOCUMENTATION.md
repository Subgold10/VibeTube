# YouTube Clone API Documentation

## Base URL

```
http://localhost:7272/api
```

## Authentication

All protected routes require a valid JWT token sent via HTTP-only cookies.

## Endpoints

### Authentication

#### POST /auth/signup

Create a new user account.

**Request Body:**

```json
{
  "name": "string (min: 3 chars)",
  "email": "string (valid email format)",
  "password": "string (min: 6 chars)"
}
```

**Response:**

- `200`: User created successfully
- `400`: Validation error
- `409`: User already exists

#### POST /auth/signin

Authenticate existing user.

**Request Body:**

```json
{
  "name": "string",
  "password": "string"
}
```

**Response:**

- `200`: Login successful, returns user data
- `400`: Invalid credentials
- `404`: User not found

### Videos

#### POST /videos

Upload a new video with files.

**Headers:**

- `Content-Type: multipart/form-data`
- `Authorization: Bearer <token>` (via cookies)

**Form Data:**

- `title`: string (3-100 chars)
- `desc`: string (10-1000 chars)
- `tags`: string (comma-separated)
- `imgFile`: image file
- `videoFile`: video file

**Response:**

- `201`: Video uploaded successfully
- `400`: Validation error
- `401`: Unauthorized

#### GET /videos/random

Get random videos.

**Response:**

- `200`: Array of random videos

#### GET /videos/trend

Get trending videos (most viewed in last 7 days).

**Response:**

- `200`: Array of trending videos

#### GET /videos/search?q=<query>

Search videos by title.

**Query Parameters:**

- `q`: Search query (2-100 chars)

**Response:**

- `200`: Array of matching videos
- `400`: Invalid search query

#### GET /videos/find/:id

Get video by ID.

**Response:**

- `200`: Video data
- `404`: Video not found

#### GET /videos/user/:userId

Get all videos by user.

**Response:**

- `200`: Array of user's videos

#### GET /videos/sub

Get videos from subscribed channels.

**Headers:**

- `Authorization: Bearer <token>` (via cookies)

**Response:**

- `200`: Array of videos from subscribed channels
- `401`: Unauthorized

#### PUT /videos/:id

Update video.

**Headers:**

- `Authorization: Bearer <token>` (via cookies)

**Request Body:**

```json
{
  "title": "string (3-100 chars)",
  "desc": "string (10-1000 chars)",
  "tags": "string"
}
```

**Response:**

- `200`: Video updated successfully
- `400`: Validation error
- `401`: Unauthorized
- `403`: Not video owner
- `404`: Video not found

#### DELETE /videos/:id

Delete video.

**Headers:**

- `Authorization: Bearer <token>` (via cookies)

**Response:**

- `200`: Video deleted successfully
- `401`: Unauthorized
- `403`: Not video owner
- `404`: Video not found

### Comments

#### POST /comments

Add a new comment.

**Headers:**

- `Authorization: Bearer <token>` (via cookies)

**Request Body:**

```json
{
  "videoId": "string",
  "desc": "string (1-500 chars)"
}
```

**Response:**

- `200`: Comment added successfully
- `400`: Validation error
- `401`: Unauthorized

#### GET /comments/:videoId

Get all comments for a video.

**Response:**

- `200`: Array of comments

#### DELETE /comments/:id

Delete a comment.

**Headers:**

- `Authorization: Bearer <token>` (via cookies)

**Response:**

- `200`: Comment deleted successfully
- `401`: Unauthorized
- `403`: Not comment owner or video owner
- `404`: Comment not found

### Users

#### GET /users/find/:id

Get user by ID.

**Response:**

- `200`: User data
- `404`: User not found

#### PUT /users/sub/:id

Subscribe to a user.

**Headers:**

- `Authorization: Bearer <token>` (via cookies)

**Response:**

- `200`: Successfully subscribed
- `401`: Unauthorized

#### PUT /users/unsub/:id

Unsubscribe from a user.

**Headers:**

- `Authorization: Bearer <token>` (via cookies)

**Response:**

- `200`: Successfully unsubscribed
- `401`: Unauthorized

#### PUT /users/like/:videoId

Like a video.

**Headers:**

- `Authorization: Bearer <token>` (via cookies)

**Response:**

- `200`: Video liked successfully
- `401`: Unauthorized

#### PUT /users/dislike/:videoId

Dislike a video.

**Headers:**

- `Authorization: Bearer <token>` (via cookies)

**Response:**

- `200`: Video disliked successfully
- `401`: Unauthorized

### Channels

#### POST /channels

Create a new channel.

**Headers:**

- `Authorization: Bearer <token>` (via cookies)

**Request Body:**

```json
{
  "name": "string (3-50 chars)",
  "description": "string (max: 500 chars)"
}
```

**Response:**

- `201`: Channel created successfully
- `400`: Validation error
- `401`: Unauthorized

#### GET /channels/:userId

Get channel by user ID.

**Response:**

- `200`: Channel data
- `404`: Channel not found

#### PUT /channels

Update channel.

**Headers:**

- `Authorization: Bearer <token>` (via cookies)

**Request Body:**

```json
{
  "name": "string (3-50 chars)",
  "description": "string (max: 500 chars)"
}
```

**Response:**

- `200`: Channel updated successfully
- `400`: Validation error
- `401`: Unauthorized

### History

#### POST /history/add

Add video to history.

**Headers:**

- `Authorization: Bearer <token>` (via cookies)

**Request Body:**

```json
{
  "userId": "string",
  "videoId": "string"
}
```

**Response:**

- `200`: Video added to history
- `401`: Unauthorized

#### GET /history/user/:userId

Get user's watch history.

**Response:**

- `200`: Array of history entries

#### DELETE /history/user/:userId

Clear user's watch history.

**Headers:**

- `Authorization: Bearer <token>` (via cookies)

**Response:**

- `200`: History cleared successfully
- `401`: Unauthorized

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "status": 400,
  "message": "Error description"
}
```

## File Upload

- **Image files**: Accepted formats: jpg, jpeg, png, gif, webp
- **Video files**: Accepted formats: mp4, avi, mov, wmv, flv
- **Maximum file size**: 100MB per file
