# 故障排除指南 | Troubleshooting Guide

## 🚨 常见错误 | Common Errors

### ❌ 错误 0: Node.js 版本过低

**完整错误信息：**
```
npm WARN EBADENGINE Unsupported engine {
npm WARN EBADENGINE   package: 'next@16.1.6',
npm WARN EBADENGINE   required: { node: '>=20.9.0' },
npm WARN EBADENGINE   current: { node: 'v18.18.2', npm: '10.2.1' }
npm WARN EBADENGINE }
```

或者 `better-sqlite3` 编译错误：
```
gyp ERR! find VS could not find a version of Visual Studio 2017 or newer to use
```

**原因 | Cause:**
您的 Node.js 版本过低。本项目需要 **Node.js 20.9.0 或更高版本**。

Your Node.js version is too old. This project requires **Node.js 20.9.0 or higher**.

**解决方案 | Solution:**

**1. 检查当前 Node 版本 | Check current Node version:**
```bash
node -v
```

**2. 如果版本低于 20.9.0，请升级 Node.js:**

**If version is lower than 20.9.0, upgrade Node.js:**

**Windows 用户 | Windows Users:**
- 访问 https://nodejs.org/
- 下载并安装 LTS 版本（Long Term Support）
- 当前推荐版本：Node.js 20.x 或 22.x

**Mac 用户（使用 Homebrew）| Mac Users (with Homebrew):**
```bash
# 安装 nvm (Node Version Manager)
brew install nvm

# 安装 Node 20
nvm install 20
nvm use 20
```

**Linux 用户 | Linux Users:**
```bash
# 使用 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
```

**3. 验证新版本 | Verify new version:**
```bash
node -v  # 应该显示 v20.x.x 或更高
npm -v   # 应该显示 10.x.x 或更高
```

**4. 重新安装依赖 | Reinstall dependencies:**
```bash
# 清理旧的安装（如果有）
rm -rf node_modules package-lock.json

# 重新安装
npm install
```

**💡 提示 | Tip:**
- **Node 20 是长期支持版本，推荐使用**
- **Node 20 is LTS version, recommended**
- 不要使用 Node 18 或更低版本
- Don't use Node 18 or lower versions

---

### ❌ 错误 1: 'next' 不是内部或外部命令

**完整错误信息：**
```
'next' 不是内部或外部命令，也不是可运行的程序或批处理文件。
```

或英文版本：
```
'next' is not recognized as an internal or external command, operable program or batch file.
```

**原因 | Cause:**
您克隆了仓库但还没有安装依赖包（node_modules）。

You cloned the repository but haven't installed the dependencies (node_modules) yet.

**解决方案 | Solution:**

```bash
# 第一步：确保在项目目录中 | Step 1: Make sure you're in the project directory
cd betting-system

# 第二步：安装依赖 | Step 2: Install dependencies
npm install

# 第三步：现在可以启动了 | Step 3: Now you can start
npm run dev
```

**⚠️ 重要提示 | Important:**
- **必须先运行 `npm install`，然后才能运行 `npm run dev`**
- **You MUST run `npm install` before running `npm run dev`**
- node_modules 文件夹不会被提交到 Git，所以每次克隆仓库后都需要安装

---

### ❌ 错误 2: 数据库文件不存在

**错误信息：**
```
Error: P1003: Database dev.db does not exist
```

**解决方案 | Solution:**

```bash
# 运行数据库迁移 | Run database migrations
npx prisma migrate dev --name init

# 生成 Prisma 客户端 | Generate Prisma client
npx prisma generate

# 填充测试数据 | Seed test data
npm run prisma:seed
```

---

### ❌ 错误 3: 端口 3000 已被占用

**错误信息：**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**解决方案 | Solution:**

**方法 1: 使用其他端口 | Use different port**
```bash
# Windows
set PORT=3001 && npm run dev

# Mac/Linux
PORT=3001 npm run dev
```

**方法 2: 停止占用端口的进程 | Stop the process using the port**

Windows:
```cmd
# 查找占用端口的进程 | Find process using port
netstat -ano | findstr :3000

# 停止进程（替换 <PID> 为实际进程 ID）| Kill process (replace <PID> with actual process ID)
taskkill /PID <PID> /F
```

Mac/Linux:
```bash
# 查找并停止进程 | Find and kill process
lsof -ti:3000 | xargs kill -9
```

---

### ❌ 错误 4: Prisma Client 未生成

**错误信息：**
```
Error: @prisma/client did not initialize yet
```

**解决方案 | Solution:**

```bash
# 生成 Prisma Client
npx prisma generate
```

---

### ❌ 错误 5: TypeScript 编译错误

**错误信息：**
```
Type error: ...
```

**解决方案 | Solution:**

```bash
# 清除 Next.js 缓存 | Clear Next.js cache
rm -rf .next

# 重新构建 | Rebuild
npm run build
```

---

## 🔄 完整重置流程 | Complete Reset Process

如果遇到无法解决的问题，可以完全重置项目：
If you encounter unsolvable issues, you can completely reset the project:

```bash
# 1. 删除所有生成的文件 | Delete all generated files
rm -rf node_modules
rm -rf .next
rm -f dev.db
rm -f package-lock.json

# 2. 重新安装 | Reinstall
npm install

# 3. 设置数据库 | Setup database
npx prisma migrate dev --name init
npx prisma generate
npm run prisma:seed

# 4. 启动 | Start
npm run dev
```

Windows 用户请使用这些命令：
Windows users use these commands:

```cmd
REM 1. 删除文件 | Delete files
rmdir /s /q node_modules
rmdir /s /q .next
del dev.db
del package-lock.json

REM 2. 重新安装 | Reinstall
npm install

REM 3. 设置数据库 | Setup database
npx prisma migrate dev --name init
npx prisma generate
npm run prisma:seed

REM 4. 启动 | Start
npm run dev
```

---

## 🎯 使用自动化脚本 | Use Automated Scripts

**推荐方法 | Recommended Method:**

我们提供了自动化设置脚本来避免这些问题：
We provide automated setup scripts to avoid these issues:

**Linux/Mac:**
```bash
./verify-setup.sh
```

**Windows:**
```cmd
verify-setup.bat
```

这些脚本会自动：
These scripts will automatically:
- ✅ 检查 Node.js 和 npm
- ✅ 安装依赖
- ✅ 设置数据库
- ✅ 生成 Prisma 客户端
- ✅ 填充测试数据

---

## 📝 标准安装流程 | Standard Installation Process

**正确的安装顺序 | Correct Installation Order:**

```bash
# 1️⃣ 克隆仓库 | Clone repository
git clone https://github.com/xiaocao-xixi/betting-system.git
cd betting-system

# 2️⃣ 安装依赖（必须！）| Install dependencies (REQUIRED!)
npm install

# 3️⃣ 设置数据库 | Setup database
npx prisma migrate dev --name init
npx prisma generate

# 4️⃣ 填充测试数据 | Seed test data
npm run prisma:seed

# 5️⃣ 启动应用 | Start application
npm run dev
```

**⚠️ 注意：**
- **步骤 2 是必须的！不能跳过！**
- **Step 2 is REQUIRED! Cannot be skipped!**
- 每个步骤都必须成功完成后才能进行下一步
- Each step must complete successfully before proceeding

---

## 🆘 仍然遇到问题？| Still Having Issues?

如果以上方案都无法解决您的问题：
If none of the above solutions work:

1. **检查 Node.js 版本 | Check Node.js version**
   ```bash
   node -v  # 应该是 v18 或更高 | Should be v18 or higher
   npm -v
   ```

2. **查看完整错误日志 | View full error log**
   ```bash
   npm run dev --verbose
   ```

3. **检查系统环境 | Check system environment**
   - 确保有足够的磁盘空间 | Ensure enough disk space
   - 确保有网络连接（安装依赖时需要）| Ensure internet connection (needed for installing dependencies)
   - 检查防火墙设置 | Check firewall settings

4. **查阅文档 | Consult documentation**
   - [README.md](./README.md)
   - [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
   - [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)

5. **提交 Issue | Submit Issue**
   - 访问 GitHub Issues: https://github.com/xiaocao-xixi/betting-system/issues
   - 提供完整的错误信息和系统信息

---

## 💡 预防性提示 | Preventive Tips

为了避免问题，请记住：
To avoid issues, remember:

- ✅ **永远先运行 `npm install`** | **Always run `npm install` first**
- ✅ 使用自动化脚本（verify-setup.sh 或 verify-setup.bat）
- ✅ 按照文档中的顺序执行步骤
- ✅ 不要跳过任何步骤
- ✅ 遇到错误立即查看本文档

---

**最后提醒：最常见的错误就是忘记运行 `npm install`！**
**Final reminder: The most common error is forgetting to run `npm install`!**
