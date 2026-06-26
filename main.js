/**
 * 应用入口文件（总指挥）
 * 职责：数据流协调、事件绑定、全局函数暴露
 */

// ===== 导入工具 =====
import { DEFAULT_USERNAME, STORAGE_KEYS } from './src/config.js';
import { state, setState, getTodoStats } from './src/state/store.js';

// ===== 导入服务层 =====
import { fetchUserRepos } from './src/services/github.js';
import { fetchWeather } from './src/services/weather.js';

// ===== 导入组件层 =====
import { renderTodos } from './src/components/todo.js';
import { renderRepos } from './src/components/repos.js';
import { renderQuote } from './src/components/quote.js';

// ============================================
// 1. 页面加载初始化
// ============================================
window.onload = function() {
    // 1.1 用户名
    if (state.userName) {
        document.getElementById('greeting').textContent = '你好，' + state.userName + '！欢迎光临！';
    }

    // 1.2 主题
    if (state.theme === 'dark') {
        document.body.classList.add('dark-mode');
        updateToggleThumb(true);
    }

    // 1.3 待办事项
    renderTodos(state.todos);

    // 1.4 名言
    const quote = renderQuote();
    state.currentQuote = quote;

    // 1.5 天气
    const weatherInput = document.getElementById('weather-input');
    if (state.lastCity && weatherInput) {
        weatherInput.value = state.lastCity;
        // 自动加载天气（取消下面注释即可启用）
        // window.fetchWeather();
    }

    // 1.6 GitHub 默认用户名
    const githubInput = document.getElementById('github-username-input');
    if (githubInput) {
        githubInput.value = DEFAULT_USERNAME;
    }
};

// ============================================
// 2. 辅助函数
// ============================================
function updateToggleThumb(isDark) {
    const thumb = document.getElementById('toggle-thumb');
    if (thumb) {
        thumb.style.transform = isDark ? 'translateX(24px)' : 'translateX(0)';
        thumb.style.background = isDark ? '#f1c40f' : 'white';
    }
}

function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
            .then(() => alert('✅ 已复制到剪贴板！'))
            .catch(() => fallbackCopy(text));
    } else {
        fallbackCopy(text);
    }
}

function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.cssText = 'position:fixed;opacity:0;';
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        alert('✅ 已复制到剪贴板！');
    } catch {
        alert('❌ 复制失败，请手动复制。');
    }
    document.body.removeChild(textarea);
}

// ============================================
// 3. 暴露给 HTML 的全局函数（onclick 使用）
// ============================================

// ---- 3.1 用户功能 ----
window.customGreeting = function() {
    const userName = prompt('请输入你的名字：');
    if (userName && userName.trim() !== '') {
        setState('userName', userName.trim());
        document.getElementById('greeting').textContent = '你好，' + userName.trim() + '！欢迎光临！';
    } else {
        alert('名字不能为空哦，再试一次吧！');
    }
};

window.forgetMe = function() {
    setState('userName', '');
    document.getElementById('greeting').textContent = '你好，我是 123-0215';
    alert('已清除记忆！');
};

// ---- 3.2 主题 ----
window.toggleTheme = function() {
    const isDark = document.body.classList.toggle('dark-mode');
    setState('theme', isDark ? 'dark' : 'light');
    updateToggleThumb(isDark);
};

// ---- 3.3 名言 ----
window.fetchQuote = function() {
    const quote = renderQuote();
    state.currentQuote = quote;
};

window.copyQuote = function() {
    const { text, author } = state.currentQuote;
    if (!text) {
        alert('⚠️ 还没有名言可以复制，先点击“换一句”吧！');
        return;
    }
    copyToClipboard(`「${text}」—— ${author}`);
};

// ---- 3.4 待办事项 ----
window.addTodo = function() {
    const input = document.getElementById('todo-input');
    const text = input.value.trim();
    if (!text) {
        alert('⚠️ 请输入任务内容！');
        return;
    }
    const newTodo = { id: Date.now(), text, completed: false };
    const updated = [...state.todos, newTodo];
    setState('todos', updated);
    renderTodos(updated);
    input.value = '';
    input.focus();
};

window.toggleTodo = function(id) {
    const updated = state.todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setState('todos', updated);
    renderTodos(updated);
};

window.deleteTodo = function(id) {
    const updated = state.todos.filter(todo => todo.id !== id);
    setState('todos', updated);
    renderTodos(updated);
};

window.clearTodos = function() {
    if (state.todos.length === 0) return;
    if (confirm('⚠️ 确定要删除所有任务吗？')) {
        setState('todos', []);
        renderTodos([]);
    }
};

// ---- 3.5 GitHub 项目 ----
window.queryUserRepos = async function() {
    const input = document.getElementById('github-username-input');
    const username = input.value.trim();
    if (!username) {
        alert('⚠️ 请先输入一个 GitHub 用户名！');
        return;
    }

    const status = document.getElementById('query-status');
    const container = document.getElementById('repo-container');

    status.innerHTML = `⏳ 正在查询用户 <strong>${username}</strong> 的项目...`;
    status.style.color = '#6c5ce7';
    container.innerHTML = '<p style="color: var(--text-muted); text-align: center;">⏳ 正在加载...</p>';

    const result = await fetchUserRepos(username);

    if (!result.success) {
        if (result.error === 'USER_NOT_FOUND') {
            status.innerHTML = `❌ 找不到用户 <strong>${username}</strong>，请检查拼写！`;
            status.style.color = '#e17055';
            container.innerHTML = `<p style="color: #e17055; text-align: center;">😅 用户 "${username}" 不存在</p>`;
        } else {
            status.innerHTML = `❌ ${result.message}`;
            status.style.color = '#e17055';
            container.innerHTML = `<p style="color: #e17055; text-align: center;">❌ ${result.message}</p>`;
        }
        return;
    }

    state.repos = result.data;
    renderRepos(result.data);
    status.innerHTML = `✅ 成功加载 <strong>${username}</strong> 的 ${result.data.length} 个项目`;
    status.style.color = '#00b894';
};

window.fetchMyRepos = function() {
    const input = document.getElementById('github-username-input');
    input.value = DEFAULT_USERNAME;
    window.queryUserRepos();
};

window.clearAll = function() {
    const input = document.getElementById('github-username-input');
    input.value = '';
    state.repos = [];
    const container = document.getElementById('repo-container');
    container.innerHTML = '<p style="color: var(--text-muted); text-align: center;">💡 输入用户名后点击查询，即可看到该用户的 GitHub 项目</p>';
    const status = document.getElementById('query-status');
    status.innerHTML = '💡 输入 GitHub 用户名，点击查询即可看到该用户的公开项目';
    status.style.color = 'var(--text-secondary)';
};

// ---- 3.6 排序 ----
window.sortByStars = function() {
    const sorted = [...state.repos].sort((a, b) => b.stargazers_count - a.stargazers_count);
    renderRepos(sorted);
};

window.sortByName = function() {
    const sorted = [...state.repos].sort((a, b) => a.name.localeCompare(b.name));
    renderRepos(sorted);
};

window.sortByRecent = function() {
    const sorted = [...state.repos].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    renderRepos(sorted);
};

// ---- 3.7 天气 ----
window.fetchWeather = async function() {
    const input = document.getElementById('weather-input');
    const city = input.value.trim();
    if (!city) {
        alert('⚠️ 请输入城市名！');
        return;
    }

    const container = document.getElementById('weather-container');
    container.innerHTML = '<p style="color: var(--text-secondary);">⏳ 正在查询 <strong>' + city + '</strong> 的天气...</p>';

    const result = await fetchWeather(city);

    if (!result.success) {
        container.innerHTML = `<p style="color: #e17055; text-align: center;">❌ ${result.message}</p>`;
        return;
    }

    const w = result.data;
    container.innerHTML = `
        <div style="background: var(--btn-ghost-bg); padding: 20px; border-radius: 16px; margin-top: 10px;">
            <div style="display: flex; align-items: center; justify-content: center; gap: 20px; flex-wrap: wrap;">
                <div style="font-size: 60px;">${w.weatherIcon}</div>
                <div style="text-align: left;">
                    <div style="font-size: 24px; font-weight: bold; color: var(--text-primary);">
                        ${w.cityName} ${w.country ? '· ' + w.country : ''}
                    </div>
                    <div style="font-size: 48px; font-weight: bold; color: var(--text-primary);">
                        ${w.temp}°C
                    </div>
                    <div style="font-size: 18px; color: var(--text-secondary);">
                        ${w.weatherDesc}
                    </div>
                </div>
            </div>
            <div style="display: flex; gap: 30px; justify-content: center; margin-top: 15px; flex-wrap: wrap; font-size: 14px; color: var(--text-secondary);">
                <span>🌡️ 体感温度：${w.feelsLike}°C</span>
                <span>💧 湿度：${w.humidity}%</span>
                <span>💨 风速：${w.windSpeed} km/h</span>
            </div>
        </div>
    `;

    setState('lastCity', city);
};