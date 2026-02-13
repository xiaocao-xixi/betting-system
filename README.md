# Betting System | 投注系统

A full-stack betting system built with Next.js, Prisma, SQLite, and Docker.

一个使用 Next.js、Prisma、SQLite 和 Docker 构建的全栈投注系统。

## ⚠️ 重要提示 | IMPORTANT

### Node.js 版本要求 | Node.js Version Requirement

**本项目需要 Node.js 20.9.0 或更高版本！**  
**This project requires Node.js 20.9.0 or higher!**

```bash
# 检查您的 Node 版本 | Check your Node version
node -v

# 如果版本低于 20.9.0，请升级 Node.js
# If version is lower than 20.9.0, please upgrade Node.js
# 下载地址 | Download: https://nodejs.org/
```

**为什么需要 Node 20+？| Why Node 20+?**
- Next.js 16 需要 Node >= 20.9.0
- React 19 需要较新的 Node 版本
- 更好的性能和安全性

### 安装依赖 | Install Dependencies

**首次使用前必须先安装依赖！| You MUST install dependencies before first use!**

```bash
npm install    # ← 必须先运行这个！| MUST run this first!
```

**遇到 "'next' 不是内部或外部命令" 错误？**  
**Getting "'next' is not recognized" error?**

👉 这说明您还没有运行 `npm install`，请查看 [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

**遇到 Node 版本错误？| Getting Node version error?**

👉 请升级到 Node 20.9.0 或更高版本 | Please upgrade to Node 20.9.0 or higher

## ✅ 系统已就绪 | System Ready

**系统已完成开发，可以立即部署测试！**  
**The system is fully developed and ready for deployment!**

👉 **快速开始 | Quick Start:** 查看 [本地开发](#local-development--本地开发) 或 [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)  
👉 **Quick Start:** See [Local Development](#local-development--本地开发) or [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

## 📋 Table of Contents | 目录

- [Overview](#overview--项目概述)
- [Tech Stack](#tech-stack--技术栈)
- [Data Models](#data-models--数据模型)
- [API Endpoints](#api-endpoints--api-接口)
- [Features](#features--功能特性)
- [Local Development](#local-development--本地开发)
- [Docker Setup](#docker-setup--docker-部署)
- [Usage Guide](#usage-guide--使用指南)
- [Troubleshooting](#troubleshooting--故障排除)
- [Requirements Mapping](#requirements-mapping--需求映射)

## 📖 Overview | 项目概述

This is a simple betting system that allows users to:
- Deposit funds
- Place bets
- Settle bets (WIN/LOSE/VOID)
- View bet history
- Track balance through append-only ledger entries

这是一个简单的投注系统，允许用户：
- 充值资金
- 下注
- 结算投注（赢/输/作废）
- 查看投注历史
- 通过仅追加的账本条目跟踪余额

## 🛠 Tech Stack | 技术栈

- **Frontend**: Next.js 14 (pages directory), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (Node.js)
- **Database**: SQLite with Prisma ORM
- **Container**: Docker + Docker Compose

## 💾 Data Models | 数据模型

### 1. User (用户)
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

### 2. LedgerEntry (账本条目 - 仅追加)
```prisma
model LedgerEntry {
  id        String   @id @default(uuid())
  userId    String
  type      String   // DEPOSIT | BET_DEBIT | BET_CREDIT
  amount    Int      // Amount in smallest unit (e.g., cents)
  createdAt DateTime @default(now())
}
```

**Balance Formula | 余额计算公式:**
```
balance = sum(DEPOSIT) + sum(BET_CREDIT) - sum(BET_DEBIT)
```

### 3. Bet (投注)
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
}
```

## 🔌 API Endpoints | API 接口

### GET `/api/users`
Get all users with their balances.

获取所有用户及其余额。

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
Admin deposits balance for a user.

管理员为用户充值。

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
Place a bet.

下注。

**Request:**
```json
{
  "userId": "uuid",
  "amount": 100
}
```

**Response:**
```json
{
  "success": true,
  "betId": "uuid"
}
```

**Validations:**
- Amount must be > 0
- Amount must not exceed current balance
- Creates BET_DEBIT ledger entry
- Creates Bet with status PLACED

### POST `/api/bet/settle`
Settle a bet.

结算投注。

**Request:**
```json
{
  "betId": "uuid",
  "result": "WIN" // or "LOSE" or "VOID"
}
```

**Response:**
```json
{
  "success": true,
  "payoutAmount": 200
}
```

**Settlement Rules:**
- WIN: payout = amount × 2
- LOSE: payout = 0
- VOID: payout = amount (refund)
- Creates BET_CREDIT ledger entry for payouts
- Updates bet status to SETTLED
- Prevents double settlement

### GET `/api/bet/history?userId={uuid}`
Get bet history for a user.

获取用户的投注历史。

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

## ⚡ Features | 功能特性

### Core Features
- ✅ User management with balance tracking
- ✅ Deposit functionality
- ✅ Place bets with balance validation
- ✅ Settle bets (WIN/LOSE/VOID)
- ✅ View bet history
- ✅ Append-only ledger system

### Safeguards
- ✅ Balance computed from ledger entries
- ✅ Prevents negative balances
- ✅ Prevents double settlement
- ✅ Ledger entries are append-only (no updates/deletes)
- ✅ Transaction support for data consistency

## 🚀 Local Development | 本地开发

### Prerequisites | 前置要求

- **Node.js 20.9.0 或更高版本** | **Node.js 20.9.0 or higher** ⚠️
  - 检查版本 | Check version: `node -v`
  - 下载 | Download: https://nodejs.org/
- npm 10+ 或 yarn | npm 10+ or yarn

### 🎯 一键验证脚本 | One-Click Verification Script

**最简单的方式！自动检查并设置所有内容：**  
**Easiest way! Automatically checks and sets up everything:**

```bash
# Linux/Mac
./verify-setup.sh

# Windows
verify-setup.bat
```

这个脚本会自动：
- 检查 Node.js 和 npm
- 安装依赖
- 设置数据库
- 生成 Prisma 客户端
- 填充种子数据

This script automatically:
- Checks Node.js and npm
- Installs dependencies
- Sets up database
- Generates Prisma client
- Seeds test data

### Installation Steps

1. **Clone the repository | 克隆仓库**
```bash
git clone https://github.com/xiaocao-xixi/betting-system.git
cd betting-system
```

2. **Install dependencies | 安装依赖**
```bash
npm install
```

3. **Set up database | 配置数据库**
```bash
# Run migrations
npm run prisma:migrate

# Generate Prisma client
npm run prisma:generate
```

4. **Seed the database | 填充种子数据**
```bash
npm run prisma:seed
```

This creates 10 test users, each with an initial balance of 1000 units.

这将创建 10 个测试用户，每个用户初始余额为 1000 单位。

5. **Start development server | 启动开发服务器**
```bash
npm run dev
```

6. **Open browser | 打开浏览器**
```
http://localhost:3000
```

## 🐳 Docker Setup | Docker 部署

### Prerequisites
- Docker
- Docker Compose

### Steps

1. **Build and start containers | 构建并启动容器**
```bash
docker-compose up --build
```

2. **Access the application | 访问应用**
```
http://localhost:3000
```

### Docker Commands

```bash
# Start containers
docker-compose up

# Start in detached mode
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f

# Rebuild containers
docker-compose up --build
```

### Running Migrations in Docker

```bash
# Execute migrations
docker-compose exec app npx prisma migrate deploy

# Seed database
docker-compose exec app npx prisma db seed
```

## 📘 Usage Guide | 使用指南

### Demo Flow

1. **View Users | 查看用户**
   - Open the home page
   - See all 10 seeded users with their balances

2. **Deposit Funds | 充值**
   - Click "Deposit" button for any user
   - Enter amount (e.g., 500)
   - Confirm deposit
   - Balance updates automatically

3. **Play Game | 进入游戏**
   - Click "Play Game" for any user
   - View user details and current balance

4. **Place Bet | 下注**
   - Enter bet amount (must be ≤ balance)
   - Click "Place Bet"
   - Bet appears in history with PLACED status

5. **Settle Bet | 结算投注**
   - For any PLACED bet, click WIN/LOSE/VOID
   - WIN: Receive 2× bet amount
   - LOSE: Lose bet amount
   - VOID: Get refund
   - Balance updates automatically

6. **View History | 查看历史**
   - All bets shown in chronological order
   - See status, result, and payout for each bet

## 📊 Requirements Mapping | 需求映射

| Requirement | Implementation | Location |
|------------|----------------|----------|
| Next.js with pages directory | ✅ | `/pages` |
| TypeScript | ✅ | `tsconfig.json`, all `.ts` files |
| API Routes | ✅ | `/pages/api` |
| SQLite + Prisma | ✅ | `prisma/schema.prisma` |
| User model | ✅ | `prisma/schema.prisma` |
| LedgerEntry model | ✅ | `prisma/schema.prisma` |
| Bet model | ✅ | `prisma/schema.prisma` |
| Seed 10 users | ✅ | `prisma/seed.ts` |
| Deposit API | ✅ | `/pages/api/deposit.ts` |
| Place bet API | ✅ | `/pages/api/bet/place.ts` |
| Settle bet API | ✅ | `/pages/api/bet/settle.ts` |
| Bet history API | ✅ | `/pages/api/bet/history.ts` |
| User list page | ✅ | `/pages/index.tsx` |
| Game page | ✅ | `/pages/game/[userId].tsx` |
| Balance validation | ✅ | `/pages/api/bet/place.ts` |
| Double settlement prevention | ✅ | `/pages/api/bet/settle.ts` |
| Append-only ledger | ✅ | Enforced by API logic |
| Docker setup | ✅ | `Dockerfile`, `docker-compose.yml` |
| Chinese + English comments | ✅ | All source files |

## 📝 Project Structure | 项目结构

```
betting-system/
├── pages/              # Next.js pages
│   ├── api/           # API routes
│   │   ├── users.ts
│   │   ├── deposit.ts
│   │   └── bet/
│   │       ├── place.ts
│   │       ├── settle.ts
│   │       └── history.ts
│   ├── game/
│   │   └── [userId].tsx
│   ├── index.tsx      # User list page
│   └── _app.tsx
├── lib/               # Shared utilities
│   ├── prisma.ts     # Prisma client
│   └── types.ts      # TypeScript types
├── prisma/           # Database
│   ├── schema.prisma # Data models
│   ├── seed.ts       # Seed script
│   └── migrations/   # Database migrations
├── styles/           # CSS files
│   └── globals.css
├── Dockerfile        # Docker configuration
├── docker-compose.yml
├── package.json
└── README.md
```

## 🔐 Security Notes | 安全说明

- This is a demo application without authentication
- In production, add proper authentication and authorization
- Validate all inputs on both client and server
- Use environment variables for sensitive configuration
- Implement rate limiting for API endpoints

这是一个没有身份验证的演示应用程序。
在生产环境中，应添加适当的身份验证和授权机制。

## 🔧 Troubleshooting | 故障排除

### 常见错误 | Common Errors

**❌ 错误: 'next' 不是内部或外部命令**

这是最常见的错误！说明您还没有安装依赖。

**解决方案：**
```bash
npm install
```

**详细的故障排除指南，请查看：**  
**For detailed troubleshooting guide, see:**

👉 [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

包含以下内容 | Includes:
- ✅ 所有常见错误的解决方案
- ✅ 完整重置流程
- ✅ 数据库问题处理
- ✅ 端口占用问题
- ✅ Windows/Mac/Linux 特定问题

## 📄 License

MIT
