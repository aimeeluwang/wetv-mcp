/**
 * WeTV MCP - 格式化工具
 * 将内容项格式化为 AI 友好的结构
 */
import { GENRE_MAP } from '../data/content-db.js';
/**
 * 格式化内容项为 AI 可读的 JSON 结构
 */
export function formatContentItem(item, rank) {
    return {
        ...(rank !== undefined && { rank }),
        id: item.id,
        title: item.title,
        title_en: item.title_en,
        type: item.type,
        genre: item.genre,
        genre_en: item.genre.map(g => GENRE_MAP[g] ?? g),
        rating: item.rating,
        status: item.status,
        episodes: {
            total: item.total_episodes,
            aired: item.aired_episodes,
        },
        update_schedule: item.update_schedule,
        brief: item.brief,
        brief_en: item.brief_en,
        cast: item.cast,
        director: item.director,
        tags: item.tags,
        heat_index: item.heat_index,
        release_year: item.release_year,
        play_url: item.play_url,
        deeplink: item.deeplink,
        cover_url: item.cover_url,
        region_available: item.region_available,
        subtitle_languages: item.subtitle_languages,
    };
}
//# sourceMappingURL=format.js.map