import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ru'; // Подключение русской локализации
import { useEffect, useState } from 'react';
import { Carousel } from '@mantine/carousel';
import {
  Text,
  Container,
  ActionIcon,
  Group,
  Card,
  Title,
  Avatar,
  Divider,
  Button,
  Rating,
  useMantineTheme,
  useMantineColorScheme,
  Image,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
  IconCrown,
  IconCalendar,
  IconStar,
  IconPlus,
  IconMessageCircle,
  IconHeart,
  IconShoppingBag,
  IconMapPin,
} from '@tabler/icons-react';
import $api from '@/components/api/axiosInstance';

dayjs.locale('ru'); // Устанавливаем локализацию на русский
dayjs.extend(relativeTime);

export function LeftMain({ stores, perfume }) {
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const [posts, setPosts] = useState([]);
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await $api.get('/article/latest');
        setPosts(response.data || []);
      } catch (error) {
        console.error('Ошибка при получении данных:', error);
      }
    };

    fetchData();
  }, []);

  // Функция для форматирования даты
  const formatDate = (date: string) => dayjs(date).fromNow();

  return (
    <>
      <Group align="center" style={{ marginBottom: '20px', gap: '10px' }}>
        <ActionIcon color="yellow" radius="xl" size="lg">
          <IconCrown size={18} color="white" />
        </ActionIcon>
        <Title order={2} style={{ fontSize: '20px', margin: 0 }}>
          Парфюм дня
        </Title>
      </Group>

      {perfume.map((perfume) => (
        <Card
          key={perfume._id}
          className="card-perfume"
          shadow="2"
          h="280px"
          padding="15.8px "
          radius="18"
          bg={theme.colors.gray[0]}
          style={{ marginBottom: '20px' }}
        >
          <Group
            style={{ display: 'flex', alignItems: 'center', gap: '20px', flexDirection: 'column' }}
          >
            <div
              style={{
                height: 80,
                width: 80,
                borderRadius: '22px',
                backgroundColor: theme.colors.gray[0],
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image
                src={perfume.image}
                alt={perfume.name}
                fit="contain"
                width="100%"
                radius="12"
                height="100%"
              />
            </div>

            <div style={{ flex: 1, textAlign: 'center' }}>
              <Text size="lg" style={{ color: theme.colors.default }}>
                {perfume.name}
              </Text>
              <Text size="sm" style={{ color: theme.colors.gray[6] }}>
                {perfume.brand}
              </Text>

              <Group spacing="sm" style={{ marginTop: '10px', alignItems: 'center' }}>
                <IconCalendar size={16} color={theme.colors.blue[6]} />
                <Text size="xs" style={{ color: theme.colors.gray[6] }}>
                  Год выпуска: {perfume.release_year}
                </Text>
              </Group>
            </div>
            <Button
              variant="outline"
              radius="12"
              style={{ borderColor: theme.colors.gray[4], color: isDark ? 'white' : 'black' }}
            >
              Читать полностью
            </Button>
          </Group>
        </Card>
      ))}

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
        <ActionIcon color="yellow" radius="xl" size="lg">
          <IconStar size={16} color="white" />
        </ActionIcon>
        <h2 style={{ marginTop: '-4px', fontSize: '22px' }}>Лучшее в блогах</h2>
        <ActionIcon variant="outline" radius="xl" size="lg">
          <IconPlus size={16} />
        </ActionIcon>
      </div>

      {posts.map((post, index) => (
        <div
          key={post.id}
          onClick={() => (window.location.href = `/article/${post._id}`)}
          style={{ cursor: 'pointer' }}
        >
          <div
            style={{
              marginBottom: '0px',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
            }}
          >
            <div>
              <Avatar src={post?.userId?.avatar} alt={post.author} radius="xl" size="lg" />
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '0px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0px', margin: '0' }}>
                <Text size="sm" style={{ margin: 0, padding: 0 }}>
                  {post.author}
                </Text>
                <Text size="xs" color="dimmed" style={{ margin: 0, padding: 0 }}>
                  {formatDate(post.createdAt)}
                </Text>
              </div>
              <div style={{ marginTop: '2px' }}>
                <Text size="sm" style={{ margin: 0, padding: 0, width: '160px' }}>
                  {post.title}
                </Text>
              </div>
              <div style={{ display: 'flex', gap: '20px' }}>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px' }}
                >
                  <IconMessageCircle size={16} color="gray" />
                  <Text size="xs" style={{ margin: 0, padding: 0, color: 'gray' }}>
                    {post.comments?.length || 0}
                  </Text>
                </div>
              </div>
            </div>
          </div>
          {index < posts.length - 1 && <Divider size="1" my="8" mt="20" />}
        </div>
      ))}
      <Button radius="12" variant="outline" mt="20">
        Показать еще
      </Button>
      <div style={{ padding: '0px', borderRadius: '12px', marginTop: '50px' }}>
        <Group align="center" mb="xl">
          <IconShoppingBag color={theme.colors.blue[6]} />
          <Title style={{ fontSize: '22px' }}>Aromo магазины</Title>
        </Group>

        {stores.map((store) => (
          <div key={store.id} style={{ marginBottom: '40px' }}>
            <Group className="aromo-shops" align="start">
              {/* Store Image */}
              <Image
                src="data:image/jpeg;base64,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"
                alt={store.name}
                width={80}
                radius="md"
              />

              {/* Store Details */}
              <div style={{ flex: 1 }}>
                <Text weight={500} size="lg">
                  {store.name}
                </Text>
                <Text size="sm" color="dimmed">
                  {store.url}
                </Text>
                <Group spacing="xs" mt="sm" align="center">
                  <IconMapPin size={16} color={theme.colors.blue[6]} />
                  <Text size="sm" color="dimmed">
                    {store.location}
                  </Text>
                </Group>
                {/* Store Rating */}
                <Rating value={store.rating} readOnly mt="sm" />
              </div>

              {/* Likes and Comments */}
              <Group spacing="xs">
                <Group spacing={5}>
                  <IconHeart size={16} color="gray" />
                  <Text size="xs" color="dimmed">
                    {store.likes}
                  </Text>
                </Group>
                <Group spacing={5}>
                  <IconMessageCircle size={16} color="gray" />
                  <Text color="dimmed">{store.comments}</Text>
                </Group>
              </Group>
            </Group>
          </div>
        ))}
      </div>
    </>
  );
}
