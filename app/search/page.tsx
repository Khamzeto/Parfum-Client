import { Header } from '@/components/Header/Header';
import { FooterLinks } from '@/components/ui/Footer/Footer';
import SearchPage from '@/components/ui/Search/Search';
import { Container, Title, Text, List } from '@mantine/core';
import React, { Suspense } from 'react';

export default function Search() {
  return (
    <>
      <head>
        <title>Подбор и описание по ваших критериям - Parfumetrika</title>
        <meta
          name="description"
          content="Ищете идеальный аромат? Ознакомьтесь с подробными описаниями из (общее количесво парфюмов в базе) парфюмов: ноты, пирамиды аккордов, стойкость и подходящие случаи для каждого аромата. Найдите тот, который лучше всего подчеркнет вашу индивидуальность."
        />
        <meta
          name="keywords"
          content="Парфюм, Аромат, Обзоры, Описание парфюма, Популярные парфюмы"
        />
      </head>
      <Header />
      <Suspense fallback={<div>Loading...</div>}>
        <SearchPage />
      </Suspense>
      <FooterLinks />
    </>
  );
}
