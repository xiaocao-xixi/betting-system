# Vercel 快速部署参考 | Vercel Quick Deploy Reference

## 一键部署按钮 | One-Click Deploy Button

如果你是项目维护者，可以添加此按钮到 README：

If you're the project maintainer, you can add this button to README:

```markdown
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/xiaocao-xixi/betting-system)
```

## 快速命令参考 | Quick Command Reference

### 本地测试 | Local Testing
```bash
# 安装依赖 | Install dependencies
npm install

# 构建（包含 Prisma 生成）| Build (with Prisma generation)
npm run build

# 启动生产服务器 | Start production server
npm start
```

### Vercel CLI 命令 | Vercel CLI Commands
```bash
# 安装 Vercel CLI | Install Vercel CLI
npm i -g vercel

# 登录 | Login
vercel login

# 部署到预览环境 | Deploy to preview
vercel

# 部署到生产环境 | Deploy to production
vercel --prod

# 拉取环境变量 | Pull environment variables
vercel env pull .env.local

# 查看日志 | View logs
vercel logs
```

### 数据库迁移 | Database Migrations
```bash
# 生产环境迁移 | Production migrations
npx prisma migrate deploy

# 查看迁移状态 | Check migration status
npx prisma migrate status

# 生成 Prisma Client | Generate Prisma Client
npx prisma generate

# 查看数据库 | View database
npx prisma studio
```

## 环境变量 | Environment Variables

必需的环境变量 | Required environment variables:

```bash
# PostgreSQL (推荐 Recommended)
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"

# MySQL (可选 Optional)
DATABASE_URL="mysql://user:password@host:3306/database"
```

## 常见问题快速修复 | Quick Fixes

### 问题：Prisma Client 未找到 | Issue: Prisma Client not found
```bash
npm run postinstall
# 或 | or
npx prisma generate
```

### 问题：构建失败 | Issue: Build failed
```bash
# 清理并重新构建 | Clean and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### 问题：数据库连接失败 | Issue: Database connection failed
1. 检查 `DATABASE_URL` 环境变量 | Check `DATABASE_URL` environment variable
2. 确认数据库在运行 | Verify database is running
3. 检查防火墙设置 | Check firewall settings
4. 测试连接字符串 | Test connection string:
   ```bash
   DATABASE_URL="..." npx prisma db push
   ```

### 问题：迁移未应用 | Issue: Migrations not applied
```bash
# 手动运行迁移 | Manually run migrations
DATABASE_URL="..." npx prisma migrate deploy
```

## 检查清单 | Checklist

部署前确认 | Before deploying:

- [ ] 代码已推送到 Git 仓库 | Code pushed to Git repository
- [ ] 已创建/配置数据库 | Database created/configured
- [ ] 环境变量已设置 | Environment variables set
- [ ] `prisma/schema.prisma` 使用正确的数据库提供商 | Correct database provider in schema
- [ ] 本地构建成功 | Local build succeeds

部署后验证 | After deploying:

- [ ] 网站可访问 | Website accessible
- [ ] 数据库已迁移 | Database migrated
- [ ] API 端点正常工作 | API endpoints working
- [ ] 可以创建用户 | Can create users
- [ ] 可以下注 | Can place bets
- [ ] 可以结算 | Can settle bets

## 资源链接 | Resource Links

- 📖 [完整部署指南 | Full Deployment Guide](./VERCEL_DEPLOYMENT.md)
- 🌐 [Vercel 文档 | Vercel Docs](https://vercel.com/docs)
- 🔷 [Prisma 文档 | Prisma Docs](https://www.prisma.io/docs)
- 💻 [Next.js 文档 | Next.js Docs](https://nextjs.org/docs)

## 支持的数据库 | Supported Databases

| 数据库 Database | Vercel 支持 Vercel Support | 免费额度 Free Tier | 推荐度 Recommendation |
|----------------|---------------------------|-------------------|----------------------|
| Vercel Postgres | ✅ 原生支持 Native | ✅ 有 Yes | ⭐⭐⭐⭐⭐ |
| Supabase | ✅ 外部 External | ✅ 有 Yes | ⭐⭐⭐⭐ |
| Neon | ✅ 外部 External | ✅ 有 Yes | ⭐⭐⭐⭐ |
| PlanetScale | ✅ 外部 External | ✅ 有 Yes | ⭐⭐⭐⭐ |
| Railway | ✅ 外部 External | ⚠️ 有限 Limited | ⭐⭐⭐ |

## 性能优化建议 | Performance Tips

1. **使用连接池 | Use Connection Pooling**
   - Vercel Postgres: 自动包含 | Automatically included
   - 其他: 考虑使用 PgBouncer | Others: Consider PgBouncer

2. **边缘网络 | Edge Network**
   - 选择离用户最近的区域 | Choose region closest to users
   - 考虑使用 Edge Functions | Consider Edge Functions

3. **缓存策略 | Caching Strategy**
   - 使用 Next.js 的 ISR | Use Next.js ISR
   - 考虑 Redis 缓存层 | Consider Redis caching layer

4. **监控 | Monitoring**
   - 启用 Vercel Analytics | Enable Vercel Analytics
   - 设置错误追踪 | Set up error tracking
   - 监控数据库性能 | Monitor database performance

---

**提示**: 详细说明请参阅 [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

**Tip**: For detailed instructions, see [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)
