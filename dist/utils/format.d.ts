/**
 * WeTV MCP - 格式化工具
 * 将内容项格式化为 AI 友好的结构
 */
import type { ContentItem } from '../types.js';
/**
 * 格式化内容项为 AI 可读的 JSON 结构
 */
export declare function formatContentItem(item: ContentItem, rank?: number): {
    id: string;
    title: string;
    title_en: string;
    type: import("../types.js").ContentType;
    genre: string[];
    genre_en: string[];
    rating: number;
    status: import("../types.js").ContentStatus;
    episodes: {
        total: number;
        aired: number;
    };
    update_schedule: string;
    brief: string;
    brief_en: string;
    cast: string[];
    director: string;
    tags: string[];
    heat_index: number;
    release_year: number;
    play_url: string;
    deeplink: string;
    cover_url: string;
    region_available: import("../types.js").Region[];
    subtitle_languages: string[];
    rank?: number | undefined;
};
//# sourceMappingURL=format.d.ts.map