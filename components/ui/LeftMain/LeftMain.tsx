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
  Tooltip,
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
  IconCheck,
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

  const [shops, setShops] = useState([]);
  const router = useRouter();
  const [selectedPerfume, setSelectedPerfume] = useState(null);
  useEffect(() => {
    const savedPerfume = localStorage.getItem('perfumeOfTheDay');
    const savedDate = localStorage.getItem('perfumeOfTheDayDate');

    const now = dayjs();

    if (savedPerfume && savedDate && now.isBefore(dayjs(savedDate).add(1, 'day'))) {
      // Если прошло меньше 24 часов, используем сохранённый парфюм
      setSelectedPerfume(JSON.parse(savedPerfume));
    } else {
      // Если прошло больше 24 часов, выбираем новый случайный парфюм
      const randomPerfume = perfume[Math.floor(Math.random() * perfume.length)];
      setSelectedPerfume(randomPerfume);

      // Сохраняем выбранный парфюм и текущую дату в localStorage
      localStorage.setItem('perfumeOfTheDay', JSON.stringify(randomPerfume));
      localStorage.setItem('perfumeOfTheDayDate', now.toISOString());
    }
  }, []);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await $api.get('/shops');
        setShops(response.data);
      } catch (error) {
        console.error('Ошибка при получении данных магазинов:', error);
      }
    };

    fetchShops();
  }, []);

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
      <div className="mob-hidden">
        <Group align="center" style={{ marginBottom: '20px', gap: '10px' }}>
          <ActionIcon color="yellow" radius="xl" size="lg">
            <IconCrown size={18} color="white" />
          </ActionIcon>
          <Title order={2} style={{ fontSize: '20px', margin: 0 }}>
            Парфюм дня
          </Title>
        </Group>

        <Card
          key={selectedPerfume?._id}
          className="card-perfume"
          shadow="2"
          h="280px"
          padding="15.8px"
          radius="18"
          bg={theme.colors.gray[0]}
          style={{ marginBottom: '20px', cursor: 'pointer' }}
          onClick={() => router.push(`/perfumes/${selectedPerfume.perfume_id}`)}
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
                src={selectedPerfume?.image}
                alt={selectedPerfume?.name}
                fit="contain"
                width="100%"
                radius="12"
                height="100%"
              />
            </div>

            <div style={{ flex: 1, textAlign: 'center' }}>
              <Text size="lg" style={{ color: theme.colors.default, fontSize: '14px' }}>
                {selectedPerfume?.name}
              </Text>
              <Text size="sm" style={{ color: theme.colors.gray[6] }}>
                {selectedPerfume?.brand}
              </Text>

              <Group
                spacing="sm"
                justify="center"
                style={{ marginTop: '10px', alignItems: 'center', gap: '4px' }}
              >
                <IconCalendar size={16} color={theme.colors.blue[6]} />
                <Text size="xs" style={{ color: theme.colors.gray[6], textAlign: 'center' }}>
                  Год выпуска: {selectedPerfume?.release_year}
                </Text>
              </Group>
            </div>
            <Button
              onClick={() => router.push(`/perfumes/${selectedPerfume?.perfume_id}`)}
              variant="outline"
              radius="12"
              mb="14"
              style={{ borderColor: theme.colors.gray[4] }}
            >
              Читать полностью
            </Button>
          </Group>
        </Card>
      </div>

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
              <Avatar
                src={`https://hltback.parfumetrika.ru/${post?.userId?.avatar}`}
                alt={post.author}
                radius="xl"
                size="lg"
              />
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '0px',
              }}
            >
              <Text mb="6" size="xs" color="dimmed" style={{ margin: 0, padding: 0 }}>
                {formatDate(post.createdAt)}
              </Text>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '0' }}>
                <Text size="sm" style={{ margin: 0, padding: 0 }}>
                  {post.userId.username}
                </Text>
                {post.userId.isVerified && (
                  <Tooltip label="Подтвержденная личность" withArrow>
                    <div
                      style={{
                        backgroundColor: '#007bff', // Blue background
                        borderRadius: '50%',
                        width: '16px',
                        height: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <IconCheck size="0.68rem" color="white" />
                    </div>
                  </Tooltip>
                )}
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
      <Button radius="12" onClick={() => router.push(`/articles`)} variant="outline" mt="20">
        Показать еще
      </Button>

      <div style={{ padding: '0px', borderRadius: '12px', marginTop: '50px' }}>
        {shops.length > 0 && (
          <Group align="center" mb="xl">
            <IconShoppingBag color={theme.colors.blue[6]} />
            <Title style={{ fontSize: '22px' }}>Aromo магазины</Title>
          </Group>
        )}

        {shops.map((shop) => (
          <div key={shop._id} style={{ marginBottom: '40px' }}>
            <Group className="aromo-shops" align="start">
              <Image src={shop.image} alt={shop.name} width={80} radius="18" />

              <div style={{ flex: 1, justifyContent: 'center' }}>
                <Text weight={500} size="lg">
                  {shop.name}
                </Text>
                <Text
                  size="sm"
                  color="dimmed"
                  component="a"
                  href={`${shop.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {shop.url}
                </Text>
                <Group spacing="xs" gap="4" mt="sm" align="center">
                  <IconMapPin size={16} color={theme.colors.blue[6]} />
                  <Text size="sm" color="dimmed">
                    {shop.location}
                  </Text>
                </Group>
                <Rating value={shop.rating} readOnly mt="sm" />
              </div>

              <Group spacing="xs"></Group>
            </Group>
          </div>
        ))}
      </div>
    </>
  );
}
