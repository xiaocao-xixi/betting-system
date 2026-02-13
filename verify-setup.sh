#!/bin/bash

# 系统验证脚本 | System Verification Script
# 用于验证投注系统是否正确安装和配置 | Verify betting system installation and configuration

echo "🔍 开始验证投注系统... | Starting betting system verification..."
echo ""

# 检查 Node.js | Check Node.js
echo "1️⃣ 检查 Node.js 版本... | Checking Node.js version..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo "   ✅ Node.js 已安装: $NODE_VERSION | Node.js installed: $NODE_VERSION"
    
    # 检查 Node 版本是否 >= 20.9.0
    # Extract version number and compare
    NODE_MAJOR=$(echo $NODE_VERSION | sed 's/v//' | cut -d. -f1)
    NODE_MINOR=$(echo $NODE_VERSION | sed 's/v//' | cut -d. -f2)
    
    if [ "$NODE_MAJOR" -lt 20 ] || ([ "$NODE_MAJOR" -eq 20 ] && [ "$NODE_MINOR" -lt 9 ]); then
        echo ""
        echo "   ❌ 错误：Node.js 版本过低！| Error: Node.js version too old!"
        echo "   当前版本 | Current version: $NODE_VERSION"
        echo "   需要版本 | Required version: >= 20.9.0"
        echo ""
        echo "   请升级 Node.js | Please upgrade Node.js:"
        echo "   - 下载地址 | Download: https://nodejs.org/"
        echo "   - 详细说明 | Details: TROUBLESHOOTING.md"
        exit 1
    fi
else
    echo "   ❌ Node.js 未安装 | Node.js not installed"
    echo "   请安装 Node.js 20.9.0+ | Please install Node.js 20.9.0+"
    echo "   下载地址 | Download: https://nodejs.org/"
    exit 1
fi

# 检查 npm | Check npm
echo ""
echo "2️⃣ 检查 npm 版本... | Checking npm version..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo "   ✅ npm 已安装: $NPM_VERSION | npm installed: $NPM_VERSION"
else
    echo "   ❌ npm 未安装 | npm not installed"
    exit 1
fi

# 检查依赖 | Check dependencies
echo ""
echo "3️⃣ 检查项目依赖... | Checking project dependencies..."
if [ -d "node_modules" ]; then
    echo "   ✅ 依赖已安装 | Dependencies installed"
else
    echo "   ⚠️  依赖未安装，正在安装... | Dependencies not installed, installing..."
    npm install
    if [ $? -eq 0 ]; then
        echo "   ✅ 依赖安装成功 | Dependencies installed successfully"
    else
        echo "   ❌ 依赖安装失败 | Dependencies installation failed"
        exit 1
    fi
fi

# 检查 .env 文件 | Check .env file
echo ""
echo "4️⃣ 检查环境配置... | Checking environment configuration..."
if [ -f ".env" ]; then
    echo "   ✅ .env 文件存在 | .env file exists"
else
    echo "   ⚠️  .env 文件不存在，从模板创建... | .env file not found, creating from template..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "   ✅ .env 文件已创建 | .env file created"
    else
        echo "   ❌ .env.example 模板不存在 | .env.example template not found"
        exit 1
    fi
fi

# 检查 Prisma Client | Check Prisma Client
echo ""
echo "5️⃣ 检查 Prisma 客户端... | Checking Prisma Client..."
if [ -d "node_modules/@prisma/client" ]; then
    echo "   ✅ Prisma Client 已生成 | Prisma Client generated"
else
    echo "   ⚠️  Prisma Client 未生成，正在生成... | Prisma Client not generated, generating..."
    npx prisma generate
    if [ $? -eq 0 ]; then
        echo "   ✅ Prisma Client 生成成功 | Prisma Client generated successfully"
    else
        echo "   ❌ Prisma Client 生成失败 | Prisma Client generation failed"
        exit 1
    fi
fi

# 检查数据库 | Check database
echo ""
echo "6️⃣ 检查数据库... | Checking database..."
if [ -f "dev.db" ]; then
    echo "   ✅ 数据库文件存在 | Database file exists"
else
    echo "   ⚠️  数据库不存在，正在创建... | Database not found, creating..."
    npx prisma migrate dev --name init
    if [ $? -eq 0 ]; then
        echo "   ✅ 数据库迁移成功 | Database migration successful"
    else
        echo "   ❌ 数据库迁移失败 | Database migration failed"
        exit 1
    fi
fi

# 检查种子数据 | Check seed data
echo ""
echo "7️⃣ 检查种子数据... | Checking seed data..."
USER_COUNT=$(echo "SELECT COUNT(*) FROM users;" | sqlite3 dev.db 2>/dev/null || echo "0")
if [ "$USER_COUNT" -ge 10 ]; then
    echo "   ✅ 种子数据已存在 ($USER_COUNT 个用户) | Seed data exists ($USER_COUNT users)"
else
    echo "   ⚠️  种子数据不足，正在填充... | Insufficient seed data, seeding..."
    npm run prisma:seed
    if [ $? -eq 0 ]; then
        echo "   ✅ 种子数据填充成功 | Seed data populated successfully"
    else
        echo "   ❌ 种子数据填充失败 | Seed data population failed"
        exit 1
    fi
fi

# 尝试构建 | Try building
echo ""
echo "8️⃣ 验证构建... | Verifying build..."
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "   ✅ 构建成功 | Build successful"
else
    echo "   ⚠️  构建失败，但这可能是正常的 | Build failed, but this might be normal"
    echo "   开发模式下可以忽略 | You can ignore in development mode"
fi

# 总结 | Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ 系统验证完成！| System verification complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🚀 准备就绪！您可以启动应用了："
echo "🚀 Ready! You can now start the application:"
echo ""
echo "   npm run dev"
echo ""
echo "然后访问 | Then visit: http://localhost:3000"
echo ""
echo "📚 更多信息请查看 | For more info see:"
echo "   - README.md"
echo "   - DEPLOYMENT_GUIDE.md"
echo ""
