'use client';
import { useEffect, useState } from 'react';
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
  Button,
  SimpleGrid,
} from '@mantine/core';
import { IconClock } from '@tabler/icons-react';
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
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const isSmallScreen = useMediaQuery('(max-width: 768px)');

  const fetchArticles = async (page = 1) => {
    try {
      setLoading(true);
      const response = await $api.get(`/article/latest?skip=${(page - 1) * 9}`);
      const newArticles = response.data;

      setArticles((prevArticles) => [...prevArticles, ...newArticles]);
      setHasMore(newArticles.length === 9);
    } catch (error) {
      console.error('Ошибка при получении статей пользователя:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchPopularArticles = async () => {
      try {
        const response = await $api.get('/article/requests/popular');
        setPopularArticles(response.data || []);
      } catch (error) {
        console.error('Ошибка загрузки популярных статей:', error);
      }
    };

    fetchArticles();
    fetchPopularArticles();
  }, []);

  const handleArticle = (articleId: string) => {
    window.location.href = `/article/${articleId}`;
  };

  const handleCreateArticle = () => {
    window.location.href = '/create-article';
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

        <meta
          property="og:title"
          content="Статьи от пользователей парфюмерики – Мнение и опыт о мире ароматов"
        />
      </head>
      <Header />
      <Container fluid maw="1300px" style={{ margin: '0px auto 0 auto' }} mt="20">
        {popularArticles.length > 0 && (
          <div style={{ marginTop: '50px', marginBottom: '20px' }}>
            <Title size="24" mb="20" style={{ fontWeight: '600' }}>
              Популярные статьи
            </Title>
            <div style={{ display: 'flex', gap: '20px', overflowX: 'auto' }}>
              {popularArticles.map((popArticle) => (
                <Card
                  key={popArticle._id}
                  h="340px"
                  radius="16"
                  withBorder
                  style={{ minWidth: '300px', cursor: 'pointer' }}
                  onClick={() => handleArticle(popArticle._id)}
                >
                  <Box>
                    <Text size="lg" style={{ fontWeight: 600, color: '#ffb000' }}>
                      Популярное
                    </Text>
                    <Text size="sm" color="dimmed" style={{ fontSize: '12px' }}>
                      {dayjs(popArticle.createdAt).fromNow()}
                    </Text>
                    <Text size="lg" style={{ fontWeight: 600 }}>
                      {popArticle.title}
                    </Text>
                    <Text size="sm" color="dimmed" style={{ color: '#757575' }}>
                      {popArticle.description}
                    </Text>
                  </Box>
                  <Image
                    src={`https://hltback.parfumetrika.ru${popArticle.coverImage || '/images/placeholder.jpg'}`}
                    alt={popArticle.title}
                    height={140}
                    fit="cover"
                    radius="14"
                  />
                </Card>
              ))}
            </div>
          </div>
        )}

        <Card
          radius="14"
          shadow="sm"
          mt="40"
          style={{
            marginBottom: '40px',
            background: 'linear-gradient(200deg, #007BFF, #007BFF)',
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
              color: '#007BFF',
              backgroundColor: 'white',
              fontWeight: 600,
              padding: isSmallScreen ? '8px 20px' : '12px 30px',
            }}
          >
            Создать статью
          </Button>
        </Card>

        <Title size="24" mb="20" mt="60">
          Последние статьи
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
            style={{
              margin: '0 auto',
              display: 'flex',
              justifyContent: 'center',
              marginTop: '60px',
            }}
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
