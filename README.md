# FoodGuard AI

**“See it. Scan it. Secure it.”**
An AI-powered food safety, expiry monitoring, and inventory intelligence platform.

## Features
- **AI Food Scanner:** Upload or snap a picture of food packaging. The AI reads OCR labels, detects visible packaging damage, extracts expiry dates, and alerts you of safety issues.
- **Expiry Monitor & FEFO Engine:** Automatically prioritize the "Use First" inventory based on First-Expire-First-Out logic.
- **Risk Center:** Command center for actionable insights (expired products, storage temperature warnings).
- **Waste Analytics:** Track discarded food, dollar value, and AI insights to reduce waste.
- **GuardAI Chatbot:** A conversational AI assistant that can answer questions about your inventory in real-time.

## Tech Stack
- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Lucide React, Recharts
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL via Prisma ORM
- **AI/Vision:** Extendable `AIService` abstraction

## Running Locally

### Backend Setup
1. Navigate to `/backend`.
2. Install dependencies: `npm install`
3. Setup Environment:
   Create a `.env` file with `DATABASE_URL=postgres://user:pass@localhost:5432/foodguard`
4. Run migrations: `npx prisma db push`
5. Seed demo data: `npm run seed`
6. Start API server: `npm run dev`

### Frontend Setup
1. Navigate to `/frontend`.
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open the application on `http://localhost:5173`

## Hackathon Demo Flow
1. **Dashboard:** Show the executive view and AI recommendations.
2. **Scanner:** Upload a food package image to demonstrate the AI extracting expiry and risk levels.
3. **Inventory & Expiry:** Show how the scanned product automatically slots into the "Urgent" queue.
4. **Risk Center:** Demonstrate actionable food-safety tasks.
5. **Analytics & GuardAI:** Show the waste trends and chat with the AI about inventory.
