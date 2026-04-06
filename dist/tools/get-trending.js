/**
 * WeTV MCP - Tool: get_trending
 * 获取 WeTV/腾讯视频 热播榜/飙升榜
 */
import { z } from 'zod';
import { formatContentItem } from '../utils/format.js';
export function registerGetTrending(server, dataService) {
    server.tool('get_trending', 'Get the current trending/hot content on WeTV and Tencent Video (腾讯视频). Returns the hottest dramas, variety shows, anime, and movies ranked by real-time heat index. Perfect for answering "what\'s hot right now" or "what should I watch".', {
        type: z.enum(['drama', 'variety', 'anime', 'movie', 'documentary']).optional().describe('Filter by content type. Omit to get all types.'),
        region: z.enum(['CN', 'TH', 'ID', 'VN', 'MY', 'PH', 'GLOBAL']).optional().describe('Filter by region. CN=China Mainland, TH=Thailand (WeTV), ID=Indonesia (WeTV), etc.'),
        limit: z.number().int().min(1).max(20).default(10).optional().describe('Number of results, max 20, default 10'),
    }, async (params) => {
        const results = dataService.getTrending({
            type: params.type,
            region: params.region,
            limit: params.limit ?? 10,
        });
        const formatted = results.map((item, index) => formatContentItem(item, index + 1));
        const typeLabel = params.type ? ` ${params.type}` : '';
        const regionLabel = params.region ? ` (${params.region})` : '';
        return {
            content: [{
                    type: 'text',
                    text: JSON.stringify({
                        trending: formatted,
                        total: formatted.length,
                        title: `WeTV/Tencent Video Trending${typeLabel}${regionLabel}`,
                        updated_at: new Date().toISOString(),
                        source: 'WeTV / 腾讯视频',
                        disclaimer: 'Rankings based on real-time heat index. Playback may require a VIP subscription.',
                    }, null, 2),
                }],
        };
    });
}
//# sourceMappingURL=get-trending.js.map