<div align="center">

<img src="public/images/logo.png" alt="HelpingHands logo" height="80" />

# 🤝 HelpingHands

### Make Every Small Action Matter

A volunteer-events platform where people in Bangladesh can **discover, join, and create** meaningful social service events, from tree plantations to winter clothes distribution.

<br />

[![Live Site](https://img.shields.io/badge/🌐_Live_Site-Visit_Now-16a34a?style=for-the-badge)](https://helpinghandsnafis.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com)

### 🔗 [https://helpinghandsnafis.vercel.app](https://helpinghandsnafis.vercel.app)

</div>

---

## 📑 Table of Contents

1. [About](#-about)
2. [Key Features](#-key-features)
3. [Pages & Routes](#-pages--routes)
4. [Tech Stack](#-tech-stack)
5. [Project Structure](#-project-structure)
6. [Getting Started](#-getting-started)
7. [Environment Variables](#-environment-variables)
8. [Available Scripts](#-available-scripts)
9. [API Endpoints](#-api-endpoints)
10. [Author](#-author)

---

## 📖 About

**HelpingHands** connects volunteers with community service events. Anyone can browse events by category and status and join the ones they care about. Organizers can publish and manage their own events. Everything lives in a clean, responsive interface with light and dark themes.

---

## ✨ Key Features

### 🎯 For Volunteers

| | Feature | Description |
| :-: | --- | --- |
| 🔍 | **Browse & filter** | Search events, filter by category and status, and sort by soonest, latest or most joined |
| 📅 | **Upcoming events** | A dedicated page for what's coming next, plus a "near upcoming events" section on the home page |
| 🙋 | **Join & leave** | Join any event in one click and leave it any time from your Joined Events page |

### 🧑‍💼 For Organizers

| | Feature | Description |
| :-: | --- | --- |
| 📝 | **Create events** | Publish an event with title, category, location, date, image and description |
| ✏️ | **Manage events** | Edit or delete your own events. Events that have already ended are locked from editing and deletion |

### 🔐 Accounts & Security

| | Feature | Description |
| :-: | --- | --- |
| 🔑 | **Authentication** | Email and password sign-up/login plus **Continue with Google**, powered by Better Auth |
| 🛡️ | **Protected routes** | Create, manage and joined-events pages redirect guests to the login page |

### 🎨 Experience

| | Feature | Description |
| :-: | --- | --- |
| 🌗 | **Light / Dark mode** | Theme toggle without hydration flicker |
| 📱 | **Fully responsive** | Mobile menu and adaptive layouts for every screen size |
| ⚡ | **Smooth UX** | Skeleton loaders, toast notifications and a custom 404 page |
| 🖼️ | **Polished home page** | Hero banner, impact stats, near-upcoming events, photo gallery and newsletter section |

---

## 🧭 Pages & Routes

| Route | Page | Access |
| --- | --- | :-: |
| `/` | Home | 🌍 Public |
| `/events` | All events with search, filters and sorting | 🌍 Public |
| `/events/[id]` | Event details and join action | 🌍 Public |
| `/upcoming-events` | Upcoming events | 🌍 Public |
| `/login` | Log in | 🌍 Public |
| `/signup` | Sign up | 🌍 Public |
| `/create-event` | Create a new event | 🔒 Logged in |
| `/manage-event` | Edit or delete your events | 🔒 Logged in |
| `/joined-events` | Events you joined | 🔒 Logged in |

---

## 🛠️ Tech Stack

| Layer | Technologies |
| --- | --- |
| **Framework** | Next.js 16 (App Router), React 19 with React Compiler |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4, shadcn/ui (Base UI), tw-animate-css |
| **Auth** | Better Auth (email/password + Google OAuth, JWT plugin) |
| **Database** | MongoDB (via the Better Auth Mongo adapter) |
| **UI extras** | lucide-react icons, sonner toasts, next-themes |
| **Tooling** | ESLint 9, npm |

---

## 🗂️ Project Structure

```
src/
├── app/
│   ├── (auth)/              # login, signup
│   ├── (userarea)/          # create-event, manage-event, joined-events (protected)
│   ├── events/              # all events + event details ([id])
│   ├── upcoming-events/     # upcoming events listing
│   ├── api/auth/[...all]/   # Better Auth route handler
│   └── page.tsx             # home page
├── components/
│   ├── events/              # EventCard, browsers, Join/Leave/Edit/Delete actions
│   ├── home/                # HeroBanner, StatusSection, EventGallery, Newsletter...
│   ├── layout/              # Navbar, Footer
│   ├── userauth/            # LoginForm, SignupForm, ContinueWithGoogle
│   └── ui/                  # shadcn/ui primitives
├── lib/                     # auth, auth-client, JWT token helpers
├── commonfeatures/          # date helpers (Asia/Dhaka timezone)
├── proxy.ts                 # route protection
└── types.ts
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ and npm
- A MongoDB database
- A Google OAuth client (for Google sign-in)
- The HelpingHands REST API backend (the app reads events and participants from it)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/nafismahamudshahin/Helping-hands.git
cd Helping-hands

# 2. Install dependencies
npm install

# 3. Add your environment variables (see below), then start the app
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Environment Variables

Create a `.env.local` file in the project root:

```env
# MongoDB connection string used by Better Auth
DB_URL=your_mongodb_connection_string

# Better Auth
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Base URL of the events REST API
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## 📜 Available Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

---

## 🔌 API Endpoints

The client talks to a separate REST API (`NEXT_PUBLIC_API_URL`) and sends the Better Auth JWT for protected actions.

<details>
<summary><b>📅 Events</b></summary>

<br />

| Method | Endpoint | Purpose |
| :-: | --- | --- |
| `GET` | `/events` | List all events |
| `GET` | `/events/:id` | Event details |
| `GET` | `/upcoming-events` | Upcoming events |
| `GET` | `/near-upcoming-events` | Next events for the home page |
| `GET` | `/events/my/:userId` | Events created by a user |
| `POST` | `/events` | Create an event |
| `PATCH` | `/events/:id` | Edit an event |
| `DELETE` | `/events/:id` | Delete an event |

</details>

<details>
<summary><b>🙋 Participants</b></summary>

<br />

| Method | Endpoint | Purpose |
| :-: | --- | --- |
| `POST` | `/participants` | Join an event |
| `GET` | `/participants/me/:userId` | Events a user has joined |
| `DELETE` | `/participants/me/:joinId` | Leave an event |
| `GET` | `/check-join/:userId/:eventId` | Check if a user already joined |
| `PATCH` | `/count-joined/:eventId` | Update an event's joined count |

</details>

---

## 👤 Author

**Nafis Mahamud Shahin**

[![GitHub](https://img.shields.io/badge/GitHub-nafismahamudshahin-181717?style=flat-square&logo=github)](https://github.com/nafismahamudshahin)
[![Portfolio](https://img.shields.io/badge/Portfolio-nafismahamudshahin.vercel.app-16a34a?style=flat-square&logo=googlechrome&logoColor=white)](https://nafismahamudshahin.vercel.app)

---

<div align="center">

⭐ If you like this project, please give it a star! ⭐

Made with 💚 for a kinder, healthier and more inclusive Bangladesh.

</div>