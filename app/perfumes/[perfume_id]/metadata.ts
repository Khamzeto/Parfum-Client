import axios from 'axios';

export async function generateMetadata({ params }) {
  const { perfume_id } = params;

  try {
    const response = await axios.get(`https://hltback.parfumetrika.ru/perfumes/${perfume_id}`);
    const perfume = response.data;

    // Формируем Open Graph теги и метаданные
    const title = `${perfume.name || 'Название парфюма'} от ${perfume.brand || 'Бренд'} - отзывы, ноты и характеристики парфюм`;
    const description = `${perfume.name || 'Название парфюма'} - аромат для ${
      perfume.gender === 'male'
        ? 'Мужчин'
        : perfume.gender === 'female'
          ? 'Женщин'
          : 'Мужчин и Женщин'
    } от ${perfume.brand || 'Бренд'}, выпущенный в ${
      perfume.release_year || 'неизвестном году'
    }. Оценка ${perfume.rating_value || '0'} из 10.`;

    const mainImage = `https://parfumetrika.ru${perfume.main_image}`;
    const additionalImages = (perfume.additional_images || []).map(
      (img) => `https://parfumetrika.ru/${img}`
    );
    const topNotes = perfume.notes?.top_notes?.join(', ') || 'неизвестны';
    const heartNotes = perfume.notes?.heart_notes?.join(', ') || 'неизвестны';
    const baseNotes = perfume.notes?.base_notes?.join(', ') || 'неизвестны';

    return {
      title,
      description,
      image: mainImage,
      openGraph: {
        title,
        description,
        url: `https://parfumetrika.ru/perfumes/${perfume_id}`,
        type: 'article',
        images: [mainImage, ...additionalImages],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        image: mainImage,
      },
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: perfume.name || 'Название парфюма',
        brand: {
          '@type': 'Brand',
          name: perfume.brand || 'Бренд',
        },
        description: perfume.description || description,
        image: mainImage,
        releaseDate: perfume.release_year || 'unknown',
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: perfume.rating_value || '0',
          reviewCount: perfume.rating_count || '0',
        },
        review: perfume.reviews?.map((review) => ({
          '@type': 'Review',
          author: {
            '@type': 'Person',
            name: review.username || 'Неизвестный пользователь',
          },
          reviewBody: review.comment || 'Отзыв отсутствует',
        })),
        additionalProperty: [
          { '@type': 'PropertyValue', name: 'Топ ноты', value: topNotes },
          { '@type': 'PropertyValue', name: 'Средние ноты', value: heartNotes },
          { '@type': 'PropertyValue', name: 'Базовые ноты', value: baseNotes },
        ],
      },
    };
  } catch (error) {
    console.error('Ошибка при загрузке метаданных:', error);
    return {
      title: 'Парфюм - ошибка загрузки',
      description: 'Не удалось загрузить данные о парфюме.',
    };
  }
}
