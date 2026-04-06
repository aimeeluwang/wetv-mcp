/**
 * WeTV MCP - Data Service
 * 数据服务层：对接 WeTV 公开数据 + 本地数据库 fallback
 */

import { CONTENT_DB, generateEpisodes, GENRE_MAP } from './content-db.js';
import type {
  ContentItem,
  ContentType,
  Episode,
  ListResponse,
  RecommendationParams,
  Region,
  SearchParams,
  TrendingParams,
} from '../types.js';

/**
 * WeTV 数据服务
 */
export class WetvDataService {
  private db: ContentItem[];

  constructor() {
    this.db = [...CONTENT_DB];
  }

  /**
   * 搜索内容
   */
  search(params: SearchParams): ListResponse<ContentItem> {
    const { query, type, region, language, page = 1, per_page = 10 } = params;
    const q = query.toLowerCase();

    let results = this.db.filter(item => {
      // 关键词匹配：标题、演员、简介、流派
      const matchesQuery =
        item.title.toLowerCase().includes(q) ||
        item.title_en.toLowerCase().includes(q) ||
        item.cast.some(c => c.toLowerCase().includes(q)) ||
        item.brief.toLowerCase().includes(q) ||
        item.brief_en.toLowerCase().includes(q) ||
        item.genre.some(g => g.toLowerCase().includes(q)) ||
        item.director.toLowerCase().includes(q);

      const matchesType = !type || item.type === type;
      const matchesRegion = !region || item.region_available.includes(region);
      const matchesLanguage = !language || item.subtitle_languages.includes(language);

      return matchesQuery && matchesType && matchesRegion && matchesLanguage;
    });

    // 按热度排序
    results.sort((a, b) => b.heat_index - a.heat_index);

    const total = results.length;
    const start = (page - 1) * per_page;
    const paged = results.slice(start, start + per_page);

    return {
      data: paged,
      meta: {
        page,
        per_page,
        total,
        total_pages: Math.ceil(total / per_page),
      },
      source: 'WeTV / 腾讯视频',
    };
  }

  /**
   * 获取热播/飙升内容
   */
  getTrending(params: TrendingParams = {}): ContentItem[] {
    const { type, region, limit = 10 } = params;

    let results = [...this.db];

    if (type) {
      results = results.filter(item => item.type === type);
    }
    if (region) {
      results = results.filter(item => item.region_available.includes(region));
    }

    // 按热度指数排序
    results.sort((a, b) => b.heat_index - a.heat_index);

    return results.slice(0, limit);
  }

  /**
   * 获取热门（按播放量）
   */
  getPopular(params: { type?: ContentType; region?: Region; limit?: number } = {}): ContentItem[] {
    const { type, region, limit = 10 } = params;

    let results = [...this.db];

    if (type) {
      results = results.filter(item => item.type === type);
    }
    if (region) {
      results = results.filter(item => item.region_available.includes(region));
    }

    // 按热度 × 评分排序（综合热度）
    results.sort((a, b) => (b.heat_index * b.rating) - (a.heat_index * a.rating));

    return results.slice(0, limit);
  }

  /**
   * 获取内容详情
   */
  getDetail(id: string): ContentItem | null {
    return this.db.find(item => item.id === id) ?? null;
  }

  /**
   * 获取剧集列表
   */
  getEpisodes(contentId: string, page = 1, perPage = 20): ListResponse<Episode> {
    const episodes = generateEpisodes(contentId);
    const total = episodes.length;
    const start = (page - 1) * perPage;
    const paged = episodes.slice(start, start + perPage);

    return {
      data: paged,
      meta: {
        page,
        per_page: perPage,
        total,
        total_pages: Math.ceil(total / perPage),
      },
      source: 'WeTV / 腾讯视频',
    };
  }

  /**
   * 个性化推荐
   */
  getRecommendations(params: RecommendationParams = {}): ContentItem[] {
    const { genre, mood, type, region, limit = 5 } = params;

    let results = [...this.db];

    if (type) {
      results = results.filter(item => item.type === type);
    }
    if (region) {
      results = results.filter(item => item.region_available.includes(region));
    }

    // 基于 genre 过滤
    if (genre) {
      const g = genre.toLowerCase();
      results = results.filter(item =>
        item.genre.some(ig => ig.toLowerCase().includes(g)) ||
        item.genre.some(ig => {
          const en = GENRE_MAP[ig];
          return en && en.toLowerCase().includes(g);
        })
      );
    }

    // 基于 mood 推荐映射
    if (mood) {
      const moodGenreMap: Record<string, string[]> = {
        'relaxing': ['甜宠', '轻喜剧', '治愈', '旅行'],
        '轻松': ['甜宠', '轻喜剧', '治愈', '旅行'],
        'exciting': ['冒险', '热血', '竞技', '动作'],
        '热血': ['冒险', '热血', '竞技', '动作'],
        'romantic': ['爱情', '甜宠', '仙侠', '虐恋'],
        '浪漫': ['爱情', '甜宠', '仙侠', '虐恋'],
        'suspenseful': ['悬疑', '探案', '惊悚', '民国'],
        '烧脑': ['悬疑', '探案', '惊悚'],
        'funny': ['喜剧', '轻喜剧', '脱口秀'],
        '搞笑': ['喜剧', '轻喜剧', '脱口秀'],
        'inspiring': ['热血', '纪录片', '人文', '竞技'],
        '励志': ['热血', '纪录片', '人文', '竞技'],
        'date': ['爱情', '甜宠', '轻喜剧'],
        '约会': ['爱情', '甜宠', '轻喜剧'],
        'family': ['喜剧', '治愈', '旅行', '纪录片'],
        '家庭': ['喜剧', '治愈', '旅行', '纪录片'],
      };

      const moodGenres = moodGenreMap[mood.toLowerCase()] ?? [];
      if (moodGenres.length > 0) {
        results = results.filter(item =>
          item.genre.some(g => moodGenres.includes(g))
        );
      }
    }

    // 按评分 × 热度综合排序
    results.sort((a, b) => (b.rating * b.heat_index) - (a.rating * a.heat_index));

    return results.slice(0, limit);
  }

  /**
   * 获取类型趋势
   */
  getGenreTrends(): { genre: string; genre_en: string; count: number; avg_rating: number; avg_heat: number }[] {
    const genreStats = new Map<string, { count: number; totalRating: number; totalHeat: number }>();

    for (const item of this.db) {
      for (const genre of item.genre) {
        const stat = genreStats.get(genre) ?? { count: 0, totalRating: 0, totalHeat: 0 };
        stat.count++;
        stat.totalRating += item.rating;
        stat.totalHeat += item.heat_index;
        genreStats.set(genre, stat);
      }
    }

    return Array.from(genreStats.entries())
      .map(([genre, stat]) => ({
        genre,
        genre_en: GENRE_MAP[genre] ?? genre,
        count: stat.count,
        avg_rating: Math.round((stat.totalRating / stat.count) * 10) / 10,
        avg_heat: Math.round(stat.totalHeat / stat.count),
      }))
      .sort((a, b) => b.avg_heat - a.avg_heat);
  }
}
