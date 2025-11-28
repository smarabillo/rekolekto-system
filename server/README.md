# Rekolekto System Backend

## Overview

**Backend / Server:** Node.js + Express.js + Sequelize + PostgreSQL + bcrypt + JSON Web Tokens + dotenv + CORS + nodemon  
**Database:** PostgreSQL

This backend handles API endpoints, authentication, and database operations for the Rekolekto system.

---

## Stack

- **Express** – Minimal and flexible Node.js web framework for building APIs.
- **Sequelize** – Promise-based ORM for SQL databases (PostgreSQL, MySQL, SQLite, etc.).
- **bcrypt** – Securely hashes and compares passwords.
- **jsonwebtoken (JWT)** – Creates and verifies tokens for authentication.
- **dotenv** – Loads environment variables from a `.env` file.
- **CORS** – Enables cross-origin requests in Express.
- **Nodemon** – Automatically restarts the server on file changes (development only).

---

## Installation 

npm install express sequelize bcrypt jsonwebtoken dotenv cors
npm install --save-dev nodemon sequelize-cli


## ENV creation

PORT=3000
DATABASE_URL=postgres://username:password@localhost:5432/dbname
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=3600

## Start Server 

npm run start

## Sequelize commands

Generate a model and migration:
- npx sequelize-cli model:generate --name <Model/Table name> --attributes name:string, ... 

Generate a seeder: 
- npx sequelize-cli seed:generate --name demo-<Model/Table name>

NOTE: Custom scripts found in package json for shorter commands.