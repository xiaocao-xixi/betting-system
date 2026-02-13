# 使用 Node.js 官方镜像 | Use official Node.js image
FROM node:18-alpine

# 设置工作目录 | Set working directory
WORKDIR /app

# 复制 package 文件 | Copy package files
COPY package*.json ./

# 安装依赖 | Install dependencies
RUN npm ci

# 复制项目文件 | Copy project files
COPY . .

# 生成 Prisma 客户端 | Generate Prisma client
RUN npx prisma generate

# 构建 Next.js 应用 | Build Next.js app
RUN npm run build

# 暴露端口 | Expose port
EXPOSE 3000

# 启动命令 | Start command
CMD ["npm", "start"]
