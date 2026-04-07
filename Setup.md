I have updated the **Environment Variables** and **Prerequisites** sections to include your specific keys for Recaptcha, Stripe, and the database. I also ensured the backend and frontend variable names match your provided list.

-----

# ElectroVision - Modern E-Commerce Store

ElectroVision is a full-stack e-commerce web application designed for selling electronic products. Users can browse a wide range of electronics, manage their shopping cart, and securely purchase items via Stripe.

-----

## Features

  - **Secure Authentication:** Support for both traditional Email/Password login and Google OAuth 2.0.
  - **Verification & Security:** Google reCAPTCHA integration and OTP (One-Time Password) verification to prevent bot activity and unauthorized access.
  - **Product Catalog:** Browse electronics like TVs, drones, and e-readers with a modern UI.
  - **Shopping Cart & Buy Now:** Add items to a persistent cart or use the "Buy Now" feature for instant checkout.
  - **Secure Payments:** Full Stripe integration for handling credit card transactions safely.
  - **Order History & Emails:** Automated order confirmation emails via Nodemailer and a dedicated user dashboard for past orders.

-----

## Getting Started

### Prerequisites

  - **Node.js** (v18 or later)
  - **PostgreSQL** instance.
  - **Stripe Account:** For Secret and Webhook keys.
  - **Google Cloud Console:** For OAuth 2.0 credentials.
  - **Google reCAPTCHA:** Site and Secret keys (v2 or v3).
  - **Gmail Account:** With an **App Password** for SMTP.

-----

### Installation & Setup

**1. Clone the Repository**

```bash
git clone https://github.com/your-username/electrovision.git
cd electrovision
```

**2. Backend Setup**

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and fill in the following:

```ini
PORT=5000
SERVER_BASE_URL=http://localhost:5000
FRONTEND_BASE_URL=http://localhost:5173
SESSION_SECRET=your_strong_session_secret

STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

MAIL_USER=your-email@gmail.com
MAIL_PASS=your_app_password

RECAPTCHA_SECRET_KEY=your_secret_key

DB_HOST=localhost
DB_PORT=5432
DB_USER=store
DB_PASSWORD=store
DB_NAME=store
```

**3. Database Initialization**

```bash
npm run generate
npm run push
npm run seed
```

**4. Frontend Setup**

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `/frontend` directory:

```ini
VITE_SERVER_BASE_URL=http://localhost:5000
VITE_RECAPTCHA_SITE_KEY=your_site_key
```

-----

## Running the Application

1.  **Backend:** `cd backend && npm run dev`
2.  **Frontend:** `cd frontend && npm run dev`
3.  **Stripe CLI:** `stripe listen --forward-to http://localhost:5000/api/stripe/webhook`

-----

## Available Backend Scripts

| Script             | Description                                                   |
| ------------------ | ------------------------------------------------------------- |
| `npm run dev`      | Starts the server using `ts-node`.                            |
| `npm run generate` | Generates Drizzle migration files.                            |
| `npm run push`     | Syncs your schema directly to the database.                   |
| `npm run seed`     | Seeds the database with initial products.                     |
| `npm run studio`   | Opens Drizzle Studio to browse your data.                     |
| `npm run del`      | Clears only the products table.                               |
| `npm run del2`     | **Warning:** Wipes all tables and data.                       |

## License

MIT License - ElectroVision 2026