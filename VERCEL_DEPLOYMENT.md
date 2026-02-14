# Vercel 部署指南 | Vercel Deployment Guide

本文档详细说明如何将此投注系统部署到 Vercel 平台。

This document provides detailed instructions for deploying this betting system to Vercel.

---

## 📋 Vercel 部署配置 | Vercel Deployment Configuration

### 1. Build Command | 构建命令

```bash
npm run build
```

或者如果需要在构建时生成 Prisma 客户端 | Or if you need to generate Prisma client during build:

```bash
prisma generate && npm run build
```

### 2. Output Directory | 输出目录

```
.next
```

**注意**: Vercel 会自动检测 Next.js 项目，通常无需手动设置输出目录。

**Note**: Vercel automatically detects Next.js projects, so you usually don't need to manually set the output directory.

### 3. Install Command | 安装命令

```bash
npm install
```

### 4. Environment Variables | 环境变量

在 Vercel 项目设置中添加以下环境变量 | Add the following environment variables in your Vercel project settings:

| Variable Name | Value | Description |
|--------------|-------|-------------|
| `DATABASE_URL` | `file:./dev.db` (本地测试) 或 PostgreSQL 连接字符串 | Database connection string |
| `NODE_ENV` | `production` | Node environment |

---

## ⚠️ 重要提示：数据库配置 | Important: Database Configuration

### SQLite 限制 | SQLite Limitations

**此项目默认使用 SQLite**，但 **SQLite 不适合在 Vercel 等无服务器平台上使用**，原因如下：

**This project uses SQLite by default**, but **SQLite is NOT suitable for serverless platforms like Vercel** because:

1. **文件系统只读** | **Read-only filesystem**: Vercel 的无服务器函数使用临时的、只读的文件系统，无法持久化 SQLite 数据库文件。
2. **无状态部署** | **Stateless deployments**: 每次函数调用可能在不同的容器中运行，数据无法在请求之间共享。
3. **构建时数据丢失** | **Data loss on builds**: 每次重新部署都会重置文件系统。

### 推荐解决方案 | Recommended Solutions

#### 选项 1：使用 PostgreSQL（推荐用于生产环境）| Option 1: Use PostgreSQL (Recommended for Production)

**步骤 | Steps:**

1. **创建 PostgreSQL 数据库 | Create a PostgreSQL database:**
   
   推荐服务 | Recommended services:
   - [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) (官方集成 | Official integration)
   - [Supabase](https://supabase.com/) (免费套餐 | Free tier available)
   - [Neon](https://neon.tech/) (无服务器 Postgres | Serverless Postgres)
   - [Railway](https://railway.app/) (简单易用 | Easy to use)

2. **更新 Prisma Schema | Update Prisma Schema:**

   编辑 `prisma/schema.prisma` | Edit `prisma/schema.prisma`:
   
   ```prisma
   datasource db {
     provider = "postgresql"  // 改为 postgresql | Change to postgresql
     url      = env("DATABASE_URL")
   }
   ```

3. **更新环境变量 | Update Environment Variables:**

   在 Vercel 中设置 | Set in Vercel:
   ```
   DATABASE_URL="postgresql://username:password@host:5432/database?schema=public"
   ```

4. **运行数据库迁移 | Run Database Migrations:**

   本地运行 | Run locally:
   ```bash
   npx prisma migrate deploy
   ```
   
   或在 Vercel 部署后通过 Vercel CLI | Or after Vercel deployment via Vercel CLI:
   ```bash
   vercel env pull .env.local
   npx prisma migrate deploy
   ```

#### 选项 2：使用 Vercel Postgres（最简单）| Option 2: Use Vercel Postgres (Easiest)

1. **在 Vercel 项目中创建 Postgres 数据库 | Create Postgres database in Vercel project:**
   - 进入你的 Vercel 项目 | Go to your Vercel project
   - 点击 "Storage" 标签 | Click "Storage" tab
   - 点击 "Create Database" → "Postgres"
   - 按照向导完成设置 | Follow the wizard to complete setup

2. **Vercel 会自动设置环境变量 | Vercel will automatically set environment variables:**
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`

3. **更新 Prisma Schema 使用 Postgres | Update Prisma Schema to use Postgres:**
   
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("POSTGRES_PRISMA_URL")
   }
   ```

4. **添加构建脚本进行数据库迁移 | Add build script for database migrations:**
   
   更新 `package.json` | Update `package.json`:
   ```json
   {
     "scripts": {
       "build": "prisma generate && prisma migrate deploy && next build"
     }
   }
   ```

#### 选项 3：使用 PlanetScale MySQL（无需迁移）| Option 3: Use PlanetScale MySQL (Migration-free)

1. **创建 PlanetScale 数据库 | Create PlanetScale database:**
   - 访问 [PlanetScale](https://planetscale.com/)
   - 创建免费账户和数据库 | Create free account and database
   - 获取连接字符串 | Get connection string

2. **更新 Prisma Schema | Update Prisma Schema:**
   
   ```prisma
   datasource db {
     provider = "mysql"
     url      = env("DATABASE_URL")
     relationMode = "prisma"
   }
   ```

3. **在 Vercel 设置环境变量 | Set environment variable in Vercel:**
   ```
   DATABASE_URL="mysql://user:pass@host.us-east-3.psdb.cloud/database?sslaccept=strict"
   ```

---

## 🚀 部署步骤 | Deployment Steps

### 方法 1：通过 Vercel Dashboard（推荐）| Method 1: Via Vercel Dashboard (Recommended)

1. **登录 Vercel | Login to Vercel:**
   - 访问 [vercel.com](https://vercel.com)
   - 使用 GitHub 账户登录 | Login with GitHub account

2. **导入项目 | Import Project:**
   - 点击 "Add New..." → "Project"
   - 从 GitHub 选择 `xiaocao-xixi/betting-system` 仓库
   - Select the `xiaocao-xixi/betting-system` repository from GitHub

3. **配置项目 | Configure Project:**

   **Build & Development Settings:**
   - **Framework Preset**: Next.js (自动检测 | Auto-detected)
   - **Build Command**: `prisma generate && npm run build`
   - **Output Directory**: `.next` (默认 | Default)
   - **Install Command**: `npm install` (默认 | Default)

4. **添加环境变量 | Add Environment Variables:**
   
   点击 "Environment Variables" 部分 | Click "Environment Variables" section:
   
   ```
   DATABASE_URL = postgresql://your-connection-string
   NODE_ENV = production
   ```
   
   **重要 | Important**: 确保为所有环境（Production, Preview, Development）添加变量
   Make sure to add variables for all environments (Production, Preview, Development)

5. **部署 | Deploy:**
   - 点击 "Deploy" 按钮 | Click "Deploy" button
   - 等待构建完成（约 1-3 分钟）| Wait for build to complete (about 1-3 minutes)
   - 访问部署的 URL | Visit the deployed URL

### 方法 2：通过 Vercel CLI | Method 2: Via Vercel CLI

1. **安装 Vercel CLI | Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **登录 | Login:**
   ```bash
   vercel login
   ```

3. **部署 | Deploy:**
   ```bash
   # 在项目根目录运行 | Run in project root directory
   vercel
   
   # 或直接部署到生产环境 | Or deploy directly to production
   vercel --prod
   ```

4. **设置环境变量 | Set Environment Variables:**
   ```bash
   vercel env add DATABASE_URL production
   vercel env add NODE_ENV production
   ```

---

## 📝 可选配置文件 | Optional Configuration File

可以创建 `vercel.json` 来自定义 Vercel 配置 | You can create a `vercel.json` file to customize Vercel configuration:

```json
{
  "buildCommand": "prisma generate && npm run build",
  "framework": "nextjs",
  "installCommand": "npm install"
}
```

---

## 🔧 部署后配置 | Post-Deployment Configuration

### 1. 数据库迁移 | Database Migrations

如果使用 PostgreSQL 或 MySQL，部署后需要运行数据库迁移 | If using PostgreSQL or MySQL, run database migrations after deployment:

```bash
# 拉取环境变量到本地 | Pull environment variables locally
vercel env pull .env.local

# 运行迁移 | Run migrations
npx prisma migrate deploy

# 或使用 Vercel CLI 在生产环境运行 | Or run in production via Vercel CLI
vercel exec -- npx prisma migrate deploy
```

### 2. 数据库填充（可选）| Database Seeding (Optional)

如果需要初始化测试数据 | If you want to seed test data:

```bash
# 本地运行（使用生产数据库连接）| Run locally (using production database connection)
npx tsx prisma/seed.ts

# 或通过 Vercel CLI | Or via Vercel CLI
vercel exec -- npm run prisma:seed
```

**警告 | Warning**: 仅在开发/测试环境填充数据，不要在生产环境运行！
Only seed data in development/testing environments, DO NOT run in production!

### 3. 验证部署 | Verify Deployment

访问部署的 URL 并测试以下功能 | Visit your deployed URL and test the following:

- ✅ 首页显示用户列表 | Homepage shows user list
- ✅ 可以进行存款操作 | Can perform deposit operations
- ✅ 可以下注 | Can place bets
- ✅ 可以结算投注 | Can settle bets
- ✅ 查看投注历史 | View bet history

---

## 🐛 常见问题 | Troubleshooting

### 问题 1：构建失败 "Prisma Client could not be generated"

**解决方案 | Solution:**

确保 Build Command 包含 Prisma 生成步骤 | Make sure Build Command includes Prisma generation:
```bash
prisma generate && npm run build
```

### 问题 2：运行时错误 "Can't reach database server"

**原因 | Cause**: 数据库连接字符串配置错误或数据库不可访问

**解决方案 | Solution:**
1. 检查 `DATABASE_URL` 环境变量是否正确设置
2. 确保数据库服务可从外部访问
3. 检查防火墙和 IP 白名单设置
4. 验证数据库用户名和密码

### 问题 3：SQLite 文件系统错误

**原因 | Cause**: Vercel 不支持 SQLite 文件持久化

**解决方案 | Solution**: 必须迁移到 PostgreSQL 或 MySQL（见上文"数据库配置"部分）

### 问题 4：环境变量未生效

**解决方案 | Solution:**
1. 确保在 Vercel Dashboard 的所有环境（Production, Preview, Development）中都设置了环境变量
2. 重新部署项目以应用新的环境变量
3. 使用 `vercel env ls` 命令查看当前设置的变量

### 问题 5：数据库迁移未执行

**解决方案 | Solution:**

方法 1 - 在构建时自动运行 | Method 1 - Automatically run during build:
```json
{
  "scripts": {
    "build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

方法 2 - 手动运行 | Method 2 - Manually run:
```bash
vercel env pull .env.local
npx prisma migrate deploy
```

---

## 📊 性能优化建议 | Performance Optimization Tips

1. **使用连接池 | Use Connection Pooling:**
   - 对于 PostgreSQL，使用 PgBouncer 或 Prisma Data Proxy
   - For PostgreSQL, use PgBouncer or Prisma Data Proxy

2. **配置 Prisma 连接限制 | Configure Prisma Connection Limits:**
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   
   generator client {
     provider = "prisma-client-js"
     previewFeatures = ["jsonProtocol"]
   }
   ```

3. **启用 Next.js 增量静态再生成 | Enable Next.js ISR:**
   ```typescript
   export async function getStaticProps() {
     return {
       props: {},
       revalidate: 60 // 每60秒重新生成 | Regenerate every 60 seconds
     }
   }
   ```

---

## 📚 相关资源 | Related Resources

- [Vercel 官方文档 | Vercel Official Docs](https://vercel.com/docs)
- [Next.js 部署文档 | Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Prisma 部署指南 | Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)
- [Vercel Postgres 文档 | Vercel Postgres Docs](https://vercel.com/docs/storage/vercel-postgres)

---

## 📋 快速参考 | Quick Reference

### Vercel 配置总结 | Vercel Configuration Summary

| Setting | Value |
|---------|-------|
| **Framework** | Next.js (Auto-detected) |
| **Build Command** | `prisma generate && npm run build` |
| **Output Directory** | `.next` (Default) |
| **Install Command** | `npm install` (Default) |
| **Node Version** | 20.x (Specified in package.json) |

### 必需的环境变量 | Required Environment Variables

```env
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
NODE_ENV="production"
```

### 可选的环境变量 | Optional Environment Variables

```env
# 如果使用自定义端口（Vercel 会自动处理）
# If using custom port (Vercel handles this automatically)
# PORT=3000

# Prisma Data Proxy (如果使用)
# PRISMA_DATA_PROXY_URL="prisma://..."
```

---

## ✅ 部署检查清单 | Deployment Checklist

在部署前确保完成以下步骤 | Make sure to complete these steps before deploying:

- [ ] 选择并配置数据库（PostgreSQL/MySQL）| Choose and configure database (PostgreSQL/MySQL)
- [ ] 更新 `prisma/schema.prisma` 的 datasource provider | Update datasource provider in `prisma/schema.prisma`
- [ ] 在 Vercel 中设置 `DATABASE_URL` 环境变量 | Set `DATABASE_URL` environment variable in Vercel
- [ ] 配置 Build Command: `prisma generate && npm run build` | Configure Build Command
- [ ] 运行数据库迁移 `prisma migrate deploy` | Run database migrations
- [ ] （可选）填充测试数据 | (Optional) Seed test data
- [ ] 测试部署的应用程序 | Test the deployed application
- [ ] 检查 Vercel 日志确认无错误 | Check Vercel logs for errors

---

## 🎉 完成！| Done!

现在你的投注系统应该已经成功部署到 Vercel 了！

Your betting system should now be successfully deployed to Vercel!

如有问题，请查看上面的常见问题部分或访问 [Vercel 支持](https://vercel.com/support)。

If you encounter any issues, please refer to the Troubleshooting section above or visit [Vercel Support](https://vercel.com/support).
