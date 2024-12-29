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
          content="Добро пожаловать на Парфюметрику - отзывы на 150 000+ парфюмов, подробные обзоры, подборки похожих ароматов и рейтинги брендов. Исследуйте наш каталог, изучайте отзывы и выбирайте Ваш идеальный аромат."
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
