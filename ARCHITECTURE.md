# FoodGuard AI - Architecture

## System Overview

FoodGuard AI is a full-stack web application designed for food safety, expiry monitoring, and inventory intelligence.

The architecture is split into a **Frontend** (React + TypeScript) and a **Backend** (Node.js + Express + Prisma).

### Tech Stack
- **Frontend**: React, Vite, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript, Prisma ORM
- **Database**: PostgreSQL
- **AI/OCR**: Custom abstractions configurable via environment variables
- **Storage**: Object storage for images

## Directory Structure

```text
/FoodGuard AI
  /frontend             (React + Vite)
    /src
      /components       (Reusable UI elements)
      /pages            (Dashboard, Scanner, Inventory, etc.)
      /services         (API calls)
      /types            (TypeScript interfaces)
  /backend              (Node.js + Express)
    /src
      /controllers      (Route handlers)
      /routes           (API endpoint definitions)
      /services         (Business logic, AI integration)
      /prisma           (Database schema)
```

## AI Pipeline
1. Image uploaded by user
2. Uploaded to Object Storage
3. URL sent to AI Service
4. AI extracts info (Product name, expiry, risk, etc.)
5. Response mapped to Prisma model and saved

## Database Models (Core)
- **User** (Admin/Manager/Staff)
- **Business** (Location, Type)
- **Product** (Inventory Item)
- **Alert** (Expiry/Risk warnings)
- **WasteRecord** (Track discarded food)
