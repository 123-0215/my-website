/**
 * GitHub API 服务层
 * 负责所有 GitHub 相关的网络请求
 */

import { GITHUB_API_BASE } from '../config.js';

/**
 * 获取指定用户的公开仓库列表
 * @param {string} username - GitHub 用户名
 * @param {number} perPage - 每页数量（默认 12）
 * @returns {Promise<Object>} { success, data, error }
 */
export async function fetchUserRepos(username, perPage = 12) {
    try {
        const url = `${GITHUB_API_BASE}/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=${perPage}`;
        const response = await fetch(url);

        // 处理 404（用户不存在）
        if (response.status === 404) {
            return {
                success: false,
                error: 'USER_NOT_FOUND',
                message: `用户 "${username}" 不存在`
            };
        }

        // 处理其他 HTTP 错误
        if (!response.ok) {
            return {
                success: false,
                error: 'HTTP_ERROR',
                message: `请求失败 (状态码: ${response.status})`
            };
        }

        const data = await response.json();
        return {
            success: true,
            data: data
        };
    } catch (error) {
        return {
            success: false,
            error: 'NETWORK_ERROR',
            message: error.message || '网络连接失败'
        };
    }
}

/**
 * 获取用户的单个仓库详情（预留，暂未使用）
 */
export async function fetchRepoDetail(username, repoName) {
    // 可扩展
}