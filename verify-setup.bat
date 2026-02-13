@echo off
REM 系统验证脚本 | System Verification Script
REM 用于验证投注系统是否正确安装和配置 | Verify betting system installation and configuration

echo 🔍 开始验证投注系统... ^| Starting betting system verification...
echo.

REM 检查 Node.js | Check Node.js
echo 1️⃣ 检查 Node.js 版本... ^| Checking Node.js version...
node -v >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%a in ('node -v') do set NODE_VERSION=%%a
    echo    ✅ Node.js 已安装: %NODE_VERSION% ^| Node.js installed: %NODE_VERSION%
) else (
    echo    ❌ Node.js 未安装 ^| Node.js not installed
    echo    请安装 Node.js 18+ ^| Please install Node.js 18+
    exit /b 1
)

REM 检查 npm | Check npm
echo.
echo 2️⃣ 检查 npm 版本... ^| Checking npm version...
npm -v >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%a in ('npm -v') do set NPM_VERSION=%%a
    echo    ✅ npm 已安装: %NPM_VERSION% ^| npm installed: %NPM_VERSION%
) else (
    echo    ❌ npm 未安装 ^| npm not installed
    exit /b 1
)

REM 检查依赖 | Check dependencies
echo.
echo 3️⃣ 检查项目依赖... ^| Checking project dependencies...
if exist "node_modules" (
    echo    ✅ 依赖已安装 ^| Dependencies installed
) else (
    echo    ⚠️  依赖未安装，正在安装... ^| Dependencies not installed, installing...
    call npm install
    if %errorlevel% equ 0 (
        echo    ✅ 依赖安装成功 ^| Dependencies installed successfully
    ) else (
        echo    ❌ 依赖安装失败 ^| Dependencies installation failed
        exit /b 1
    )
)

REM 检查 .env 文件 | Check .env file
echo.
echo 4️⃣ 检查环境配置... ^| Checking environment configuration...
if exist ".env" (
    echo    ✅ .env 文件存在 ^| .env file exists
) else (
    echo    ⚠️  .env 文件不存在，从模板创建... ^| .env file not found, creating from template...
    if exist ".env.example" (
        copy .env.example .env >nul
        echo    ✅ .env 文件已创建 ^| .env file created
    ) else (
        echo    ❌ .env.example 模板不存在 ^| .env.example template not found
        exit /b 1
    )
)

REM 检查 Prisma Client | Check Prisma Client
echo.
echo 5️⃣ 检查 Prisma 客户端... ^| Checking Prisma Client...
if exist "node_modules\@prisma\client" (
    echo    ✅ Prisma Client 已生成 ^| Prisma Client generated
) else (
    echo    ⚠️  Prisma Client 未生成，正在生成... ^| Prisma Client not generated, generating...
    call npx prisma generate
    if %errorlevel% equ 0 (
        echo    ✅ Prisma Client 生成成功 ^| Prisma Client generated successfully
    ) else (
        echo    ❌ Prisma Client 生成失败 ^| Prisma Client generation failed
        exit /b 1
    )
)

REM 检查数据库 | Check database
echo.
echo 6️⃣ 检查数据库... ^| Checking database...
if exist "dev.db" (
    echo    ✅ 数据库文件存在 ^| Database file exists
) else (
    echo    ⚠️  数据库不存在，正在创建... ^| Database not found, creating...
    call npx prisma migrate dev --name init
    if %errorlevel% equ 0 (
        echo    ✅ 数据库迁移成功 ^| Database migration successful
    ) else (
        echo    ❌ 数据库迁移失败 ^| Database migration failed
        exit /b 1
    )
)

REM 检查种子数据 | Check seed data
echo.
echo 7️⃣ 检查并填充种子数据... ^| Checking and seeding data...
call npm run prisma:seed
if %errorlevel% equ 0 (
    echo    ✅ 种子数据检查/填充成功 ^| Seed data check/population successful
) else (
    echo    ⚠️  种子数据填充可能失败，请检查 ^| Seed data population might have failed, please check
)

REM 总结 | Summary
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo ✅ 系统验证完成！^| System verification complete!
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo 🚀 准备就绪！您可以启动应用了：
echo 🚀 Ready! You can now start the application:
echo.
echo    npm run dev
echo.
echo 然后访问 ^| Then visit: http://localhost:3000
echo.
echo 📚 更多信息请查看 ^| For more info see:
echo    - README.md
echo    - DEPLOYMENT_GUIDE.md
echo.
pause
