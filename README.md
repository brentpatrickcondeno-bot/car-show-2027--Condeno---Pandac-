# Car Show Registration System

## Team

| MEMBER | ROLE |
|--------|------|
| Brent Patrick Condeno | Frontend Developer |
| John Anthony Pandac | Backend Developer |

## How to Run Both Apps

### Backend (C# API)
```bash
cd backend
dotnet run --project Api
```
- API: http://localhost:5205
- Scalar API docs: http://localhost:5205/scalar/v1

### Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
- App: http://localhost:5173

The frontend calls the backend at `http://localhost:5205` (configured via `VITE_API_BASE_URL` in `frontend/.env.development`). CORS is configured to allow the frontend origin.