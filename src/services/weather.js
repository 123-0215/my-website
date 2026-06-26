/**
 * 天气 API 服务层
 * 负责所有天气相关的网络请求
 */

import { WEATHER_API_BASE, WEATHER_ICONS } from '../config.js';

/**
 * 获取指定城市的天气信息
 * @param {string} city - 城市名（支持中文、英文）
 * @returns {Promise<Object>} { success, data, error }
 */
export async function fetchWeather(city) {
    try {
        const url = `${WEATHER_API_BASE}/${encodeURIComponent(city)}?format=j1&lang=zh`;
        const response = await fetch(url);

        if (!response.ok) {
            if (response.status === 404) {
                return {
                    success: false,
                    error: 'CITY_NOT_FOUND',
                    message: '找不到这个城市，请检查拼写！'
                };
            }
            return {
                success: false,
                error: 'HTTP_ERROR',
                message: `请求失败 (状态码: ${response.status})`
            };
        }

        const rawData = await response.json();

        // wttr.in 返回的错误格式
        if (rawData.error) {
            return {
                success: false,
                error: 'API_ERROR',
                message: rawData.error
            };
        }

        // 提取关键数据
        const current = rawData.current_condition[0];
        const location = rawData.nearest_area[0];

        const weatherData = {
            cityName: location?.areaName?.[0]?.value || city,
            country: location?.country?.[0]?.value || '',
            temp: current?.temp_C || '--',
            feelsLike: current?.FeelsLikeC || '--',
            weatherDesc: current?.weatherDesc?.[0]?.value || '未知天气',
            humidity: current?.humidity || '--',
            windSpeed: current?.windspeedKmph || '--',
            weatherCode: current?.weatherCode || '113',
            weatherIcon: WEATHER_ICONS[String(current?.weatherCode || '113')] || '🌡️'
        };

        return {
            success: true,
            data: weatherData
        };
    } catch (error) {
        return {
            success: false,
            error: 'NETWORK_ERROR',
            message: error.message || '网络连接失败'
        };
    }
}