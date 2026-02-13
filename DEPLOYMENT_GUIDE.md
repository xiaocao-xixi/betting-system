# 本地部署验证指南 | Local Deployment Verification Guide

## ✅ 系统已就绪！| System Ready!

您的投注系统已经完全开发完成，可以进行本地部署测试了！
Your betting system is fully developed and ready for local deployment testing!

## 🚀 快速开始 | Quick Start

### ⚠️ 重要提示 | IMPORTANT WARNING

**在运行 `npm run dev` 之前，必须先运行 `npm install`！**
**You MUST run `npm install` before running `npm run dev`!**

如果看到 "'next' 不是内部或外部命令" 错误，说明您跳过了安装步骤。
If you see "'next' is not recognized" error, it means you skipped the installation step.

### 方法1: 本地 Node.js 部署 | Method 1: Local Node.js Deployment

**前置要求 | Prerequisites:**
- **Node.js 20.9.0 或更高版本** | **Node.js 20.9.0 or higher** ⚠️
  - 检查版本 | Check version: `node -v`
  - 如果版本过低，请参考 [TROUBLESHOOTING.md](./TROUBLESHOOTING.md#错误-0-nodejs-版本过低)
- npm 10+ 或 yarn | npm 10+ or yarn

**步骤 | Steps:**

```bash
# 1. 克隆仓库 | Clone repository
git clone https://github.com/xiaocao-xixi/betting-system.git
cd betting-system

# 2. ⚠️ 安装依赖（必须！）| Install dependencies (REQUIRED!)
npm install

# 3. 设置数据库 | Setup database
npx prisma migrate dev --name init

# 4. 生成 Prisma 客户端 | Generate Prisma client
npx prisma generate

# 5. 填充测试数据（10个用户，每个1000初始余额）| Seed test data (10 users, 1000 initial balance each)
npm run prisma:seed

# 6. 启动开发服务器 | Start development server
npm run dev
```

**访问应用 | Access Application:**
```
http://localhost:3000
```

### 方法2: Docker 部署 | Method 2: Docker Deployment

**前置要求 | Prerequisites:**
- Docker
- Docker Compose

**步骤 | Steps:**

```bash
# 1. 克隆仓库 | Clone repository
git clone https://github.com/xiaocao-xixi/betting-system.git
cd betting-system

# 2. 启动容器 | Start containers
docker-compose up --build

# 3. 在容器中运行迁移（新窗口）| Run migrations in container (new window)
docker-compose exec app npx prisma migrate deploy

# 4. 在容器中填充数据 | Seed data in container
docker-compose exec app npm run prisma:seed
```

**访问应用 | Access Application:**
```
http://localhost:3000
```

## 📋 功能验证清单 | Feature Verification Checklist

部署完成后，请按照以下步骤验证所有功能：
After deployment, verify all features with these steps:

### 1. 查看用户列表 | View User List
- [ ] 访问 http://localhost:3000
- [ ] 确认看到10个测试用户
- [ ] 每个用户初始余额为 1000

### 2. 测试充值功能 | Test Deposit
- [ ] 点击任意用户的"充值 | Deposit"按钮
- [ ] 输入金额（例如：500）
- [ ] 点击"确认 | Confirm"
- [ ] 验证余额增加（1000 → 1500）

### 3. 进入游戏页面 | Enter Game Page
- [ ] 点击"进入游戏 | Play Game"
- [ ] 确认显示用户信息和当前余额

### 4. 测试下注功能 | Test Place Bet
- [ ] 输入投注金额（例如：200）
- [ ] 点击"下注 | Place Bet"
- [ ] 验证余额减少（1500 → 1300）
- [ ] 确认投注记录出现在历史中，状态为 PLACED

### 5. 测试结算功能 | Test Settlement
- [ ] 对于 PLACED 状态的投注，点击 WIN 按钮
- [ ] 验证赔付金额为投注金额的2倍（200 → 400）
- [ ] 验证余额增加（1300 → 1700）
- [ ] 确认投注状态变为 SETTLED，结果为 WIN

### 6. 测试其他结算结果 | Test Other Settlement Results
- [ ] 下注并点击 LOSE：余额不增加，赔付为0
- [ ] 下注并点击 VOID：退还投注金额（余额不变）

## 🔍 故障排除 | Troubleshooting

### ❌ 最常见错误：'next' 不是内部或外部命令

**错误信息 | Error Message:**
```
'next' 不是内部或外部命令，也不是可运行的程序或批处理文件。
'next' is not recognized as an internal or external command
```

**原因 | Cause:**  
您在克隆仓库后直接运行了 `npm run dev`，但还没有安装依赖包。

You ran `npm run dev` right after cloning without installing dependencies.

**解决方案 | Solution:**
```bash
# 必须先安装依赖！| You MUST install dependencies first!
npm install

# 然后才能启动 | Then you can start
npm run dev
```

**💡 提示：** 这是最常见的错误！请务必先运行 `npm install`。

**💡 Tip:** This is the most common error! Always run `npm install` first.

---

### 问题1: npm install 失败 | Issue 1: npm install fails
**解决方案 | Solution:**
```bash
# 清除缓存并重新安装 | Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### 问题2: 数据库迁移失败 | Issue 2: Database migration fails
**解决方案 | Solution:**
```bash
# 删除现有数据库并重新创建 | Delete existing database and recreate
rm -f dev.db
npx prisma migrate dev --name init
npx prisma generate
npm run prisma:seed
```

### 问题3: 端口 3000 已被占用 | Issue 3: Port 3000 already in use
**解决方案 | Solution:**
```bash
# 方法1: 使用不同端口 | Method 1: Use different port
PORT=3001 npm run dev

# 方法2: 停止占用端口的进程 | Method 2: Stop process using port
# Mac/Linux:
lsof -ti:3000 | xargs kill -9
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### 更多故障排除 | More Troubleshooting

详细的故障排除指南请查看：
For detailed troubleshooting guide, see:

👉 **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)**

包含所有常见错误和解决方案 | Includes all common errors and solutions

### 问题4: Docker 构建失败 | Issue 4: Docker build fails
**解决方案 | Solution:**
```bash
# 清理 Docker 缓存并重新构建 | Clean Docker cache and rebuild
docker-compose down
docker system prune -a
docker-compose up --build
```

## 📊 API 测试示例 | API Testing Examples

您也可以使用 curl 或 Postman 测试 API：
You can also test APIs using curl or Postman:

```bash
# 1. 获取所有用户 | Get all users
curl http://localhost:3000/api/users | jq

# 2. 充值 | Deposit
curl -X POST http://localhost:3000/api/deposit \
  -H "Content-Type: application/json" \
  -d '{"userId":"USER_ID_HERE","amount":500}' | jq

# 3. 下注 | Place bet
curl -X POST http://localhost:3000/api/bet/place \
  -H "Content-Type: application/json" \
  -d '{"userId":"USER_ID_HERE","amount":100}' | jq

# 4. 结算投注 | Settle bet
curl -X POST http://localhost:3000/api/bet/settle \
  -H "Content-Type: application/json" \
  -d '{"betId":"BET_ID_HERE","result":"WIN"}' | jq

# 5. 查看投注历史 | View bet history
curl "http://localhost:3000/api/bet/history?userId=USER_ID_HERE" | jq
```

## 💡 重要提示 | Important Notes

1. **数据持久化 | Data Persistence**: 
   - 所有数据存储在 `dev.db` SQLite 文件中
   - 删除此文件将清空所有数据
   - Data is stored in `dev.db` SQLite file
   - Deleting this file will clear all data

2. **生产部署 | Production Deployment**:
   - 当前配置仅用于开发和演示
   - 生产环境需要添加身份验证
   - Current setup is for development/demo only
   - Production requires authentication

3. **账本不可变性 | Ledger Immutability**:
   - LedgerEntry 表仅支持追加，不可更新或删除
   - 这确保了财务审计追踪
   - LedgerEntry table is append-only
   - This ensures financial audit trail

## 📞 需要帮助？| Need Help?

如果遇到任何问题，请查看：
If you encounter any issues, check:
- 完整的 README.md 文档
- GitHub Issues: https://github.com/xiaocao-xixi/betting-system/issues

## ✅ 验证完成 | Verification Complete

当您完成上述所有测试步骤后，系统就可以投入使用了！
Once you complete all the above test steps, the system is ready to use!

祝您使用愉快！🎉
Happy betting! 🎉
