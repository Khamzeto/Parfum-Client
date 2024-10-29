'use client';
import { useEffect, useState } from 'react';
import { Header } from '@/components/Header/Header';
import { Container, Group, Text, Card, Image, Box, Title, Skeleton } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import '@mantine/carousel/styles.css';
import { IconClock, IconEye } from '@tabler/icons-react';
import $api from '@/components/api/axiosInstance';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ru';
import { useMediaQuery } from '@mantine/hooks'; // Используем useMediaQuery для адаптации

dayjs.extend(relativeTime);
dayjs.locale('ru');

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popularArticles, setPopularArticles] = useState([]);

  const isSmallScreen = useMediaQuery('(max-width: 768px)'); // Используем для адаптивности

  useEffect(() => {
    const fetchUserArticles = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const user = storedUser ? JSON.parse(storedUser) : null;
        if (user && user.id) {
          const response = await $api.get('/article/requests/');
          setArticles(response.data.requests);
        }
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

  return (
    <>
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
                          src={popArticle.coverImage || '/images/placeholder.jpg'}
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

        {/* Последние статьи */}
        <Title size="24" mb="20" mt="60" style={{ fontWeight: '600' }}>
          Последние статьи
        </Title>
        <Carousel
          height={340}
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
                      <IconEye size={16} color="#757575" />
                      <Text size="xs" color="dimmed" style={{ color: '#757575' }}>
                        {article.views || 0} просмотров
                      </Text>
                    </Group>
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
    </>
  );
}
