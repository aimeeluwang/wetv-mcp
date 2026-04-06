/**
 * WeTV MCP - Data Types
 * 定义所有数据结构
 */
/** 剧集/内容类型 */
export type ContentType = 'drama' | 'variety' | 'anime' | 'movie' | 'documentary';
/** 内容状态 */
export type ContentStatus = 'airing' | 'completed' | 'upcoming';
/** 地区 */
export type Region = 'CN' | 'TH' | 'ID' | 'VN' | 'MY' | 'PH' | 'GLOBAL';
/** 剧集/内容项 */
export interface ContentItem {
    id: string;
    title: string;
    title_en: string;
    type: ContentType;
    genre: string[];
    rating: number;
    total_episodes: number;
    aired_episodes: number;
    status: ContentStatus;
    update_schedule: string;
    cover_url: string;
    play_url: string;
    deeplink: string;
    brief: string;
    brief_en: string;
    cast: string[];
    director: string;
    tags: string[];
    heat_index: number;
    release_year: number;
    region_available: Region[];
    language: string;
    subtitle_languages: string[];
}
/** 剧集信息 */
export interface Episode {
    episode_index: number;
    episode_name: string;
    duration_minutes: number;
    play_url: string;
    subtitle_languages: string[];
    air_date: string;
    brief: string;
}
/** 搜索参数 */
export interface SearchParams {
    query: string;
    type?: ContentType;
    region?: Region;
    language?: string;
    page?: number;
    per_page?: number;
}
/** 热播/趋势参数 */
export interface TrendingParams {
    type?: ContentType;
    region?: Region;
    limit?: number;
}
/** 推荐参数 */
export interface RecommendationParams {
    genre?: string;
    mood?: string;
    type?: ContentType;
    region?: Region;
    limit?: number;
}
/** 分页元数据 */
export interface PaginationMeta {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
}
/** 列表响应 */
export interface ListResponse<T> {
    data: T[];
    meta: PaginationMeta;
    source: string;
}
//# sourceMappingURL=types.d.ts.map