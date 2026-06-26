// // ===== 常量定义（放在文件最顶部） =====
const DEFAULT_USERNAME = '123-0215';
// ============================================
// 1. 永久记忆
// ============================================
window.onload = function() {
    let savedName = localStorage.getItem('userName');
    if (savedName) {
        document.getElementById('greeting').innerHTML = '你好，' + savedName + '！欢迎光临！';
    }
    loadTodos();
    window.onload = function() {
    // 1. 恢复用户名记忆
    let savedName = localStorage.getItem('userName');
    if (savedName) {
        document.getElementById('greeting').innerHTML = '你好，' + savedName + '！欢迎光临！';
    }
    loadTodos();
    loadTheme();
    loadLastWeather();  // 👈 新增这一行
    window.onload = function() {
    // 1. 恢复用户名记忆
    let savedName = localStorage.getItem('userName');
    if (savedName) {
        document.getElementById('greeting').innerHTML = '你好，' + savedName + '！欢迎光临！';
    }
    loadTodos();
    loadTheme();
    loadLastWeather();
    fetchQuote();  // 👈 新增这一行

    const input = document.getElementById('github-username-input');
    if (input) {
        input.value = DEFAULT_USERNAME;
    }
}
    // ============================================
// 7. 每日金句功能
// ============================================

// 当前显示的名言（用于复制功能）
let currentQuote = {
    text: '',
    author: ''
};

/**
 * 从 API 获取一条随机名言
 * 使用 quotable.io 免费 API，无需 API Key
 */
async function fetchQuote() {
    const textEl = document.getElementById('quote-text');
    const authorEl = document.getElementById('quote-author');

    // 显示加载状态
    textEl.textContent = '⏳ 加载中...';
    authorEl.textContent = '——';

    try {
        // 调用 quotable.io 随机名言 API
        const response = await fetch('https://api.adviceslip.com/advice');

        if (!response.ok) {
            throw new Error(`请求失败 (状态码: ${response.status})`);
        }

        const data = await response.json();

        // 提取数据
        const content = data.content || '名言加载失败';
        const author = data.author || '未知作者';

        // 更新界面
        textEl.textContent = '💬 ' + content;
        authorEl.textContent = '—— ' + author;

        // 保存当前名言（用于复制）
        currentQuote = {
            text: content,
            author: author
        };

    } catch (error) {
        console.error('获取名言失败:', error);
        textEl.textContent = '😅 名言加载失败，请稍后再试';
        authorEl.textContent = '——';
    }
}

/**
 * 复制当前名言到剪贴板
 */
function copyQuote() {
    if (!currentQuote.text) {
        alert('⚠️ 还没有名言可以复制，先点击“换一句”吧！');
        return;
    }

    // 构造要复制的文本
    const copyText = `「${currentQuote.text}」—— ${currentQuote.author}`;

    // 使用现代剪贴板 API
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(copyText)
            .then(() => {
                alert('✅ 名言已复制到剪贴板！');
            })
            .catch(() => {
                // 如果剪贴板 API 失败，回退到传统方法
                fallbackCopy(copyText);
            });
    } else {
        // 浏览器不支持剪贴板 API，使用传统方法
        fallbackCopy(copyText);
    }
}

/**
 * 传统复制方法（兼容旧浏览器）
 */
function fallbackCopy(text) {
    // 创建一个临时 textarea 元素
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();

    try {
        document.execCommand('copy');
        alert('✅ 名言已复制到剪贴板！');
    } catch (err) {
        alert('❌ 复制失败，请手动复制。');
    }

    document.body.removeChild(textarea);
}

// 页面加载时自动获取一条名言（可选）
// 在 window.onload 里添加 fetchQuote();

    const input = document.getElementById('github-username-input');
    if (input) {
        input.value = DEFAULT_USERNAME;
    }
}
    loadTheme();
    const input = document.getElementById('github-username-input');
    if (input) {
        input.value = '123-0215';
    }
}

function customGreeting() {
    let userName = prompt('请输入你的名字：');
    if (userName && userName.trim() !== '') {
        localStorage.setItem('userName', userName);
        document.getElementById('greeting').innerHTML = '你好，' + userName + '！欢迎光临！';
    } else {
        alert('名字不能为空哦，再试一次吧！');
    }
}

function forgetMe() {
    localStorage.removeItem('userName');
    document.getElementById('greeting').innerHTML = '你好，我是 123-0215';
    alert('已清除记忆！下次刷新页面，网站就不认识你了。');
}
/**
 * 切换暗黑/白天模式
 * 切换 body 的 dark-mode 类，更新滑块位置，并将偏好保存到 localStorage
 */
function toggleTheme() {
    // ... 原来的代码 ...
}
// ============================================
// 2. 暗黑/白天模式切换
// ============================================
function toggleTheme() {
    const body = document.body;
    const thumb = document.getElementById('toggle-thumb');

    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');

    if (thumb) {
        thumb.style.transform = isDark ? 'translateX(24px)' : 'translateX(0)';
        thumb.style.background = isDark ? '#f1c40f' : 'white';
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const body = document.body;
    const thumb = document.getElementById('toggle-thumb');

    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        if (thumb) {
            thumb.style.transform = 'translateX(24px)';
            thumb.style.background = '#f1c40f';
        }
    } else {
        body.classList.remove('dark-mode');
        if (thumb) {
            thumb.style.transform = 'translateX(0)';
            thumb.style.background = 'white';
        }
    }
}

// ============================================
// 3. GitHub 项目查询
// ============================================
let allRepos = [];

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
/**
 * 根据输入框中的用户名查询 GitHub 公开项目
 * 调用 GitHub API，处理错误（用户不存在、无项目等），并渲染项目卡片
 */
async function queryUserRepos() {
    // ... 原来的代码 ...
}
async function queryUserRepos() {
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
        allRepos = repos;
        renderRepos(allRepos);
        status.innerHTML = `✅ 成功加载 <strong>${username}</strong> 的 ${repos.length} 个项目`;
        status.style.color = '#00b894';
    } catch (error) {
        console.error('查询失败:', error);
        status.innerHTML = `❌ 查询失败: ${error.message}`;
        status.style.color = '#e17055';
        container.innerHTML = `<p style="color: #e17055; text-align: center;">❌ 网络错误，请稍后再试。</p>`;
    }
}

async function fetchMyRepos() {
    const input = document.getElementById('github-username-input');
    input.value = '123-0215';
    await queryUserRepos();
}

function clearAll() {
    const input = document.getElementById('github-username-input');
    input.value = '';
    allRepos = [];
    const container = document.getElementById('repo-container');
    container.innerHTML = '<p style="color: var(--text-muted); text-align: center;">💡 输入用户名后点击查询，即可看到该用户的 GitHub 项目</p>';
    const status = document.getElementById('query-status');
    status.innerHTML = '💡 输入 GitHub 用户名，点击查询即可看到该用户的公开项目';
    status.style.color = 'var(--text-secondary)';
}

// ============================================
// 4. 排序功能
// ============================================
function sortByStars() {
    const sorted = [...allRepos];
    sorted.sort((a, b) => b.stargazers_count - a.stargazers_count);
    renderRepos(sorted);
}

function sortByName() {
    const sorted = [...allRepos];
    sorted.sort((a, b) => a.name.localeCompare(b.name));
    renderRepos(sorted);
}

function sortByRecent() {
    const sorted = [...allRepos];
    sorted.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    renderRepos(sorted);
}

// ============================================
// 5. 待办事项
// ============================================
let todos = [];

function loadTodos() {
    const saved = localStorage.getItem('todos');
    if (saved) {
        try {
            todos = JSON.parse(saved);
        } catch (e) {
            todos = [];
        }
    } else {
        todos = [
            { id: Date.now() + 1, text: '🌟 点击复选框标记完成', completed: false },
            { id: Date.now() + 2, text: '🗑️ 点击删除按钮移除任务', completed: false },
        ];
    }
    renderTodos();
}

function renderTodos() {
    const container = document.getElementById('todo-list');
    const countSpan = document.getElementById('todo-count');
    if (todos.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 20px 0;">✨ 还没有任务，添加一条吧！</p>';
        countSpan.textContent = '📋 0 个任务';
        return;
    }
    let html = '';
    todos.forEach(todo => {
        const checked = todo.completed ? 'checked' : '';
        const textStyle = todo.completed ? 'text-decoration: line-through; color: var(--text-muted);' : 'color: var(--text-primary);';
        html += `
            <div style="display: flex; align-items: center; gap: 12px; padding: 12px 16px; margin-bottom: 8px; background: ${todo.completed ? 'var(--btn-ghost-bg)' : 'var(--todo-item-bg)'}; border-radius: 12px; border: 1px solid var(--border-color); transition: 0.2s;">
                <input type="checkbox" ${checked} onchange="toggleTodo(${todo.id})" style="width: 20px; height: 20px; cursor: pointer; accent-color: #00b894;">
                <span style="flex: 1; font-size: 15px; ${textStyle}">${todo.text}</span>
                <a href="#" onclick="deleteTodo(${todo.id})" style="color: #e17055; text-decoration: none; font-size: 14px; font-weight: bold; padding: 4px 8px; border-radius: 8px;" onmouseover="this.style.background='#ffeaa7'" onmouseout="this.style.background='transparent'">✕</a>
            </div>
        `;
    });
    container.innerHTML = html;
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    countSpan.textContent = `📋 ${total} 个任务 · ✅ ${completed} 已完成`;
}
/**
 * 添加一条新的待办任务
 * 从输入框读取文字，创建一个新任务对象，保存到列表并更新界面
 */
function addTodo() {
    // ... 原来的代码 ...
}
function addTodo() {
    const input = document.getElementById('todo-input');
    const text = input.value.trim();
    if (!text) {
        alert('⚠️ 请输入任务内容！');
        return;
    }
    todos.push({ id: Date.now(), text: text, completed: false });
    saveTodos();
    renderTodos();
    input.value = '';
    input.focus();
}

function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
    }
}

function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    saveTodos();
    renderTodos();
}

function clearTodos() {
    if (todos.length === 0) return;
    if (confirm('⚠️ 确定要删除所有任务吗？')) {
        todos = [];
        saveTodos();
        renderTodos();
    }
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}
// ============================================
// 6. 天气预报功能
// ============================================

/**
 * 获取并显示指定城市的天气信息
 * 调用 wttr.in 免费天气 API，处理错误并渲染天气卡片
 */
async function fetchWeather() {
    const input = document.getElementById('weather-input');
    const city = input.value.trim();
    
    if (!city) {
        alert('⚠️ 请输入城市名！');
        return;
    }

    const container = document.getElementById('weather-container');
    container.innerHTML = '<p style="color: var(--text-secondary);">⏳ 正在查询 <strong>' + city + '</strong> 的天气...</p>';

    try {
        // 使用 wttr.in 免费天气 API（不需要 API Key）
        // 参数说明：?format=j1 返回 JSON 格式数据，?lang=zh 返回中文
        const response = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1&lang=zh`);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('找不到这个城市，请检查拼写！');
            }
            throw new Error(`请求失败 (状态码: ${response.status})`);
        }

        const data = await response.json();

        // 检查是否有错误响应
        if (data.error) {
            throw new Error(data.error);
        }

        // 提取天气数据
        const current = data.current_condition[0];
        const location = data.nearest_area[0];

        // 提取关键信息
        const cityName = location.areaName[0].value || city;
        const country = location.country[0].value || '';
        const temp = current.temp_C || '--';
        const feelsLike = current.FeelsLikeC || '--';
        const weatherDesc = current.weatherDesc[0].value || '未知天气';
        const humidity = current.humidity || '--';
        const windSpeed = current.windspeedKmph || '--';
        const weatherCode = current.weatherCode || '113';

        // 根据天气代码映射图标
        const weatherIcon = getWeatherIcon(weatherCode);

        // 渲染天气卡片
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

        // 保存到 localStorage，下次自动显示
        localStorage.setItem('lastCity', city);

    } catch (error) {
        console.error('天气查询失败:', error);
        container.innerHTML = `<p style="color: #e17055; text-align: center;">❌ ${error.message}</p>`;
    }
}

/**
 * 根据天气代码返回对应的 Emoji 图标
 * @param {string|number} code - wttr.in 天气代码
 * @returns {string} Emoji 图标
 */
function getWeatherIcon(code) {
    const codeMap = {
        '113': '☀️',  // 晴朗
        '116': '⛅',  // 局部多云
        '119': '☁️',  // 多云
        '122': '☁️',  // 阴天
        '143': '🌫️', // 雾
        '176': '🌧️', // 小雨
        '179': '🌨️', // 小雪
        '182': '🌧️', // 冻雨
        '185': '🌧️', // 冻雨
        '200': '⛈️', // 雷暴
        '227': '🌨️', // 暴雪
        '230': '🌨️', // 暴雪
        '248': '🌫️', // 雾
        '260': '🌫️', // 雾
        '263': '🌧️', // 小雨
        '266': '🌧️', // 小雨
        '281': '🌧️', // 冻雨
        '284': '🌧️', // 冻雨
        '293': '🌧️', // 小雨
        '296': '🌧️', // 小雨
        '299': '🌧️', // 中雨
        '302': '🌧️', // 中雨
        '305': '🌧️', // 大雨
        '308': '🌧️', // 大雨
        '311': '🌧️', // 冻雨
        '314': '🌧️', // 冻雨
        '317': '🌧️', // 冻雨
        '320': '🌨️', // 小雪
        '323': '🌨️', // 小雪
        '326': '🌨️', // 小雪
        '329': '🌨️', // 中雪
        '332': '🌨️', // 中雪
        '335': '🌨️', // 大雪
        '338': '🌨️', // 大雪
        '350': '🌧️', // 冻雨
        '353': '🌧️', // 小雨
        '356': '🌧️', // 中雨
        '359': '🌧️', // 大雨
        '362': '🌧️', // 冻雨
        '365': '🌧️', // 冻雨
        '368': '🌨️', // 小雪
        '371': '🌨️', // 中雪
        '374': '🌧️', // 冻雨
        '377': '🌧️', // 冻雨
        '386': '⛈️', // 雷暴
        '389': '⛈️', // 雷暴
        '392': '⛈️', // 雷暴
        '395': '🌨️', // 大雪
    };
    return codeMap[String(code)] || '🌡️';
}

/**
 * 页面加载时，恢复上次查询的城市天气
 */
function loadLastWeather() {
    const lastCity = localStorage.getItem('lastCity');
    if (lastCity) {
        const input = document.getElementById('weather-input');
        if (input) {
            input.value = lastCity;
        }
        // 自动查询天气（可选，如果不想自动加载可以注释掉）
        // fetchWeather();
    }
    // ============================================
// 7. 每日金句功能
// ============================================

// 当前显示的名言（用于复制功能）
let currentQuote = {
    text: '',
    author: ''
};

/**
 * 从 API 获取一条随机名言
 * 使用 quotable.io 免费 API，无需 API Key
 */
async function fetchQuote() {
    const textEl = document.getElementById('quote-text');
    const authorEl = document.getElementById('quote-author');

    // 显示加载状态
    textEl.textContent = '⏳ 加载中...';
    authorEl.textContent = '——';

    try {
        // 调用 quotable.io 随机名言 API
        const response = await fetch('https://api.quotable.io/random');

        if (!response.ok) {
            throw new Error(`请求失败 (状态码: ${response.status})`);
        }

        const data = await response.json();

        // 提取数据
        const content = data.content || '名言加载失败';
        const author = data.author || '未知作者';

        // 更新界面
        textEl.textContent = '💬 ' + content;
        authorEl.textContent = '—— ' + author;

        // 保存当前名言（用于复制）
        currentQuote = {
            text: content,
            author: author
        };

    } catch (error) {
        console.error('获取名言失败:', error);
        // 如果 API 失败，使用本地备用名言
        const fallbackQuotes = [
            { text: '生活就像一盒巧克力，你永远不知道下一颗是什么味道', author: '《阿甘正传》' },
            { text: '不要问你的国家能为你做什么，而要问你能为你的国家做什么', author: '肯尼迪' },
            { text: '成功不是终点，失败也不是终结，唯有勇气才是永恒', author: '丘吉尔' },
            { text: '世界上只有一种真正的英雄主义，那就是认清生活的真相后依然热爱生活', author: '罗曼·罗兰' },
        ];
        const random = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
        textEl.textContent = '💬 ' + random.text;
        authorEl.textContent = '—— ' + random.author;
        currentQuote = { text: random.text, author: random.author };
    }
}

/**
 * 复制当前名言到剪贴板
 */
function copyQuote() {
    if (!currentQuote.text) {
        alert('⚠️ 还没有名言可以复制，先点击“换一句”吧！');
        return;
    }

    const copyText = `「${currentQuote.text}」—— ${currentQuote.author}`;

    // 使用现代剪贴板 API
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(copyText)
            .then(() => {
                alert('✅ 名言已复制到剪贴板！');
            })
            .catch(() => {
                fallbackCopy(copyText);
            });
    } else {
        fallbackCopy(copyText);
    }
}

/**
 * 传统复制方法（兼容旧浏览器）
 */
function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();

    try {
        document.execCommand('copy');
        alert('✅ 名言已复制到剪贴板！');
    } catch (err) {
        alert('❌ 复制失败，请手动复制。');
    }

    document.body.removeChild(textarea);
}
}