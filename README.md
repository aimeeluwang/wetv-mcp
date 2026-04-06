# 🎬 WeTV MCP Server

> The first MCP server for Chinese long-form video streaming. Search, discover, and explore dramas, variety shows, anime, and movies on **WeTV** and **Tencent Video (腾讯视频)**.

[![npm version](https://img.shields.io/npm/v/wetv-mcp)](https://www.npmjs.com/package/wetv-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-Compatible-blue)](https://modelcontextprotocol.io)

[中文文档](./README_CN.md)

---

## ✨ What is this?

**wetv-mcp** is a [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server that lets AI assistants (Claude, ChatGPT, Cursor, etc.) search and recommend content from WeTV and Tencent Video — the largest Chinese-language streaming platform with **350M+ monthly active users**.

### Why does this matter?

YouTube and Spotify already have MCP servers. But there's **zero MCP coverage for Chinese long-form video content**. This fills that gap.

When you ask your AI assistant _"What Chinese drama should I watch?"_, it can now give you real answers with play links, ratings, cast info, and episode updates — all from WeTV/Tencent Video.

---

## 🚀 Quick Start

### Option 1: Local Mode (Claude Desktop / Cursor / Windsurf)

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "wetv": {
      "command": "npx",
      "args": ["-y", "wetv-mcp"]
    }
  }
}
```

**Configuration file locations:**
- **Claude Desktop**: `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows)
- **Cursor**: `.cursor/mcp.json` in your project root
- **Windsurf**: `~/.codebuddy/mcp.json`
- **WorkBuddy**: `~/.workbuddy/mcp.json`

### Option 2: Remote Mode (HTTP Server)

```bash
# Clone and install
git clone https://github.com/aimeeluwang/wetv-mcp.git
cd wetv-mcp
npm install
npm run build

# Start HTTP server
npm run start:http
# Server runs at http://localhost:3000/mcp
```

Then connect via Streamable HTTP:

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

## 🛠️ Available Tools

| Tool | Description | Example Query |
|------|-------------|---------------|
| **search_content** | Full-text search across all content | _"Search for Joy of Life on Tencent Video"_ |
| **get_trending** | Current trending/hot content rankings | _"What's the hottest drama on WeTV right now?"_ |
| **get_popular** | Most popular content by combined score | _"What are the most popular Chinese anime?"_ |
| **get_content_detail** | Detailed info (synopsis, cast, rating, episodes) | _"Tell me about Chasing Jade — what's it about?"_ |
| **get_episodes** | Episode list with air dates and play links | _"How many episodes does Joy of Life S3 have?"_ |
| **get_recommendations** | AI-powered personalized recommendations | _"Recommend something romantic for date night"_ |

### Content Types Supported
- 📺 **Dramas** (电视剧) — Chinese dramas, C-dramas, period/modern/fantasy
- 🎭 **Variety Shows** (综艺) — Reality shows, talent competitions, talk shows
- 🎌 **Anime** (动漫) — Chinese animation (donghua)
- 🎬 **Movies** (电影) — Chinese films
- 📹 **Documentaries** (纪录片)

### Regions Supported
- 🇨🇳 China Mainland (CN)
- 🇹🇭 Thailand (TH) — WeTV
- 🇮🇩 Indonesia (ID) — WeTV
- 🇻🇳 Vietnam (VN) — WeTV
- 🇲🇾 Malaysia (MY) — WeTV
- 🇵🇭 Philippines (PH) — WeTV
- 🌏 Global (GLOBAL)

---

## 💬 Example Conversations

### "What Chinese drama should I watch?"

```
User: What's trending on WeTV right now?

AI (via get_trending): Here are the top 5 trending dramas:

1. 🥇 Joy of Life Season 3 (庆余年 第三季) ★8.6
   Political intrigue meets comedy. Zhang Ruoyun returns as Fan Xian.
   👉 Watch: https://v.qq.com/x/cover/mzc00200qyn3.html

2. 🥈 Chasing Jade (逐玉) ★8.3
   Dual female leads in an epic fantasy adventure across three realms.
   👉 Watch: https://v.qq.com/x/cover/mzc00200zy26.html

3. 🥉 Legend of the Hunter (猎人传说) ★8.4
   Republic-era mystery thriller set in a primeval forest.
   👉 Watch: https://v.qq.com/x/cover/mzc00200lrcs.html
```

### "I'm in a romantic mood"

```
User: Recommend something romantic and sweet for tonight

AI (via get_recommendations with mood="romantic"):
Based on your mood, here are my picks:

1. Our Beautiful Encounters (我们的美好际遇) ★7.8
   Sweet office romance with a genius programmer meets CEO architect.

2. The Legend of Shen Li (与凤行) ★8.1
   Immortal romance starring Zhao Liying & Lin Gengxin.

3. Only For Love (以爱为营) ★7.6
   Top 3 on WeTV Southeast Asia — a charming CEO x journalist love story.
```

---

## 🏗️ Development

```bash
# Install dependencies
npm install

# Run in development mode (stdio)
npm run dev

# Run HTTP server in development mode
npm run dev:http

# Build for production
npm run build

# Start production (stdio)
npm start

# Start production (HTTP)
npm run start:http
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `WETV_MCP_PORT` | `3000` | HTTP server port |

---

## 📡 API Endpoints (HTTP Mode)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/mcp` | POST | MCP JSON-RPC requests |
| `/mcp` | GET | SSE stream for server notifications |
| `/mcp` | DELETE | Close session |
| `/health` | GET | Health check |
| `/` | GET | Server info & usage instructions |

---

## 🗺️ Roadmap

- [x] 6 core tools (search, trending, popular, detail, episodes, recommendations)
- [x] Stdio + Streamable HTTP dual transport
- [x] Multi-region support (China + Southeast Asia)
- [x] Bilingual content (Chinese + English)
- [ ] OAuth user authentication (watchlist, progress tracking)
- [ ] Subtitle/transcript retrieval
- [ ] Live WeTV API integration
- [ ] Cast/crew deep profiles
- [ ] Comment/danmaku AI summaries
- [ ] Content analytics (B2B)

---

## 📄 License

MIT © [aimeeluwang](https://github.com/aimeeluwang)

---

## 🌟 Contributing

PRs welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

Key areas where contributions are appreciated:
- Additional content data
- New tools (subtitle search, comment analysis, etc.)
- WeTV API integration
- Multi-language subtitle support
- Bug reports and feature requests

---

_Built with ❤️ for the global C-drama community. The first MCP to bring Chinese streaming content to AI assistants._
