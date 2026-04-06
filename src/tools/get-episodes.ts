/**
 * WeTV MCP - Tool: get_episodes
 * 获取剧集列表
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { WetvDataService } from '../data/service.js';

export function registerGetEpisodes(server: McpServer, dataService: WetvDataService) {
  server.tool(
    'get_episodes',
    'Get the episode list for a specific drama, anime, or variety show on WeTV/Tencent Video. Returns episode numbers, names, durations, air dates, and play links with subtitle information.',
    {
      content_id: z.string().describe('Content ID (from search_content or get_trending). Example: "qyn3"'),
      page: z.number().int().min(1).default(1).optional().describe('Page number, default 1'),
      per_page: z.number().int().min(1).max(50).default(20).optional().describe('Episodes per page, max 50, default 20'),
    },
    async (params) => {
      const detail = dataService.getDetail(params.content_id);
      if (!detail) {
        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify({
              error: 'Content not found',
              message: `No content found with ID "${params.content_id}". Use search_content to find the correct ID.`,
            }, null, 2),
          }],
          isError: true,
        };
      }

      const result = dataService.getEpisodes(params.content_id, params.page ?? 1, params.per_page ?? 20);

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            content_id: params.content_id,
            title: detail.title,
            title_en: detail.title_en,
            status: detail.status,
            total_episodes: detail.total_episodes,
            aired_episodes: detail.aired_episodes,
            update_schedule: detail.update_schedule,
            episodes: result.data,
            meta: result.meta,
            source: result.source,
            disclaimer: 'Playback may require a VIP subscription.',
          }, null, 2),
        }],
      };
    }
  );
}
