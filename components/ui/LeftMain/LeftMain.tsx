import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ru';
import { useEffect, useState } from 'react';
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

dayjs.locale('ru');
dayjs.extend(relativeTime);

export function LeftMain({ perfume }) {
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const [posts, setPosts] = useState([]);
  const [shops, setShops] = useState([]);
  const router = useRouter();

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
          padding="15.8px"
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

              <Group spacing="sm" style={{ marginTop: '10px', alignItems: 'center', gap: '4px' }}>
                <IconCalendar size={16} color={theme.colors.blue[6]} />
                <Text size="xs" style={{ color: theme.colors.gray[6] }}>
                  Год выпуска: {perfume.release_year}
                </Text>
              </Group>
            </div>
            <Button
              onClick={() => router.push(`/perfumes/47577`)}
              variant="outline"
              radius="12"
              style={{ borderColor: theme.colors.gray[4] }}
            >
              Читать полностью
            </Button>
          </Group>
        </Card>
      ))}

      <div style={{ padding: '0px', borderRadius: '12px', marginTop: '50px' }}>
        <Group align="center" mb="xl">
          <IconShoppingBag color={theme.colors.blue[6]} />
          <Title style={{ fontSize: '22px' }}>Aromo магазины</Title>
        </Group>

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
