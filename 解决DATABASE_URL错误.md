# 🔧 解决 "DATABASE_URL not found" 错误

## 您的问题

运行 `npx prisma migrate dev --name init` 时出现错误：

```
Error: Prisma schema validation - (get-config wasm)
Error code: P1012
error: Environment variable not found: DATABASE_URL.
```

## 问题原因

**`.env` 文件不存在或没有配置！**

Prisma 需要从 `.env` 文件读取 `DATABASE_URL` 环境变量来连接数据库。

## ✅ 立即解决

### 方法 1：创建 .env 文件（推荐）

**第 1 步：检查是否有 .env 文件**

在项目根目录运行：

```bash
# Windows
dir .env

# Mac/Linux
ls -la .env
```

**第 2 步：如果文件不存在，从示例创建**

```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

**第 3 步：验证 .env 文件内容**

打开 `.env` 文件，确保包含：

```
DATABASE_URL="file:./dev.db"
NODE_ENV="development"
```

**第 4 步：重新运行命令**

```bash
npx prisma migrate dev --name init
```

---

### 方法 2：手动创建 .env 文件

如果 `.env.example` 不存在，手动创建 `.env` 文件：

**Windows:**
```cmd
echo DATABASE_URL="file:./dev.db" > .env
echo NODE_ENV="development" >> .env
```

**Mac/Linux:**
```bash
cat > .env << EOF
DATABASE_URL="file:./dev.db"
NODE_ENV="development"
EOF
```

然后重新运行：
```bash
npx prisma migrate dev --name init
```

---

### 方法 3：临时指定环境变量

如果不想创建 `.env` 文件，可以直接指定环境变量：

**Windows:**
```cmd
set DATABASE_URL=file:./dev.db
npx prisma migrate dev --name init
```

**Mac/Linux:**
```bash
DATABASE_URL="file:./dev.db" npx prisma migrate dev --name init
```

**注意：** 这种方法每次都需要设置环境变量，不推荐长期使用。

---

## 🎯 完整的初始化流程

修复 `.env` 文件后，继续完成数据库初始化：

```bash
# 1. 运行迁移
npx prisma migrate dev --name init

# 2. 生成 Prisma 客户端
npx prisma generate

# 3. 填充测试数据
npm run prisma:seed

# 4. 启动应用
npm run dev
```

---

## 🔍 验证

### 检查 .env 文件是否正确

```bash
# Windows
type .env

# Mac/Linux
cat .env
```

应该看到：
```
DATABASE_URL="file:./dev.db"
NODE_ENV="development"
```

### 检查 Prisma 是否能读取配置

```bash
npx prisma validate
```

应该显示：
```
✔ The schema at prisma/schema.prisma is valid 🚀
```

---

## ❓ 常见问题

### Q1: 为什么我的仓库没有 .env 文件？

**A:** `.env` 文件包含敏感配置，通常不会提交到 Git。您需要自己创建。

从最新版本开始，我们已经包含了一个默认的 `.env` 文件，但如果您克隆的是早期版本，需要手动创建。

### Q2: DATABASE_URL 的格式是什么？

**A:** 对于 SQLite（本项目使用的数据库）：
```
DATABASE_URL="file:./dev.db"
```

- `file:` - SQLite 协议
- `./dev.db` - 数据库文件路径（相对于项目根目录）

### Q3: 可以使用其他数据库吗？

**A:** 可以，但需要修改 Prisma schema 和 DATABASE_URL：

**PostgreSQL:**
```
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
```

**MySQL:**
```
DATABASE_URL="mysql://user:password@localhost:3306/dbname"
```

本项目默认使用 SQLite 以简化本地开发。

### Q4: .env 文件应该提交到 Git 吗？

**A:** 通常不应该！`.env` 文件包含敏感信息。

但是：
- ✅ `.env.example` 应该提交（示例配置）
- ❌ `.env` 不应该提交（包含实际值）
- 📝 `.gitignore` 应该排除 `.env`

本项目已经配置好 `.gitignore`。

---

## 🆘 还是不行？

### 使用自动设置脚本

我们提供了自动化脚本，会帮您创建 `.env` 并完成所有设置：

**Windows:**
```cmd
verify-setup.bat
```

**Mac/Linux:**
```bash
./verify-setup.sh
```

### 查看相关文档

- **[数据库初始化指南.md](./数据库初始化指南.md)** - 完整的数据库设置
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - 故障排除
- **[START_HERE.md](./START_HERE.md)** - 快速入门

---

**按照上述步骤操作后，您应该能成功运行数据库迁移了！** ✅
