# RoomieSync

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

## Goals

The app aims to:

- Foster better communication and organization within shared households.
- Encourage fairness and accountability among roommates.
- Reduce misunderstandings and make managing shared responsibilities easier.

## Architecture

**Frontend**

- Framework: Next.js

- Language: TypeScript

- Data Layer: TanStack Query

**Backend**

- Framework: Spring Boot (Java)

- Database: PostgreSQL

## Setup

**1. Run with Docker**

The simplest way to run RoomieSync is with Docker Compose.

`docker compose up`

This will start both the frontend and backend containers

To stop and remove containers:

`docker compose down`

Containers hosted on:

Frontend: http://localhost:3000

Backend: http://localhost:8080

Database: http://localhost:5432
