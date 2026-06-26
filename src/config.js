/**
 * 全局配置文件
 * 所有常量、API 地址集中在这里管理
 */

// ===== 用户相关 =====
export const DEFAULT_USERNAME = '123-0215';

// ===== API 地址 =====
export const GITHUB_API_BASE = 'https://api.github.com';
export const WEATHER_API_BASE = 'https://wttr.in';

// ===== 本地存储键名（统一管理，防止拼写错误） =====
export const STORAGE_KEYS = {
    USER_NAME: 'userName',
    THEME: 'theme',
    TODOS: 'todos',
    LAST_CITY: 'lastCity'
};

// ===== 默认值 =====
export const DEFAULT_THEME = 'light';
export const DEFAULT_TODOS = [
    { id: Date.now() + 1, text: '🌟 点击复选框标记完成', completed: false },
    { id: Date.now() + 2, text: '🗑️ 点击删除按钮移除任务', completed: false }
];

// ===== 天气图标映射表（纯数据，不包含业务逻辑） =====
export const WEATHER_ICONS = {
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

// ===== 名言库（纯数据） =====
export const QUOTE_LIBRARY = [
    { text: '生活就像一盒巧克力，你永远不知道下一颗是什么味道', author: '《阿甘正传》' },
    { text: '不要问你的国家能为你做什么，而要问你能为你的国家做什么', author: '肯尼迪' },
    { text: '成功不是终点，失败也不是终结，唯有勇气才是永恒', author: '丘吉尔' },
    { text: '世界上只有一种真正的英雄主义，那就是认清生活的真相后依然热爱生活', author: '罗曼·罗兰' },
    { text: '路漫漫其修远兮，吾将上下而求索', author: '屈原' },
    { text: '学而不思则罔，思而不学则殆', author: '孔子' },
    { text: 'Stay hungry, stay foolish.', author: 'Steve Jobs' },
    { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
    { text: '人生就像骑自行车，要保持平衡就得往前走', author: '爱因斯坦' },
    { text: '不要为成功而努力，要为做一个有价值的人而努力', author: '爱因斯坦' }
];