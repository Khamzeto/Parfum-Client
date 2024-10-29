'use client';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Header } from '@/components/Header/Header';
import {
  Container,
  Group,
  Text,
  Button,
  Card,
  Image,
  Box,
  Badge,
  Stack,
  Skeleton,
} from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import $api from '@/components/api/axiosInstance';
import './MyArticles.css';

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [popularArticles, setPopularArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchUserArticles = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const user = storedUser ? JSON.parse(storedUser) : null;
        if (user && user.id) {
          const response = await $api.get(`/article/requests/user/${user.id}`);
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
        const response = await $api.get(`/article/requests/popular`);
        setPopularArticles(response.data || []);
      } catch (error) {
        console.error('Ошибка загрузки популярных статей:', error);
      }
    };

    fetchUserArticles();
    fetchPopularArticles();
  }, []);

  const handleEdit = (articleId) => {
    window.location.href = `/edit-article/${articleId}`;
  };

  const handleDelete = async (articleId) => {
    try {
      await $api.delete(`/article/requests/${articleId}`);
      setArticles(articles.filter((article) => article._id !== articleId));
    } catch (error) {
      console.error(`Ошибка при удалении статьи с ID: ${articleId}`, error);
    }
  };

  const handleCardClick = (id) => {
    router.push(`/article/${id}`);
  };

  return (
    <>
      <Header />
      <Container maw="1440px" mb="20" fluid style={{ margin: '20px auto 0 auto' }}>
        <Box style={{ flex: 1 }}>
          <Card padding="20" withBorder radius="14" style={{ display: 'flex' }}>
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
              <Text size="lg">Мои Статьи</Text>
              <Button onClick={() => router.push('/create-post')} radius="12" maxWidth="200px">
                Создать статью
              </Button>
            </div>
          </Card>
        </Box>

        <Group w="100%" mt="40" align="flex-start">
          <div className="myarticles-container" style={{ width: '78%', gap: '12px' }}>
            <Box style={{ flex: 1 }}>
              {loading ? (
                Array(3)
                  .fill(0)
                  .map((_, idx) => (
                    <Card key={idx} radius="16" shadow="sm" padding="lg" withBorder mb="md">
                      <Group align="flex-start">
                        <Skeleton height={140} width={200} radius="14" />
                        <Box style={{ width: '100%' }}>
                          <Skeleton height={24} width="60%" radius="md" mb="sm" />
                          <Skeleton height={16} width="80%" radius="md" mb="xs" />
                          <Skeleton height={16} width="40%" radius="md" mb="md" />
                          <Group mt="md">
                            <Skeleton height={36} width={80} radius="md" />
                            <Skeleton height={36} width={80} radius="md" />
                          </Group>
                        </Box>
                      </Group>
                    </Card>
                  ))
              ) : articles.length === 0 ? (
                <Card radius="14" padding="lg">
                  <Text>Сообщения не найдены!</Text>
                </Card>
              ) : (
                <div className="myarticles-container">
                  {articles.map((article) => (
                    <div
                      key={article._id}
                      className="myarticles-card"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleCardClick(article._id)}
                    >
                      <Card radius="16" shadow="0" padding="lg" withBorder>
                        <Group align="flex-start">
                          <div style={{ width: '100%', height: '140px' }}>
                            <Image
                              src={article.coverImage || '/images/placeholder.jpg'}
                              alt={article.title}
                              height={140}
                              width={200}
                              fit="cover"
                              radius="14"
                            />
                          </div>
                          <Box style={{ width: '100%' }}>
                            <Group position="apart">
                              <Text size="lg" weight={500}>
                                {article.title}
                              </Text>
                              <Badge
                                color={
                                  article.status === 'pending'
                                    ? 'orange'
                                    : article.status === 'approved'
                                      ? 'green'
                                      : 'red'
                                }
                              >
                                {article.status === 'pending'
                                  ? 'На проверке'
                                  : article.status === 'approved'
                                    ? 'Опубликовано'
                                    : 'Не опубликовано'}
                              </Badge>
                            </Group>
                            <Text size="sm" color="dimmed" mt="xs">
                              {article.description}
                            </Text>
                            <Group mt="md">
                              <Button
                                variant="light"
                                radius="md"
                                leftSection={<IconEdit size={18} />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(article._id);
                                }}
                              >
                                Изменить
                              </Button>
                              <Button
                                variant="light"
                                color="red"
                                radius="md"
                                leftSection={<IconTrash size={18} />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(article._id);
                                }}
                              >
                                Удалить
                              </Button>
                            </Group>
                          </Box>
                        </Group>
                      </Card>
                    </div>
                  ))}
                </div>
              )}
            </Box>
          </div>

          <Box style={{ width: '20%' }} className="pc-popular">
            <Text size="lg" mb="30">
              Популярные
            </Text>
            <Stack spacing="md">
              {loading
                ? Array(3)
                    .fill(0)
                    .map((_, idx) => (
                      <Card key={idx} radius="14" padding="lg" shadow="0" withBorder>
                        <Group>
                          <Skeleton height={80} width="100%" radius="md" />
                          <Box>
                            <Skeleton height={16} width="80%" radius="md" mb="xs" />
                            <Skeleton height={16} width="40%" radius="md" />
                          </Box>
                        </Group>
                      </Card>
                    ))
                : popularArticles.map((article) => (
                    <Card
                      key={article._id}
                      radius="14"
                      padding="lg"
                      shadow="0"
                      withBorder
                      onClick={() => router.push(`/article/${article._id}`)} // Переход на статью при клике
                      style={{ cursor: 'pointer' }} // Добавляем указатель курсора для индикации кликабельности
                    >
                      <Group>
                        <Box
                          style={{
                            width: '100%',
                            height: '80px',
                            overflow: 'hidden',
                            borderRadius: '8px',
                          }}
                        >
                          <Image
                            src={article.coverImage || '/images/placeholder.jpg'}
                            alt={article.title}
                            fit="cover"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </Box>
                        <Box>
                          <Text size="sm" weight={500}>
                            {article.title}
                          </Text>
                          <Text size="xs" color="dimmed">
                            {article.date}
                          </Text>
                        </Box>
                      </Group>
                    </Card>
                  ))}
            </Stack>
          </Box>
        </Group>
      </Container>
    </>
  );
}
