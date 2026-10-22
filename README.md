<p align="center">
  <img src="docs/images/banner.svg" alt="SkyBranch: grow your org chart" width="100%">
</p>

<p align="center">
  A cloud-hosted employee hierarchy manager. Your organisation is drawn as a living tree, every person is a branch,
  and every reporting line is a connection, all kept in sync with a live database.
</p>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React_19-56688f?style=flat&logo=react&logoColor=white">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-56688f?style=flat&logo=typescript&logoColor=white">
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js_22-5f9e7f?style=flat&logo=nodedotjs&logoColor=white">
  <img alt="Express" src="https://img.shields.io/badge/Express-5f9e7f?style=flat&logo=express&logoColor=white">
  <img alt="Prisma" src="https://img.shields.io/badge/Prisma_7-3a3f55?style=flat&logo=prisma&logoColor=white">
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-3a3f55?style=flat&logo=postgresql&logoColor=white">
</p>

<p align="center">
  <a href="https://sky-branch.vercel.app"><b>Live app</b></a> &nbsp;·&nbsp;
  <a href="docs/user-guide.md">User guide</a> &nbsp;·&nbsp;
  <a href="docs/technical-document.md">Technical document</a>
</p>

Built by Chinmayi Santhosh as a technical assessment for EPI-USE Africa.

> **Please note:** the app runs on free hosting that goes to sleep when idle. The first request after a quiet spell can take about a minute. The login page shows a "waking up the server" message while this happens. Wait for it and the page will carry on by itself.

## Where it runs

SkyBranch is deployed across three platforms, each doing one job. All of them deploy from this repository.

| Platform | Role | Link |
|---|---|---|
| **Vercel** | Frontend (React app) | https://sky-branch.vercel.app |
| **Render** | Backend (Express API) | [API health check](https://skybranch-api.onrender.com/api/health) |
| **Neon** | PostgreSQL database | https://neon.tech · project `skybranch`, branch `production`, AWS Europe Central 1 (Frankfurt) |

The database is private, so it has no public address. The app and the API are the public parts. The first request to the API after it has been idle may be slow (see the note above).

| | |
|---|---|
| **Repository** | https://github.com/ChinmayiSanthosh/SkyBranch |
| **Reviewer login** | Supplied in the submission email (not published in this public repository) |

## Screenshots

**Canopy: the organisation as a tree**

![Canopy tree view](docs/images/canopy.png)

**Roster: sort and filter on every column**

![Roster table view](docs/images/roster.png)

| Sign in | Employee sign-up |
|---|---|
| ![Login page](docs/images/login.png) | ![Employee sign-up page](docs/images/signup.png) |

**About: live organisation statistics**

![About section](docs/images/about.png)

## What it does

- **Canopy (tree view):** the organisation as a branching tree on a horizon line. Pan by dragging, zoom with the + and - buttons or Ctrl + scroll, fit the whole tree in view, flip it between an upward-growing tree and a conventional top-down chart, and click a person for their details.
- **Search the tree:** matches are highlighted, everyone else is dimmed, the view glides to the first match, and Enter cycles through the rest.
- **Roster (table view):** sort on every column, filter each column, search everything at once, and filter salary with operators such as `>100000`.
- **Manage people:** add, edit and delete employees. Choose each person's manager, or none for the top of the organisation.
- **Gravatar avatars:** pictures appear automatically from each employee's email, with initials as a fallback.
- **Two kinds of login:** administrators manage everything; employees get a view-only account with salaries hidden (see below).
- **Light and dark themes:** a toggle in the header, remembered by the browser.
- **Server rules, not just screen rules:** age, salary, manager and circular-chain checks are enforced by the API.

### Two kinds of login

| | Administrator | Employee |
|---|---|---|
| How the account is created | Created by an existing administrator, or as the very first account on an empty database | The employee opens `/signup` and chooses a password. Only works for an email that already belongs to an employee record, and each employee can have one login |
| Can see salaries | Yes | No. The API returns no salary at all |
| Can add, edit, delete | Yes | No. The API refuses with 403 |

Employees are records in the org chart. A login is a separate account, so being listed as an employee does not by itself let anyone sign in.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8, TypeScript, react-router-dom 7, CSS Modules. No UI or charting library: the tree is hand-built SVG |
| Backend | Node 22, Express, TypeScript, zod, helmet, cors, express-rate-limit |
| Database | PostgreSQL on Neon (serverless, Frankfurt), accessed through Prisma 7 |
| Auth | JSON Web Tokens, bcrypt password hashing |
| Avatars | Gravatar (SHA-256 of the email, requested directly by the browser) |
| Hosting | Vercel (frontend), Render (API), Neon (database), deployed from GitHub |

The reasoning for each choice is in the [technical document](docs/technical-document.md).

## Architecture

```
Browser (React app on Vercel)
        |  REST / JSON over HTTPS, JWT in the Authorization header
        v
Express API on Render:  routes -> controllers -> services -> Prisma
        |
        v
Neon serverless PostgreSQL (AWS eu-central-1, Frankfurt)

Gravatar images are loaded by the browser straight from gravatar.com.
```

## Repository structure

```
SkyBranch/
├── apps/
│   ├── api/                          Express + TypeScript REST API (@skybranch/api)
│   │   ├── prisma/                   Schema and versioned migrations
│   │   ├── src/
│   │   │   ├── config/               Environment settings
│   │   │   ├── controllers/          Request and response handling
│   │   │   ├── middleware/           Auth and role checks, request validation, error handling
│   │   │   ├── routes/               URL to controller mapping, including health checks
│   │   │   ├── services/             Business rules: hierarchy, salary privacy, sign-up and login
│   │   │   ├── utils/                Error type and async handler
│   │   │   ├── validators/           zod schemas for requests
│   │   │   ├── db.ts                 Prisma client
│   │   │   └── index.ts              App setup: helmet, CORS, rate limits, routes
│   │   └── prisma.config.ts          Prisma settings (direct connection for migrations)
│   └── web/                          React single-page app (@skybranch/web)
│       ├── vercel.json               Rewrite so refreshing a client route does not 404
│       └── src/
│           ├── components/
│           │   ├── atoms/            Button, Input, Select, Logo, Avatar and other basics
│           │   ├── molecules/        Form fields, search box, modal, nav menu, tree node, zoom controls
│           │   ├── organisms/        Login and sign-up forms, header, employee form, table, tree, sections
│           │   └── templates/        AuthLayout and AppLayout
│           ├── pages/                Login, sign-up and home pages
│           ├── routes/               Protected route (redirects to login)
│           ├── context/              AuthContext (session state)
│           ├── hooks/                Employees, pan and zoom, active section, permissions, theme
│           ├── services/             Typed API client and shared types
│           ├── utils/                Tree layout, validation, formatting, scrolling
│           ├── constants/            Section names for the navigation
│           └── styles/               Design tokens (including the dark theme) and global styles
├── docs/
│   ├── user-guide.md                 Step-by-step guide for end users
│   ├── technical-document.md         Architecture, patterns, technologies and justification
│   └── images/                       Banner and screenshots
├── .github/workflows/                Reserved for CI (not built yet)
├── .env.example                      API variable names (no secrets)
└── package.json                      npm workspaces and dev scripts
```

`apps/web/.env.example` lists the frontend variable.

## Running it locally

**You need:** Node.js 22 or later, npm, and a PostgreSQL database (a free Neon project works).

```bash
git clone https://github.com/ChinmayiSanthosh/SkyBranch.git
cd SkyBranch
npm install
```

1. Copy `.env.example` to `apps/api/.env` and fill in the values below.
2. Copy `apps/web/.env.example` to `apps/web/.env.local` and set `VITE_API_URL=http://localhost:4000`.
3. Create the tables in an empty database: from `apps/api`, run `npx prisma migrate deploy`.
4. Start everything from the repo root:

```bash
npm run dev          # API and web together
npm run dev:api      # API only
npm run dev:web      # web only
```

The web app runs on http://localhost:5173 and the API on http://localhost:4000.

**First administrator.** On an empty database, `POST /api/auth/register` with an email and password creates the first account. After that, registration is closed to the public and only administrators can use it.

### Environment variables

Names only. Real values are never committed, and `.env` is git-ignored.

| Variable | Used by | Purpose |
|---|---|---|
| `DATABASE_URL` | API | Pooled Neon connection used by the running app |
| `DATABASE_URL_UNPOOLED` | API | Direct Neon connection used for migrations |
| `JWT_SECRET` | API | Secret that signs login tokens. Use a different value in production |
| `PORT` | API | Port to listen on (4000 locally) |
| `CORS_ORIGIN` | API | The frontend address allowed to call the API. Leave empty locally; set it in production |
| `NODE_VERSION` | Render | Node version for the build (22.12.0) |
| `VITE_API_URL` | Web | Address of the API |

## Deployment

Vercel and Render deploy automatically when the `main` branch changes.

- **API (Render):** free Node web service. Build command `npm ci --include=dev && npm run build --workspace apps/api`, start command `npm run start --workspace apps/api`. Set `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `JWT_SECRET`, `NODE_VERSION` and `CORS_ORIGIN`.
- **Frontend (Vercel):** root directory `apps/web`, Vite preset, variable `VITE_API_URL`. `apps/web/vercel.json` rewrites every path to `index.html` so refreshing on `/login` does not return a 404.
- **Database (Neon):** one project; the app uses the pooled connection and migrations use the direct one.

## How it meets the assessment

| Requirement | How SkyBranch meets it |
|---|---|
| Create, read, update, delete employees | Add, edit and delete from the tree's details panel and from the Roster, through the API |
| Reporting line manager; nobody their own manager; some people have none | Manager dropdown (excludes the person being edited), empty for the top of the organisation. The API also rejects self-management and circular chains |
| Minimum fields | Name, surname, birth date, employee number (generated), salary, role and manager. Email is also stored for Gravatar |
| Visual hierarchy, searchable, find / edit / delete | Canopy tree with search highlighting, and Edit and Delete on a selected person |
| Table with sort and filter on any field | Roster: sortable columns, a filter per column, and a global search |
| Gravatar integration | Avatars shown on the tree and in the table, with initials as fallback |
| Avatar upload (optional) | Not built. Listed as future work |
| Cloud deployed, reachable by URL | Vercel, Render and Neon, linked in "Where it runs" above |
| User guide | [docs/user-guide.md](docs/user-guide.md) |
| Short technical document | [docs/technical-document.md](docs/technical-document.md) |
| No mocked data | All data lives in the remote Neon database. Nothing is hardcoded or read from local files |
| Git repository | This repository |
| Extra functionality documented | See section 13 of the technical document |
