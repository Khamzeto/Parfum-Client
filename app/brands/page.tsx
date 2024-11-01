import { FooterLinks } from '@/components/ui/Footer/Footer';
import { Welcome } from '@/components/Welcome/Welcome';

export default function BrandsPage() {
  return (
    <>
      <head>
        <title>Популярные парфюмерные бренды от А до Я – Полный обзор с отзывами</title>
        <meta
          name="description"
          content="Самые популярные и успешные парфюмерные бренды в мире. Полный список лучших парфюмерных домов от А до Я, факты о выпускаемых ароматах и многое другое."
        />
        <meta
          name="keywords"
          content="Парфюм, Аромат, Обзоры, Описание парфюма, Популярные парфюмы"
        />
      </head>
      <Welcome />
      <FooterLinks />
    </>
  );
}
