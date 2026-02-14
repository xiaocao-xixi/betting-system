# Betting System

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js](https://img.shields.io/badge/Node.js-20.9%2B-green.svg)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748.svg)](https://www.prisma.io/)

A full-stack betting system built with Next.js, Prisma, SQLite, and Docker. Features include user management, balance tracking through append-only ledger entries, bet placement, and settlement.

## ⭐ Features

- **User Management** - Create and manage users
- **Balance Tracking** - Append-only ledger system for accurate balance calculation
- **Bet Placement** - Place bets with balance validation
- **Bet Settlement** - Settle bets with WIN/LOSE/VOID outcomes
- **Transaction Safety** - Database transactions ensure data integrity
- **Modern UI** - Clean, responsive interface with Tailwind CSS
- **Type Safety** - Full TypeScript support
- **Docker Support** - Easy deployment with Docker Compose

## 🚀 Quick Start

### Prerequisites

- **Node.js 20.9.0 or higher** (required)
- npm 10+ or yarn
- (Optional) Docker & Docker Compose for containerized deployment

### Local Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/xiaocao-xixi/betting-system.git
cd betting-system

# 2. Install dependencies (REQUIRED!)
npm install

# 3. Create .env file (REQUIRED!)
# Copy the example file or create manually
cp .env.example .env
# Or on Windows: copy .env.example .env
# The .env file must contain: DATABASE_URL="file:./dev.db"

# 4. Setup database
npx prisma migrate dev --name init

# 5. Generate Prisma client
npx prisma generate

# 6. Seed test data (10 users with 1000 initial balance each)
npm run prisma:seed

# 7. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Docker Setup

```bash
# 1. Clone and navigate
git clone https://github.com/xiaocao-xixi/betting-system.git
cd betting-system

# 2. Start containers
docker-compose up --build

# 3. Run migrations (in new terminal)
docker-compose exec app npx prisma migrate deploy

# 4. Seed data
docker-compose exec app npm run prisma:seed
```

Access at [http://localhost:3000](http://localhost:3000)

## 📖 Overview

This betting system provides:
- **User Management**: View all users with real-time balance tracking
- **Deposits**: Admin can add funds to user accounts
- **Betting**: Users can place bets with balance validation
- **Settlement**: Settle bets with WIN (2x), LOSE (0x), or VOID (refund) outcomes
- **History**: Complete bet history with timestamps
- **Ledger System**: Append-only ledger ensures balance integrity

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (Pages Directory), React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (Node.js)
- **Database**: SQLite with Prisma ORM 5.x
- **Deployment**: Docker + Docker Compose
- **Styling**: Tailwind CSS with responsive design

## 💾 Data Models

### User
```prisma
model User {
  id           String        @id @default(uuid())
  email        String        @unique
  displayName  String
  ledgerEntries LedgerEntry[]
  bets         Bet[]
  createdAt    DateTime      @default(now())
}
```

### LedgerEntry (Append-Only)
```prisma
model LedgerEntry {
  id        String   @id @default(uuid())
  userId    String
  type      String   // DEPOSIT | BET_DEBIT | BET_CREDIT
  amount    Int      // Amount in smallest unit
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
}
```

**Balance Formula:**
```
balance = sum(DEPOSIT) + sum(BET_CREDIT) - sum(BET_DEBIT)
```

### Bet
```prisma
model Bet {
  id            String    @id @default(uuid())
  userId        String
  amount        Int
  status        String    // PLACED | SETTLED
  result        String?   // WIN | LOSE | VOID
  payoutAmount  Int       @default(0)
  createdAt     DateTime  @default(now())
  settledAt     DateTime?
  user          User      @relation(fields: [userId], references: [id])
}
```

## 🔌 API Endpoints

### GET `/api/users`
Get all users with calculated balances.

**Response:**
```json
[
  {
    "id": "uuid",
    "email": "user1@example.com",
    "displayName": "Test User 1",
    "balance": 1000
  }
]
```

### POST `/api/deposit`
Admin deposits funds for a user.

**Request:**
```json
{
  "userId": "uuid",
  "amount": 500
}
```

**Response:**
```json
{
  "success": true,
  "ledgerEntryId": "uuid"
}
```

### POST `/api/bet/place`
Place a new bet.

**Request:**
```json
{
  "userId": "uuid",
  "amount": 100
}
```

**Validations:**
- Amount must be positive
- Amount cannot exceed current balance
- Creates BET_DEBIT ledger entry
- Creates Bet with PLACED status

**Response:**
```json
{
  "success": true,
  "betId": "uuid"
}
```

### POST `/api/bet/settle`
Settle an existing bet.

**Request:**
```json
{
  "betId": "uuid",
  "result": "WIN"  // WIN | LOSE | VOID
}
```

**Settlement Rules:**
- **WIN**: payout = amount × 2 (creates BET_CREDIT)
- **LOSE**: payout = 0 (no ledger entry)
- **VOID**: payout = amount (creates BET_CREDIT as refund)

**Response:**
```json
{
  "success": true,
  "payoutAmount": 200
}
```

### GET `/api/bet/history?userId={uuid}`
Get bet history for a specific user.

**Response:**
```json
[
  {
    "id": "uuid",
    "userId": "uuid",
    "amount": 100,
    "status": "SETTLED",
    "result": "WIN",
    "payoutAmount": 200,
    "createdAt": "2024-01-01T00:00:00Z",
    "settledAt": "2024-01-01T00:01:00Z"
  }
]
```

## ✨ Features

### Core Functionality
- **Balance Tracking**: Real-time balance calculation from ledger entries
- **Deposit Management**: Admin can add funds with validation
- **Bet Placement**: Amount validation against current balance
- **Bet Settlement**: WIN/LOSE/VOID with automatic payout calculation
- **History Tracking**: Complete audit trail of all transactions

### Data Integrity
- **Append-Only Ledger**: No updates or deletes, only inserts
- **Transaction Support**: Atomic operations for consistency
- **Balance Validation**: Prevents negative balances
- **Double Settlement Prevention**: Bets can only be settled once
- **Type Safety**: Full TypeScript implementation

## 📱 Usage Guide

### Admin Functions
1. **View Users**: Access home page to see all users and balances
2. **Deposit Funds**:
   - Click "Deposit" on any user
   - Enter amount
   - Confirm deposit
   - Balance updates immediately

### User Functions
1. **Place Bet**:
   - Click "Play Game" for a user
   - Enter bet amount
   - Submit bet (balance decreases)
2. **View History**: See all past bets with outcomes
3. **Track Balance**: Real-time balance updates

### Settlement (Admin)
1. Navigate to user's game page
2. Find placed bet in history
3. Click WIN/LOSE/VOID
4. Balance updates based on outcome

## 🧪 Testing

### Automated Setup Script

**Windows:**
```cmd
verify-setup.bat
```

**Mac/Linux:**
```bash
./verify-setup.sh
```

This script automatically:
- Checks Node.js version
- Installs dependencies
- Creates .env file
- Runs migrations
- Generates Prisma client
- Seeds database
- Validates build

### Manual Testing Flow
1. View user list (confirm 10 users with 1000 balance)
2. Deposit 500 to user (balance → 1500)
3. Place bet of 100 (balance → 1400)
4. Settle as WIN (balance → 1600, payout 200)
5. Verify bet history shows all transactions

## 🐛 Troubleshooting

### Common Issues

#### Error: 'next' is not recognized
**Cause**: Dependencies not installed

**Solution**:
```bash
npm install
```

#### Error: Environment variable not found: DATABASE_URL
**Cause**: Missing .env file

**Solution**:
```bash
# Linux/Mac - Create .env file
cp .env.example .env

# Windows - Create .env file
copy .env.example .env

# Or manually create .env file with this content:
# DATABASE_URL="file:./dev.db"
```

**Note**: You MUST create the .env file before running any Prisma commands.

#### Error: Node version too old
**Cause**: Node.js < 20.9.0

**Solution**:
1. Download from [nodejs.org](https://nodejs.org/)
2. Install LTS version (20.x)
3. Restart terminal
4. Verify: `node -v`

#### Error: users.map is not a function
**Cause**: Database not initialized

**Solution**:
```bash
npx prisma migrate dev --name init
npx prisma generate
npm run prisma:seed
```

#### Port 3000 already in use
**Solutions**:

Option 1 - Use different port:
```bash
# Windows
set PORT=3001 && npm run dev

# Mac/Linux
PORT=3001 npm run dev
```

Option 2 - Kill existing process:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Database Issues

#### Reset database:
```bash
rm dev.db
rm -rf prisma/migrations
npx prisma migrate dev --name init
npm run prisma:seed
```

#### View database:
```bash
npx prisma studio
```

#### Check migration status:
```bash
npx prisma migrate status
```

## 🔧 Development

### Project Structure
```
betting-system/
├── pages/              # Next.js pages
│   ├── index.tsx      # User list (home)
│   ├── game/          # Game pages
│   │   └── [userId].tsx
│   └── api/           # API routes
│       ├── users.ts
│       ├── deposit.ts
│       └── bet/
├── prisma/            # Database schema & migrations
│   ├── schema.prisma
│   └── seed.ts
├── lib/               # Utilities
│   ├── prisma.ts
│   └── types.ts
├── styles/            # Global styles
└── public/            # Static assets
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run prisma:seed  # Seed database
```

### Adding New Features

1. **New API Endpoint**:
   - Create file in `pages/api/`
   - Import Prisma client from `@/lib/prisma`
   - Implement handler with proper validation

2. **New Page**:
   - Create file in `pages/`
   - Use TypeScript for type safety
   - Import types from `@/lib/types`

3. **Database Changes**:
   - Update `prisma/schema.prisma`
   - Run `npx prisma migrate dev`
   - Update seed script if needed

## 🚢 Deployment

### Production Build

```bash
# Build
npm run build

# Start
npm start
```

### Environment Variables

Create `.env.production`:
```env
DATABASE_URL="file:./prod.db"
NODE_ENV="production"
```

### Docker Production

```bash
# Build production image
docker build -t betting-system:prod .

# Run
docker run -p 3000:3000 betting-system:prod
```

## 📋 Requirements Mapping

All original requirements have been implemented:

✅ **Tech Stack**
- Next.js with Pages Directory
- TypeScript throughout
- SQLite with Prisma ORM
- Docker configuration

✅ **Data Models**
- User with uuid id
- LedgerEntry (append-only)
- Bet with status tracking
- Balance calculated from ledger

✅ **Core Features**
- Seed 10 users
- Deposit functionality
- Place bet with validation
- Settle bet (WIN/LOSE/VOID)
- Bet history

✅ **Pages**
- User list with balances
- Game page with betting interface
- Deposit modal
- Bet history display

✅ **Safeguards**
- Balance validation
- Prevent negative balances
- Prevent double settlement
- Append-only ledger
- Transaction support

✅ **Documentation**
- Comprehensive README
- API documentation
- Setup instructions
- Troubleshooting guide

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md) before submitting pull requests.

### How to Contribute

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for more details.

## 📧 Support

For issues or questions:
1. Check [Troubleshooting](#-troubleshooting) section above
2. Review API documentation
3. Check Prisma logs: `npx prisma studio`
4. Open a [GitHub issue](https://github.com/xiaocao-xixi/betting-system/issues)

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety

---

**Note**: This is a demo betting system for educational purposes. The default configuration uses SQLite for simplicity. For production use, consider PostgreSQL or MySQL with proper authentication and authorization.
