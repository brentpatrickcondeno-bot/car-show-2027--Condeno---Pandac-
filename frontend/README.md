# Frontend — Car Show Registration Dashboard

## Quick Start

```bash
cd frontend
npm install
npm run dev
```

The app will be available at **http://localhost:5173**.

## API Configuration

The API base URL is set via the environment variable `VITE_API_BASE_URL` in `frontend/.env.development`:

```
VITE_API_BASE_URL=http://localhost:5205
```

This points to the C# backend API (default port 5205).

## Switching between Sample Data and the Real API

Open `src/pages/RegistrationsPage.jsx` and change the import on **line 2**:

- **Sample data (works offline, no backend needed):**
  ```js
  import { getRegistrations, getSummary } from '../api/sample-data'
  ```

- **Real API (backend must be running on http://localhost:5205):**
  ```js
  import { getRegistrations, getSummary } from '../api/registrationsApi'
  ```

Both files export the **same function names** (`getRegistrations`, `getSummary`) and **identical return shapes**, so no other code changes are required when switching.

### Return Shapes

**`getRegistrations({ participantName, type, status, page, pageSize })`** returns:
```js
{
  items: [...],           // Array of registration objects
  page: number,           // Current page
  pageSize: number,       // Items per page
  totalCount: number,     // Total filtered count
  totalPages: number      // Total pages
}
```

**`getSummary()`** returns:
```js
{
  totalRegistrations: number,
  confirmed: number,
  checkedIn: number,
  pending: number,
  cancelled: number,
  totalFees: number,
  totalPayments: number,
  uncollectedPayments: number
}
```