import axios from 'axios';

export async function generateMetadata({ params }) {
  const { perfume_id } = params;

  try {
    const response = await axios.get(`https://hltback.parfumetrika.ru/perfumes/${perfume_id}`);
    const perfume = response.data;

    // Формируем основные метаданные с проверками
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

    const mainImage = perfume.main_image
      ? `https://parfumetrika.ru/${perfume.main_image}`
      : 'https://parfumetrika.ru/default-image.jpg';
    const additionalImages = (perfume.additional_images || []).map(
      (img) => `https://parfumetrika.ru/${img}`
    );
    const topNotes = perfume.notes?.top_notes?.join(', ') || 'неизвестны';
    const heartNotes = perfume.notes?.heart_notes?.join(', ') || 'неизвестны';
    const baseNotes = perfume.notes?.base_notes?.join(', ') || 'неизвестны';

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `https://parfumetrika.ru/perfumes/${perfume_id}`,
        type: 'website', // Используем 'website' вместо 'product'
        locale: 'ru_RU',
        site_name: 'Parfumetrika',
        images: [
          {
            url: mainImage,
            width: 800,
            height: 600,
            alt: perfume.name || 'Изображение парфюма',
          },
          ...additionalImages.map((img) => ({
            url: img,
            width: 800,
            height: 600,
            alt: perfume.name || 'Изображение парфюма',
          })),
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [mainImage],
      },
      facebook: {
        app_id: 'YOUR_FACEBOOK_APP_ID', // Замените на ваш Facebook App ID, если есть
      },
      vk: {
        // VK обычно распознает Open Graph, но можно добавить специфические метатеги при необходимости
      },
      pinterest: {
        // Pinterest также использует Open Graph, но убедитесь, что изображения соответствуют требованиям
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
        sku: perfume.perfume_id || 'Неизвестный SKU',
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
          reviewRating: {
            '@type': 'Rating',
            ratingValue: review.rating_value || '0',
            bestRating: '10',
          },
        })),
        additionalProperty: [
          { '@type': 'PropertyValue', name: 'Топ ноты', value: topNotes },
          { '@type': 'PropertyValue', name: 'Средние ноты', value: heartNotes },
          { '@type': 'PropertyValue', name: 'Базовые ноты', value: baseNotes },
          { '@type': 'PropertyValue', name: 'Акорды', value: (perfume.accords || []).join(', ') },
          { '@type': 'PropertyValue', name: 'Тип', value: perfume.type || 'Неизвестно' },
        ],
      },
      // Дополнительные метатеги для других социальных сетей можно добавить здесь
    };
  } catch (error) {
    console.error('Ошибка при загрузке метаданных:', error);
    return {
      title: 'Парфюм - ошибка загрузки',
      description: 'Не удалось загрузить данные о парфюме.',
      openGraph: {
        title: 'Парфюм - ошибка загрузки',
        description: 'Не удалось загрузить данные о парфюме.',
        url: `https://parfumetrika.ru/perfumes/${perfume_id}`,
        type: 'website', // Тип для ошибки тоже должен быть 'website'
        images: [
          {
            url: 'https://parfumetrika.ru/default-image.jpg', // Путь к дефолтному изображению
            width: 800,
            height: 600,
            alt: 'Ошибка загрузки изображения',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Парфюм - ошибка загрузки',
        description: 'Не удалось загрузить данные о парфюме.',
        images: ['https://parfumetrika.ru/default-image.jpg'],
      },
    };
  }
}
