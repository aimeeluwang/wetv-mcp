/**
 * WeTV MCP - Tool: get_popular
 * 获取 WeTV/腾讯视频 热门内容（按综合热度排序）
 */
import { z } from 'zod';
import { formatContentItem } from '../utils/format.js';
export function registerGetPopular(server, dataService) {
    server.tool('get_popular', 'Get the most popular content on WeTV and Tencent Video (腾讯视频) ranked by combined popularity score (views × rating). Different from trending - popular shows the all-time best-performing content.', {
        type: z.enum(['drama', 'variety', 'anime', 'movie', 'documentary']).optional().describe('Filter by content type'),
        region: z.enum(['CN', 'TH', 'ID', 'VN', 'MY', 'PH', 'GLOBAL']).optional().describe('Filter by region availability'),
        limit: z.number().int().min(1).max(20).default(10).optional().describe('Number of results, max 20, default 10'),
    }, async (params) => {
        const results = dataService.getPopular({
            type: params.type,
            region: params.region,
            limit: params.limit ?? 10,
        });
        const formatted = results.map((item, index) => formatContentItem(item, index + 1));
        return {
            content: [{
                    type: 'text',
                    text: JSON.stringify({
                        popular: formatted,
                        total: formatted.length,
                        title: 'WeTV/Tencent Video Most Popular',
                        source: 'WeTV / 腾讯视频',
                        disclaimer: 'Ranked by combined popularity score. Playback may require a VIP subscription.',
                    }, null, 2),
                }],
        };
    });
}
//# sourceMappingURL=get-popular.js.map