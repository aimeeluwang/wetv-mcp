/**
 * WeTV MCP - Tool: get_content_detail
 * 获取单个内容的详细信息
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { WetvDataService } from '../data/service.js';
import { GENRE_MAP } from '../data/content-db.js';

export function registerGetContentDetail(server: McpServer, dataService: WetvDataService) {
  server.tool(
    'get_content_detail',
    'Get detailed information about a specific drama, movie, variety show, or anime on WeTV/Tencent Video (腾讯视频). Returns full details including synopsis, cast, rating, episode count, update schedule, play links, and available regions/subtitles.',
    {
      id: z.string().describe('Content ID (obtained from search_content or get_trending results). Example: "qyn3" for Joy of Life Season 3'),
    },
    async (params) => {
      const item = dataService.getDetail(params.id);

      if (!item) {
        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify({
              error: 'Content not found',
              message: `No content found with ID "${params.id}". Use search_content to find the correct ID.`,
            }, null, 2),
          }],
          isError: true,
        };
      }

      const detail = {
        id: item.id,
        title: item.title,
        title_en: item.title_en,
        type: item.type,
        genre: item.genre.map(g => ({ zh: g, en: GENRE_MAP[g] ?? g })),
        rating: item.rating,
        status: item.status,
        episodes: {
          total: item.total_episodes,
          aired: item.aired_episodes,
          update_schedule: item.update_schedule,
        },
        synopsis: {
          zh: item.brief,
          en: item.brief_en,
        },
        cast: item.cast,
        director: item.director,
        release_year: item.release_year,
        tags: item.tags,
        heat_index: item.heat_index,
        links: {
          web_url: item.play_url,
          deeplink: item.deeplink,
          cover_image: item.cover_url,
        },
        availability: {
          regions: item.region_available,
          subtitle_languages: item.subtitle_languages,
          language: item.language,
        },
        source: 'WeTV / 腾讯视频',
        disclaimer: 'Playback may require a VIP subscription. Availability varies by region.',
      };

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify(detail, null, 2),
        }],
      };
    }
  );
}
