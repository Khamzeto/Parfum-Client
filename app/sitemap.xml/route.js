async function fetchPerfumeLinks() {
  const baseUrl = 'https://parfumetrika.ru/perfumes';
  const hltbackUrl = 'https://hltback.parfumetrika.ru/perfumes/names';

  try {
    // Выполняем запрос на получение данных
    const response = await fetch(hltbackUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Ошибка запроса к hltback: ${response.statusText}`);
    }

    // Получаем JSON-данные
    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Неверный формат данных: ожидается массив');
    }

    // Генерируем ссылки
    const links = data.map((id) => `${baseUrl}/${id}`);

    console.log('Ссылки:', links);

    // Возвращаем массив ссылок
    return links;
  } catch (error) {
    console.error('Ошибка:', error);
    alert('Ошибка загрузки данных: ' + error.message);
    return [];
  }
}

// Вызов функции и обработка результатов
fetchPerfumeLinks().then((links) => {
  // Вы можете использовать ссылки, например, отобразить их на странице
  const container = document.getElementById('links-container');
  if (container) {
    container.innerHTML = links.map((link) => `<a href="${link}">${link}</a>`).join('<br>');
  }
});
