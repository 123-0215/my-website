/**
 * 本地存储工具模块
 * 所有 localStorage 操作都通过这里，方便未来更换存储方式
 */

/**
 * 保存数据到 localStorage
 * @param {string} key - 存储的键名
 * @param {*} value - 要存储的数据（会自动转成 JSON）
 */
export function saveData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

/**
 * 从 localStorage 读取数据
 * @param {string} key - 存储的键名
 * @param {*} defaultValue - 如果没有数据，返回这个默认值
 * @returns {*} 解析后的数据
 */
export function loadData(key, defaultValue = null) {
    const data = localStorage.getItem(key);
    if (!data) return defaultValue;
    try {
        return JSON.parse(data);
    } catch {
        return defaultValue;
    }
}

/**
 * 从 localStorage 删除数据
 * @param {string} key - 要删除的键名
 */
export function removeData(key) {
    localStorage.removeItem(key);
}

/**
 * 清空所有 localStorage 数据（慎用！）
 */
export function clearAllData() {
    localStorage.clear();
}