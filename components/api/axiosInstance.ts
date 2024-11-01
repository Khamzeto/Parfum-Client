import axios from 'axios';

export const API_URL = 'https://hltback.parfumetrika.ru';

const $api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  mode: 'no-cors', // Это не решает проблему с CORS, но иногда помогает с конфигурацией
  withCredentials: true, // Отправка куков или аутентификационной информации
});

export default $api;
