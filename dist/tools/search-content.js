/**
 * WeTV MCP - Tool: search_content
 * 搜索 WeTV/腾讯视频上的剧集、综艺、动漫、电影
 */
import { z } from 'zod';
import { formatContentItem } from '../utils/format.js';
export function registerSearchContent(server, dataService) {
    server.tool('search_content', 'Search for dramas, variety shows, anime, movies, and documentaries on WeTV and Tencent Video (腾讯视频). Supports searching by title, actor, director, genre, or keywords in both Chinese and English.', {
        query: z.string().describe('Search keywords - title, actor name, director, genre, or any keyword. Supports Chinese and English. Examples: "庆余年", "Joy of Life", "张若昀", "古装"'),
        type: z.enum(['drama', 'variety', 'anime', 'movie', 'documentary']).optional().describe('Filter by content type'),
        region: z.enum(['CN', 'TH', 'ID', 'VN', 'MY', 'PH', 'GLOBAL']).optional().describe('Filter by region availability. CN=China, TH=Thailand, ID=Indonesia, VN=Vietnam, MY=Malaysia, PH=Philippines'),
        language: z.string().optional().describe('Filter by subtitle language (ISO 639-1 code, e.g., "en", "th", "id", "vi")'),
        page: z.number().int().min(1).default(1).optional().describe('Page number, default 1'),
        per_page: z.number().int().min(1).max(20).default(10).optional().describe('Results per page, max 20, default 10'),
    }, async (params) => {
        const result = dataService.search({
            query: params.query,
            type: params.type,
            region: params.region,
            language: params.language,
            page: params.page ?? 1,
            per_page: params.per_page ?? 10,
        });
        if (result.data.length === 0) {
            return {
                content: [{
                        type: 'text',
                        text: JSON.stringify({
                            results: [],
                            total: 0,
                            message: `No results found for "${params.query}" on WeTV/Tencent Video. Try different keywords or remove filters.`,
                            source: 'WeTV / 腾讯视频',
                        }, null, 2),
                    }],
            };
        }
        const formatted = result.data.map((item, index) => formatContentItem(item, index + 1 + ((result.meta.page - 1) * result.meta.per_page)));
        return {
            content: [{
                    type: 'text',
                    text: JSON.stringify({
                        results: formatted,
                        meta: result.meta,
                        source: result.source,
                        disclaimer: 'Data from WeTV/Tencent Video. Playback may require a VIP subscription.',
                    }, null, 2),
                }],
        };
    });
}
//# sourceMappingURL=search-content.js.map