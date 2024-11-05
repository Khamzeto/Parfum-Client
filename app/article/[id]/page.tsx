'use client';
// @ts-nocheck
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Container,
  Image,
  Text,
  Box,
  Card,
  Group,
  Textarea,
  Button,
  Divider,
  Title,
  ActionIcon,
  Avatar,
  Skeleton,
} from '@mantine/core';
import {
  IconBrandFacebook,
  IconBrandOkRu,
  IconBrandTelegram,
  IconBrandTwitter,
  IconBrandVk,
  IconBrandWhatsapp,
  IconEye,
  IconTrash,
} from '@tabler/icons-react';
import { Carousel } from '@mantine/carousel';
import $api from '@/components/api/axiosInstance';
import ReactHtmlParser from 'react-html-parser';
import { Header } from '@/components/Header/Header';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import '@mantine/carousel/styles.css';
import 'dayjs/locale/ru';
import { FooterLinks } from '@/components/ui/Footer/Footer';

dayjs.extend(relativeTime);
dayjs.locale('ru');

export default function ArticlePage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [popularArticles, setPopularArticles] = useState([]); // Инициализируем как пустой массив
  const [newComment, setNewComment] = useState('');
  const [newReply, setNewReply] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [replyLimit, setReplyLimit] = useState(3);
  const [reloadCommentsTrigger, setReloadCommentsTrigger] = useState(false);
  const router = useRouter();
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const handleAvatarClick = () => {
    // Переход к профилю пользователя по userId
    router.push(`/user/${article.userId}`);
  };
  const handleUserClick = (userId) => {
    router.push(`/user/${userId}`);
  };
  // Загрузка статьи, комментариев и популярных статей
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    setUserId(user?.id);
    setUsername(user?.username);

    if (id) {
      const fetchArticle = async () => {
        try {
          const response = await $api.get(`/article/requests/id/${id}`);
          setArticle(response.data);
          setComments(response.data.comments || []);
        } catch (error) {
          console.error('Ошибка загрузки статьи:', error);
        } finally {
          setLoading(false);
        }
      };

      const fetchPopularArticles = async () => {
        try {
          const response = await $api.get(`/article/requests/popular`);
          setPopularArticles(response.data || []); // Добавляем || [] на случай, если данных нет
        } catch (error) {
          console.error('Ошибка загрузки популярных статей:', error);
        }
      };

      fetchArticle();
      fetchPopularArticles();
    }
  }, [id, reloadCommentsTrigger]);

  // Обработка отправки комментария
  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    if (!userId) {
      console.error('Пользователь не найден в локальном хранилище');
      return;
    }

    setSubmitting(true);

    try {
      // Отправляем комментарий на сервер
      await $api.post(`/article/requests/${id}/comments`, {
        userId,
        content: newComment,
        username,
      });

      // После успешной отправки делаем новый запрос, чтобы обновить комментарии
      const response = await $api.get(`/article/requests/id/${id}`);
      setComments(response.data.comments || []);

      setNewComment('');
    } catch (error) {
      console.error('Ошибка отправки комментария:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Обработка отправки ответа на комментарий
  const handleReplySubmit = async (commentId: string) => {
    if (!newReply.trim()) return;

    setSubmitting(true);
    try {
      await $api.post(`/article/requests/${id}/comments/${commentId}/replies`, {
        userId,
        content: newReply,
        username,
      });

      setNewReply('');
      setReplyingTo(null);
      setReloadCommentsTrigger((prev) => !prev);
    } catch (error) {
      console.error('Ошибка отправки ответа:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Удаление комментария
  const handleDeleteComment = async (commentId: string) => {
    try {
      await $api.delete(`/article/requests/${id}/comments/${commentId}`);
      setReloadCommentsTrigger((prev) => !prev);
    } catch (error) {
      console.error('Ошибка удаления комментария:', error);
    }
  };

  // Удаление ответа на комментарий
  const handleDeleteReply = async (commentId: string, replyId: string) => {
    try {
      await $api.delete(`/article/requests/${id}/comments/${commentId}/replies/${replyId}`);
      setReloadCommentsTrigger((prev) => !prev);
    } catch (error) {
      console.error('Ошибка удаления ответа:', error);
    }
  };

  // Показать больше ответов
  const handleShowMoreReplies = () => {
    setReplyLimit(replyLimit + 3);
  };

  const contentStyle = {
    img: {
      maxWidth: '100%',
      maxHeight: '300px',
      objectFit: 'cover',
      borderRadius: '8px',
      margin: '10px auto',
      display: 'block',
    },
    p: {
      fontSize: '18px',
      lineHeight: '1.6',
      marginBottom: '20px',
    },
  };

  return (
    <>
      <head>
        <title>{article ? `${article.title} – Parfumetrika` : 'Статья – Parfumetrika'}</title>
        <meta
          name="description"
          content={
            article
              ? `Читать статью "${article.title}" на Parfumetrika. Узнайте больше о ${article.description} и присоединяйтесь к обсуждению.`
              : 'Читать статью на Parfumetrika и присоединиться к обсуждению.'
          }
        />
      </head>
      <Header />
      <Container size="lg" mt="50">
        <Card padding="50" radius="24">
          {/* Заголовок и контент */}
          <Group mb="lg">
            {loading ? (
              <Skeleton height={48} circle mb="sm" />
            ) : (
              <Avatar
                src={article.user?.avatar || undefined}
                alt={article.user?.username || 'Анонимно'}
                size="lg"
                onClick={handleAvatarClick}
                style={{ cursor: 'pointer' }} // Добавляем указатель при наведении
              />
            )}
            <div>
              {loading ? (
                <Skeleton height={24} width="200px" mb="sm" />
              ) : (
                <Text size="sm">
                  <Group onClick={handleAvatarClick} style={{ cursor: 'pointer' }}>
                    {article?.user?.username || 'Анонимно'}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <Text size="xs" color="dimmed">
                        {dayjs(article.createdAt).fromNow()} {/* Время создания статьи */}
                      </Text>
                    </div>
                  </Group>
                </Text>
              )}
              <Title mt="10" size="24" mb="sm">
                {loading ? <Skeleton height={32} width="250px" /> : article.title}
              </Title>
              <Text size="lg">
                {loading ? <Skeleton height={20} width="300px" /> : article.description}
              </Text>
            </div>
          </Group>
          <Box mt="10" mb="20">
            <Title size="lg" mb="sm">
              Поделиться:
            </Title>
            <Group spacing="sm">
              <ActionIcon
                size="lg"
                component="a"
                href={`https://telegram.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(article?.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                color="blue"
              >
                <IconBrandTelegram size={24} strokeWidth={1.6} />
              </ActionIcon>

              <ActionIcon
                size="lg"
                component="a"
                href={`https://wa.me/?text=${encodeURIComponent(article?.title)} ${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                color="green"
              >
                <IconBrandWhatsapp strokeWidth={1.6} size={24} />
              </ActionIcon>

              <ActionIcon
                size="lg"
                component="a"
                href={`https://vk.com/share.php?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(article?.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                color="blue"
              >
                <IconBrandVk size={24} strokeWidth={1.6} />
              </ActionIcon>

              <ActionIcon
                size="lg"
                component="a"
                href={`https://connect.ok.ru/offer?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(article?.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                color="orange"
              >
                <IconBrandOkRu size={24} strokeWidth={1.6} />
              </ActionIcon>
            </Group>
          </Box>

          {article?.coverImage && !loading ? (
            <Image
              src={article.coverImage}
              alt={article.title}
              radius="md"
              fit="cover"
              mb="lg"
              style={{
                borderRadius: '14px',
                border: '1px solid #dee2e6',
                position: 'relative',
                maxHeight: '320px',
              }}
            />
          ) : (
            <Skeleton height={320} radius="md" />
          )}

          {/* Контент статьи */}
          <Box>
            {loading ? (
              <Skeleton height={20} mt="lg" width="100%" />
            ) : (
              ReactHtmlParser(article.content, {
                transform: (node) => {
                  if (node.type === 'tag' && node.name === 'img') {
                    return (
                      <img src={node.attribs.src} alt={node.attribs.alt} style={contentStyle.img} />
                    );
                  }
                  if (node.type === 'tag' && node.name === 'p') {
                    return (
                      <p style={contentStyle.p}>
                        {node.children.map((childNode) => childNode.data)}
                      </p>
                    );
                  }
                },
              })
            )}
          </Box>

          {Array.isArray(popularArticles) && popularArticles.length > 0 && !loading && (
            <div style={{ marginTop: '20px', marginBottom: '20px' }}>
              <Title size="20" mb="20">
                Популярные статьи
              </Title>
              <Carousel
                slideSize={{
                  base: '100%', // Для мобильных
                  sm: '50%', // Для планшетов
                  md: '33.333%', // Для больших экранов
                }}
                slideGap="8"
                align="start"
              >
                {popularArticles.map((popArticle) => (
                  <Carousel.Slide key={popArticle._id}>
                    <Card radius="16" shadow="0" padding="lg" withBorder>
                      <Group align="flex-start">
                        <div style={{ width: '100%', height: '140px' }}>
                          <Image
                            src={popArticle.coverImage || '/images/placeholder.jpg'}
                            alt={popArticle.title}
                            height={140}
                            width={200}
                            fit="cover"
                            radius="14"
                          />
                        </div>

                        <Box style={{ width: '100%' }}>
                          <Group position="apart">
                            <Text size="lg" weight={500}>
                              {popArticle.title}
                            </Text>
                          </Group>
                          <Text size="sm" color="dimmed" mt="xs">
                            {popArticle.description}
                          </Text>
                        </Box>
                      </Group>
                    </Card>
                  </Carousel.Slide>
                ))}
              </Carousel>
            </div>
          )}

          <Divider my="xl" />
          <Title size="lg" mb="lg">
            Комментарии
          </Title>

          <Box mb="lg">
            {comments.length === 0 ? (
              <Text size="sm" color="dimmed">
                Пока нет комментариев.
              </Text>
            ) : (
              comments.map((comment, index) => (
                <Box key={index} mb="sm">
                  <Card shadow="0" padding="lg" radius="14" withBorder>
                    <Group>
                      <div style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', gap: '20px' }}>
                            <Avatar
                              src={comment.avatar || undefined}
                              alt={comment.username || 'Анонимно'}
                              size="md"
                              style={{ cursor: 'pointer' }}
                              onClick={() => handleUserClick(comment.userId)} // Переход по userId
                            />
                            <div>
                              <Text
                                size="xs"
                                onClick={() => handleUserClick(comment.userId)}
                                style={{ cursor: 'pointer' }}
                              >
                                {comment.username || 'Анонимно'}
                                {comment.userId === article.userId && (
                                  <span
                                    style={{
                                      marginLeft: '6px',
                                      fontWeight: 'bold',
                                      color: 'white',
                                      padding: '2px 5px',
                                      borderRadius: '5px',
                                    }}
                                  >
                                    Автор
                                  </span>
                                )}
                              </Text>
                              <Text mt="4" size="sm">
                                {comment.content}
                              </Text>
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  marginTop: '4px',
                                  gap: '8px',
                                }}
                              >
                                <Text style={{ fontSize: '12px' }} color="dimmed">
                                  {dayjs(comment.createdAt).fromNow()}
                                </Text>
                                <Text
                                  style={{ fontSize: '12px', cursor: 'pointer' }}
                                  onClick={() => setReplyingTo(comment._id)}
                                >
                                  Ответить
                                </Text>
                              </div>
                            </div>
                          </div>
                          {comment.userId === userId && (
                            <ActionIcon
                              radius="8"
                              color="red"
                              onClick={() => handleDeleteComment(comment._id)}
                            >
                              <IconTrash size={16} />
                            </ActionIcon>
                          )}
                        </div>
                        {/* Отображение ответов на комментарии */}
                        {comment.replies?.length > 0 &&
                          comment.replies.slice(0, replyLimit).map((reply, replyIndex) => (
                            <Box key={replyIndex} ml="md" mt="md">
                              <Card shadow="0" padding="lg" radius="14" withBorder>
                                <Group>
                                  <div style={{ width: '100%' }}>
                                    <div
                                      style={{ display: 'flex', justifyContent: 'space-between' }}
                                    >
                                      <div style={{ display: 'flex', gap: '20px' }}>
                                        <Avatar
                                          src={reply.avatar || undefined}
                                          alt={reply.username}
                                          size="sm"
                                          style={{ cursor: 'pointer' }}
                                          onClick={() => handleUserClick(reply.userId)} // Переход по userId
                                        />
                                        <div>
                                          <Text
                                            size="xs"
                                            color="dimmed"
                                            onClick={() => handleUserClick(reply.userId)}
                                            style={{ cursor: 'pointer' }}
                                          >
                                            Ответил(a): {reply.username || 'Анонимно'}
                                            {reply.userId === article.userId && (
                                              <span
                                                style={{
                                                  marginLeft: '6px',
                                                  fontWeight: 'bold',
                                                  color: 'white',
                                                  padding: '2px 5px',
                                                  borderRadius: '5px',
                                                }}
                                              >
                                                Автор
                                              </span>
                                            )}
                                          </Text>
                                          <Text size="sm" mt="6" w="90%">
                                            {reply.content}
                                          </Text>
                                          <Text size="xs" mt="6" color="dimmed">
                                            {dayjs(reply.createdAt).fromNow()}
                                          </Text>
                                        </div>
                                      </div>
                                      <div>
                                        {reply.userId === userId && (
                                          <ActionIcon
                                            radius="8"
                                            color="red"
                                            onClick={() =>
                                              handleDeleteReply(comment._id, reply._id)
                                            }
                                          >
                                            <IconTrash size={16} />
                                          </ActionIcon>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </Group>
                              </Card>
                            </Box>
                          ))}
                      </div>
                    </Group>
                  </Card>
                </Box>
              ))
            )}
          </Box>

          {/* Добавить комментарий */}
          <Divider my="sm" />
          <Title size="lg" mb="sm">
            Добавить комментарий
          </Title>
          <Textarea
            radius="12"
            placeholder="Оставьте свой комментарий..."
            minRows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.currentTarget.value)}
            mb="sm"
          />
          <Button
            radius="12"
            onClick={handleCommentSubmit}
            loading={submitting}
            disabled={submitting}
          >
            Отправить комментарий
          </Button>
        </Card>
        <Box mt="10" mb="20">
          <Title size="lg" mb="sm">
            Поделиться:
          </Title>
          <Group spacing="sm">
            <ActionIcon
              size="lg"
              component="a"
              href={`https://telegram.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(article?.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              color="blue"
            >
              <IconBrandTelegram size={24} strokeWidth={1.6} />
            </ActionIcon>

            <ActionIcon
              size="lg"
              component="a"
              href={`https://wa.me/?text=${encodeURIComponent(article?.title)} ${encodeURIComponent(currentUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              color="green"
            >
              <IconBrandWhatsapp strokeWidth={1.6} size={24} />
            </ActionIcon>

            <ActionIcon
              size="lg"
              component="a"
              href={`https://vk.com/share.php?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(article?.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              color="blue"
            >
              <IconBrandVk size={24} strokeWidth={1.6} />
            </ActionIcon>

            <ActionIcon
              size="lg"
              component="a"
              href={`https://connect.ok.ru/offer?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(article?.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              color="orange"
            >
              <IconBrandOkRu size={24} strokeWidth={1.6} />
            </ActionIcon>
          </Group>
        </Box>
      </Container>
      <FooterLinks />
    </>
  );
}
