# 🎯 快速参考 | Quick Reference

## ⚠️ 首先必须做的事 | MUST DO FIRST

### 1. 检查 Node.js 版本 | Check Node.js Version

```bash
node -v    # 必须 >= 20.9.0 | Must be >= 20.9.0
```

**如果版本过低：| If version too old:**
- 📖 **详细升级指南 | Detailed guide:** [如何升级Node.md](./如何升级Node.md)
- 下载 Node.js 20+ | Download Node.js 20+: https://nodejs.org/
- 详见 | See: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md#错误-0-nodejs-版本过低)

### 2. 安装依赖 | Install Dependencies

```bash
npm install    # ← 必须先运行！| MUST run first!
```

**如果看到 "'next' 不是内部或外部命令" 错误：**  
**If you see "'next' is not recognized" error:**

👉 您忘记运行 `npm install` 了！请先安装依赖。  
👉 You forgot to run `npm install`! Install dependencies first.

---

## 立即开始 | Get Started Now

```bash
# 1. 克隆项目 | Clone
git clone https://github.com/xiaocao-xixi/betting-system.git
cd betting-system

# 2. 一键设置 | One-click setup
./verify-setup.sh          # Linux/Mac
# or
verify-setup.bat           # Windows

# 3. 启动 | Start
npm run dev

# 4. 访问 | Visit
# http://localhost:3000
```

## 常用命令 | Common Commands

```bash
# 开发模式 | Development
npm run dev                 # 启动开发服务器 | Start dev server

# 生产构建 | Production Build
npm run build              # 构建生产版本 | Build for production
npm start                  # 启动生产服务器 | Start production server

# 数据库 | Database
npm run prisma:migrate     # 运行迁移 | Run migrations
npm run prisma:generate    # 生成客户端 | Generate client
npm run prisma:seed        # 填充数据 | Seed data

# Docker
docker-compose up          # 启动容器 | Start containers
docker-compose down        # 停止容器 | Stop containers
```

## 测试用户 | Test Users

系统自动创建10个测试用户：
System automatically creates 10 test users:

- user1@example.com → 测试用户1 | Test User 1 (余额 Balance: 1000)
- user2@example.com → 测试用户2 | Test User 2 (余额 Balance: 1000)
- ...
- user10@example.com → 测试用户10 | Test User 10 (余额 Balance: 1000)

## 功能测试流程 | Feature Testing Flow

1. **访问首页** http://localhost:3000
   - 查看所有用户和余额

2. **充值 | Deposit**
   - 点击任意用户的"充值"按钮
   - 输入金额（如 500）
   - 余额增加 ✅

3. **进入游戏 | Play**
   - 点击"进入游戏"按钮
   - 查看用户详情

4. **下注 | Bet**
   - 输入投注金额（如 200）
   - 点击"下注"
   - 余额减少 ✅

5. **结算 | Settle**
   - 点击 WIN：获得 2倍赔付
   - 点击 LOSE：无赔付
   - 点击 VOID：退款

## API 端点 | API Endpoints

```bash
# 获取用户 | Get Users
curl http://localhost:3000/api/users

# 充值 | Deposit
curl -X POST http://localhost:3000/api/deposit \
  -H "Content-Type: application/json" \
  -d '{"userId":"<ID>","amount":500}'

# 下注 | Place Bet
curl -X POST http://localhost:3000/api/bet/place \
  -H "Content-Type: application/json" \
  -d '{"userId":"<ID>","amount":100}'

# 结算 | Settle
curl -X POST http://localhost:3000/api/bet/settle \
  -H "Content-Type: application/json" \
  -d '{"betId":"<ID>","result":"WIN"}'

# 历史 | History
curl "http://localhost:3000/api/bet/history?userId=<ID>"
```

## 项目结构 | Project Structure

```
betting-system/
├── pages/              # Next.js 页面 | Pages
│   ├── api/           # API 路由 | API routes
│   ├── game/          # 游戏页面 | Game pages
│   └── index.tsx      # 首页 | Home page
├── lib/               # 工具函数 | Utilities
├── prisma/            # 数据库 | Database
│   ├── schema.prisma  # 数据模型 | Data models
│   └── seed.ts        # 种子数据 | Seed data
├── styles/            # 样式 | Styles
├── Dockerfile         # Docker 配置
├── docker-compose.yml # Docker Compose
└── README.md          # 文档 | Documentation
```

## 故障排除 | Troubleshooting

**端口被占用 | Port in use:**
```bash
PORT=3001 npm run dev
```

**重置数据库 | Reset database:**
```bash
rm dev.db
npm run prisma:migrate
npm run prisma:seed
```

**重新安装 | Reinstall:**
```bash
rm -rf node_modules package-lock.json
npm install
```

## 文档链接 | Documentation Links

- 📖 [README.md](./README.md) - 完整文档
- 🚀 [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - 部署指南
- 🔧 [verify-setup.sh](./verify-setup.sh) - 验证脚本

## 技术栈 | Tech Stack

- **前端 Frontend**: Next.js 14 + React 19 + TypeScript + Tailwind CSS
- **后端 Backend**: Next.js API Routes
- **数据库 Database**: SQLite + Prisma ORM
- **容器 Container**: Docker + Docker Compose

---

**💡 提示 | Tip:** 使用 `./verify-setup.sh` 一键完成所有设置！
**💡 Tip:** Use `./verify-setup.sh` for one-click setup!

**🎉 祝您使用愉快！| Happy Betting!**
