# Vercel 部署指南 | Vercel Deployment Guide

本项目支持部署到 Vercel 平台。由于 Vercel 是无服务器（serverless）环境，不支持 SQLite，因此需要使用云数据库。

This project supports deployment to Vercel. Since Vercel is a serverless environment and doesn't support SQLite, you'll need to use a cloud database.

## 🚀 快速部署 | Quick Deploy

### 方式 1: 使用 Vercel Postgres (推荐) | Method 1: Using Vercel Postgres (Recommended)

#### 步骤 | Steps:

1. **Fork 或克隆仓库 | Fork or Clone Repository**
   ```bash
   git clone https://github.com/xiaocao-xixi/betting-system.git
   cd betting-system
   ```

2. **在 Vercel 创建新项目 | Create New Project in Vercel**
   - 访问 [Vercel Dashboard](https://vercel.com/dashboard)
   - 点击 "Add New..." → "Project"
   - 导入你的 GitHub 仓库 | Import your GitHub repository

3. **添加 Vercel Postgres 数据库 | Add Vercel Postgres Database**
   - 在项目设置中，进入 "Storage" 标签页
   - 点击 "Create Database"
   - 选择 "Postgres"
   - 选择区域（建议选择离用户最近的区域）
   - 创建数据库后，Vercel 会自动添加环境变量

4. **配置环境变量 | Configure Environment Variables**
   
   在 Vercel 项目设置中添加以下环境变量（如果使用 Vercel Postgres，`DATABASE_URL` 已自动配置）：
   
   In Vercel project settings, add the following environment variables (if using Vercel Postgres, `DATABASE_URL` is auto-configured):
   
   ```
   DATABASE_URL=postgresql://user:password@host:port/database?schema=public
   NODE_ENV=production
   ```

5. **更新 Prisma Schema | Update Prisma Schema**
   
   编辑 `prisma/schema.prisma`，将 provider 从 `sqlite` 改为 `postgresql`:
   
   Edit `prisma/schema.prisma`, change provider from `sqlite` to `postgresql`:
   
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

6. **部署 | Deploy**
   - Vercel 会自动检测到更改并重新部署
   - 或者点击 "Deploy" 按钮手动部署
   - 首次部署后，需要运行数据库迁移

7. **运行数据库迁移 | Run Database Migrations**
   
   部署成功后，需要运行迁移脚本。有两种方式：
   
   After successful deployment, you need to run migrations. Two methods:
   
   **方法 A: 使用 Vercel CLI (推荐) | Method A: Using Vercel CLI (Recommended)**
   ```bash
   # 安装 Vercel CLI | Install Vercel CLI
   npm i -g vercel
   
   # 登录 | Login
   vercel login
   
   # 拉取环境变量 | Pull environment variables
   vercel env pull .env.local
   
   # 运行迁移 | Run migrations
   npx prisma migrate deploy
   
   # 可选：填充种子数据 | Optional: Seed data
   npm run prisma:seed
   ```
   
   **方法 B: 在本地运行迁移 | Method B: Run Migrations Locally**
   ```bash
   # 设置 DATABASE_URL 环境变量为 Vercel Postgres 连接字符串
   # Set DATABASE_URL environment variable to your Vercel Postgres connection string
   export DATABASE_URL="postgresql://..."
   
   # 运行迁移 | Run migrations
   npx prisma migrate deploy
   
   # 可选：填充种子数据 | Optional: Seed data
   npm run prisma:seed
   ```

8. **验证部署 | Verify Deployment**
   - 访问 Vercel 提供的 URL
   - 检查应用是否正常运行
   - 测试用户列表、存款、下注等功能

---

### 方式 2: 使用其他 PostgreSQL 数据库 | Method 2: Using Other PostgreSQL Databases

你也可以使用其他 PostgreSQL 提供商：
- **Supabase** (免费套餐) - https://supabase.com
- **Neon** (免费套餐) - https://neon.tech
- **Railway** (免费额度) - https://railway.app
- **PlanetScale** (MySQL 兼容) - https://planetscale.com
- **AWS RDS** (付费)
- **Google Cloud SQL** (付费)

#### 步骤 | Steps:

1. 在选择的数据库提供商创建 PostgreSQL 数据库
2. 获取连接字符串（DATABASE_URL）
3. 在 Vercel 项目设置中添加 `DATABASE_URL` 环境变量
4. 更新 `prisma/schema.prisma` 中的 provider 为 `postgresql`
5. 部署项目
6. 运行数据库迁移

---

### 方式 3: 使用 MySQL (PlanetScale) | Method 3: Using MySQL (PlanetScale)

如果使用 PlanetScale 或其他 MySQL 数据库：

If using PlanetScale or other MySQL databases:

1. **更新 Prisma Schema | Update Prisma Schema**
   ```prisma
   datasource db {
     provider = "mysql"
     url      = env("DATABASE_URL")
     relationMode = "prisma"  // PlanetScale 需要 | Required for PlanetScale
   }
   ```

2. **获取连接字符串 | Get Connection String**
   - 从 PlanetScale 获取连接字符串
   - 格式：`mysql://user:password@host/database?sslaccept=strict`

3. **在 Vercel 添加环境变量 | Add Environment Variable in Vercel**
   ```
   DATABASE_URL=mysql://...
   ```

4. **部署并运行迁移 | Deploy and Run Migrations**

---

## 📋 环境变量清单 | Environment Variables Checklist

在 Vercel 项目设置中配置以下环境变量：

Configure the following environment variables in Vercel project settings:

| 变量名 Variable | 必需 Required | 说明 Description | 示例 Example |
|----------------|---------------|-----------------|--------------|
| `DATABASE_URL` | ✅ 是 Yes | 数据库连接字符串 Database connection string | `postgresql://...` 或 `mysql://...` |
| `NODE_ENV` | ⚠️ 可选 Optional | 环境标识 Environment | `production` (Vercel 自动设置) |

---

## ⚙️ 部署配置说明 | Deployment Configuration

### vercel.json 文件 | vercel.json File

项目包含 `vercel.json` 配置文件，包含以下设置：

The project includes a `vercel.json` configuration file with:

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next",
  "regions": ["hnd1"]
}
```

- **regions**: 默认使用东京区域 (hnd1)，可根据需要修改
- **buildCommand**: 包含 Prisma 生成和 Next.js 构建
- **framework**: 自动检测为 Next.js

### 构建脚本 | Build Scripts

`package.json` 包含以下部署相关脚本：

`package.json` includes deployment-related scripts:

```json
{
  "scripts": {
    "build": "prisma generate && next build",
    "postinstall": "prisma generate",
    "prisma:migrate:deploy": "prisma migrate deploy"
  }
}
```

- **postinstall**: 自动在安装依赖后生成 Prisma Client
- **build**: 构建前生成 Prisma Client
- **prisma:migrate:deploy**: 用于在生产环境运行迁移

---

## 🔧 常见问题 | Troubleshooting

### 问题 1: Prisma Client 未生成 | Issue 1: Prisma Client Not Generated

**错误信息 | Error:**
```
Error: @prisma/client did not initialize yet
```

**解决方案 | Solution:**
确保 `postinstall` 脚本在 `package.json` 中存在，Vercel 会在部署时自动运行它。

Ensure the `postinstall` script exists in `package.json`, Vercel will run it automatically during deployment.

---

### 问题 2: 数据库连接失败 | Issue 2: Database Connection Failed

**错误信息 | Error:**
```
Can't reach database server
```

**检查项 | Checklist:**
1. ✅ 确认 `DATABASE_URL` 环境变量已正确设置
2. ✅ 确认数据库防火墙允许 Vercel IP
3. ✅ 确认连接字符串格式正确
4. ✅ 对于 Vercel Postgres，确保数据库已创建并连接到项目

---

### 问题 3: 迁移未运行 | Issue 3: Migrations Not Applied

**症状 | Symptoms:**
- 页面加载时出现数据库错误
- 表不存在错误

**解决方案 | Solution:**
手动运行迁移：

Manually run migrations:

```bash
# 方法 1: 使用 Vercel CLI
vercel env pull .env.local
npx prisma migrate deploy

# 方法 2: 直接使用 DATABASE_URL
DATABASE_URL="postgresql://..." npx prisma migrate deploy
```

---

### 问题 4: SQLite 不兼容 | Issue 4: SQLite Incompatibility

**错误信息 | Error:**
```
SQLite database file doesn't exist
```

**解决方案 | Solution:**
Vercel 不支持 SQLite（文件系统是只读的）。必须使用 PostgreSQL 或 MySQL。

Vercel doesn't support SQLite (filesystem is read-only). You must use PostgreSQL or MySQL.

更新 `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"  // 或 "mysql"
  url      = env("DATABASE_URL")
}
```

---

## 📊 部署后检查清单 | Post-Deployment Checklist

部署完成后，请验证以下功能：

After deployment, verify the following features:

- [ ] 访问主页显示用户列表 | Homepage displays user list
- [ ] 可以查看用户余额 | Can view user balances
- [ ] 存款功能正常 | Deposit function works
- [ ] 可以下注 | Can place bets
- [ ] 可以结算投注 | Can settle bets
- [ ] 查看投注历史 | View bet history
- [ ] 所有 API 端点响应正常 | All API endpoints respond correctly

---

## 🔄 持续部署 | Continuous Deployment

Vercel 自动配置 CI/CD：

Vercel automatically sets up CI/CD:

1. **自动部署 | Automatic Deployments**
   - 推送到主分支 → 生产部署
   - 推送到其他分支 → 预览部署
   
2. **预览部署 | Preview Deployments**
   - 每个 Pull Request 都会创建预览 URL
   - 可以在合并前测试更改

3. **回滚 | Rollbacks**
   - 在 Vercel Dashboard 中点击 "Rollback"
   - 可以快速恢复到之前的部署版本

---

## 🌐 自定义域名 | Custom Domain

在 Vercel 项目设置中：

In Vercel project settings:

1. 进入 "Domains" 标签页 | Go to "Domains" tab
2. 添加你的域名 | Add your domain
3. 按照指示配置 DNS | Follow DNS configuration instructions
4. 等待 DNS 传播（通常几分钟到几小时）

---

## 💡 最佳实践 | Best Practices

1. **使用环境变量 | Use Environment Variables**
   - 不要在代码中硬编码密钥和连接字符串
   - 使用 Vercel 的环境变量管理

2. **数据库连接池 | Database Connection Pooling**
   - 对于 PostgreSQL，考虑使用连接池（如 PgBouncer）
   - Vercel Postgres 自动包含连接池

3. **监控 | Monitoring**
   - 使用 Vercel Analytics 监控性能
   - 设置日志和错误跟踪

4. **备份 | Backups**
   - 定期备份生产数据库
   - Vercel Postgres 提供自动备份

---

## 📚 参考资源 | Resources

- [Vercel 文档 | Vercel Docs](https://vercel.com/docs)
- [Next.js 部署 | Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma 与 Vercel | Prisma with Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)

---

## 🆘 获取帮助 | Get Help

如果遇到问题：

If you encounter issues:

1. 查看 Vercel 部署日志 | Check Vercel deployment logs
2. 查看本文档的故障排除部分 | Check the Troubleshooting section
3. 访问 [Vercel 社区](https://github.com/vercel/vercel/discussions)
4. 在项目仓库提交 [Issue](https://github.com/xiaocao-xixi/betting-system/issues)

---

**注意 | Note**: 这是一个演示项目。在生产环境中，请确保添加适当的身份验证、授权和安全措施。

This is a demo project. For production use, ensure you add proper authentication, authorization, and security measures.
