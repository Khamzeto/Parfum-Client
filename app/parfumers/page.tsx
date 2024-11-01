import { Parfumers } from '@/components/Parfumers/Parfumers';
import { FooterLinks } from '@/components/ui/Footer/Footer';

export default function ParfumersPage() {
  return (
    <>
      <head>
        <title>Список парфюмеров от А до Я – Энциклопедия создателей ароматов - Parfumetrika</title>
        <meta
          name="description"
          content="Узнайте больше о парфюмерах со всего мира – от легенд индустрии до современных талантов. Биографии, творчество и знаковые ароматы от А до Я для всех, кто хочет глубже понять искусство создания парфюмов."
        />
        <meta
          name="keywords"
          content="Парфюм, Аромат, Обзоры, Описание парфюма, Популярные парфюмы"
        />

        {/* Open Graph / Facebook */}

        <meta
          property="og:title"
          content="Список парфюмеров от А до Я – Энциклопедия создателей ароматов - Parfumetrika"
        />
      </head>
      <Parfumers />
      <FooterLinks />
    </>
  );
}
