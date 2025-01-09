BEGIN;

-- Allows us to use gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- not a 'real' table - just for learning/dev purposes
CREATE TABLE examples (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamp WITH time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    some_text varchar(100) NOT NULL
);

CREATE TABLE groups (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(100) NOT NULL,
    group_code varchar(10) UNIQUE NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id uuid PRIMARY KEY REFERENCES auth.users(id),
    group_id uuid REFERENCES groups(id),
    first_name varchar(100) NOT NULL,
    last_name varchar(100) NOT NULL,
    email varchar(100) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE expenses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id uuid REFERENCES groups(id),
    paid_by uuid REFERENCES users(id),
    amount numeric NOT NULL,
    description varchar(100) NOT NULL,
    is_paid boolean NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE expense_payment (
    amount_paid numeric NOT NULL,
    recipient uuid REFERENCES users(id),
    payer uuid REFERENCES users(id),
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chores (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id uuid REFERENCES groups(id),
    name varchar(100) NOT NULL,
    description varchar(100) NOT NULL,
    cadence varchar(100) NOT NULL, 
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chore_assignments (
    chore_id uuid REFERENCES chores(id) ON DELETE CASCADE,
    user_id uuid REFERENCES users(id),
    due_date timestamp NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (chore_id, user_id)
);

CREATE TABLE alarms (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES users(id),
    name varchar(100) UNIQUE NOT NULL,
    time time NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

COMMIT;