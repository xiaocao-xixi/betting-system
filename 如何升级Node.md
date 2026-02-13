# 如何升级 Node.js | How to Upgrade Node.js

## 📝 目录 | Table of Contents

1. [检查当前版本](#检查当前版本)
2. [Windows 升级方法](#windows-升级方法)
3. [Mac 升级方法](#mac-升级方法)
4. [Linux 升级方法](#linux-升级方法)
5. [使用 NVM 管理多个版本](#使用-nvm-管理多个版本)
6. [常见问题](#常见问题)

---

## 🔍 检查当前版本

在开始之前，先检查您当前的 Node.js 版本：

```bash
node -v
```

如果显示的版本低于 **v20.9.0**，您需要升级。

**本项目需要：Node.js 20.9.0 或更高版本**

---

## 💻 Windows 升级方法

### 方法 1：使用官方安装程序（推荐，最简单）

#### 第 1 步：下载安装程序

1. 打开浏览器，访问 Node.js 官网：
   ```
   https://nodejs.org/
   ```

2. 您会看到两个版本：
   - **LTS（长期支持版）** ← 推荐这个！
   - Current（最新版）

3. 点击下载 **LTS 版本**（目前是 20.x）

#### 第 2 步：运行安装程序

1. 双击下载的 `.msi` 文件
2. 按照安装向导操作：
   - 点击 "Next"（下一步）
   - 接受许可协议
   - 选择安装位置（默认即可）
   - **确保勾选** "Automatically install necessary tools" 
   - 点击 "Install"（安装）

#### 第 3 步：验证安装

1. **重启命令行窗口**（重要！）
   - 关闭当前的 CMD 或 PowerShell
   - 重新打开

2. 检查版本：
   ```cmd
   node -v
   ```
   应该显示 `v20.x.x` 或更高

3. 检查 npm 版本：
   ```cmd
   npm -v
   ```
   应该显示 `10.x.x` 或更高

✅ **完成！您已成功升级！**

---

### 方法 2：使用 NVM for Windows（适合需要管理多个版本的用户）

NVM（Node Version Manager）可以让您在同一台电脑上安装和切换多个 Node.js 版本。

#### 第 1 步：卸载现有的 Node.js（如果有）

1. 打开 "控制面板" → "程序和功能"
2. 找到 "Node.js"，右键点击 "卸载"
3. 重启电脑

#### 第 2 步：下载 NVM for Windows

1. 访问：
   ```
   https://github.com/coreybutler/nvm-windows/releases
   ```

2. 下载最新的 `nvm-setup.exe`（例如：nvm-setup.exe）

#### 第 3 步：安装 NVM

1. 运行下载的安装程序
2. 按照默认设置安装
3. 安装完成后，**重启命令行窗口**

#### 第 4 步：使用 NVM 安装 Node.js

```cmd
REM 查看可用的 Node 版本
nvm list available

REM 安装 Node 20 LTS
nvm install 20

REM 使用 Node 20
nvm use 20

REM 验证版本
node -v
```

#### 第 5 步：设置默认版本（可选）

```cmd
REM 将 Node 20 设置为默认版本
nvm alias default 20
```

✅ **完成！您现在可以轻松切换 Node 版本！**

---

## 🍎 Mac 升级方法

### 方法 1：使用官方安装程序

#### 第 1 步：下载

1. 访问 https://nodejs.org/
2. 下载 LTS 版本的 `.pkg` 文件

#### 第 2 步：安装

1. 双击 `.pkg` 文件
2. 按照安装向导操作
3. 输入管理员密码（如果需要）

#### 第 3 步：验证

```bash
node -v
npm -v
```

---

### 方法 2：使用 Homebrew（推荐）

如果您已经安装了 Homebrew：

```bash
# 更新 Homebrew
brew update

# 安装 Node 20
brew install node@20

# 链接到系统
brew link node@20

# 验证
node -v
```

---

### 方法 3：使用 NVM（最灵活）

#### 安装 NVM

```bash
# 使用 curl 安装
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# 或者使用 wget
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

#### 配置环境变量

安装后，添加以下内容到 `~/.bash_profile` 或 `~/.zshrc`：

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

然后：

```bash
# 重新加载配置
source ~/.bash_profile  # 或 source ~/.zshrc
```

#### 使用 NVM 安装 Node

```bash
# 安装 Node 20
nvm install 20

# 使用 Node 20
nvm use 20

# 设置为默认
nvm alias default 20

# 验证
node -v
```

---

## 🐧 Linux 升级方法

### 方法 1：使用 NVM（推荐）

#### 安装 NVM

```bash
# 下载并安装 NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# 重新加载配置
source ~/.bashrc
# 或
source ~/.zshrc
```

#### 使用 NVM 安装 Node

```bash
# 安装 Node 20
nvm install 20

# 使用 Node 20
nvm use 20

# 设置为默认
nvm alias default 20

# 验证
node -v
```

---

### 方法 2：使用包管理器

#### Ubuntu/Debian

```bash
# 添加 NodeSource 仓库
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# 安装 Node.js
sudo apt-get install -y nodejs

# 验证
node -v
npm -v
```

#### CentOS/RHEL/Fedora

```bash
# 添加 NodeSource 仓库
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -

# 安装 Node.js
sudo yum install -y nodejs

# 验证
node -v
npm -v
```

---

## 🔄 使用 NVM 管理多个版本

NVM 的最大优势是可以在同一台电脑上安装和切换多个 Node.js 版本。

### 常用 NVM 命令

```bash
# 列出所有已安装的版本
nvm list

# 列出所有可用的 Node 版本
nvm list available  # Windows
nvm ls-remote       # Mac/Linux

# 安装特定版本
nvm install 20.11.0

# 使用特定版本
nvm use 20

# 设置默认版本
nvm alias default 20

# 卸载特定版本
nvm uninstall 18

# 查看当前使用的版本
nvm current
```

### 在不同项目中使用不同版本

您可以在项目根目录创建 `.nvmrc` 文件：

```bash
# 在项目目录创建 .nvmrc
echo "20" > .nvmrc

# 进入项目目录时自动切换
nvm use
```

---

## ❓ 常见问题

### Q1: 升级后需要重新安装全局包吗？

**A:** 是的，如果您使用官方安装程序升级，全局安装的包会丢失。

**解决方案：**

升级前，导出全局包列表：
```bash
npm list -g --depth=0 > my-global-packages.txt
```

升级后，重新安装：
```bash
# 手动重新安装需要的包
npm install -g package-name
```

**如果使用 NVM**，可以从旧版本迁移包：
```bash
# 从 Node 18 迁移包到 Node 20
nvm install 20 --reinstall-packages-from=18
```

---

### Q2: 升级会影响我的其他项目吗？

**A:** 
- 如果使用官方安装程序：会影响，因为系统只有一个 Node 版本
- 如果使用 NVM：不会影响，可以为每个项目使用不同版本

**建议：** 使用 NVM 来管理多个版本。

---

### Q3: 我应该选择哪个版本？

**A:** 
- **本项目需要：Node 20.9.0 或更高**
- 推荐安装 **Node 20 LTS**（长期支持版）
- Node 20 是当前的 LTS 版本，稳定且有长期支持

---

### Q4: 升级后为什么 `node -v` 还是旧版本？

**A:** 可能的原因：

1. **没有重启命令行窗口** ← 最常见
   - 解决：关闭并重新打开命令行

2. **环境变量没有更新**
   - Windows：重启电脑
   - Mac/Linux：运行 `source ~/.bashrc` 或 `source ~/.zshrc`

3. **使用了 NVM 但没有切换版本**
   - 运行：`nvm use 20`

4. **安装在非默认位置**
   - 检查：`where node`（Windows）或 `which node`（Mac/Linux）

---

### Q5: 卸载旧版本 Node 的方法？

**Windows:**
```
控制面板 → 程序和功能 → 找到 Node.js → 卸载
```

**Mac (Homebrew):**
```bash
brew uninstall node
```

**Mac (官方安装):**
```bash
sudo rm -rf /usr/local/lib/node_modules
sudo rm -rf /usr/local/include/node
sudo rm -rf ~/.npm
sudo rm /usr/local/bin/node
sudo rm /usr/local/bin/npm
```

**Linux:**
```bash
sudo apt-get remove nodejs  # Ubuntu/Debian
sudo yum remove nodejs       # CentOS/RHEL
```

---

## ✅ 升级后的步骤

升级 Node.js 后，在本项目中执行：

```bash
# 第 1 步：验证版本
node -v   # 应该 >= 20.9.0
npm -v    # 应该 >= 10.0.0

# 第 2 步：清理旧的依赖（如果之前安装过）
# Windows:
rmdir /s /q node_modules
del package-lock.json

# Mac/Linux:
rm -rf node_modules package-lock.json

# 第 3 步：重新安装依赖
npm install

# 第 4 步：启动项目
npm run dev
```

---

## 📚 相关资源

- **Node.js 官网**: https://nodejs.org/
- **NVM for Windows**: https://github.com/coreybutler/nvm-windows
- **NVM for Mac/Linux**: https://github.com/nvm-sh/nvm
- **Node.js 版本发布计划**: https://nodejs.org/en/about/releases/

---

## 🆘 需要更多帮助？

如果升级过程中遇到问题：

1. 查看 [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
2. 查看 [解决方案-安装错误.md](./解决方案-安装错误.md)
3. 查看 [START_HERE.md](./START_HERE.md)

---

**祝您升级顺利！🎉**
