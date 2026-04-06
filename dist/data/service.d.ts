/**
 * WeTV MCP - Data Service
 * 数据服务层：对接 WeTV 公开数据 + 本地数据库 fallback
 */
import type { ContentItem, ContentType, Episode, ListResponse, RecommendationParams, Region, SearchParams, TrendingParams } from '../types.js';
/**
 * WeTV 数据服务
 */
export declare class WetvDataService {
    private db;
    constructor();
    /**
     * 搜索内容
     */
    search(params: SearchParams): ListResponse<ContentItem>;
    /**
     * 获取热播/飙升内容
     */
    getTrending(params?: TrendingParams): ContentItem[];
    /**
     * 获取热门（按播放量）
     */
    getPopular(params?: {
        type?: ContentType;
        region?: Region;
        limit?: number;
    }): ContentItem[];
    /**
     * 获取内容详情
     */
    getDetail(id: string): ContentItem | null;
    /**
     * 获取剧集列表
     */
    getEpisodes(contentId: string, page?: number, perPage?: number): ListResponse<Episode>;
    /**
     * 个性化推荐
     */
    getRecommendations(params?: RecommendationParams): ContentItem[];
    /**
     * 获取类型趋势
     */
    getGenreTrends(): {
        genre: string;
        genre_en: string;
        count: number;
        avg_rating: number;
        avg_heat: number;
    }[];
}
//# sourceMappingURL=service.d.ts.map