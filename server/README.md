-----------------------------------------------------

Backend/server: Node + Express JS + sequelize pg + bcyrpt + jsonwebtoken + dotenv + CORS + nodemon 
Database: PostgresQL

- Express – Minimal and flexible Node.js web framework for building APIs and server-side applications.
- Sequelize – Promise-based ORM for Node.js that supports SQL databases like PostgreSQL, MySQL, MariaDB, and SQLite.
- bcrypt – Library for securely hashing and comparing passwords.
- jsonwebtoken (JWT) – Standard for creating and verifying JSON Web Tokens used in authentication and authorization.
- dotenv – Loads environment variables from a .env file into process.env for configuration management.
- CORS – Middleware that enables and configures Cross-Origin Resource Sharing in Express.
- Nodemon – Development tool that automatically restarts the Node.js server when file changes are detected.

Installation:  

- npm install express sequelize bcrypt jsonwebtoken dotenv cors pg pg-hstore
- npm install --save-dev nodemon

-----------------------------------------------------

Sequilize Commands: 
- npx sequelize-cli model:generate --name User --attributes username:string,email:string,password:string (example) --> builds model and migration
- npx sequelize-cli seed:generate --name user --> builds seeder for user
