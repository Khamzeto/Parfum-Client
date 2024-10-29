import { useEffect, useState } from 'react';
import { Carousel } from '@mantine/carousel';
import {
  Text,
  Container,
  ActionIcon,
  Group,
  rem,
  Card,
  Title,
  Avatar,
  Divider,
  Button,
  useMantineTheme,
  useMantineColorScheme,
  Image,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  IconLeaf,
  IconUserFilled,
  IconChevronLeft,
  IconChevronRight,
  IconPlus,
} from '@tabler/icons-react';
dayjs.locale('ru');
dayjs.extend(relativeTime);
import $api from '@/components/api/axiosInstance'; // Импортируем axios экземпляр
import { useRouter } from 'next/navigation';

export function RightMain({ firstBrand, posts, notes, perfumes }) {
  const [recentReviews, setRecentReviews] = useState([]);
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();

  useEffect(() => {
    // Получаем последние отзывы из API
    const fetchRecentReviews = async () => {
      try {
        const response = await $api.get('/perfumes/reviews/recent');
        setRecentReviews(response.data);
      } catch (error) {
        console.error('Ошибка при получении последних отзывов:', error);
      }
    };
    fetchRecentReviews();
  }, []);

  return (
    <>
      {/* Нота дня */}
      <Group align="center" style={{ marginBottom: '20px', gap: '10px' }}>
        <ActionIcon radius="xl" size="lg">
          <IconLeaf size={18} color={theme.colors.white} />
        </ActionIcon>
        <Title order={2} style={{ fontSize: '20px', margin: 0 }}>
          Нота дня
        </Title>
      </Group>

      {/* Отображение парфюмов для нот дня */}
      {notes.map((perfume) => (
        <Card
          key={perfume._id}
          bg={isDark ? theme.colors.dark[6] : theme.colors.gray[0]}
          shadow="2"
          h="280px"
          padding="lg"
          radius="18"
          style={{ marginBottom: '20px' }}
        >
          <Group
            style={{ display: 'flex', alignItems: 'center', gap: '20px', flexDirection: 'column' }}
          >
            <div style={{ flex: 1, textAlign: 'center' }}>
              <Text size="lg" style={{ color: theme.colors.default }}>
                {perfume.title}
              </Text>
            </div>
            <div
              style={{
                height: 80,
                width: 80,
                borderRadius: '360px',
                backgroundColor: theme.colors.gray[0],
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image
                src="https://img.parfumo.de/notes/f1/f1_22c346156a3e3950b3e3b8769ca1877328dbce56_320.jpg" // Placeholder image
                alt={perfume.name}
                fit="contain"
                width="100%"
                radius="360"
                height="100%"
              />
            </div>
            <Text
              style={{
                textAlign: 'center',
                fontSize: '12px',
                width: '98%',
                color: theme.colors.gray[6],
              }}
            >
              Белая амбра лучшая амбра на свете богата аминокислотами{' '}
            </Text>
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

      {/* Лучшие отзывы из блогов */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
        <ActionIcon color="blue" radius="xl" size="lg">
          <IconUserFilled size={16} color="white" />
        </ActionIcon>
        <h2 style={{ marginTop: '-4px', fontSize: '22px' }}>Лучшее в блогах</h2>
        <ActionIcon variant="outline" radius="xl" size="lg">
          <IconPlus color={theme.colors.blue[6]} size={16} />
        </ActionIcon>
      </div>

      {/* Отображение последних отзывов */}
      {recentReviews.map((review, index) => (
        <div
          key={review.perfume_id}
          style={{ cursor: 'pointer' }}
          onClick={() => router.push(`/perfumes/${review.perfume_id}`)}
        >
          <div
            style={{
              marginBottom: '10px',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
            }}
          >
            <div>
              <Avatar
                src={`https://pimages.parfumo.de/720/2_img-9013-hermes-terre-d-hermes-eau-de-toilette_720.webp`}
                alt={review.user.username}
                radius="8"
                size="lg"
              />
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '4px',
              }}
            >
              <Text size="xs" color="dimmed" style={{ margin: 0, padding: 0 }}>
                {dayjs(review.reviews.createdAt).fromNow()}
              </Text>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'start',
                  gap: '4px',
                  margin: '0',
                }}
              >
                <IconUserFilled color={theme.colors.blue[6]} size={16} />
                <Text size="sm" style={{ margin: 0, padding: 0, fontWeight: 600 }}>
                  {review.user.username}
                </Text>
              </div>
              <div style={{ marginTop: '0px' }}>
                <Text size="sm" style={{ margin: 0, padding: 0, width: '160px' }}>
                  {review.reviews.body}
                </Text>
              </div>
            </div>
          </div>

          {/* Divider между отзывами */}
          {index < recentReviews.length - 1 && <Divider size="1" my="lg" />}
        </div>
      ))}

      <Button radius="12" variant="outline" mt="20">
        Показать еще
      </Button>

      {/* Карточка Бренд дня */}
      <Card
        mt="30"
        bg={isDark ? theme.colors.dark[6] : theme.colors.gray[0]}
        padding="xl"
        radius="18"
        style={{ textAlign: 'center', maxWidth: '300px', width: '100%', margin: '0 auto' }}
      >
        <Text size="xs">Бренд дня</Text>
        <Text size="xl" style={{ marginBottom: '10px' }}>
          Acqua dell Elba
        </Text>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          {firstBrand.logo(isDark)}
        </div>

        <Text size="sm" color="dimmed">
          Ароматы Acqua dell Elba
        </Text>
        <Carousel
          loop
          nextControlIcon={<IconChevronRight size={16} />}
          previousControlIcon={<IconChevronLeft size={16} />}
          style={{ marginTop: '10px', marginBottom: '20px' }}
        >
          {perfumes.map((perfume) => (
            <Carousel.Slide key={perfume.id}>
              <Image
                src={perfume.image}
                alt={perfume.name}
                width={50}
                height={80}
                fit="contain"
                style={{ marginBottom: '10px' }}
              />
              <Text weight={500}>{perfume.name}</Text>
              <Text size="sm" color="dimmed">
                {perfume.type}
              </Text>
            </Carousel.Slide>
          ))}
        </Carousel>

        <Button variant="outline" radius="md" fullWidth style={{ marginTop: '20px' }}>
          Вся информация о бренде
        </Button>
      </Card>
    </>
  );
}
