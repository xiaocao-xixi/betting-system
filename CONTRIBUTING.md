# Contributing to Betting System | 贡献指南

Thank you for your interest in contributing to the Betting System! | 感谢您对投注系统项目的关注！

## How to Contribute | 如何贡献

### Reporting Issues | 报告问题

If you find a bug or have a feature request, please create an issue on GitHub with:
- A clear title and description
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Your environment (OS, Node version, etc.)

如果您发现错误或有功能请求，请在 GitHub 上创建 issue，包含：
- 清晰的标题和描述
- 复现步骤（对于错误）
- 预期行为与实际行为
- 您的环境（操作系统、Node 版本等）

### Pull Requests | 提交 PR

1. **Fork the repository** | Fork 仓库
2. **Create a branch** | 创建分支
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** | 进行修改
4. **Test your changes** | 测试您的更改
   ```bash
   npm run build
   npm run dev
   ```
5. **Commit your changes** | 提交更改
   ```bash
   git commit -m "Add: your feature description"
   ```
6. **Push to your fork** | 推送到您的 fork
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Create a Pull Request** | 创建 Pull Request

### Code Style | 代码风格

- Use TypeScript for type safety
- Follow existing code formatting
- Add comments for complex logic
- Keep functions small and focused

- 使用 TypeScript 确保类型安全
- 遵循现有代码格式
- 为复杂逻辑添加注释
- 保持函数小而专注

### Commit Messages | 提交信息

Use clear, descriptive commit messages:
- `Add: new feature`
- `Fix: bug description`
- `Update: changes to existing feature`
- `Refactor: code improvements`
- `Docs: documentation updates`

使用清晰、描述性的提交信息：
- `Add: 新功能`
- `Fix: 错误描述`
- `Update: 现有功能的更改`
- `Refactor: 代码改进`
- `Docs: 文档更新`

### Testing | 测试

Before submitting a PR, make sure:
- The project builds without errors: `npm run build`
- All existing functionality still works
- Your new code has been tested locally

在提交 PR 之前，请确保：
- 项目构建无错误：`npm run build`
- 所有现有功能仍正常工作
- 您的新代码已在本地测试

## Development Setup | 开发环境设置

```bash
# Clone the repository
git clone https://github.com/xiaocao-xixi/betting-system.git
cd betting-system

# Install dependencies
npm install

# Setup database
npx prisma migrate dev --name init
npx prisma generate
npm run prisma:seed

# Start development server
npm run dev
```

**Note**: If you encounter connection issues when cloning (timeout, connection refused, etc.), please see the [Git Clone Troubleshooting section in the README](README.md#git-clone-issues--git-克隆问题) for solutions.

**注意**：如果克隆时遇到连接问题（超时、连接被拒绝等），请参阅 [README 中的 Git 克隆故障排除部分](README.md#git-clone-issues--git-克隆问题)寻找解决方案。

## Questions? | 有问题？

Feel free to open an issue for questions or discussions!

随时可以创建 issue 提问或讨论！

## License | 许可证

By contributing, you agree that your contributions will be licensed under the ISC License.

通过贡献，您同意您的贡献将在 ISC 许可证下授权。
