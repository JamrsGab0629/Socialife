SociaLife Reverse Proxy Setup
=============================

1. Clone the repository

git clone <github-repository-url>

cd socialife-appsdev


2. Make sure these files exist

docker-compose.yml

backend/Dockerfile

Frontend/Dockerfile

Frontend/nginx.conf

nginx/Dockerfile

nginx/nginx.conf

backend/.env


3. Build and start everything

docker compose up --build


4. Open the application

http://localhost


5. Stop the application

docker compose down


6. Start again without rebuilding

docker compose up


7. If the code was updated from GitHub

git pull

docker compose up --build


Architecture

Browser
   ↓
Nginx :80
   ├── /api/* → Backend :3000
   └── /*     → Frontend :80

Backend → PostgreSQL


Important:

The frontend must use:

/api

NOT:

http://localhost:3000/api



### this is all you need to do

1. Install Docker Desktop.

2. Clone the GitHub repository:

git clone <repository-url>

3. Enter the project:

cd socialife-appsdev

4. Create/configure the backend .env file if it is not included in GitHub.

5. Build and run everything:

docker compose up --build

6. Open the app:

http://localhost