import axios from 'axios';

export async function generateMetadata({ params }) {
  const { perfume_id } = params;

  try {
    const response = await axios.get(`https://hltback.parfumetrika.ru/perfumes/${perfume_id}`);
    const perfume = response.data;

    return {
      title: `${perfume.name || 'Название парфюма'} от ${perfume.brand || 'Бренд'}`,
      description: `${perfume.name || 'Название парфюма'} - аромат для ${
        perfume.gender === 'male'
          ? 'Мужчин'
          : perfume.gender === 'female'
            ? 'Женщин'
            : 'Мужчин и Женщин'
      } от ${perfume.brand || 'Бренд'}, выпущенный в ${
        perfume.release_year || 'неизвестном году'
      }. Оценка ${perfume.rating_value || '0'} из 10.`,
    };
  } catch (error) {
    console.error('Ошибка при загрузке метаданных:', error);
    return {
      title: 'Парфюм - ошибка загрузки',
      description: 'Не удалось загрузить данные о парфюме.',
    };
  }
}
