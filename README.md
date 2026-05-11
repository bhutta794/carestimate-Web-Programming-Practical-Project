# CarEstimate 🚗

> A full-stack car marketplace where prices are calculated automatically — no guessing, no negotiating blind.

---

## Project Theme

CarEstimate is a web application that lets users **list cars for sale** and receive a **system-calculated fair market price** based on a weighted algorithm. Instead of sellers setting arbitrary prices, the platform analyses four objective factors — vehicle age, mileage, brand reputation, and inspection condition — and computes a fair value automatically.

The result is a transparent, trustworthy marketplace where buyers can compare listings with confidence, and sellers get instant, data-backed pricing.

---

## Technologies Used

| Technology | Purpose |
|---|---|
| **Next.js 16** (App Router) | Full-stack React framework |
| **TypeScript** | Type-safe code throughout |
| **PostgreSQL** | Production relational database |
| **Prisma 5.22.0** | Database ORM & schema management |
| **NextAuth.js** | Authentication with JWT sessions |
| **bcryptjs** | Secure password hashing |
| **Tailwind CSS** | Utility-first styling |
| **React Hook Form** | Performant form state management |
| **Zod** | Runtime schema validation |

---

## How to Run the Project

### Prerequisites
- Node.js 18+
- PostgreSQL running locally

### Step 1 — Clone the repository

```bash
git clone https://github.com/bhutta794/carestimate-Web-Programming-Practical-Project.git
cd carestimate
```

### Step 2 — Install dependencies

```bash
npm install
```

### Step 3 — Configure environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/carestimate"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### Step 4 — Set up the database

```bash
# Generate the Prisma client
npx prisma generate

# Push the schema to your database
npx prisma db push

# Optional: open Prisma Studio to browse data
npx prisma studio
```

### Step 5 — Start the development server

```bash
npm run dev
```

### Step 6 — Open the app

Visit **http://localhost:3000** in your browser.

---

## Main User Flow

### 1. Register
Navigate to `/register` → enter your name, email, phone number, and password → account is created → redirected to the login page.

### 2. Login
Navigate to `/login` → enter email and password → redirected to the home page with a personalised navbar.

### 3. Sell a Car
Click **Sell** in the navbar → select a brand (model dropdown updates automatically) → enter year, mileage, and condition rating (1–10) → the system shows a **live price preview** → optionally add a description and photo → submit → car is saved with the calculated price → redirected to the marketplace.

### 4. Browse Listings
Click **Browse** in the navbar → all active listings appear in a responsive grid → filter by brand using the pill buttons → each card shows the car image, year, make, model, mileage, condition badge, price, and seller name.

### 5. View Car Details
Click any listing card → see full specifications, the condition rating, system-calculated price, and seller contact information. The seller's phone number is only visible to logged-in users.

### 6. Edit or Delete a Listing
If you own the listing, **Edit** and **Delete** buttons appear on the detail page. Editing pre-fills the form with existing data and recalculates the price live as you make changes.

### 7. My Listings
Click **My Listings** in the navbar → see all cars you have listed with quick links to view, edit, or delete each one.

### 8. Logout
Click **Logout** in the navbar → session ends → redirected to the home page.

---

## Price Calculation Formula

The system calculates price using a weighted composite score across four factors:

| Factor | Weight | Logic |
|---|---|---|
| **Year / Age** | 35% | Newer vehicles score higher; cars 15+ years old receive a 40% reduction |
| **Mileage** | 30% | Lower mileage scores higher, benchmarked against 12,000 miles/year |
| **Brand** | 20% | Pre-defined brand scores (e.g. Porsche: 95, Toyota: 85, Ford: 72) |
| **Condition** | 15% | 1–10 scale; a perfect 10 adds an 8% bonus |

```
Final Price = Base Model Value × (Composite Score / 100)
```

---

## Project Structure

```
carestimate/
├── app/
│   ├── api/
│   │   ├── cars/[id]/route.ts       # GET, PUT, DELETE single car
│   │   ├── cars/route.ts            # GET all cars, POST new car
│   │   ├── price-preview/route.ts   # Live price estimation endpoint
│   │   ├── register/route.ts        # User registration
│   │   └── upload/route.ts          # Image upload handler
│   ├── buy/page.tsx                 # Marketplace browse page
│   ├── cars/[id]/
│   │   ├── page.tsx                 # Car detail view
│   │   └── edit/page.tsx            # Edit listing form
│   ├── components/
│   │   ├── AuthProvider.tsx         # NextAuth session wrapper
│   │   └── Navbar.tsx               # Global navigation bar
│   ├── login/page.tsx               # Login page
│   ├── register/page.tsx            # Registration page
│   ├── sell/page.tsx                # Create new listing
│   ├── page.tsx                     # Home / landing page
│   ├── globals.css                  # Global styles
│   └── layout.tsx                   # Root layout with AuthProvider
├── lib/
│   ├── authOptions.ts               # NextAuth configuration
│   ├── constants.ts                 # Brand/model data, shared constants
│   ├── priceCalculator.ts           # Weighted pricing algorithm
│   └── prisma.ts                    # Prisma client singleton
├── prisma/
│   └── schema.prisma                # Database schema (User, Car models)
├── public/
│   ├── android-chrome-192x192.png
│   ├── android-chrome-512x512.png
│   ├── apple-touch-icon.png
│   ├── favicon.ico
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   └── site.webmanifest
├── types/
│   └── next-auth.d.ts               # NextAuth type extensions
├── .env                             # Environment variables (not committed)
├── next.config.js                   # Next.js configuration
├── tailwind.config.js               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
└── README.md
```

---

## License

This project was built as a Web Programming practical assignment.
