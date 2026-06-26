/**
 * 待办事项组件
 * 负责渲染待办列表和统计信息
 */

/**
 * 渲染待办列表
 * @param {Array} todos - 待办任务数组
 * @param {string} containerId - 容器元素 ID
 * @param {string} countId - 统计元素 ID
 */
export function renderTodos(todos, containerId = 'todo-list', countId = 'todo-count') {
    const container = document.getElementById(containerId);
    const countSpan = document.getElementById(countId);

    if (!container || !countSpan) {
        console.warn('待办组件：找不到容器元素');
        return;
    }

    // 空状态
    if (!todos || todos.length === 0) {
        container.innerHTML = `
            <p style="color: var(--text-muted); text-align: center; padding: 20px 0;">
                ✨ 还没有任务，添加一条吧！
            </p>
        `;
        countSpan.textContent = '📋 0 个任务';
        return;
    }

    // 生成列表 HTML
    let html = '';
    todos.forEach(todo => {
        const checked = todo.completed ? 'checked' : '';
        const textStyle = todo.completed
            ? 'text-decoration: line-through; color: var(--text-muted);'
            : 'color: var(--text-primary);';
        const bgColor = todo.completed ? 'var(--btn-ghost-bg)' : 'var(--todo-item-bg)';

        html += `
            <div style="display: flex; align-items: center; gap: 12px; padding: 12px 16px; margin-bottom: 8px; background: ${bgColor}; border-radius: 12px; border: 1px solid var(--border-color); transition: 0.2s;">
                <input 
                    type="checkbox" 
                    ${checked} 
                    onchange="toggleTodo(${todo.id})" 
                    style="width: 20px; height: 20px; cursor: pointer; accent-color: #00b894;"
                >
                <span style="flex: 1; font-size: 15px; ${textStyle}">${todo.text}</span>
                <a 
                    href="#" 
                    onclick="deleteTodo(${todo.id})" 
                    style="color: #e17055; text-decoration: none; font-size: 14px; font-weight: bold; padding: 4px 8px; border-radius: 8px;" 
                    onmouseover="this.style.background='#ffeaa7'" 
                    onmouseout="this.style.background='transparent'"
                >✕</a>
            </div>
        `;
    });

    container.innerHTML = html;

    // 更新统计
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    countSpan.textContent = `📋 ${total} 个任务 · ✅ ${completed} 已完成`;
}