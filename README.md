# Magnif — Roofing E-Commerce Platform

A full-stack e-commerce web application for **Magnif**, a metal roofing sheet manufacturer and distributor. Built as a complete, production-shaped platform: product catalog with variants, cart, checkout with real payment integration, order tracking, an admin dashboard with business analytics, and role-based access control.

> ⚠️ **This is a test / portfolio deployment, not Magnif's official live website.**
> Payments are processed through Paynow's **sandbox/test environment** — no real money changes hands. This project exists to demonstrate the platform's functionality and as a working proposal for Magnif's business, not as their operating storefront.

## 🔗 Live Demo

**[magnif.vercel.app](https://magnif.vercel.app)**

A couple of things worth knowing before clicking through:
- The backend is hosted on a free tier that **sleeps after 15 minutes of inactivity**. The first request after a period of idleness can take up to ~60 seconds to respond while it wakes up — this is expected, not a bug.
- Checkout uses **Paynow's sandbox mode** — you can go through the full payment flow, but it simulates success/failure rather than processing a real transaction. No real card, EcoCash, or bank details are needed or should be entered.
- An admin account exists for demo purposes (seeded automatically) — reach out if you'd like a walkthrough of the admin dashboard specifically.

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | **React** (Vite) + **Tailwind CSS** | Fast dev experience, component-based UI, utility-first styling without a separate CSS build pipeline |
| Routing | **React Router** | Client-side routing, dynamic product/order URLs |
| State | **React Context API** | Shared auth and cart state across the app without prop drilling |
| Backend | **Node.js + Express** | Lightweight, well-documented REST API framework |
| Database | **PostgreSQL** | Relational data (products, variants, orders, users) benefits from real foreign keys and joins rather than a document store |
| ORM | **Prisma** | Type-safe queries, schema-as-code, migration history |
| Auth | **JWT + bcrypt** | Stateless authentication suited to a decoupled frontend/backend; passwords are hashed, never stored in plain text |
| Payments | **Paynow** | Stripe and most major gateways don't support Zimbabwean merchants; Paynow supports EcoCash, Visa, Mastercard, and Zimswitch in one integration |
| Email | **Resend** | Raw SMTP (Nodemailer + Gmail) is unreliable on most free-tier hosts, which commonly block outbound SMTP ports; Resend sends over HTTPS instead |
| Image storage | **Cloudinary** | Free hosting tiers generally use ephemeral local disk — uploaded files can be wiped on redeploy. Cloudinary provides real, persistent file storage |
| PDF generation | **PDFKit** | Programmatic PDF generation for admin monthly statements |
| Containerization | **Docker + Docker Compose** | Consistent local environment across machines; used for local full-stack testing |
| Hosting | **Vercel** (frontend) · **Render** (backend) · **Neon** (database) | Each piece hosted on the platform best suited to it, all with genuinely usable free tiers |

---

## Features

**Guest**
- Browse products and variants (thickness/pricing options) with no account required

**Registered users**
- Register / log in (JWT-based session, persisted across refreshes)
- Add products to cart (variant-aware — different thicknesses tracked as separate line items)
- Checkout with delivery address and real payment processing via Paynow
- View order history with live payment/delivery status
- Leave product reviews
- Receive an emailed order receipt on confirmed payment

**Admin**
- Full CRUD on products and variants (create, edit, delete — with safeguards against deleting items with existing order history)
- Upload real product images
- View and update delivery status on **all** customer orders
- Business dashboard: revenue, profit/loss, stock value, low-stock alerts
- Download monthly PDF statements
- Promote/demote other users to admin (with safeguards against self-demotion or removing the last remaining admin)

---

## Architecture

```
┌─────────────┐      HTTPS       ┌─────────────┐      Prisma      ┌─────────────┐
│   React     │ ───────────────▶ │   Express   │ ────────────────▶│  PostgreSQL │
│  (Vercel)   │ ◀─────────────── │  (Render)   │ ◀──────────────── │   (Neon)    │
└─────────────┘                  └──────┬──────┘                  └─────────────┘
                                         │
                          ┌──────────────┼──────────────┐
                          ▼              ▼               ▼
                     ┌─────────┐   ┌──────────┐   ┌─────────────┐
                     │ Paynow  │   │  Resend  │   │  Cloudinary │
                     │(payments)│   │  (email) │   │  (images)   │
                     └─────────┘   └──────────┘   └─────────────┘
```

---

## Running Locally

### Prerequisites
- Node.js (LTS)
- PostgreSQL (local install, or a free hosted instance)
- Accounts (free tiers) for: Paynow (sandbox), Resend, Cloudinary

### Setup

```bash
git clone https://github.com/Bl00m1ng-droid/Magnif.git
cd Magnif
```

**Backend:**
```bash
cd server
npm install
# create server/.env — see Environment Variables below
npx prisma migrate deploy
npx prisma db seed
npm run dev
```

**Frontend:**
```bash
cd client
npm install
# create client/.env — see Environment Variables below
npm run dev
```

### Running with Docker

A full local stack (frontend, backend, Postgres) can also be run via Docker Compose:
```bash
docker compose up --build
```
This serves the frontend at `http://localhost:3000` and the API at `http://localhost:5000`. A root-level `.env` is required — see below.

---

## Environment Variables

**`server/.env`**
```
DATABASE_URL=
JWT_SECRET=
PAYNOW_INTEGRATION_ID=
PAYNOW_INTEGRATION_KEY=
PAYNOW_MERCHANT_EMAIL=
RESEND_API_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
BACKEND_URL=
FRONTEND_URL=
```

**`client/.env`**
```
VITE_API_URL=
```

---

## Known Limitations (honest, on purpose)

- **Payments are sandbox-only.** A live Paynow merchant account requires Magnif's real business registration and banking details — a step for the business owner to complete directly with Paynow, not something achievable in code.
- **Currency display (USD vs. ZWG)** on live Paynow transactions is tied to account/integration configuration on Paynow's side, still to be confirmed directly with them.
- **Email sending is currently restricted** to a single verified address under Resend's free-tier testing rules. Sending to arbitrary customer addresses requires verifying a real Magnif domain with Resend.
- **Free-tier hosting trade-offs:** the backend (Render free tier) spins down after periods of inactivity, causing a delay on the first request after idle time. For a live, customer-facing deployment, upgrading to a paid tier (~$7/month) removes this entirely.

---

## Roadmap

- [ ] Verify a real domain with Resend to lift the email-recipient restriction
- [ ] Apply for a live Paynow merchant account
- [ ] Confirm live-transaction currency configuration with Paynow
- [ ] Optional: AI-assisted business insights on the admin dashboard

---

## Author

Built by Dondo Kundai as a full-stack learning project and business proposal for Magnif (Pvt) Ltd.
