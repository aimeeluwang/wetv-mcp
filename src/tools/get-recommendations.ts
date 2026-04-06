/**
 * WeTV MCP - Tool: get_recommendations
 * 个性化推荐 - AI 追剧顾问
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { WetvDataService } from '../data/service.js';
import { formatContentItem } from '../utils/format.js';
import type { ContentType, Region } from '../types.js';

export function registerGetRecommendations(server: McpServer, dataService: WetvDataService) {
  server.tool(
    'get_recommendations',
    'Get personalized content recommendations from WeTV/Tencent Video (腾讯视频) based on genre preferences, mood, or viewing context. This is the AI drama advisor - perfect for "what should I watch tonight?", "recommend something for a date", or "I\'m in the mood for something exciting". Supports both Chinese and English genre/mood keywords.',
    {
      genre: z.string().optional().describe('Preferred genre in Chinese or English. Examples: "古装" (Historical), "悬疑" (Mystery), "甜宠" (Sweet Romance), "热血" (Action), "科幻" (Sci-Fi)'),
      mood: z.string().optional().describe('Current mood or context. Supported: "relaxing/轻松", "exciting/热血", "romantic/浪漫", "suspenseful/烧脑", "funny/搞笑", "inspiring/励志", "date/约会", "family/家庭"'),
      type: z.enum(['drama', 'variety', 'anime', 'movie', 'documentary']).optional().describe('Filter by content type'),
      region: z.enum(['CN', 'TH', 'ID', 'VN', 'MY', 'PH', 'GLOBAL']).optional().describe('Filter by region availability'),
      limit: z.number().int().min(1).max(10).default(5).optional().describe('Number of recommendations, max 10, default 5'),
    },
    async (params) => {
      const results = dataService.getRecommendations({
        genre: params.genre,
        mood: params.mood,
        type: params.type as ContentType | undefined,
        region: params.region as Region | undefined,
        limit: params.limit ?? 5,
      });

      if (results.length === 0) {
        // Fallback 到通用推荐
        const fallback = dataService.getTrending({ limit: params.limit ?? 5 });
        const formatted = fallback.map((item, index) => formatContentItem(item, index + 1));

        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify({
              recommendations: formatted,
              total: formatted.length,
              note: `No exact matches for the specified preferences. Here are the current trending picks instead.`,
              criteria: { genre: params.genre, mood: params.mood, type: params.type },
              source: 'WeTV / 腾讯视频',
              disclaimer: 'Playback may require a VIP subscription.',
            }, null, 2),
          }],
        };
      }

      const formatted = results.map((item, index) => formatContentItem(item, index + 1));

      const moodLabel = params.mood ? ` for "${params.mood}" mood` : '';
      const genreLabel = params.genre ? ` in "${params.genre}" genre` : '';

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            recommendations: formatted,
            total: formatted.length,
            title: `WeTV/Tencent Video Recommendations${genreLabel}${moodLabel}`,
            criteria: { genre: params.genre, mood: params.mood, type: params.type, region: params.region },
            source: 'WeTV / 腾讯视频',
            tip: 'Click the play_url to start watching directly on WeTV/Tencent Video.',
            disclaimer: 'Playback may require a VIP subscription. Availability varies by region.',
          }, null, 2),
        }],
      };
    }
  );
}
