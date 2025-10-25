eSwift Admin Web (React)

Setup

- `cd frontend/admin-web`
- `npm install`
- Create `.env` from `.env.example` and set `VITE_API_BASE_URL` if needed
- `npm run dev`

Features

- Login + token persistence
- Restaurants: list, create, detail, logo upload
- Menu: list, create, edit, delete
- Menu item image: upload (POST) and update (PATCH) via multipart, delete via DELETE

Endpoints

- Uses the backend at `VITE_API_BASE_URL` (default http://localhost:5001)

