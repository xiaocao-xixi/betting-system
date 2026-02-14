# Vercel 部署快速参考

## 部署到 Vercel 所需的配置信息

### 1. Build Command (构建命令)
```bash
prisma generate && npm run build
```

### 2. Output Directory (输出目录)
```
.next
```
**注意**: Vercel 会自动检测 Next.js 项目，通常可以留空或使用默认值

### 3. Install Command (安装命令)
```bash
npm install
```
**注意**: 这是默认值，通常可以留空

### 4. Environment Variables (环境变量)

**重要**: 你需要在 Vercel 项目设置中添加以下环境变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `DATABASE_URL` | `postgresql://user:password@host:5432/database` | 数据库连接字符串（必须使用 PostgreSQL 或 MySQL） |
| `NODE_ENV` | `production` | Node 环境 |

## ⚠️ 重要提示

### SQLite 不能在 Vercel 上使用！

本项目默认使用 SQLite，但 **Vercel 是无服务器平台，不支持 SQLite**。你必须：

1. **选择云数据库服务**（推荐其中之一）：
   - **Vercel Postgres** - 官方集成，最简单
   - **Supabase** - 有免费套餐
   - **Neon** - 无服务器 PostgreSQL
   - **Railway** - 简单易用
   - **PlanetScale** - MySQL 选项

2. **修改 Prisma 配置文件** (`prisma/schema.prisma`):
   ```prisma
   datasource db {
     provider = "postgresql"  // 改为 postgresql 或 mysql
     url      = env("DATABASE_URL")
   }
   ```

3. **运行数据库迁移**:
   ```bash
   npx prisma migrate deploy
   ```

## 完整部署步骤

详细步骤请查看 [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) 文件。

### 简化步骤：

1. 登录 [vercel.com](https://vercel.com)
2. 导入你的 GitHub 仓库
3. 设置环境变量（DATABASE_URL 和 NODE_ENV）
4. 点击部署

**注意**: 确保先设置好云数据库并修改 Prisma 配置！

## 需要帮助？

查看完整的中英文双语文档：[VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)
