# 🎬 WeTV MCP 服务器

> 全球首个中文长视频 MCP 服务器。让 AI 助手搜索和推荐 **WeTV** 和 **腾讯视频** 上的电视剧、综艺、动漫和电影。

[![npm version](https://img.shields.io/npm/v/wetv-mcp)](https://www.npmjs.com/package/wetv-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-Compatible-blue)](https://modelcontextprotocol.io)

[English](./README.md)

---

## ✨ 这是什么？

**wetv-mcp** 是一个 [MCP (Model Context Protocol)](https://modelcontextprotocol.io) 服务器，让 AI 助手（Claude、ChatGPT、Cursor 等）能够搜索和推荐腾讯视频/WeTV 的内容。

### 为什么要做？

YouTube 和 Spotify 已经有了 MCP 服务器，但**中文长视频领域的 MCP 完全空白**。

当你问 AI _"最近有什么好看的国产剧？"_，它现在可以给你真实的推荐，附带播放链接、评分、演员信息和更新进度——全部来自腾讯视频/WeTV。

---

## 🚀 快速开始

### 方式一：克隆安装（推荐）

```bash
git clone https://github.com/aimeeluwang/wetv-mcp.git
cd wetv-mcp
npm install
npm run build
```

在你的 MCP 配置文件中添加：

```json
{
  "mcpServers": {
    "wetv": {
      "command": "node",
      "args": ["/path/to/wetv-mcp/dist/index.js"]
    }
  }
}
```

> 💡 将 `/path/to/wetv-mcp` 替换为你实际的克隆路径。

**配置文件位置：**
- **Claude Desktop**: `~/Library/Application Support/Claude/claude_desktop_config.json`（macOS）
- **Cursor**: 项目根目录 `.cursor/mcp.json`
- **WorkBuddy**: `~/.workbuddy/mcp.json`

### 方式二：远程模式（HTTP 服务器）

```bash
cd wetv-mcp
npm run start:http
# 服务器运行在 http://localhost:3000/mcp
```

远程连接配置：

```json
{
  "mcpServers": {
    "wetv": {
      "url": "http://localhost:3000/mcp"
    }
  }
}
```

---

## 🛠️ 工具列表

| 工具 | 功能 | 场景示例 |
|------|------|---------|
| **search_content** | 全文搜索内容 | "搜一下腾讯视频上有没有《庆余年》" |
| **get_trending** | 获取热播/飙升榜 | "最近腾讯视频什么剧最火？" |
| **get_popular** | 获取综合热度排行 | "最受欢迎的国漫是哪些？" |
| **get_content_detail** | 获取内容详情 | "《逐玉》讲的什么？评分多少？" |
| **get_episodes** | 获取剧集列表 | "《庆余年》第三季有多少集？" |
| **get_recommendations** | AI 个性化推荐 | "推荐几部适合周末看的轻松甜剧" |

### 支持的内容类型
- 📺 **电视剧** — 古装/现代/仙侠/悬疑/甜宠
- 🎭 **综艺** — 选秀/真人秀/脱口秀
- 🎌 **动漫** — 国漫
- 🎬 **电影** — 院线/网络电影
- 📹 **纪录片**

### 支持的地区
🇨🇳 中国大陆 | 🇹🇭 泰国 | 🇮🇩 印尼 | 🇻🇳 越南 | 🇲🇾 马来西亚 | 🇵🇭 菲律宾 | 🌏 全球

---

## 💬 使用示例

### "最近有什么好看的？"

```
用户：WeTV 上现在什么剧最火？

AI（调用 get_trending）：腾讯视频热播榜前 5：

1. 🥇《庆余年 第三季》 ★8.6
   权谋喜剧大作，张若昀主演。已完结，共 36 集。
   👉 播放：https://v.qq.com/x/cover/mzc00200qyn3.html

2. 🥈《逐玉》 ★8.3
   双女主古装玄幻，虞书欣 × 田曦薇。已完结，40 集。
   👉 播放：https://v.qq.com/x/cover/mzc00200zy26.html

3. 🥉《猎人传说》 ★8.4
   民国悬疑探险，肖战 × 杨紫。已完结，30 集。
   👉 播放：https://v.qq.com/x/cover/mzc00200lrcs.html
```

### "推荐约会看的剧"

```
用户：今晚跟女朋友看什么？推荐甜一点的

AI（调用 get_recommendations mood="约会"）：
为你推荐这几部适合约会看的甜剧：

1.《我们的美好际遇》 ★7.8
   天才女程序员 × 霸总建筑师，甜蜜日常。

2.《与凤行》 ★8.1
   仙侠爱情，赵丽颖 × 林更新。

3.《以爱为营》 ★7.6
   WeTV 东南亚热播前三，霸气女总裁 × 温柔记者。
```

---

## 🏗️ 开发

```bash
npm install          # 安装依赖
npm run dev          # 开发模式（stdio）
npm run dev:http     # 开发模式（HTTP）
npm run build        # 构建
npm start            # 生产运行（stdio）
npm run start:http   # 生产运行（HTTP）
```

---

## 📄 许可证

MIT

---

_用 ❤️ 为全球华语剧迷打造。首个将中文流媒体内容带入 AI 助手的 MCP。_
