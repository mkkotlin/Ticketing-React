# 🎫 FastReactTicket Frontend

![React 19](https://img.shields.io/badge/React-19-blue?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-purple?logo=vite&logoColor=white)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-blue?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white)

Welcome to the frontend application for the **FastReactTicket** System—a modern, responsive, and robust ticketing and support platform built with **React**, **TypeScript**, and **Vite**.

This application provides customized dashboards and workflows for **Customers**, **Agents**, and **Administrators** to report, manage, and resolve tickets efficiently.

---
## URL: https://rticketflow.vercel.app/login
## 📸 Screenshots

| Customer Dashboard | Agent Dashboard |
| :---: | :---: |
| ![Customer Dashboard](./ticketing-frontend/screenshots/cutomer%20dashboard.png) | ![Agent Dashboard](./ticketing-frontend/screenshots/agent%20dashboard.png) |
| *View, filter, and track support tickets* | *View assigned tickets and update status* |

| Admin Dashboard | Ticket Action & Comments |
| :---: | :---: |
| ![Admin Dashboard](./ticketing-frontend/screenshots/admin%20dashboard.png) | ![Ticket Comment](./ticketing-frontend/screenshots/ticket%20action%20comment.png) |
| *Assign agents and manage ticket flow* | *Interactive comment section and collaboration* |

| Ticket Action Details |
| :---: |
| ![Ticket Details](./ticketing-frontend/screenshots/ticket%20action%20ss.png) |
| *Status and priority selection* |

---

## 🚀 Key Features

*   🔐 **Role-Based Authentication**: Secure login and registration with automatic role redirection (`Customer`, `Agent`, `Admin`).
*   📊 **Dynamic Dashboards**:
    *   **Customer Portal**: Submit tickets, track progress, and communicate with support agents.
    *   **Agent Workspace**: View assigned tickets, update ticket statuses, and respond to customers.
    *   **Admin Console**: Comprehensive ticket overview, agent assignments, and global status/priority control.
*   💬 **Interactive Ticket Activity**: Detail-oriented ticket page featuring live commenting and status selector tools.
*   ⚡ **Lightning-Fast Performance**: Built on top of **Vite** for near-instantaneous Hot Module Replacement (HMR) and optimized build bundles.
*   🛡️ **TypeScript Safety**: Fully typed application components, routes, and API responses.

---

## 🛠️ Tech Stack & Dependencies

*   **Framework**: [React 19](https://react.dev/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Build Tool**: [Vite 8](https://vite.dev/)
*   **Routing**: [React Router DOM v7](https://reactrouter.com/)
*   **API Client**: [Axios](https://axios-http.com/)
*   **Styles**: Custom Vanilla CSS for modularity and custom design theme

---

## 📂 Project Structure

```text
ticketing-frontend/
├── public/                 # Static assets
└── src/
    ├── api/                # API communication layers (axios, endpoints)
    │   ├── authApi.ts      # Authentication endpoints
    │   ├── ticketApi.ts    # Ticket management endpoints
    │   └── userApi.ts      # User management endpoints
    ├── assets/             # Images, fonts, and global assets
    ├── components/         # Reusable UI components
    │   ├── AdminDashboard.tsx
    │   ├── AgentDashboard.tsx
    │   ├── CustomerDashboard.tsx
    │   ├── CommentSection.tsx
    │   ├── StatusSelector.tsx
    │   └── Navbar.tsx
    ├── context/            # Auth and global state contexts
    │   └── AuthContext.tsx
    ├── pages/              # Page layouts & container components
    │   ├── Login.tsx
    │   ├── Register.tsx
    │   ├── Dashboard.tsx
    │   ├── Tickets.tsx
    │   ├── TicketDetail.tsx
    │   └── CreateTicket.tsx
    ├── routes/             # App routing and route-guards
    │   ├── AppRouters.tsx  # Centralized router definition
    │   ├── ProtectRoute.tsx # Auth protection filter
    │   └── RoleRoute.tsx   # Role verification filter
    ├── types/              # Type definitions
    ├── App.tsx             # App shell wrapper
    ├── index.css           # Global theme & styles
    └── main.tsx            # Main application entrypoint
```

---

## ⚙️ Getting Started

### 📋 Prerequisites

Before running the application, make sure you have the following installed:
*   [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
*   [npm](https://www.npmjs.com/) (usually comes with Node.js)

### 1. Installation

Clone the repository and navigate to the frontend directory:

```bash
cd ticketing-frontend
npm install
```

### 2. Configuration

Create a `.env` file in the root of the `ticketing-frontend` folder (or edit the existing one):

```env
VITE_API_URL=http://localhost:8000
```

> [!NOTE]
> Ensure this URL matches the host and port where your backend service/API is running.

### 3. Run the Development Server

Start the Vite development server:

```bash
npm run dev
```

The application will be available at [http://localhost:5173/](http://localhost:5173/) (or the port specified by Vite in the terminal).

### 4. Build for Production

To create an optimized production bundle:

```bash
npm run build
```

This compiles your assets and generates static files inside the `dist/` directory, ready to be hosted on Netlify, Vercel, or any other web server.

### 5. Linting

Run the linter to verify code style and quality:

```bash
npm run lint
```

---

## 🔒 Security and Route Guards

The frontend uses specialized route wrappers to enforce permissions:
*   **ProtectedRoute**: Blocks unauthenticated requests and redirects users to `/login`.
*   **RoleRoute**: resticts pages to users with specific roles (e.g., `["ADMIN"]` or `["AGENT", "ADMIN"]`).
