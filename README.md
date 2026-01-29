# Nexus Academy - Online Learning Platform (Frontend)

Nexus Academy is a Next.js-based online learning platform scaffolded in this repository. It provides instructor and learner flows, course management, lessons, quizzes, and a modern UI component library used across the app.


---

## Key Features

- Instructor dashboard: create and manage courses, modules, lessons, quizzes.
- Learner experience: course catalog, course learning view, resources.
- Authentication flows: login, signup (including instructor signup), password reset and confirm.
- Reusable UI `shadcn` for rapid development.
- Lightweight client-side utils and API integration helpers.

## Tech stack

- Framework: Next.js
- Language: JavaScript / React
- Styling: Tailwind CSS (configured in project)
- REST API (Django Backend)

## Repo structure (high level)

- `app/` — Next.js app routes, pages and feature folders.
  - `app/(authentication)/` — Auth flows (login, signup, reset password).
  - `app/components/` — App-level React components and UI building blocks.
  - `app/lib/` — Utilities such as `axios` etc.
- `public/` — Static assets.


## Demo Section


[Demo App](https://nexusacademy.vercel.app)

![Landing Page](public\nexus_academy_1.webp "Nexus Academy Landing Page")


## For Trials

### Instructor Credentials

- **Username:** instructor
- **Password:** pass@1234

### Student Credentials
- **Username:** user
- **Password:** user@1234

### This repo will go private soon 😉
