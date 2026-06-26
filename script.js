// ============================================
// 1. 永久记忆
// ============================================
window.onload = function() {
    let savedName = localStorage.getItem('userName');
    if (savedName) {
        document.getElementById('greeting').innerHTML = '你好，' + savedName + '！欢迎光临！';
    }
    loadTodos();
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