'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
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
import '@mantine/carousel/styles.css';
import { Carousel } from '@mantine/carousel';
import { IconEye, IconClock } from '@tabler/icons-react';
import $api from '@/components/api/axiosInstance';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ru';
import { useMediaQuery } from '@mantine/hooks'; // Используем для адаптивности
import { pointer } from '@testing-library/user-event/dist/types/pointer';
import { FooterLinks } from '@/components/ui/Footer/Footer';

dayjs.extend(relativeTime);
dayjs.locale('ru');

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const [popularArticles, setPopularArticles] = useState([]);

  const isSmallScreen = useMediaQuery('(max-width: 768px)');
  const isMediumScreen = useMediaQuery('(max-width: 1200px)');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const fetchArticles = async (page = 1) => {
    try {
      setLoading(true);
      const response = await $api.get(`/news/latest?skip=${(page - 1) * 9}`);
      const newArticles = response.data;

      setArticles((prevArticles) => [...prevArticles, ...newArticles]);
      setHasMore(newArticles.length === 9);
    } catch (error) {
      console.error('Ошибка при получении новостей:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchPopularArticles = async () => {
      try {
        const response = await $api.get(`/news/popular`);
        setPopularArticles(response.data || []);
      } catch (error) {
        console.error('Ошибка загрузки популярных статей:', error);
      }
    };

    fetchArticles();
    fetchPopularArticles();
  }, []);

  const handleArticle = (articleId: string) => {
    window.location.href = `/new/${articleId}`;
  };
  const loadMoreArticles = () => {
    setCurrentPage((prevPage) => {
      const nextPage = prevPage + 1;
      fetchArticles(nextPage);
      return nextPage;
    });
  };

  return (
    <>
      {' '}
      <head>
        <title>Новости о парфюмерии – Свежие тренды и события от редакции - Parfumetrika</title>
        <meta
          name="description"
          content="Узнайте первыми о новинках, трендах и событиях в мире парфюмерии. Следите за актуальными выпусками, коллаборациями и аналитикой индустрии, чтобы оставаться в курсе последних изменений и вдохновляться новыми ароматами."
        />
        <meta
          name="keywords"
          content="Парфюм, Аромат, Обзоры, Описание парфюма, Популярные парфюмы"
        />

        {/* Open Graph / Facebook */}

        <meta
          property="og:title"
          content="Новости о парфюмерии – Свежие тренды и события от редакции - Parfumetrika"
        />
      </head>
      <Header />
      <Container fluid maw="1300px" style={{ margin: '0px auto 0 auto' }} mt="20">
        {/* Популярные статьи */}
        {loading ? (
          <Skeleton height={340} mb="lg" radius="md" />
        ) : (
          Array.isArray(popularArticles) &&
          popularArticles.length > 0 && (
            <div style={{ marginTop: '50px', marginBottom: '20px' }}>
              <Title size="24" mb="20" style={{ fontWeight: '600' }}>
                Популярные новости
              </Title>
              <Carousel withIndicators height={340} loop align="start">
                {popularArticles.map((popArticle) => (
                  <Carousel.Slide key={popArticle._id}>
                    <Card
                      h="340px"
                      radius="16"
                      withBorder
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        padding: '20px',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleArticle(popArticle._id)}
                    >
                      <Box
                        style={{
                          width: '100%',
                          padding: '20px',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '20px',
                            marginBottom: '10px',
                          }}
                        >
                          <Text
                            size="lg"
                            style={{
                              fontSize: '14px',
                              fontWeight: 600,
                              color: '#ffb000',
                            }}
                          >
                            Популярное
                          </Text>
                          {/* Иконка часов и время */}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              color: '#757575',
                            }}
                          >
                            <IconClock size={16} />
                            <Text
                              size="sm"
                              color="dimmed"
                              style={{
                                fontSize: '12px',
                              }}
                            >
                              {dayjs(popArticle.createdAt).fromNow()}
                            </Text>
                          </div>
                        </div>

                        <Group>
                          <Text
                            size="lg"
                            style={{
                              fontSize: isSmallScreen ? '18px' : '24px', // Адаптация размера текста
                              fontWeight: 600,
                            }}
                          >
                            {popArticle.title}
                          </Text>
                        </Group>
                        <Text
                          size="sm"
                          color="dimmed"
                          mt="xs"
                          style={{
                            color: '#757575',
                            fontSize: isSmallScreen ? '12px' : '14px', // Адаптация размера текста
                          }}
                        >
                          {popArticle.description}
                        </Text>
                      </Box>
                      <div
                        style={{
                          width: isSmallScreen ? '100%' : '80%', // Адаптация ширины изображения
                          height: '100%',
                          position: 'relative',
                          top: '-30px',
                          right: '-40px',
                        }}
                      >
                        <Image
                          src={`https://hltback.parfumetrika.ru${popArticle.coverImage || '/images/placeholder.jpg'}`}
                          alt={popArticle.title}
                          height={500}
                          style={{ position: 'absolute', top: '0px' }}
                          width={isSmallScreen ? 200 : 200} // Адаптация ширины изображения
                          fit="cover"
                        />
                      </div>
                    </Card>
                  </Carousel.Slide>
                ))}
              </Carousel>
            </div>
          )
        )}

        <Title size="24" mb="20" mt="60">
          Последние новости
        </Title>
        <SimpleGrid cols={isSmallScreen ? 1 : 3} spacing="lg">
          {articles.map((article) => (
            <Card
              key={article._id}
              radius="16"
              padding="md"
              withBorder
              style={{ cursor: 'pointer', height: '360px' }}
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
              <Text size="sm" color="dimmed">
                {article.description}
              </Text>
              <Group mt="md">
                <IconClock size={16} color="#757575" />
                <Text size="xs" color="dimmed" style={{ color: '#757575' }}>
                  {dayjs(article.createdAt).fromNow()}
                </Text>
              </Group>
            </Card>
          ))}
        </SimpleGrid>
        {hasMore && (
          <Button
            mt="40px"
            size="md"
            style={{ margin: '0 auto', display: 'flex', justifyContent: 'center' }}
            variant="light"
            onClick={loadMoreArticles}
          >
            Показать ещё
          </Button>
        )}
      </Container>
      <FooterLinks />
    </>
  );
}
