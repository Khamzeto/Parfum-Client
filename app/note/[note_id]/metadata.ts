import axios from 'axios';

export async function generateMetadata({ params }) {
  const { note_id: noteId } = params;

  try {
    // Запрос данных о ноте по noteId
    const response = await axios.get(`https://hltback.parfumetrika.ru/notes/${noteId}`);
    const noteData = response.data;

    const title = `${noteData.name || 'Название ноты'} – Духи с нотой ${noteData.name || 'Название ноты'} в одном месте – Parfumetrika`;
    const description = `«${noteData.name || 'Название ноты'}» - Рейтинг популярных ароматов, в которых присутствует эта нота, а также интересные факты о её использовании в парфюмерии.`;

    return {
      title,
      description,
    };
  } catch (error) {
    console.error('Ошибка при загрузке данных о ноте:', error);

    return {
      title: 'Ошибка загрузки данных',
      description: 'Не удалось загрузить информацию о ноте. Попробуйте позже.',
    };
  }
}
