import { Notes } from '@/components/Notes/Notes';
import { Parfumers } from '@/components/Parfumers/Parfumers';
import { FooterLinks } from '@/components/ui/Footer/Footer';

export default function NotesPage() {
  return (
    <>
      <head>
        <title>Подбор парфюма по нотам - список нот c функцией поиска - Parfumetrika</title>
        <meta
          name="description"
          content="Откройте для себя более 10,000 ароматных нот парфюмерного мира — от классических до самых экзотических, каждая из которых привносит уникальный характер и эмоции в композиции. Узнайте, в каких духах встречаются любимые ноты, и погрузитесь в увлекательный мир аккордов, раскрывающих глубину и многогранность парфюмерии."
        />
        <meta
          name="keywords"
          content="Парфюм, Аромат, Обзоры, Описание парфюма, Популярные парфюмы"
        />
      </head>
      <Notes />
      <FooterLinks />
    </>
  );
}
