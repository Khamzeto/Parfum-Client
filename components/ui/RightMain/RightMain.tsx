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

export function RightMain({ firstBrand, posts, perfumes }) {
  const [recentReviews, setRecentReviews] = useState([]);
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();

  // Данные о нотах
  const notesData = [
    {
      id: '66e84e5ba0ed7975759f1b1d',
      title: 'Яблоко',
      imageUrl: 'https://parfumetrika.ru/note_images/Яблоко.jpg',
      description: 'Parfumetrika знает 1234 парфюмов, содержащих ноту Яблоко.',
    },
    {
      id: '66e84e5ba0ed7975759f1bab',
      title: 'Базилик',
      imageUrl: 'https://parfumetrika.ru/note_images/Базилик.jpg',
      description: 'Parfumetrika знает 2196 парфюм, содержащий ноту Базилик.',
    },
    {
      id: '66e84e5ba0ed7975759f1e29',
      title: 'Гедиона',
      imageUrl: 'https://parfumetrika.ru/note_images/Гедиона.jpg',
      description: 'Parfumetrika знает 346 парфюм, содержащий ноту Гедиона.',
    },
    {
      id: '66e84e5ca0ed7975759f2434',
      title: 'Ель',
      imageUrl: 'https://parfumetrika.ru/note_images/Ель.jpg',
      description: 'Parfumetrika знает 126 парфюм, содержащий ноту Ель.',
    },
    {
      id: '66e84e5ba0ed7975759f1c8b',
      title: 'Магнолия',
      imageUrl: 'https://parfumetrika.ru/note_images/Магнолия.jpg',
      description: 'Parfumetrika знает 3073 парфюм, содержащий ноту Магнолия.',
    },
    // Добавьте другие ноты по аналогии
  ];

  // Состояние для выбранной ноты дня
  const [noteOfTheDay, setNoteOfTheDay] = useState(null);

  useEffect(() => {
    // Логика для выбора ноты дня
    if (typeof window !== 'undefined') {
      const savedNote = localStorage.getItem('noteOfTheDay');
      const savedDate = localStorage.getItem('noteOfTheDayDate');

      const now = dayjs();

      if (savedNote && savedDate && now.isBefore(dayjs(savedDate).add(1, 'day'))) {
        // Если прошло меньше 24 часов, используем сохранённую ноту
        setNoteOfTheDay(JSON.parse(savedNote));
      } else {
        // Если прошло больше 24 часов, выбираем новую случайную ноту
        if (notesData.length > 0) {
          const randomIndex = Math.floor(Math.random() * notesData.length);
          const randomNote = notesData[randomIndex];
          setNoteOfTheDay(randomNote);

          // Сохраняем выбранную ноту и текущую дату в localStorage
          localStorage.setItem('noteOfTheDay', JSON.stringify(randomNote));
          localStorage.setItem('noteOfTheDayDate', now.toISOString());
        } else {
          console.warn('Массив нот пуст');
        }
      }
    }
  }, []);

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

      {/* Отображение ноты дня */}
      {noteOfTheDay ? (
        <Card
          key={noteOfTheDay.id}
          bg={isDark ? theme.colors.dark[6] : theme.colors.gray[0]}
          shadow="2"
          h="280px"
          padding="lg"
          radius="18"
          style={{ marginBottom: '20px', cursor: 'pointer' }}
          onClick={() => router.push(`/note/${noteOfTheDay.id}`)}
        >
          <Group
            style={{ display: 'flex', alignItems: 'center', gap: '20px', flexDirection: 'column' }}
          >
            <div style={{ flex: 1, textAlign: 'center' }}>
              <Text size="lg" style={{ color: theme.colors.default }}>
                {noteOfTheDay.title}
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
                src={noteOfTheDay.imageUrl}
                alt={noteOfTheDay.title}
                fit="contain"
                width="100%"
                radius="360"
                height="100%"
                onError={(e) => {
                  e.target.src = '/fallback-note.jpg'; // Путь к изображению-заглушке для нот
                }}
              />
            </div>
            <Text
              style={{
                textAlign: 'center',
                fontSize: '14px',
                width: '98%',
                color: theme.colors.gray[6],
              }}
            >
              {noteOfTheDay.description}
            </Text>
            <Button
              variant="outline"
              radius="12"
              onClick={() => router.push(`/note/${noteOfTheDay.id}`)}
              style={{ borderColor: theme.colors.gray[4], color: isDark ? 'white' : 'black' }}
            >
              Читать полностью
            </Button>
          </Group>
        </Card>
      ) : (
        <Text>Загрузка ноты дня...</Text>
      )}

      {/* Лучшие отзывы из блогов */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
        <ActionIcon color="blue" radius="xl" size="lg">
          <IconUserFilled size={16} color="white" />
        </ActionIcon>
        <h2 style={{ marginTop: '-4px', fontSize: '22px' }}>Последние отзывы</h2>
        <ActionIcon onClick={() => router.push(`/search`)} variant="outline" radius="xl" size="lg">
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
                src={`https://parfumetrika.ru/${review.main_image}`}
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

      {/* Карточка Бренд дня */}
      <Card
        mt="30"
        bg={isDark ? theme.colors.dark[6] : theme.colors.gray[0]}
        padding="xl"
        radius="18"
        style={{ textAlign: 'center', maxWidth: '300px', width: '100%', margin: '0 auto' }}
      >
        <Text size="xl" style={{ marginBottom: '10px' }} size="xs">
          Бренд дня
        </Text>
        <Text
          onClick={() => router.push(`/brand/Gucci`)}
          size="xl"
          style={{ marginBottom: '10px', cursor: 'pointer' }}
        >
          Dior
        </Text>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            marginBottom: '10px',
          }}
          onClick={() => router.push(`/brand/Gucci`)}
        >
          <img width="80px" src="/cdi.svg" />
        </div>

        <Text
          size="sm"
          style={{ cursor: 'pointer' }}
          onClick={() => router.push(`/brand/Gucci`)}
          color="dimmed"
        >
          Ароматы Dior
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
                style={{ marginBottom: '10px', cursor: 'pointer' }}
                onClick={() => router.push(`/perfumes/${perfume.perfume_id}`)}
              />
              <Text
                style={{ cursor: 'pointer' }}
                onClick={() => router.push(`/perfumes/${perfume.perfume_id}`)}
                weight={500}
              >
                {perfume.name}
              </Text>
              <Text
                style={{ cursor: 'pointer' }}
                onClick={() => router.push(`/perfumes/${perfume.perfume_id}`)}
                size="sm"
                color="dimmed"
              >
                {perfume.type}
              </Text>
            </Carousel.Slide>
          ))}
        </Carousel>

        <Button
          onClick={() => router.push(`/brand/Gucci`)}
          variant="outline"
          radius="md"
          fullWidth
          style={{ marginTop: '20px' }}
        >
          Вся информация о бренде
        </Button>
      </Card>
    </>
  );
}
