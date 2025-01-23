# Roomie Sync

A roommate management App designed to make shared living more organized and collaborative. With user authentication and group joining capabilities, roommates can work together to manage their household effectively. This app provides tools for shared alarms, expense tracking, and chore management to ensure everyone contributes fairly and stays informed.

## Features 
1. Shared Alarm System
- View when your roommates are waking up.
- Coordinate schedules easily for shared activities or quiet times.
- Set and update alarms collaboratively to stay in sync.

2. Expense Tracking
- Record and track shared expenses.
- Keep everyone accountable for their share of household costs.
- Simplify the process of splitting bills and keeping financial transparency.

3. Chore Dashboard
- Create and assign household chores.
- Set reminders for chores to ensure they are completed on time.
- Track contributions and keep the household running smoothly.

## Gaols 
The app aims to:
- Foster better communication and organization within shared households.
- Encourage fairness and accountability among roommates.
- Reduce misunderstandings and make managing shared responsibilities easier.

## Tech Stack 
- Frontend: Typescript, React, CSS, and some Tailwind 
- Backend: Python with Flask
- DB: supabase

## Prerequisites

- Install [pipenv](https://pipenv.pypa.io/en/latest/index.html) to manage dependencies.
- Install NodeJS/npm (should already have this from frontend) for Supabase, what we're using for database and authentication.

# Backend Setup

```
cd backend/

# Start the backend
python app.py
```

# Database Setup

```
cd ./

# Start supabase containers (DB/Auth)
npx supabase start -x vector

# Get supabase API keys, links, etc.
npx supabase status

# Reset DB (for new seed data, schema, etc.)
npx supabase db reset
```

# Frontend
```
cd frontend/

# Install dependencies
npm i

# Run the development environment locally
npm run dev
```

# Backend architecture
- `app.py`: This is where application initialization code goes, and where you will call your routes functions to register routes/functionality (see `routes/`).
- `routes/`: This is where individual route handlers will be made, and where the bulk of logic and db actions will be done. Each file in this directory has a `XXXRoutes(app: Flask, supabase: Client)` function, and this function contains multiple routes for a single 'concern' (users, groups, alarms, etc.).
- `supabase/`: This is where supabase configuration lives. You should be aware of 2 flies:
    - `migrations/20240910200423_initialize.sql`: This is where schema/table definitions are defined.
    - `seed.sql`: This is where seed data is defined.
    
