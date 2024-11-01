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
import { useRouter } from 'next/navigation';

dayjs.locale('ru'); // Устанавливаем локализацию на русский
dayjs.extend(relativeTime);

export function LeftMain({ stores, perfume }) {
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const [posts, setPosts] = useState([]);
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();

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
        <ActionIcon
          onClick={() => router.push(`/create-article`)}
          variant="outline"
          radius="xl"
          size="lg"
        >
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
              <Image src="" alt={store.name} width={80} radius="md" />

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
