'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Text,
  Container,
  Title,
  SimpleGrid,
  Image,
  Badge,
  Pagination,
  Group,
  Skeleton,
  Select,
  useMantineTheme,
  useMantineColorScheme,
  Button,
  Divider,
  Anchor,
  Breadcrumbs,
} from '@mantine/core';
import {
  IconMars,
  IconVenus,
  IconGenderBigender,
  IconStar,
  IconCalendar,
  IconSearch,
  IconZoomReset,
  IconGridDots,
  IconList,
  IconUser,
} from '@tabler/icons-react';
import $api from '@/components/api/axiosInstance';
import { Header } from '@/components/Header/Header';
import Link from 'next/link';
import SearchInput from '../../../components/ui/InputSearch/InputSearch';
import { FooterLinks } from '@/components/ui/Footer/Footer';

interface Perfume {
  _id: string;
  name: string;
  brand: string;
  type: string;
  perfume_id: string;
  description: string;
  release_year: number;
  gender: string;
  rating_value: number;
  rating_count: number;
  main_image: string;
  accords: string[];
}

const PerfumesByParfumer = () => {
  const theme = useMantineTheme();
  const params = useParams();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const [isListView, setIsListView] = useState(false);

  const parfumerSlug = params.parfumeName;

  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activePage, setActivePage] = useState<number>(1);
  const itemsPerPage = 20;
  const [totalItems, setTotalItems] = useState<number>(0);
  const [parfumerName, setParfumerName] = useState<string>('');
  const [total, setTotal] = useState<number>(0);
  const [parfumerRu, setParfumerRu] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('A-Z');
  const [genderFilter, setGenderFilter] = useState<string | null>(null);

  useEffect(() => {
    if (parfumerSlug) {
      fetchPerfumesByParfumer(parfumerSlug, activePage, sortBy, genderFilter);
    }
  }, [parfumerSlug, activePage, sortBy, genderFilter]);

  const fetchPerfumesByParfumer = async (
    parfumerSlug: string,
    page: number,
    sortBy: string,
    gender: string | null
  ) => {
    setLoading(true);
    try {
      const response = await $api.get(`/parfumers/perfumes`, {
        params: {
          slug: parfumerSlug,
          page: page,
          limit: itemsPerPage,
          sortBy: sortBy,
          gender: gender,
        },
      });
      setParfumerRu(response.data.perfumes[0]);

      setPerfumes(response.data.perfumes);
      setTotalItems(response.data.total);
      setParfumerName(response.data.parfumer);
      setParfumerRu(response.data.parfumer_ru);
      setTotal(response.data.total);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch perfumes');
    } finally {
      setLoading(false);
    }
  };

  const formatImageUrl = (url: string) => {
    const baseURL = 'https://hltback.parfumetrika.ru/';
    const defaultImage =
      'https://pimages.parfumo.de/240/119838_img-8861-a__e__ariana__evans-platinum_240.webp';
    return url ? baseURL + url.replace(/\\/g, '/') : defaultImage;
  };

  const getGenderIcon = (gender: string) => {
    switch (gender.toLowerCase()) {
      case 'male':
        return (
          <IconMars
            size={20}
            color={theme.colors.blue[6]}
            style={{ verticalAlign: 'middle', marginLeft: 4 }}
          />
        );
      case 'female':
        return (
          <IconVenus
            size={20}
            color={theme.colors.pink[6]}
            style={{ verticalAlign: 'middle', marginLeft: 4 }}
          />
        );
      case 'unisex':
        return (
          <IconGenderBigender
            size={20}
            color={theme.colors.green[6]}
            style={{ verticalAlign: 'middle', marginLeft: 4 }}
          />
        );
      default:
        return null;
    }
  };

  const handlePageChange = (page: number) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSortBy('A-Z');
    setGenderFilter(null);
    setActivePage(1);
  };

  if (error) return <Text color="red">{error}</Text>;
  const title = `${parfumerRu}`;
  console.log(title);

  return (
    <>
      <head>
        <title>
          {`${parfumerRu} - Полный список созданных ароматов с функцией поиска - Parfumetrika`}
        </title>

        <meta
          name="description"
          content={`Узнайте все о парфюмере ${parfumerName}: его биография, и ключевые достижения. Изучите характеристики каждого парфюма, отзывы пользователей и информацию о брендах, с которыми он сотрудничал. Получите практическое руководство по выбору его ароматов, чтобы найти идеальный вариант.`}
        />
      </head>
      <Header />

      <div
        style={{
          maxWidth: '1440px',
          margin: '30px auto 0 auto',
          paddingLeft: '20px',
          paddingRight: '20px',
        }}
      >
        <Breadcrumbs
          separator=">"
          style={{
            display: 'flex',
            flexWrap: 'wrap', // Позволяет переходить на новую строку при нехватке места
            color: '#555',
            marginTop: '0px',
            maxWidth: '100%',
          }}
        >
          <Anchor href="/" style={{ textDecoration: 'none', color: '#007bff' }}>
            Главная
          </Anchor>
          <Anchor href="/parfumers" style={{ textDecoration: 'none', color: '#007bff' }}>
            Парфюмеры
          </Anchor>
          <span style={{ color: '#6c757d' }}>{parfumerName.split(' ').slice(0, 2).join(' ')}</span>
        </Breadcrumbs>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '20px',
            maxWidth: '1380px',
            margin: '50px auto',
          }}
        >
          <div style={{ flex: 1, maxWidth: '1000px' }}>
            <Title size="18px" align="left">
              {' '}
              {parfumerName}
            </Title>

            <Group mb="40" mt="30" position="center">
              <Select
                label="Сортировка"
                placeholder="Выберите сортировку"
                value={sortBy}
                onChange={(value: string) => setSortBy(value)}
                data={[
                  { value: 'A-Z', label: 'От A до Z' },
                  { value: 'Z-A', label: 'От Z до A' },
                  { value: 'popular', label: 'Популярные' },
                  { value: 'unpopular', label: 'Непопулярные' },
                ]}
              />
              <Select
                label="Пол"
                placeholder="Выберите гендер"
                value={genderFilter}
                onChange={(value: string | null) => setGenderFilter(value)}
                data={[
                  { value: 'male', label: 'Мужской' },
                  { value: 'female', label: 'Женский' },
                  { value: 'unisex', label: 'Унисекс' },
                ]}
              />
            </Group>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '10px',
                maxWidth: '100%',
              }}
            >
              <Button
                leftSection={<IconZoomReset size={18} />}
                variant="light"
                color="gray"
                onClick={clearFilters}
              >
                Очистить
              </Button>
              <Button
                onClick={() => setIsListView(!isListView)}
                leftSection={isListView ? <IconGridDots size={18} /> : <IconList size={18} />}
              >
                {isListView ? 'Сетка' : 'Список'}
              </Button>
            </div>

            <div style={{ marginTop: '60px', maxWidth: '1200px' }}>
              {isListView ? (
                <SimpleGrid
                  type="container"
                  cols={{ base: 2, '893px': 2, '720px': 1, '330px': 1, '0px': 1 }}
                  spacing={{ base: '0px', '0px': 'sm' }}
                  style={{ width: '100%' }}
                >
                  {loading
                    ? Array.from({ length: itemsPerPage }).map((_, index) => (
                        <div
                          key={index}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 0',
                            borderBottom: '1px solid #eee',
                          }}
                        >
                          <Skeleton width={50} height={50} radius="8" />
                          <div style={{ flex: 1, marginLeft: '10px' }}>
                            <Skeleton height={16} width="70%" mb={8} />
                            <Skeleton height={14} width="40%" />
                          </div>
                        </div>
                      ))
                    : perfumes.map((perfume) => (
                        <Link
                          href={`/perfumes/${perfume.perfume_id}`}
                          key={perfume._id}
                          style={{ textDecoration: 'none' }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              padding: '10px 0',
                              borderBottom: '1px solid #eee',
                              gap: '10px',
                            }}
                          >
                            <Image
                              src="https://pimages.parfumo.de/240/196014_img-1075-mellifluence-perfume-ericius_240.webp"
                              alt={perfume.name}
                              width={50}
                              height={50}
                              fit="contain"
                              radius="8"
                            />
                            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                              <Text size="sm" weight={500}>
                                {perfume.name}
                              </Text>
                              <Text size="xs">{perfume.brand}</Text>
                              <Group spacing="xs">
                                <Text
                                  size="xs"
                                  color="dimmed"
                                  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                                >
                                  <IconStar size={12} /> {perfume.rating_value} (
                                  {perfume.rating_count} оценок)
                                </Text>
                                <Text
                                  size="xs"
                                  color="dimmed"
                                  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                                >
                                  <IconCalendar size={12} /> {perfume.release_year}
                                </Text>
                                {getGenderIcon(perfume.gender)}
                              </Group>
                            </div>
                          </div>
                        </Link>
                      ))}
                </SimpleGrid>
              ) : (
                <SimpleGrid
                  type="container"
                  cols={{ base: 4, '893px': 4, '720px': 3, '330px': 2, '0px': 1 }}
                  spacing={{ base: '0px', '0px': 'sm', '300px': 'xs' }}
                  style={{ width: '100%' }}
                >
                  {loading
                    ? Array.from({ length: itemsPerPage }).map((_, index) => (
                        <Skeleton
                          key={index}
                          width="100%"
                          height="220px"
                          radius="18"
                          style={{ minWidth: '160px', marginBottom: '20px', maxWidth: '200px' }}
                        />
                      ))
                    : perfumes.map((perfume) => (
                        <Link
                          href={`/perfumes/${perfume.perfume_id}`}
                          key={perfume._id}
                          style={{ textDecoration: 'none' }}
                        >
                          <div
                            style={{
                              minHeight: '220px',
                              maxWidth: '200px',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: '8px',
                              marginBottom: '20px',
                              cursor: 'pointer',
                            }}
                          >
                            <div
                              style={{
                                height: 100,
                                minWidth: '80%',
                                backgroundColor: '#fff',
                                display: 'flex',
                                justifyContent: 'center',
                                borderRadius: '12px',
                              }}
                            >
                              <Image
                                src="https://pimages.parfumo.de/240/196014_img-1075-mellifluence-perfume-ericius_240.webp"
                                alt={perfume.name}
                                fit="contain"
                                width="60px"
                              />
                            </div>
                            <Text
                              weight={500}
                              align="center"
                              size="xs"
                              style={{ overflow: 'hidden' }}
                            >
                              {perfume.name}
                              {getGenderIcon(perfume.gender)}
                            </Text>
                            {perfume.type && (
                              <Badge variant="light" mt="-2px">
                                {perfume.type}
                              </Badge>
                            )}
                            <Group spacing="xs">
                              <Text
                                size="xs"
                                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                              >
                                <IconStar size={16} style={{ color: theme.colors.yellow[6] }} />{' '}
                                {perfume.rating_value} ({perfume.rating_count} оценок)
                              </Text>
                            </Group>
                            <Group spacing="xs">
                              <Text
                                size="xs"
                                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                              >
                                <IconCalendar size={16} style={{ color: theme.colors.blue[6] }} />{' '}
                                {perfume.release_year}
                              </Text>
                            </Group>
                          </div>
                        </Link>
                      ))}
                </SimpleGrid>
              )}
            </div>

            <Group mt="lg" mb="12" style={{ display: 'flex', justifyContent: 'center' }}>
              <Pagination
                page={activePage}
                radius="9px"
                onChange={handlePageChange}
                total={Math.ceil(totalItems / itemsPerPage)}
              />
            </Group>
          </div>

          <Divider orientation="vertical" className="right-notes" />

          <div
            className="right-notes"
            style={{ flex: 1, maxWidth: '250px', textAlign: 'center', marginTop: '180px' }}
          >
            <div
              style={{
                width: '140px',
                height: '140px',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f0f0f0', // You can change this to your preferred background color
                marginBottom: '20px',
                margin: '0 auto 40px auto',
              }}
            >
              <IconUser size={80} />
            </div>
            <Title mb="14" order={4}>
              {parfumerName}
            </Title>
            <Text mb="14">
              Parfumetrika знает {total} парфюм от парфюмера {parfumerName}
            </Text>
          </div>
        </div>
      </div>
      <FooterLinks />
    </>
  );
};

export default PerfumesByParfumer;
