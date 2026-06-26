/**
 * 应用状态管理（总电表箱）
 * 所有数据集中在这里，所有组件从这里读取数据
 */

import { loadData, saveData } from '../utils/storage.js';
import { STORAGE_KEYS, DEFAULT_THEME, DEFAULT_TODOS, DEFAULT_USERNAME } from '../config.js';

// ============================================
// 1. 状态定义
// ============================================

/**
 * 应用状态对象
 * 所有数据都放在这里，修改数据必须通过 setState 函数
 */
export const state = {
    // 用户相关
    userName: loadData(STORAGE_KEYS.USER_NAME, ''),
    
    // 主题
    theme: loadData(STORAGE_KEYS.THEME, DEFAULT_THEME),
    
    // 待办事项
    todos: loadData(STORAGE_KEYS.TODOS, DEFAULT_TODOS),
    
    // GitHub 项目
    repos: [],
    
    // 天气
    lastCity: loadData(STORAGE_KEYS.LAST_CITY, ''),
    weatherData: null,
    
    // 当前名言
    currentQuote: { text: '', author: '' }
};

// ============================================
// 2. 状态更新函数（唯一修改入口）
// ============================================

/**
 * 更新状态，并自动保存到 localStorage
 * @param {string} key - 要更新的字段名
 * @param {*} value - 新值
 * @param {Function} onUpdate - 可选回调，用于触发组件重新渲染
 */
export function setState(key, value, onUpdate = null) {
    state[key] = value;
    
    // 自动保存到 localStorage（只保存需要持久化的字段）
    const persistentKeys = ['userName', 'theme', 'todos', 'lastCity'];
    if (persistentKeys.includes(key)) {
        saveData(STORAGE_KEYS[key.toUpperCase()] || key, value);
    }
    
    // 如果有回调，执行它（用于触发 UI 更新）
    if (onUpdate && typeof onUpdate === 'function') {
        onUpdate(value);
    }
}

/**
 * 批量更新状态
 * @param {Object} updates - 键值对对象
 */
export function setStateBatch(updates) {
    Object.keys(updates).forEach(key => {
        state[key] = updates[key];
        // 自动保存
        const persistentKeys = ['userName', 'theme', 'todos', 'lastCity'];
        if (persistentKeys.includes(key)) {
            saveData(STORAGE_KEYS[key.toUpperCase()] || key, updates[key]);
        }
    });
}

/**
 * 重置状态到初始值（可用于清除所有数据）
 */
export function resetState() {
    const confirmReset = confirm('⚠️ 确定要清除所有数据吗？此操作不可恢复！');
    if (!confirmReset) return;
    
    // 清空 localStorage
    Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
    });
    
    // 重置 state
    state.userName = '';
    state.theme = DEFAULT_THEME;
    state.todos = DEFAULT_TODOS;
    state.repos = [];
    state.lastCity = '';
    state.weatherData = null;
    state.currentQuote = { text: '', author: '' };
    
    // 刷新页面
    window.location.reload();
}

// ============================================
// 3. 辅助函数：获取状态快照
// ============================================

/**
 * 获取当前状态的副本（防止外部直接修改）
 */
export function getState() {
    return { ...state };
}

/**
 * 获取 todo 统计信息
 */
export function getTodoStats() {
    const total = state.todos.length;
    const completed = state.todos.filter(t => t.completed).length;
    return { total, completed, pending: total - completed };
}