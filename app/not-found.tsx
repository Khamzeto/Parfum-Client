// app/not-found.js
'use client';

import { Header } from '@/components/Header/Header';
import {
  Container,
  Group,
  Text,
  Card,
  Image,
  Box,
  Title,
  Skeleton,
  SimpleGrid,
  Button,
} from '@mantine/core';
import { IconClock, IconError404 } from '@tabler/icons-react';
import Link from 'next/link';
import { Carousel } from '@mantine/carousel';
import { useEffect, useState } from 'react';
import $api from '@/components/api/axiosInstance';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ru';
dayjs.extend(relativeTime);
dayjs.locale('ru');
import '@mantine/carousel/styles.css';

export default function NotFound() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUserArticles = async () => {
      try {
        const response = await $api.get(`/news/requests/`);
        setArticles(response.data.requests);
      } catch (error) {
        console.error('Ошибка при получении статей пользователя:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserArticles();
  }, []);
  const handleArticle = (articleId: string) => {
    window.location.href = `/new/${articleId}`;
  };
  return (
    <>
      <head>
        <title>404 - Страница не найдена</title>
        <meta name="description" content="Извините, страница, которую вы ищете, не существует." />
        <meta
          name="keywords"
          content="Парфюм, Аромат, Обзоры, Описание парфюма, Популярные парфюмы"
        />
      </head>
      <Header />
      <div
        size="md"
        w="100%"
        style={{ textAlign: 'center', paddingTop: '50px', marginBottom: '40px' }}
      >
        <Title order={1} style={{ fontWeight: 700, fontSize: '2.5rem', color: '#FF6B6B' }}>
          404 - Страница не найдена
        </Title>
        <Text color="dimmed" size="lg" style={{ marginTop: '20px', marginBottom: '30px' }}>
          Извините, страница, которую вы ищете, не существует.
        </Text>
        <Group justify="center" mt="xl">
          <Link href="/" passHref>
            <Button component="a" size="md" radius="14" variant="filled">
              Вернуться на главную
            </Button>
          </Link>
          <Link href="/contacts" passHref>
            <Button component="a" size="md" radius="14" variant="outline">
              Связаться с нами
            </Button>
          </Link>
        </Group>
        <Title size="24" mb="20" mt="60" style={{ fontWeight: '600' }}>
          Последние новости
        </Title>
        <Carousel
          height={340}
          style={{
            display: 'flex',

            maxWidth: '1300px',
            margin: '0 auto',
          }}
          slideGap={{ base: 0, sm: 'md' }} // Адаптивный gap между слайдами
          slideSize={{
            base: '100%', // Для мобильных
            sm: '50%', // Для планшетов
            md: '33.333%', // Для больших экранов
          }}
          mb={30}
          loop
          align="start"
        >
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <Carousel.Slide key={index}>
                <Card radius="14" padding="lg">
                  <Skeleton height={140} radius="md" />
                  <Skeleton height={20} mt="md" radius="sm" />
                  <Skeleton height={15} mt="sm" radius="sm" width="70%" />
                  <Skeleton height={15} mt="sm" radius="sm" width="50%" />
                </Card>
              </Carousel.Slide>
            ))
          ) : articles.length === 0 ? (
            <Card radius="14" padding="lg">
              <Text>Сообщения не найдены!</Text>
            </Card>
          ) : (
            articles.map((article) => (
              <Carousel.Slide key={article._id}>
                <Card
                  key={article._id}
                  radius="16"
                  padding="lg"
                  withBorder
                  h="340px"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleArticle(article._id)}
                >
                  <Image
                    src={`https://hltback.parfumetrika.ru${article.coverImage || '/images/placeholder.jpg'}`}
                    alt={article.title}
                    height={140}
                    fit="cover"
                    radius="14"
                    style={{ marginBottom: '12px' }}
                  />
                  <Group style={{ marginBottom: '8px' }}>
                    <Text size="lg" weight={500}>
                      {article.title}
                    </Text>
                  </Group>
                  <Group mb="xs">
                    <Text size="sm" color="dimmed">
                      {article.description}
                    </Text>
                  </Group>
                  <Group mt="md">
                    <Group>
                      <IconClock size={16} color="#757575" />
                      <Text size="xs" color="dimmed" style={{ color: '#757575' }}>
                        {dayjs(article.createdAt).fromNow()}
                      </Text>
                    </Group>
                  </Group>
                </Card>
              </Carousel.Slide>
            ))
          )}
        </Carousel>
      </div>
    </>
  );
}
