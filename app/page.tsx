import { Welcome } from '../components/Welcome/Welcome';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import MainPage from '@/components/Main/Main';

export default function HomePage() {
  return (
    <>
      <head>
        <title>Парфюметрика – Ваш гид в мире парфюмерии</title>
        <meta
          name="description"
          content="Добро пожаловать на Парфюметрику! Здесь вы найдете все ароматы мира: обзоры на (общее количество парфюмов в базе) парфюмов, описания, подборки похожих ароматов и рейтинги брендов. Исследуйте наш каталог, изучайте отзывы и выбирайте идеальные ароматы, которые подчеркнут ваш стиль и создадут особое настроение."
        />
        <meta
          name="keywords"
          content="Парфюм, Аромат, Обзоры, Описание парфюма, Популярные парфюмы"
        />
      </head>
      <MainPage />
    </>
  );
}
