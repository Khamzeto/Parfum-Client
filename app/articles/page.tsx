'use client';
import { useEffect, useState } from 'react';
import { Header } from '@/components/Header/Header';
import { Container, Group, Text, Card, Image, Box, Title, Skeleton, Button } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import '@mantine/carousel/styles.css';
import { IconClock, IconEye, IconPencilPlus } from '@tabler/icons-react';
import $api from '@/components/api/axiosInstance';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ru';
import { useMediaQuery } from '@mantine/hooks';
import { FooterLinks } from '@/components/ui/Footer/Footer';

dayjs.extend(relativeTime);
dayjs.locale('ru');

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popularArticles, setPopularArticles] = useState([]);

  const isSmallScreen = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    const fetchUserArticles = async () => {
      try {
        const response = await $api.get('/article/latest');
        setArticles(response.data);
      } catch (error) {
        console.error('Ошибка при получении статей пользователя:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchPopularArticles = async () => {
      try {
        const response = await $api.get('/article/requests/popular');
        setPopularArticles(response.data || []);
      } catch (error) {
        console.error('Ошибка загрузки популярных статей:', error);
      }
    };

    fetchUserArticles();
    fetchPopularArticles();
  }, []);

  const handleArticle = (articleId: string) => {
    window.location.href = `/article/${articleId}`;
  };

  const handleCreateArticle = () => {
    window.location.href = '/create-article';
  };

  return (
    <>
      <head>
        <title>Статьи от пользователей парфюмерики – Мнение и опыт комьюнити</title>
        <meta
          name="description"
          content="Читайте увлекательные статьи, написанные любителями парфюмерии: обзоры, истории, впечатления и советы. Узнайте больше о любимых ароматах и откройте для себя новые."
        />
        <meta
          name="keywords"
          content="Парфюм, Аромат, Обзоры, Описание парфюма, Популярные парфюмы"
        />

        {/* Open Graph / Facebook */}

        <meta
          property="og:title"
          content="Статьи от пользователей парфюмерики – Мнение и опыт о мире ароматов"
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
                Популярные статьи
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
                      <Box style={{ width: '100%', padding: '20px' }}>
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
                            style={{ fontSize: '14px', fontWeight: 600, color: '#ffb000' }}
                          >
                            Популярное
                          </Text>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              color: '#757575',
                            }}
                          >
                            <IconClock size={16} />
                            <Text size="sm" color="dimmed" style={{ fontSize: '12px' }}>
                              {dayjs(popArticle.createdAt).fromNow()}
                            </Text>
                          </div>
                        </div>
                        <Group>
                          <Text
                            size="lg"
                            style={{ fontSize: isSmallScreen ? '18px' : '24px', fontWeight: 600 }}
                          >
                            {popArticle.title}
                          </Text>
                        </Group>
                        <Text
                          size="sm"
                          color="dimmed"
                          mt="xs"
                          style={{ color: '#757575', fontSize: isSmallScreen ? '12px' : '14px' }}
                        >
                          {popArticle.description}
                        </Text>
                      </Box>
                      <div
                        style={{
                          width: isSmallScreen ? '100%' : '80%',
                          height: '100%',
                          position: 'relative',
                          top: '-30px',
                          right: '-40px',
                        }}
                      >
                        <Image
                          src={popArticle.coverImage || '/images/placeholder.jpg'}
                          alt={popArticle.title}
                          height={500}
                          style={{ position: 'absolute', top: '0px' }}
                          width={isSmallScreen ? 200 : 200}
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
        <Card
          radius="14"
          shadow="sm"
          mt="40"
          style={{
            marginBottom: '40px',
            background: 'linear-gradient(200deg, #007BFF, #007BFF)', // Бело-синий градиент
            color: '#ffffff',
            padding: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: isSmallScreen ? 'column' : 'row',
            gap: '20px',
          }}
        >
          <div>
            <Title size={isSmallScreen ? '20px' : '28px'} mb="md">
              Станьте частью нашего сообщества
            </Title>
            <Text size={isSmallScreen ? 'sm' : 'md'}>
              Делитесь своими знаниями и вдохновляйте других — создайте свою статью прямо сейчас!
            </Text>
          </div>
          <Button
            size="lg"
            variant="white"
            onClick={handleCreateArticle}
            radius="14"
            style={{
              color: '#007BFF', // Синий текст для кнопки
              backgroundColor: 'white',
              fontWeight: 600,
              padding: isSmallScreen ? '8px 20px' : '12px 30px',
            }}
          >
            Создать статью
          </Button>
        </Card>
        {/* Последние статьи */}
        <Title size="24" mb="20" mt="60">
          Последние статьи
        </Title>
        <Carousel
          height={340}
          slideGap={{ base: 0, sm: 'md' }}
          slideSize={{ base: '100%', sm: '50%', md: '33.333%' }}
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
                    src={article.coverImage || '/images/placeholder.jpg'}
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
      </Container>
      <FooterLinks />
    </>
  );
}
