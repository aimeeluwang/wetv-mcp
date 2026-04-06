/**
 * WeTV MCP Server - Streamable HTTP Transport (Remote Mode)
 * 
 * 远程模式：通过 HTTP + SSE 通信
 * 适用于云端部署，支持任何 MCP 客户端远程连接
 * 
 * Usage:
 *   node dist/http.js
 *   WETV_MCP_PORT=3000 node dist/http.js
 * 
 * Endpoints:
 *   POST /mcp  - MCP JSON-RPC requests
 *   GET  /mcp  - SSE stream for server notifications
 *   GET  /health - Health check
 */

import express from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { WetvDataService } from './data/service.js';
import { registerAllTools } from './tools/index.js';

const SERVER_NAME = 'wetv-mcp';
const SERVER_VERSION = '1.0.0';
const PORT = parseInt(process.env['WETV_MCP_PORT'] ?? '3000', 10);

async function main() {
  const app = express();
  app.use(express.json());

  // 安全头
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Mcp-Session-Id, Authorization');
    res.setHeader('Access-Control-Expose-Headers', 'Mcp-Session-Id');
    next();
  });

  // CORS preflight
  app.options('/mcp', (_req, res) => {
    res.status(204).end();
  });

  // Session 管理
  const sessions = new Map<string, { server: McpServer; transport: StreamableHTTPServerTransport }>();

  /**
   * 创建新的 MCP session
   */
  function createSession(): { server: McpServer; transport: StreamableHTTPServerTransport } {
    const server = new McpServer({
      name: SERVER_NAME,
      version: SERVER_VERSION,
    });

    const dataService = new WetvDataService();
    registerAllTools(server, dataService);

    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => `wetv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      onsessioninitialized: (sessionId) => {
        sessions.set(sessionId, { server, transport });
        console.log(`[${SERVER_NAME}] Session created: ${sessionId}`);
      },
    });

    server.connect(transport).catch(err => {
      console.error(`[${SERVER_NAME}] Connect error:`, err);
    });

    return { server, transport };
  }

  // POST /mcp - 处理 MCP 请求
  app.post('/mcp', async (req, res) => {
    const sessionId = req.headers['mcp-session-id'] as string | undefined;
    let session: { server: McpServer; transport: StreamableHTTPServerTransport };

    if (sessionId && sessions.has(sessionId)) {
      session = sessions.get(sessionId)!;
    } else if (!sessionId) {
      // 新 session（初始化请求）
      session = createSession();
    } else {
      res.status(404).json({ error: 'Session not found' });
      return;
    }

    try {
      await session.transport.handleRequest(req, res, req.body);
    } catch (error) {
      console.error(`[${SERVER_NAME}] Request error:`, error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  });

  // GET /mcp - SSE 流
  app.get('/mcp', async (req, res) => {
    const sessionId = req.headers['mcp-session-id'] as string | undefined;
    if (!sessionId || !sessions.has(sessionId)) {
      res.status(404).json({ error: 'Session not found. Send a POST request first to initialize.' });
      return;
    }

    const session = sessions.get(sessionId)!;
    await session.transport.handleRequest(req, res);
  });

  // DELETE /mcp - 关闭 session
  app.delete('/mcp', async (req, res) => {
    const sessionId = req.headers['mcp-session-id'] as string | undefined;
    if (sessionId && sessions.has(sessionId)) {
      const session = sessions.get(sessionId)!;
      await session.transport.close();
      sessions.delete(sessionId);
      console.log(`[${SERVER_NAME}] Session closed: ${sessionId}`);
    }
    res.status(204).end();
  });

  // Health check
  app.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      server: SERVER_NAME,
      version: SERVER_VERSION,
      tools: 6,
      active_sessions: sessions.size,
      uptime: process.uptime(),
    });
  });

  // 根路由 - 显示信息
  app.get('/', (_req, res) => {
    res.json({
      name: SERVER_NAME,
      version: SERVER_VERSION,
      description: 'WeTV & Tencent Video MCP Server - Search, discover, and explore Chinese dramas, variety shows, anime, and movies.',
      mcp_endpoint: '/mcp',
      health_endpoint: '/health',
      tools: [
        'search_content - Search content by keywords',
        'get_trending - Get trending/hot content',
        'get_popular - Get most popular content',
        'get_content_detail - Get detailed content information',
        'get_episodes - Get episode list',
        'get_recommendations - Get personalized recommendations',
      ],
      usage: {
        remote: {
          description: 'Connect via Streamable HTTP',
          config: {
            mcpServers: {
              wetv: {
                url: `http://localhost:${PORT}/mcp`,
              },
            },
          },
        },
        local: {
          description: 'Connect via stdio',
          config: {
            mcpServers: {
              wetv: {
                command: 'npx',
                args: ['-y', 'wetv-mcp'],
              },
            },
          },
        },
      },
    });
  });

  app.listen(PORT, () => {
    console.log(`\n🎬 ${SERVER_NAME} v${SERVER_VERSION}`);
    console.log(`   MCP endpoint: http://localhost:${PORT}/mcp`);
    console.log(`   Health check: http://localhost:${PORT}/health`);
    console.log(`   Server info:  http://localhost:${PORT}/`);
    console.log(`\n   6 tools registered:`);
    console.log(`   • search_content       - Search dramas, movies, anime, variety shows`);
    console.log(`   • get_trending         - Get trending/hot content`);
    console.log(`   • get_popular          - Get most popular content`);
    console.log(`   • get_content_detail   - Get detailed content info`);
    console.log(`   • get_episodes         - Get episode list`);
    console.log(`   • get_recommendations  - AI drama advisor recommendations`);
    console.log(`\n   Ready for connections! 🚀\n`);
  });
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
