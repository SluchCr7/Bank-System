# PFB Digital Banking System

A full-stack digital banking application with an Arabic-first customer interface, an administrative dashboard, and a REST API. The project is intended for development and demonstration; it is not a production banking or payment system.

## Contents

- [Features](#features)
- [Technology](#technology)
- [Project layout](#project-layout)
- [Requirements](#requirements)
- [Configuration](#configuration)
- [Run locally](#run-locally)
- [Application pages](#application-pages)
- [API reference](#api-reference)
- [Scripts and checks](#scripts-and-checks)
- [Security notes](#security-notes)

## Features

- User registration and login, profile editing, and account balance display.
- Account deposits and withdrawals, transfers between users, and transaction history.
- Virtual card creation, card balance operations, and transfers between account and card balances.
- Stripe Checkout deposit flow, with a local simulated redirect when no Stripe secret is configured.
- User notifications, including read and delete actions.
- Admin dashboard for browsing users, cards, and transactions; admins can change balances, grant admin access, and delete users.
- Redux Toolkit Query API integration and responsive Next.js pages.

## Technology

| Area           | Technologies                                                    |
| -------------- | --------------------------------------------------------------- |
| Frontend       | Next.js 16, React 19, TypeScript, Redux Toolkit, Tailwind CSS 4 |
| Backend        | Node.js, Express 5, Mongoose, MongoDB                           |
| Authentication | JSON Web Tokens, bcrypt, cookie-parser                          |
| Payments       | Stripe Checkout                                                 |

## Project layout

```text
back/
  Controllers/       Request handlers for auth, users, cards, transactions, and admin
  Middelwares/       JWT and admin authorization middleware
  config/            MongoDB connection
  models/            Mongoose user, card, transaction, and notification models
  routes/            Express route definitions
  utils/             API error and async-handler helpers
  index.js            Express app setup and API mounting
front/
  app/(website)/      Customer-facing pages and layout
  app/(Admin)/        Admin page and layout
  app/redux/          Redux store, auth slice, and RTK Query API
  Components/         Shared customer and admin UI components
```

## Requirements

- Node.js 20.9 or newer and npm.
- MongoDB, running locally or available through a connection URI.
- A Stripe secret key is optional for local development. Use a Stripe test key to exercise hosted Checkout.

## Configuration

### Backend

Create `back/.env` from the provided example:

```powershell
Copy-Item back/.env.example back/.env
```

Set the values in `back/.env`:

| Variable               | Purpose                                | Local default/example                                                  |
| ---------------------- | -------------------------------------- | ---------------------------------------------------------------------- |
| `PORT`                 | Express listening port                 | `5000`                                                                 |
| `MONGO_URI`            | MongoDB connection URI                 | `mongodb://127.0.0.1:27017/bank_db`                                    |
| `ACCESS_TOKEN_SECRET`  | JWT access-token signing secret        | Set a private random value                                             |
| `REFRESH_TOKEN_SECRET` | JWT refresh-token signing secret       | Set a separate private random value                                    |
| `FRONTEND_URL`         | Frontend origin and payment return URL | `http://localhost:3000`                                                |
| `STRIPE_SECRET_KEY`    | Stripe Checkout secret key             | Leave empty for simulated local deposits, or provide a Stripe test key |
| `NODE_ENV`             | Runtime mode                           | `development`                                                          |

The example file contains placeholder secrets. Replace both JWT secrets before starting the API. For simulated local deposits, remove the `STRIPE_SECRET_KEY` placeholder or set it to an empty value; a non-empty placeholder is treated as a Stripe key and will not work.

### Frontend

The frontend defaults to `http://localhost:5000/api`. To use a different API URL, create `front/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Restart the Next.js development server after changing frontend environment variables.

## Run locally

Start MongoDB first, then run the backend and frontend in separate terminals from the repository root.

Backend:

```powershell
Set-Location back
npm ci
npm start
```

Frontend:

```powershell
Set-Location front
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The root page redirects to the dashboard; use `/Pages/Auth` to register or sign in. The API health response is available at [http://localhost:5000/](http://localhost:5000/).

## Application pages

| Path                     | Purpose                                    |
| ------------------------ | ------------------------------------------ |
| `/Pages/Auth`            | Sign in and register                       |
| `/Pages/Dashboard`       | Account overview and quick actions         |
| `/Pages/Transactions`    | Account transaction history                |
| `/Pages/Transfer`        | Transfer funds                             |
| `/Pages/deposite`        | Start a deposit                            |
| `/Pages/Verify-deposite` | Deposit return and verification screen     |
| `/Pages/Mycard`          | View and manage the user's virtual card    |
| `/Pages/Notifications`   | Review and manage notifications            |
| `/Pages/Profile`         | View and edit profile details              |
| `/Admin`                 | Admin dashboard; requires an admin account |

## API reference

The API is mounted under `/api`, except for the root health check. Protected routes accept the access token in an `Authorization: Bearer <token>` header or the `accessToken` cookie. Admin routes also require the authenticated user to have `isAdmin: true`.

| Method   | Endpoint                                           | Access | Description                                                                             |
| -------- | -------------------------------------------------- | ------ | --------------------------------------------------------------------------------------- |
| `GET`    | `/`                                                | Public | API health check                                                                        |
| `POST`   | `/api/auth/register`                               | Public | Register; body includes `name`, `email`, `password`, and `balance`; `phone` is optional |
| `POST`   | `/api/auth/login`                                  | Public | Sign in with `email` and `password`                                                     |
| `GET`    | `/api/user/me`                                     | User   | Get current user                                                                        |
| `PUT`    | `/api/user/profile`                                | User   | Update profile fields                                                                   |
| `POST`   | `/api/cards`                                       | User   | Create a virtual card                                                                   |
| `GET`    | `/api/cards/my-card`                               | User   | Get the current user's card                                                             |
| `GET`    | `/api/transactions`                                | User   | List account transactions                                                               |
| `POST`   | `/api/transactions/deposit`                        | User   | Deposit to account balance; body includes `amount`                                      |
| `POST`   | `/api/transactions/withdraw`                       | User   | Withdraw from account balance; body includes `amount`                                   |
| `POST`   | `/api/transfers`                                   | User   | Transfer to another user; body includes `amount` and receiver email or ID               |
| `POST`   | `/api/card-transactions/deposit[/:id]`             | User   | Deposit to a card; body includes `amount`; optional card ID in path                     |
| `POST`   | `/api/card-transactions/withdraw[/:id]`            | User   | Withdraw from a card; body includes `amount`; optional card ID in path                  |
| `GET`    | `/api/card-transactions/balance[/:id]`             | User   | Get card balance; optional card ID in path                                              |
| `POST`   | `/api/card-transactions/transfer-to-card[/:id]`    | User   | Move funds from account to card; body includes `amount`                                 |
| `POST`   | `/api/card-transactions/transfer-to-account[/:id]` | User   | Move funds from card to account; body includes `amount`                                 |
| `POST`   | `/api/deposits/stripe`                             | User   | Start Stripe Checkout; body includes `amount`                                           |
| `GET`    | `/api/deposits/verify?success=...&amount=...`      | User   | Process the deposit return result                                                       |
| `GET`    | `/api/notifications`                               | User   | List notifications                                                                      |
| `PUT`    | `/api/notifications/:id/read`                      | User   | Mark a notification as read                                                             |
| `DELETE` | `/api/notifications/:id`                           | User   | Delete a notification                                                                   |
| `GET`    | `/api/admin/users`                                 | Admin  | List users                                                                              |
| `DELETE` | `/api/admin/users/:id`                             | Admin  | Delete a user                                                                           |
| `PUT`    | `/api/admin/users/:id/admin`                       | Admin  | Change a user's admin status                                                            |
| `PUT`    | `/api/admin/users/:id/balance`                     | Admin  | Update a user's balance; body includes `balance`                                        |
| `GET`    | `/api/admin/cards`                                 | Admin  | List cards                                                                              |
| `GET`    | `/api/admin/transactions`                          | Admin  | List transactions                                                                       |

Errors use a JSON response with `success: false` and a `message`; validation details may also be returned in `errors`. Development responses may include a stack trace.

## Scripts and checks

Run these from the relevant app directory:

| Directory | Command         | Purpose                            |
| --------- | --------------- | ---------------------------------- |
| `front`   | `npm run dev`   | Start Next.js development server   |
| `front`   | `npm run build` | Build the frontend for production  |
| `front`   | `npm run start` | Serve a production build           |
| `front`   | `npm run lint`  | Run ESLint                         |
| `back`    | `npm start`     | Start the Express API with nodemon |

The backend package currently has no automated test suite configured.

## Security notes

This repository is a development/demo application, not a production banking system. In particular, the current deposit verification endpoint trusts query parameters rather than verifying a Stripe Checkout session or webhook. Do not use the simulated deposit flow or this verification logic for real payments. The card model also stores card number and CVV fields directly; do not store or process real payment-card data with this implementation. Before any production deployment, review authorization, CORS policy, secrets, payment verification, and applicable financial and payment-card compliance requirements.
