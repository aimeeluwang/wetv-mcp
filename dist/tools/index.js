/**
 * WeTV MCP - 工具注册入口
 * 统一注册所有 MCP Tools
 */
import { registerSearchContent } from './search-content.js';
import { registerGetTrending } from './get-trending.js';
import { registerGetPopular } from './get-popular.js';
import { registerGetContentDetail } from './get-content-detail.js';
import { registerGetEpisodes } from './get-episodes.js';
import { registerGetRecommendations } from './get-recommendations.js';
/**
 * 注册所有 WeTV MCP 工具
 */
export function registerAllTools(server, dataService) {
    registerSearchContent(server, dataService);
    registerGetTrending(server, dataService);
    registerGetPopular(server, dataService);
    registerGetContentDetail(server, dataService);
    registerGetEpisodes(server, dataService);
    registerGetRecommendations(server, dataService);
}
//# sourceMappingURL=index.js.map