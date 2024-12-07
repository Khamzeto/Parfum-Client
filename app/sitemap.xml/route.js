export async function GET() {
  const baseUrl = 'https://parfumetrika.ru/perfumes';
  const hltbackUrl = 'https://hltback.parfumetrika.ru/perfumes/names';

  try {
    // Получаем данные с hltback
    const response = await fetch(hltbackUrl, {
      next: { revalidate: 60 }, // Кэшируем данные на 60 секунд
    });

    if (!response.ok) {
      throw new Error(`Ошибка запроса к hltback: ${response.statusText}`);
    }

    const data = await response.json(); // Типизация не используется

    // Генерируем ссылки
    const links = data.map((id) => `${baseUrl}/${id}`);

    // Возвращаем результат
    return new Response(JSON.stringify(links), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Ошибка генерации ссылок:', error);
    return new Response('Ошибка генерации ссылок', { status: 500 });
  }
}
