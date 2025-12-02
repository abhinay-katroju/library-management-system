# API Examples

## Authentication

### Register New User
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "name": "New User",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@library.com",
    "password": "password123"
  }'
```

## Books

### Get All Books
```bash
curl http://localhost:3000/books
```

### Get Books with Filters
```bash
# Available books only
curl "http://localhost:3000/books?available=true"

# Search by title
curl "http://localhost:3000/books?search=Harry"

# Filter by year range
curl "http://localhost:3000/books?publishedYearFrom=1990&publishedYearTo=2000"

# Pagination
curl "http://localhost:3000/books?page=1&limit=10"
```

### Create Book (Protected)
```bash
TOKEN="your-jwt-token-here"

curl -X POST http://localhost:3000/books \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Book",
    "isbn": "978-1234567890",
    "publishedYear": 2024,
    "description": "A great book",
    "totalCopies": 5,
    "authorId": "author-uuid-here"
  }'
```

### Update Book (Protected)
```bash
TOKEN="your-jwt-token-here"

curl -X PATCH http://localhost:3000/books/{bookId} \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "availableCopies": 3
  }'
```

## Authors

### Get All Authors
```bash
curl http://localhost:3000/authors
```

### Search Authors
```bash
curl "http://localhost:3000/authors?search=rowling"
```

### Create Author (Protected)
```bash
TOKEN="your-jwt-token-here"

curl -X POST http://localhost:3000/authors \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Author",
    "bio": "Author biography",
    "country": "Country Name"
  }'
```

## Users

### Get All Users (Protected)
```bash
TOKEN="your-jwt-token-here"

curl http://localhost:3000/users \
  -H "Authorization: Bearer $TOKEN"
```

### Create User (Protected)
```bash
TOKEN="your-jwt-token-here"

curl -X POST http://localhost:3000/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "name": "User Name",
    "password": "password123",
    "role": "USER"
  }'
```

## Borrowed Books

### Borrow a Book (Protected)
```bash
TOKEN="your-jwt-token-here"

curl -X POST http://localhost:3000/borrowed-books/borrow \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-uuid-here",
    "bookId": "book-uuid-here",
    "dueDate": "2024-12-31T00:00:00.000Z"
  }'
```

### Return a Book (Protected)
```bash
TOKEN="your-jwt-token-here"

curl -X PATCH http://localhost:3000/borrowed-books/return/{borrowId} \
  -H "Authorization: Bearer $TOKEN"
```

### Get User's Borrowed Books (Protected)
```bash
TOKEN="your-jwt-token-here"

# All borrowed books for a user
curl http://localhost:3000/borrowed-books/user/{userId} \
  -H "Authorization: Bearer $TOKEN"

# Only currently borrowed books
curl "http://localhost:3000/borrowed-books/user/{userId}?status=BORROWED" \
  -H "Authorization: Bearer $TOKEN"

# Only returned books
curl "http://localhost:3000/borrowed-books/user/{userId}?status=RETURNED" \
  -H "Authorization: Bearer $TOKEN"
```

### Get All Borrowed Books (Protected)
```bash
TOKEN="your-jwt-token-here"

curl http://localhost:3000/borrowed-books \
  -H "Authorization: Bearer $TOKEN"
```

## Complete Workflow Example

```bash
# 1. Login and get token
TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@library.com","password":"password123"}' \
  | jq -r '.access_token')

echo "Token: $TOKEN"

# 2. Get all books
curl -s http://localhost:3000/books | jq '.data[0]'

# 3. Get first book ID
BOOK_ID=$(curl -s http://localhost:3000/books | jq -r '.data[0].id')
echo "Book ID: $BOOK_ID"

# 4. Get first user ID
USER_ID=$(curl -s http://localhost:3000/users \
  -H "Authorization: Bearer $TOKEN" \
  | jq -r '.[0].id')
echo "User ID: $USER_ID"

# 5. Borrow the book
curl -X POST http://localhost:3000/borrowed-books/borrow \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"userId\": \"$USER_ID\",
    \"bookId\": \"$BOOK_ID\",
    \"dueDate\": \"2024-12-31T00:00:00.000Z\"
  }" | jq '.'

# 6. Check user's borrowed books
curl -s "http://localhost:3000/borrowed-books/user/$USER_ID" \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.'
```

## PowerShell Examples (Windows)

### Get Token
```powershell
$response = Invoke-RestMethod -Uri "http://localhost:3000/auth/login" `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"email":"admin@library.com","password":"password123"}'

$TOKEN = $response.access_token
Write-Host "Token: $TOKEN"
```

### Get Books with Token
```powershell
$headers = @{
    "Authorization" = "Bearer $TOKEN"
}

Invoke-RestMethod -Uri "http://localhost:3000/books" -Headers $headers
```

### Create Book
```powershell
$headers = @{
    "Authorization" = "Bearer $TOKEN"
    "Content-Type" = "application/json"
}

$body = @{
    title = "New Book"
    isbn = "978-1234567890"
    publishedYear = 2024
    description = "A great book"
    totalCopies = 5
    authorId = "author-uuid-here"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/books" `
  -Method Post `
  -Headers $headers `
  -Body $body
```

## Response Examples

### Successful Login Response
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "email": "admin@library.com",
    "name": "Admin User",
    "role": "ADMIN"
  }
}
```

### Books List Response
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Harry Potter and the Sorcerer's Stone",
      "isbn": "978-0439708180",
      "publishedYear": 1997,
      "description": "The first book in the Harry Potter series",
      "totalCopies": 5,
      "availableCopies": 5,
      "authorId": "author-uuid",
      "author": {
        "id": "author-uuid",
        "name": "J.K. Rowling"
      }
    }
  ],
  "meta": {
    "total": 5,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

### Error Response
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```
