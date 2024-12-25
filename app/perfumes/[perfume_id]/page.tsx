import PerfumeDetailsPage from '@/components/Perfumes/Perfumes';
import { generateMetadata } from './metadata';
import axios from 'axios';
export { generateMetadata };

interface PerfumeDetailsProps {
  params: { perfume_id: string };
}

// Получение данных о парфюме
async function fetchPerfumeData(perfume_id: string) {
  try {
    const response = await axios.get(`https://hltback.parfumetrika.ru/perfumes/${perfume_id}`);
    return response.data; // Возвращаем только данные
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
    return null; // Возвращаем null в случае ошибки
  }
}

// Главный компонент страницы
export default async function PerfumeDetails({ params }: PerfumeDetailsProps) {
  const { perfume_id } = params;

  // Получаем данные парфюма
  const perfumeData = await fetchPerfumeData(perfume_id);

  // Если данные не удалось загрузить
  if (!perfumeData) {
    return (
      <div>
        <h1>Ошибка загрузки</h1>
        <p>Не удалось загрузить данные о парфюме.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Передаём данные парфюма в компонент */}
      <PerfumeDetailsPage metadata={perfumeData} />
    </div>
  );
}
