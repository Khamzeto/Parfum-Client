import $api from '@/components/api/axiosInstance';

export async function generateMetadata({ params }: { params: { parfumeName: string } }) {
  const parfumerSlug = params.parfumeName;

  try {
    const response = await $api.get(`/parfumers/perfumes`, {
      params: {
        slug: parfumerSlug,
        page: 1, // Минимальный запрос для получения данных парфюмера
        limit: 1, // Только для метаданных
      },
    });

    const parfumerName = response.data.parfumer || 'Неизвестный парфюмер';
    const parfumerRu = response.data.parfumer_ru || parfumerName;

    // Формируем метаданные
    const title = `${parfumerRu} - Полный список созданных ароматов с функцией поиска - Parfumetrika`;
    const description = `Узнайте все о парфюмере ${parfumerName}: его биография, и ключевые достижения. Изучите характеристики каждого парфюма, отзывы пользователей и информацию о брендах, с которыми он сотрудничал. Получите практическое руководство по выбору его ароматов, чтобы найти идеальный вариант.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `https://parfumetrika.ru/parfumers/${parfumerSlug}`,
        type: 'website',
        site_name: 'Parfumetrika',
        locale: 'ru_RU',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
    };
  } catch (error) {
    console.error('Ошибка при загрузке метаданных:', error);

    return {
      title: 'Ошибка загрузки данных о парфюмере',
      description: 'Не удалось загрузить информацию о парфюмере.',
    };
  }
}
