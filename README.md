# ER Diagram Generator

这是一个基于 Next.js 的 ER 图生成器，允许用户输入 MySQL CREATE TABLE 语句并生成相应的实体关系图。该项目使用 TypeScript 和 Tailwind CSS 构建，提供了友好的用户界面和交互体验。

## 功能

- 输入 MySQL CREATE TABLE 语句
- 生成相应的 ER 图
- 显示加载动画
- 错误处理和提示
- 下载生成的 ER 图为 SVG 文件
- 放大查看 ER 图

## 技术栈

- [Next.js](https://nextjs.org/) - React 框架
- [TypeScript](https://www.typescriptlang.org/) - JavaScript 的超集
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [mermaid](https://mermaid-js.github.io/mermaid/#/) - 用于生成图表的库
- [node-sql-parser](https://github.com/NodeSQLParser/node-sql-parser) - SQL 解析器

## 安装和运行

1. 克隆这个仓库：

   ```bash
   git clone https://github.com/yourusername/er_generator.git
   cd er_generator
   ```

2. 安装依赖：

   ```bash
   npm install
   ```

3. 运行开发服务器：

   ```bash
   npm run dev
   ```

4. 打开浏览器访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 使用说明

1. 在文本框中输入 MySQL CREATE TABLE 语句。
2. 点击 "Generate Diagram" 按钮生成 ER 图。
3. 点击生成的 ER 图可以放大查看。
4. 点击 "Download Diagram" 按钮下载 ER 图为 SVG 文件。

## 贡献

欢迎任何形式的贡献！请提交问题或拉取请求。

## 许可证

该项目使用 MIT 许可证。有关详细信息，请参阅 [LICENSE](LICENSE) 文件。