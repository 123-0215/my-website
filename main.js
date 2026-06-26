/**
 * 应用入口文件（main.js）
 * 负责：初始化应用、组装各模块、暴露全局函数给 HTML 使用
 */

// ===== 导入配置和工具 =====
import { DEFAULT_USERNAME, STORAGE_KEYS, QUOTE_LIBRARY, WEATHER_ICONS } from './src/config.js';
import { loadData, saveData } from './src/utils/storage.js';
import { state, setState, setStateBatch, getTodoStats } from './src/state/store.js';

// ============================================
// 1. 页面加载初始化
// ============================================
window.onload = function() {
    // 1.1 恢复用户名
    if (state.userName) {
        document.getElementById('greeting').textContent = '你好，' + state.userName + '！欢迎光临！';
    }

    // 1.2 恢复主题
    if (state.theme === 'dark') {
        document.body.classList.add('dark-mode');
        updateToggleThumb(true);
    }

    // 1.3 加载待办事项
    renderTodos();

    // 1.4 加载名言
    fetchQuote();

    // 1.5 恢复上次查询的城市
    const weatherInput = document.getElementById('weather-input');
    if (state.lastCity && weatherInput) {
        weatherInput.value = state.lastCity;
    }

    // 1.6 填入默认 GitHub 用户名
    const githubInput = document.getElementById('github-username-input');
    if (githubInput) {
        githubInput.value = DEFAULT_USERNAME;
    }
};

// ============================================
// 2. 暴露给 HTML 的全局函数（onclick 使用）
// ============================================

// 2.1 自定义称呼
window.customGreeting = function() {
    const userName = prompt('请输入你的名字：');
    if (userName && userName.trim() !== '') {
        setState('userName', userName.trim());
        document.getElementById('greeting').textContent = '你好，' + userName.trim() + '！欢迎光临！';
    } else {
        alert('名字不能为空哦，再试一次吧！');
    }
};

// 2.2 清除记忆
window.forgetMe = function() {
    setState('userName', '');
    document.getElementById('greeting').textContent = '你好，我是 123-0215';
    alert('已清除记忆！下次刷新页面，网站就不认识你了。');
};

// 2.3 切换主题
window.toggleTheme = function() {
    const isDark = document.body.classList.toggle('dark-mode');
    setState('theme', isDark ? 'dark' : 'light');
    updateToggleThumb(isDark);
};

function updateToggleThumb(isDark) {
    const thumb = document.getElementById('toggle-thumb');
    if (thumb) {
        thumb.style.transform = isDark ? 'translateX(24px)' : 'translateX(0)';
        thumb.style.background = isDark ? '#f1c40f' : 'white';
    }
}

// 2.4 获取名言
window.fetchQuote = function() {
    const textEl = document.getElementById('quote-text');
    const authorEl = document.getElementById('quote-author');
    
    const randomIndex = Math.floor(Math.random() * QUOTE_LIBRARY.length);
    const quote = QUOTE_LIBRARY[randomIndex];
    
    textEl.textContent = '💬 ' + quote.text;
    authorEl.textContent = '—— ' + quote.author;
    
    state.currentQuote = { text: quote.text, author: quote.author };
};

// 2.5 复制名言
window.copyQuote = function() {
    const { text, author } = state.currentQuote;
    if (!text) {
        alert('⚠️ 还没有名言可以复制，先点击“换一句”吧！');
        return;
    }
    const copyText = `「${text}」—— ${author}`;
    copyToClipboard(copyText);
};

function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
            .then(() => alert('✅ 名言已复制到剪贴板！'))
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
        alert('✅ 名言已复制到剪贴板！');
    } catch {
        alert('❌ 复制失败，请手动复制。');
    }
    document.body.removeChild(textarea);
}

// ============================================
// 3. 待办事项相关（数据操作 + 渲染）
// ============================================

window.addTodo = function() {
    const input = document.getElementById('todo-input');
    const text = input.value.trim();
    if (!text) {
        alert('⚠️ 请输入任务内容！');
        return;
    }
    
    const newTodo = { id: Date.now(), text, completed: false };
    const updatedTodos = [...state.todos, newTodo];
    setState('todos', updatedTodos);
    renderTodos();
    input.value = '';
    input.focus();
};

window.toggleTodo = function(id) {
    const updatedTodos = state.todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });
    setState('todos', updatedTodos);
    renderTodos();
};

window.deleteTodo = function(id) {
    const updatedTodos = state.todos.filter(todo => todo.id !== id);
    setState('todos', updatedTodos);
    renderTodos();
};

window.clearTodos = function() {
    if (state.todos.length === 0) return;
    if (confirm('⚠️ 确定要删除所有任务吗？')) {
        setState('todos', []);
        renderTodos();
    }
};

function renderTodos() {
    const container = document.getElementById('todo-list');
    const countSpan = document.getElementById('todo-count');
    
    if (state.todos.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 20px 0;">✨ 还没有任务，添加一条吧！</p>';
        countSpan.textContent = '📋 0 个任务';
        return;
    }
    
    let html = '';
    state.todos.forEach(todo => {
        const checked = todo.completed ? 'checked' : '';
        const textStyle = todo.completed 
            ? 'text-decoration: line-through; color: var(--text-muted);' 
            : 'color: var(--text-primary);';
        html += `
            <div style="display: flex; align-items: center; gap: 12px; padding: 12px 16px; margin-bottom: 8px; background: ${todo.completed ? 'var(--btn-ghost-bg)' : 'var(--todo-item-bg)'}; border-radius: 12px; border: 1px solid var(--border-color); transition: 0.2s;">
                <input type="checkbox" ${checked} onchange="toggleTodo(${todo.id})" style="width: 20px; height: 20px; cursor: pointer; accent-color: #00b894;">
                <span style="flex: 1; font-size: 15px; ${textStyle}">${todo.text}</span>
                <a href="#" onclick="deleteTodo(${todo.id})" style="color: #e17055; text-decoration: none; font-size: 14px; font-weight: bold; padding: 4px 8px; border-radius: 8px;" onmouseover="this.style.background='#ffeaa7'" onmouseout="this.style.background='transparent'">✕</a>
            </div>
        `;
    });
    container.innerHTML = html;
    
    const stats = getTodoStats();
    countSpan.textContent = `📋 ${stats.total} 个任务 · ✅ ${stats.completed} 已完成`;
}

// ============================================
// 4. GitHub 项目查询
// ============================================

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

    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=12`);
        if (response.status === 404) {
            status.innerHTML = `❌ 找不到用户 <strong>${username}</strong>，请检查拼写！`;
            status.style.color = '#e17055';
            container.innerHTML = `<p style="color: #e17055; text-align: center;">😅 用户 "${username}" 不存在，请重新输入。</p>`;
            return;
        }
        if (!response.ok) {
            throw new Error(`GitHub 返回错误码: ${response.status}`);
        }
        const repos = await response.json();
        if (repos.length === 0) {
            status.innerHTML = `📭 用户 <strong>${username}</strong> 没有公开项目。`;
            status.style.color = '#fdcb6e';
            container.innerHTML = `<p style="color: var(--text-muted); text-align: center;">😅 用户 "${username}" 还没有公开项目。</p>`;
            return;
        }
        state.repos = repos;
        renderRepos(repos);
        status.innerHTML = `✅ 成功加载 <strong>${username}</strong> 的 ${repos.length} 个项目`;
        status.style.color = '#00b894';
    } catch (error) {
        console.error('查询失败:', error);
        status.innerHTML = `❌ 查询失败: ${error.message}`;
        status.style.color = '#e17055';
        container.innerHTML = `<p style="color: #e17055; text-align: center;">❌ 网络错误，请稍后再试。</p>`;
    }
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

function renderRepos(repos) {
    const container = document.getElementById('repo-container');
    if (!repos || repos.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); text-align: center;">😅 这个用户还没有公开项目。</p>';
        return;
    }
    let html = '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">';
    repos.forEach(repo => {
        html += `
            <div style="background: var(--btn-ghost-bg); padding: 15px; border-radius: 12px; border-left: 4px solid #6c5ce7;">
                <a href="${repo.html_url}" target="_blank" style="font-weight: bold; color: var(--text-primary); text-decoration: none; font-size: 16px;">
                    📁 ${repo.name}
                </a>
                <p style="font-size: 14px; color: var(--text-secondary); margin: 8px 0 0 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    ${repo.description || '这个项目还没有描述'}
                </p>
                <div style="margin-top: 10px; font-size: 12px; color: var(--text-muted);">
                    ⭐ ${repo.stargazers_count} · 🍴 ${repo.forks_count}
                </div>
                <div style="font-size: 12px; color: #6c5ce7; margin-top: 4px;">💻 ${repo.language || '未知'}</div>
            </div>
        `;
    });
    html += '</div>';
    container.innerHTML = html;
}

// ============================================
// 5. 排序功能
// ============================================

window.sortByStars = function() {
    const sorted = [...state.repos];
    sorted.sort((a, b) => b.stargazers_count - a.stargazers_count);
    renderRepos(sorted);
};

window.sortByName = function() {
    const sorted = [...state.repos];
    sorted.sort((a, b) => a.name.localeCompare(b.name));
    renderRepos(sorted);
};

window.sortByRecent = function() {
    const sorted = [...state.repos];
    sorted.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    renderRepos(sorted);
};

// ============================================
// 6. 天气预报功能
// ============================================

window.fetchWeather = async function() {
    const input = document.getElementById('weather-input');
    const city = input.value.trim();
    if (!city) {
        alert('⚠️ 请输入城市名！');
        return;
    }

    const container = document.getElementById('weather-container');
    container.innerHTML = '<p style="color: var(--text-secondary);">⏳ 正在查询 <strong>' + city + '</strong> 的天气...</p>';

    try {
        const response = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1&lang=zh`);
        if (!response.ok) {
            if (response.status === 404) throw new Error('找不到这个城市，请检查拼写！');
            throw new Error(`请求失败 (状态码: ${response.status})`);
        }
        const data = await response.json();
        if (data.error) throw new Error(data.error);

        const current = data.current_condition[0];
        const location = data.nearest_area[0];
        const cityName = location.areaName[0].value || city;
        const country = location.country[0].value || '';
        const temp = current.temp_C || '--';
        const feelsLike = current.FeelsLikeC || '--';
        const weatherDesc = current.weatherDesc[0].value || '未知天气';
        const humidity = current.humidity || '--';
        const windSpeed = current.windspeedKmph || '--';
        const weatherCode = current.weatherCode || '113';
        const weatherIcon = WEATHER_ICONS[String(weatherCode)] || '🌡️';

        container.innerHTML = `
            <div style="background: var(--btn-ghost-bg); padding: 20px; border-radius: 16px; margin-top: 10px;">
                <div style="display: flex; align-items: center; justify-content: center; gap: 20px; flex-wrap: wrap;">
                    <div style="font-size: 60px;">${weatherIcon}</div>
                    <div style="text-align: left;">
                        <div style="font-size: 24px; font-weight: bold; color: var(--text-primary);">
                            ${cityName} ${country ? '· ' + country : ''}
                        </div>
                        <div style="font-size: 48px; font-weight: bold; color: var(--text-primary);">
                            ${temp}°C
                        </div>
                        <div style="font-size: 18px; color: var(--text-secondary);">
                            ${weatherDesc}
                        </div>
                    </div>
                </div>
                <div style="display: flex; gap: 30px; justify-content: center; margin-top: 15px; flex-wrap: wrap; font-size: 14px; color: var(--text-secondary);">
                    <span>🌡️ 体感温度：${feelsLike}°C</span>
                    <span>💧 湿度：${humidity}%</span>
                    <span>💨 风速：${windSpeed} km/h</span>
                </div>
            </div>
        `;

        setState('lastCity', city);

    } catch (error) {
        console.error('天气查询失败:', error);
        container.innerHTML = `<p style="color: #e17055; text-align: center;">❌ ${error.message}</p>`;
    }
};