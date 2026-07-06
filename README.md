# Shipment Service

Shipment Service is a Node.js microservice responsible for managing shipments and cargo in the Maritime Shipping Cargo Management System.

This service is part of the graduation project and follows a microservices architecture where each service owns its own database.

---

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- ES6 Modules
- Docker
- JWT (planned)

---

## Project Structure

```
src/
│
├── config/
├── controllers/
├── middleware/
├── routes/
├── services/
├── validators/
├── utils/
├── app.js
└── server.js

prisma/
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd shipment-service
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create the environment file

```bash
cp .env.example .env
```

Update the values if necessary.

---

### 4. Start PostgreSQL

If using Docker:

```bash
docker compose up -d
```

---

### 5. Run Prisma migrations

```bash
npx prisma migrate dev --name init
```

---

### 6. Start the server

```bash
npm run dev
```

The API will be available at:

```
http://localhost:5000
```

---


## Architecture

This service follows a layered architecture:

```
Routes
    ↓
Controllers
    ↓
Services
    ↓
Prisma ORM
    ↓
PostgreSQL
```

---

## Database

This service owns its own database.

It stores:

- Shipments
- Cargo

Relationships with other microservices (such as Fleet Service) are maintained through identifiers (e.g., `shipId`) and validated through service-to-service communication instead of cross-database foreign keys.