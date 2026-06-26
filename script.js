// ===== 常量定义 =====
const DEFAULT_USERNAME = '123-0215';

// ============================================
// 1. 页面加载初始化（合并所有 window.onload）
// ============================================
window.onload = function() {
    // 1. 恢复用户名记忆
    let savedName = localStorage.getItem('userName');
    if (savedName) {
        document.getElementById('greeting').innerHTML = '你好，' + savedName + '！欢迎光临！';
    }

    // 2. 加载待办事项
    loadTodos();

    // 3. 加载暗黑模式主题
    loadTheme();

    // 4. 加载上次查询的城市天气
    loadLastWeather();

    // 5. 自动加载名言
    fetchQuote();

    // 6. 自动填入 GitHub 用户名
    const input = document.getElementById('github-username-input');
    if (input) {
        input.value = DEFAULT_USERNAME;
    }
}

// ============================================
// 2. 永久记忆功能
// ============================================
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

// ============================================
// 3. 暗黑/白天模式切换
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
// 4. GitHub 项目查询
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
    input.value = DEFAULT_USERNAME;
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
// 5. 排序功能
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
// 6. 待办事项
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
// 7. 天气预报功能
// ============================================
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
        const response = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1&lang=zh`);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('找不到这个城市，请检查拼写！');
            }
            throw new Error(`请求失败 (状态码: ${response.status})`);
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

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

        const weatherIcon = getWeatherIcon(weatherCode);

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

        localStorage.setItem('lastCity', city);

    } catch (error) {
        console.error('天气查询失败:', error);
        container.innerHTML = `<p style="color: #e17055; text-align: center;">❌ ${error.message}</p>`;
    }
}

function getWeatherIcon(code) {
    const codeMap = {
        '113': '☀️', '116': '⛅', '119': '☁️', '122': '☁️', '143': '🌫️',
        '176': '🌧️', '179': '🌨️', '182': '🌧️', '185': '🌧️', '200': '⛈️',
        '227': '🌨️', '230': '🌨️', '248': '🌫️', '260': '🌫️',
        '263': '🌧️', '266': '🌧️', '281': '🌧️', '284': '🌧️',
        '293': '🌧️', '296': '🌧️', '299': '🌧️', '302': '🌧️',
        '305': '🌧️', '308': '🌧️', '311': '🌧️', '314': '🌧️',
        '317': '🌧️', '320': '🌨️', '323': '🌨️', '326': '🌨️',
        '329': '🌨️', '332': '🌨️', '335': '🌨️', '338': '🌨️',
        '350': '🌧️', '353': '🌧️', '356': '🌧️', '359': '🌧️',
        '362': '🌧️', '365': '🌧️', '368': '🌨️', '371': '🌨️',
        '374': '🌧️', '377': '🌧️', '386': '⛈️', '389': '⛈️',
        '392': '⛈️', '395': '🌨️'
    };
    return codeMap[String(code)] || '🌡️';
}

function loadLastWeather() {
    const lastCity = localStorage.getItem('lastCity');
    if (lastCity) {
        const input = document.getElementById('weather-input');
        if (input) {
            input.value = lastCity;
        }
        // 如果你想自动查询天气，取消下面这行的注释
        // fetchWeather();
    }
}

// ============================================
// 8. 每日金句功能（使用 adviceslip.com）
// ============================================
// ============================================
// 8. 每日金句功能（完全本地，无需网络）
// ============================================
let currentQuote = {
    text: '',
    author: ''
};

// 本地名言库（你可以随意增删）
const quoteLibrary = [
    { text: '生活就像一盒巧克力，你永远不知道下一颗是什么味道', author: '《阿甘正传》' },
    { text: '不要问你的国家能为你做什么，而要问你能为你的国家做什么', author: '肯尼迪' },
    { text: '成功不是终点，失败也不是终结，唯有勇气才是永恒', author: '丘吉尔' },
    { text: '世界上只有一种真正的英雄主义，那就是认清生活的真相后依然热爱生活', author: '罗曼·罗兰' },
    { text: '路漫漫其修远兮，吾将上下而求索', author: '屈原' },
    { text: '学而不思则罔，思而不学则殆', author: '孔子' },
    { text: 'Stay hungry, stay foolish.', author: 'Steve Jobs' },
    { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
    { text: '人生就像骑自行车，要保持平衡就得往前走', author: '爱因斯坦' },
    { text: '不要为成功而努力，要为做一个有价值的人而努力', author: '爱因斯坦' },
];

function fetchQuote() {
    const textEl = document.getElementById('quote-text');
    const authorEl = document.getElementById('quote-author');

    // 从本地库中随机选一条
    const randomIndex = Math.floor(Math.random() * quoteLibrary.length);
    const quote = quoteLibrary[randomIndex];

    textEl.textContent = '💬 ' + quote.text;
    authorEl.textContent = '—— ' + quote.author;

    // 保存当前名言供复制使用
    currentQuote = {
        text: quote.text,
        author: quote.author
    };
}