#!/usr/bin/env node
/**
 * WeTV MCP Server - Stdio Transport (Local Mode)
 * 
 * 本地模式：通过 stdin/stdout 通信
 * 适用于 Claude Desktop / Cursor / Windsurf 等本地 AI 客户端
 * 
 * Usage:
 *   npx wetv-mcp
 *   node dist/index.js
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { WetvDataService } from './data/service.js';
import { registerAllTools } from './tools/index.js';

const SERVER_NAME = 'wetv-mcp';
const SERVER_VERSION = '1.0.0';

async function main() {
  // 创建 MCP Server
  const server = new McpServer({
    name: SERVER_NAME,
    version: SERVER_VERSION,
  });

  // 初始化数据服务
  const dataService = new WetvDataService();

  // 注册所有工具
  registerAllTools(server, dataService);

  // 使用 Stdio 传输
  const transport = new StdioServerTransport();
  await server.connect(transport);

  // 日志输出到 stderr（不干扰 stdout 的 MCP 协议通信）
  console.error(`[${SERVER_NAME}] MCP Server v${SERVER_VERSION} running on stdio`);
  console.error(`[${SERVER_NAME}] 6 tools registered: search_content, get_trending, get_popular, get_content_detail, get_episodes, get_recommendations`);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
