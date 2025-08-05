# 3D Metasphere  

## Introduction  
This project consists of a backend (using PostgreSQL, Prisma, and Node.js) and a frontend (React). The backend handles the database operations and API endpoints, while the frontend provides an interface for users to interact with the application.  

---

## Backend Setup  

### 1. Database Setup  
Run the following command to start a PostgreSQL container:  
```bash  
docker run -p 5432:5432 -e POSTGRES_PASSWORD=<your_password> -d postgres 
```
Explanation:  
- `-p 5432:5432`: Maps port 5432 of the container to your local machine. <br>
- `-e POSTGRES_PASSWORD=<your_password>`: Sets the PostgreSQL password. <br>
- `-d postgres`: Runs the PostgreSQL container in detached mode using the `postgres` image.

### 2. Migrate the Database
Apply any pending database migrations by running:
```bash
npx prisma migrate dev  
```
Explanation:<br>
- This applies all migrations to the PostgreSQL database, ensuring the schema is up to date.<br>

### 3. Generate Prisma Client
Generate the necessary Prisma client files with:
```bash
npx prisma generate  
```
Explanation:<br>
- This generates the Prisma client code required to interact with the database.<br>

### 4. Build and Start the Backend
Navigate to the http directory and run the following commands:
```bash
npm run build  
npm run start
```
Explanation:
- `npm run build`: Builds the backend code.<br>
- `npm run start`: Starts the backend server.<br>

## Running Tests

### 5. Run Tests
Navigate to the tests directory and execute:
```bash
npm run test  
```
Explanation:<br>
- This command runs all unit and integration tests to ensure the backend is working correctly.<br>

## Frontend Setup
### 6. Run the Frontend
Navigate to the frontend directory and start the frontend with:
```bash
npm start  
```
Explanation:<br>
- This starts the frontend development server on the default port (usually http://localhost:3000).<br>








