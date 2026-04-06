/**
 * WeTV MCP - Content Database
 * 真实剧集数据 + WeTV API 数据源
 * 包含 2025-2026 年热播中国剧集、综艺、动漫、电影
 */
import type { ContentItem, Episode } from '../types.js';
/**
 * 内容数据库：真实剧集信息
 * 数据来源：WeTV/腾讯视频 公开信息
 */
export declare const CONTENT_DB: ContentItem[];
/**
 * 生成模拟剧集列表
 */
export declare function generateEpisodes(contentId: string): Episode[];
/** 流派映射（中英文） */
export declare const GENRE_MAP: Record<string, string>;
//# sourceMappingURL=content-db.d.ts.map