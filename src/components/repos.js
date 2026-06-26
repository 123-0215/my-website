/**
 * GitHub 项目卡片组件
 * 负责渲染项目列表
 */

/**
 * 渲染 GitHub 项目卡片
 * @param {Array} repos - 项目数组
 * @param {string} containerId - 容器元素 ID
 */
export function renderRepos(repos, containerId = 'repo-container') {
    const container = document.getElementById(containerId);

    if (!container) {
        console.warn('项目组件：找不到容器元素');
        return;
    }

    // 空状态
    if (!repos || repos.length === 0) {
        container.innerHTML = `
            <p style="color: var(--text-muted); text-align: center;">
                😅 这个用户还没有公开项目。
            </p>
        `;
        return;
    }

    // 生成卡片 HTML
    let html = '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">';
    repos.forEach(repo => {
        html += `
            <div style="background: var(--btn-ghost-bg); padding: 15px; border-radius: 12px; border-left: 4px solid #6c5ce7;">
                <a 
                    href="${repo.html_url}" 
                    target="_blank" 
                    style="font-weight: bold; color: var(--text-primary); text-decoration: none; font-size: 16px;"
                >
                    📁 ${repo.name}
                </a>
                <p style="font-size: 14px; color: var(--text-secondary); margin: 8px 0 0 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    ${repo.description || '这个项目还没有描述'}
                </p>
                <div style="margin-top: 10px; font-size: 12px; color: var(--text-muted);">
                    ⭐ ${repo.stargazers_count} · 🍴 ${repo.forks_count}
                </div>
                <div style="font-size: 12px; color: #6c5ce7; margin-top: 4px;">
                    💻 ${repo.language || '未知'}
                </div>
            </div>
        `;
    });
    html += '</div>';

    container.innerHTML = html;
}