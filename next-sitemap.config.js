module.exports = {
  siteUrl: 'https://parfumetrika.ru',
  generateRobotsTxt: true,
  transform: async (config, path) => {
    let priority = 0.7; // Значение по умолчанию
    let changefreq = 'daily'; // Частота обновления по умолчанию

    if (
      path.includes('/brand') ||
      path.includes('/article') ||
      path.includes('/new') ||
      path.includes('/parfumer') ||
      path.includes('/perfumes')
    ) {
      priority = 0.9; // Устанавливаем повышенный приоритет для этих маршрутов
      changefreq = 'weekly'; // Устанавливаем обновление раз в неделю
    }

    return {
      loc: path, // Динамическая генерация URL
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
    };
  },
};
