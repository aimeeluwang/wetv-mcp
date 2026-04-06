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
export {};
//# sourceMappingURL=http.d.ts.map