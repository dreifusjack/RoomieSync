BEGIN;

-- Allows us to use gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- not a 'real' table - just for learning/dev purposes
CREATE TABLE examples (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamp WITH time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    some_text varchar(100) NOT NULL
);

CREATE TABLE users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name varchar(100) NOT NULL,
    last_name varchar(100) NOT NULL,
    email varchar(100) NOT NULL,
    password varchar(100) NOT NULL,
    supabase_id uuid UNIQUE NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE groups (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(100) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE group_members (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id uuid REFERENCES groups(id),
    user_id uuid REFERENCES users(id),
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE expenses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id uuid REFERENCES groups(id),
    amount numeric NOT NULL,
    description varchar(100) NOT NULL,
    paid_on timestamp NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE expense_participants (
    expense_id uuid REFERENCES expenses(id),
    user_id uuid REFERENCES users(id),
    is_paid boolean NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (expense_id, user_id)
);

CREATE TABLE chores (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id uuid REFERENCES groups(id),
    name varchar(100) NOT NULL,
    description varchar(100) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chore_assignments (
    chore_id uuid REFERENCES chores(id),
    user_id uuid REFERENCES users(id),
    due_date timestamp NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (chore_id, user_id)
);

CREATE TABLE alarms (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES users(id),
    name varchar(100) NOT NULL,
    time timestamp NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

COMMIT;