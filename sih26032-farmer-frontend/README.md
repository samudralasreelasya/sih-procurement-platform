# FarmSlot — SIH26032 Farmer-Side Frontend

A frontend prototype for the farmer side of SIH problem statement SIH26032.

## Included farmer flow
- Farmer login / registration UI
- Farmer dashboard
- Slot booking
- Virtual/live queue status
- Procurement tracking
- Payment status
- Notifications
- Responsive mobile layout

## Run locally

Requirements: Node.js 18+ recommended.

```bash
npm install
npm run dev
```

Open the local URL shown by Vite.

## Important
This is a **frontend prototype with mock data**. The forms and navigation work locally, but there is no real backend, database, SMS service, or authentication yet.

When your backend team creates APIs, replace the mock state/data in `src/main.jsx` with API calls (for example using `fetch` or Axios).
