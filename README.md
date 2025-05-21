# 🛒 Product API with Auth, Caching and Likes

A simple Node.js RESTful API built with Express, MongoDB, and Redis. Features include authentication, product management, search, like functionality, and Redis caching for performance optimization.

---

## 📦 Features

- 🔐 User registration & login (JWT-based authentication)
- 🛍️ Product listing, creation, search
- ❤️ Like/unlike products
- ⚡ Redis-based response caching for `/products` listing
- 📄 Pagination and query support

---

## 🚀 Installation & Setup

### Prerequisites

- Node.js
- MongoDB
- Redis

### 1. Clone the repository

```bash
git clone https://github.com/nguyenphananhthien0210/product-test-api.git
cd product-test-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment variables

```env
MONGO_URI=mongodb://localhost:27017/product_test
REDIS_URI=redis://localhost:6379
JWT_SECRET=your_jwt_secret
PORT=3000
```

### 4. Start Redis

Make sure Redis is installed on your machine.

```bash
redis-server
```

### 5. Start the server

```bash
npm start
```

Server will run at http://localhost:3000

---

## 📘 API Documentation

### 🔐 Auth Routes

**`POST /auth/register`**
Registers a new user.

##### Request Body:

```json
{
  "username": "user1",
  "password": "user123"
}
```

##### Response:

```json
{
  "message": "User registered successfully"
}
```

**`POST /auth/login`**
Logs in an existing user and returns a JWT token.

##### Request Body:

```json
{
  "username": "user1",
  "password": "user123"
}
```

##### Response:

```json
{
  "token": "your_jwt_token"
}
```

### 🛍️ Product Routes

**`GET /api/products`**
Returns a paginated list of products (cached with Redis for 10 seconds).

##### Query Parameters:

- limit (optional, default: 10)

- page (optional, default: 1)

##### Response:

```json
{
  "currentPage": 1,
  "totalPages": 1,
  "totalItems": 1,
  "data": [
    {
      "_id": "productId",
      "name": "iPhone 15",
      "price": 999,
      "category": "Electronics",
      "subcategory": "Phones",
      "likes": 5
    }
  ]
}
```

**`POST /api/products`**
Create a new product (requires authentication).

##### Headers:

Authorization: Bearer token

##### Request Body:

```json
{
  "name": "iPhone 15",
  "price": 999,
  "category": "Electronics",
  "subcategory": "Phones"
}
```

##### Response:

```json
{
  "message": "Product created successfully"
  "data": {}
}
```

**`GET /api/products/search?q=term`**
Searches for products by name.

##### Query Parameters:

- q : search term

- limit (optional, default: 10)

- page (optional, default: 1)

##### Response:

```json
{
  "currentPage": 1,
  "totalPages": 1,
  "totalItems": 1,
  "data": [
    {
      "_id": "productId",
      "name": "iPhone 15",
      "price": 999,
      "category": "Electronics",
      "subcategory": "Phones",
      "likes": 5
    }
  ]
}
```

**`GET /api/products/:id/like`**

Toggles like/unlike a product for the authenticated user.

##### Headers:

Authorization: Bearer token

##### Response:

```json
{
  "message": "Update reaction successfully"
}
```

---

## 💡 Caching Strategy

- Caching is implemented via Redis for the GET /api/products route.

- Cached by the request URL (req.originalUrl) with a TTL of 10 seconds.

- If a cache hit occurs, the DB is bypassed for performance.

### Benefits:

⚡ Faster response times

📉 Reduced database load

🧠 Smarter usage of memory for frequent requests

---

## ⚙️ Optimization Techniques

📄 Pagination helps prevent over-fetching large data sets.

⚡ Redis cache accelerates performance and improves scalability.

---

## ❤️ Like Feature Details

- Likes are stored in a separate collection LikeProduct.
- Each like is linked to userId and productId.
- If already liked, the route toggles the value (like ↔ unlike).
- Like counts are returned on product listing and search via aggregation logic.

```

```

```

```
