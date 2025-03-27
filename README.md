# 🚀 Express + MySQL + Sequelize API

This project is a REST API on **Express.js** with **MySQL** database and **Sequelize** ORM.

## Installation and launch

1. Install MySQL (if not installed)

2. Copy `.env.example` and create `.env`

```sh
cp .env.example .env
```

3. Edit `.env` to include your details.

4. Install dependencies:

```sh
yarn install
```

5. Run the `start` command, it will create the database, start the server and perform migrations:

```sh
yarn start
```

If everything went well, you should see the message "✅ Setup complete. Server is ready!"

## Base URL

`http://localhost:5000/api`

## Endpoints

### 1. POST /signin

Description: Authenticate and obtain an access token.

Request:

Body:

```
{
    "id": "89289312384",
    "password": "password123",
    "deviceId": "deviceXYZ"
}
```

Response:

```
{
    "accessToken": "qwerty",
    "refreshToken": "reftok123"
}
```

### 2. POST /signin/new_token

Description: Refresh the access token using the refresh token.

Request:

Body:

```
{
    "refreshToken": "reftok123",
}
```

Response:

```
{
    "accessToken": "qwerty",
}
```

### 3. POST /signup

Description: Register a new user.

Request:

Body:

```
{
    "id": "89289312384",
    "password": "password123",
    "deviceId": "deviceXYZ"
}
```

Response:

```
{
    "accessToken": "qwerty",
    "refreshToken": "reftok123"
}
```

### 4. GET /info

Description: Get user information.

Request:

Headers:

```
{
    "Authorization": "Bearer your_access_token_here"
}
```

Response:

```
{
    "id": "your_id"
}
```

### 5. GET /logout

Description: Log out.

Request:

Headers:

```
{
    "Authorization": "Bearer your_access_token_here"
}
```

Response:

```
{
    "message": "User logged out"
}
```

### 6. POST /file/upload

Description: Upload a file.

Request:

Body:

multipart/form-data (file field named file)

```
{
    "Authorization": "Bearer your_access_token_here"
}
```

Response:

```
{
    "message": "File uploaded successfully, id: 1743117309397"
}
```

### 7. GET /file/list

Description: Get a list of uploaded files.

Request:

Query Parameters:

`list_size` (optional, default: 10): Number of files to return per page.

`page` (optional, default: 1): Page number to return.

Headers:

```
{
    "Authorization": "Bearer your_access_token_here"
}
```

Response:

```
{
    "total": 100,
    "page": 1,
    "list_size": 10,
    "total_pages": 10,
    "files": [
        {
            "id": "12345",
            "name": "file1.png",
            "extension": ".png",
            "mime_type": "image/png",
            "size": 2048,
            "upload_date": "2025-03-01T12:00:00Z"
        },
        ...
    ]
}
```

### 8. DELETE /file/delete/:id

Description: Get a list of uploaded files.

Request:

Query Parameters:

`id`: The ID of the file to delete.

Headers:

```
{
    "Authorization": "Bearer your_access_token_here"
}
```

Response:

```
{
    "message": "File successfully deleted"
}
```

### 9. GET /file/:id

Description: Get detailed information about a file.

Request:

Query Parameters:

`id`: The ID of the file.

Headers:

```
{
    "Authorization": "Bearer your_access_token_here"
}
```

Response:

```
{
    "id": "12345",
    "name": "file1.png",
    "extension": ".png",
    "mime_type": "image/png",
    "size": 2048,
    "upload_date": "2025-03-01T12:00:00Z"
}
```

### 10. GET /file/download/:id

Description: Download a file by its ID.

Request:

Query Parameters:

`id`: The ID of the file.

Headers:

```
{
    "Authorization": "Bearer your_access_token_here"
}
```

Response:

File is downloaded directly.

### 11. PUT /file/update/:id

Description: Update a file by uploading a new version.

Request:

Query Parameters:

`id`: The ID of the file.

Headers:

```
{
    "Authorization": "Bearer your_access_token_here"
}
```

Response:

```
{
    "message": "File updated successfully"
}
```
