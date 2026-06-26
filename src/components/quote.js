/**
 * 每日金句组件
 * 负责渲染名言
 */

import { QUOTE_LIBRARY } from '../config.js';

/**
 * 渲染一条随机名言
 * @param {string} textId - 名言文本元素 ID
 * @param {string} authorId - 作者元素 ID
 * @returns {Object} { text, author } 当前显示的名言
 */
export function renderQuote(textId = 'quote-text', authorId = 'quote-author') {
    const textEl = document.getElementById(textId);
    const authorEl = document.getElementById(authorId);

    if (!textEl || !authorEl) {
        console.warn('名言组件：找不到元素');
        return { text: '', author: '' };
    }

    const randomIndex = Math.floor(Math.random() * QUOTE_LIBRARY.length);
    const quote = QUOTE_LIBRARY[randomIndex];

    textEl.textContent = '💬 ' + quote.text;
    authorEl.textContent = '—— ' + quote.author;

    return { text: quote.text, author: quote.author };
}

/**
 * 获取名言库的总数量（用于展示）
 */
export function getQuoteCount() {
    return QUOTE_LIBRARY.length;
}