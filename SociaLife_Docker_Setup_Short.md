# SociaLife Docker Setup

## 1. Backend configuration

### `backend/Dockerfile`

```dockerfile
FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

### `backend/.dockerignore`

```text
node_modules
npm-debug.log
.env
.git
.gitignore
```

### `backend/server/server.js`

Make sure Express listens on `0.0.0.0`:

```js
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on PORT ${PORT}`);
});
```

### Backend `.env`

```env
DB_NAME=socialife
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=host.docker.internal
DB_PORT=5432
```

Keep the other required environment variables. Do not commit `.env`.

---

## 2. Build backend

```powershell
cd backend
docker build -t socialife-backend .
```

## 3. Run backend

Make sure PostgreSQL is running:

```powershell
docker run --rm --name socialife-backend -p 3000:3000 --env-file .env socialife-backend
```

Backend:

`http://localhost:3000`

Expected:

```text
Database connected successfully.
Database tables synchronized.
Server is running on PORT 3000
```

---

## 4. Frontend configuration

### `frontend/Dockerfile`

```dockerfile
FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### `frontend/.dockerignore`

```text
node_modules
dist
npm-debug.log
.env
.git
.gitignore
```

---

## 5. Build frontend

```powershell
cd frontend
docker build -t socialife-frontend .
```

## 6. Run frontend

```powershell
docker run --rm --name socialife-frontend -p 8080:80 socialife-frontend
```

Open:

`http://localhost:8080`

---

## 7. Quick workflow

### Backend

```powershell
cd backend
docker build -t socialife-backend .
docker run --rm --name socialife-backend -p 3000:3000 --env-file .env socialife-backend
```

### Frontend

```powershell
cd frontend
docker build -t socialife-frontend .
docker run --rm --name socialife-frontend -p 8080:80 socialife-frontend
```
