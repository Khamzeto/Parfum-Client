import $api from '@/components/api/axiosInstance';

export async function generateMetadata({ params }: { params: { brandName: string } }) {
  const brandSlug = params.brandName;

  try {
    const response = await $api.get(`/brands/perfumes`, {
      params: { slug: brandSlug, page: 1, limit: 1 }, // Минимальный запрос для получения данных бренда
    });

    const brandName = response.data.brandName || 'Бренд';

    // Формируем заголовок и описание
    const title = `${brandName} – Рейтинг ароматов бренда с отзывами в одном месте – Parfumetrika`;
    const description = `Духи от бренда ${brandName}: подробные обзоры, реальные отзывы и рекомендации по выбору ароматов. Следите за новинками и актуальными новостями бренда.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `https://parfumetrika.ru/brands/${brandSlug}`,
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
      title: 'Ошибка загрузки данных о бренде',
      description: 'Не удалось загрузить информацию о бренде.',
    };
  }
}
