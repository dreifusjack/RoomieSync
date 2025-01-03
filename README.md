# Roomie Sync

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
    
