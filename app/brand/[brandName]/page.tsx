'use client';
// @ts-ignore: Temporary ignore TypeScript error
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
  IconZoomReset,
  IconGridDots,
  IconList,
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

const PerfumesByBrand = () => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const [isListView, setIsListView] = useState(false);
  const params = useParams();
  const brandSlug = Array.isArray(params.brandName) ? params.brandName[0] : params.brandName;

  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activePage, setActivePage] = useState<number>(1);
  const itemsPerPage = 20;
  const [totalItems, setTotalItems] = useState<number>(0);
  const [brandName, setBrandName] = useState<string>(''); // Название бренда
  const [total, setTotal] = useState<number>(0); // Общее количество духов
  console.log(brandName);
  const [sortBy, setSortBy] = useState<string>('popular');
  const [genderFilter, setGenderFilter] = useState<string | null>(null);

  useEffect(() => {
    if (brandSlug) {
      fetchPerfumesByBrand(brandSlug, activePage, sortBy, genderFilter);
    }
  }, [brandSlug, activePage, sortBy, genderFilter]);

  const fetchPerfumesByBrand = async (
    slug: string,
    page: number,
    sortBy: string,
    gender: string | null
  ) => {
    setLoading(true);
    try {
      const response = await $api.get(`/brands/perfumes`, {
        params: { slug: slug, page: page, limit: itemsPerPage, sortBy: sortBy, gender: gender },
      });

      setPerfumes(response.data.perfumes);
      setTotalItems(response.data.total);
      setBrandName(response.data.brandName);
      setTotal(response.data.total); // Устанавливаем общее количество духов
    } catch (err: any) {
      setError(err.response?.data?.message || 'Не удалось получить парфюмы');
    } finally {
      setLoading(false);
    }
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
  const title = `${brandName} – Все Ароматы бренда с отзывами в одном месте – Parfumetrika`;
  return (
    <>
      <head>
        <title>{title}</title>
        <meta
          name="description"
          content={`Узнайте больше о парфюмах ${brandName}: подробные обзоры, реальные отзывы и рекомендации по выбору ароматов. Следите за новинками и актуальными новостями бренда.`}
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
        <Breadcrumbs separator=">" style={{ fontSize: '14px', color: '#555', marginTop: '0px' }}>
          <Anchor href="/" style={{ textDecoration: 'none', color: '#007bff' }}>
            Главная
          </Anchor>
          <Anchor href="/" style={{ textDecoration: 'none', color: '#007bff' }}>
            Бренды
          </Anchor>
          <span style={{ color: '#6c757d' }}>{brandName}</span>
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
            <Title order={2} style={{ textAlign: 'left' }}>
              {brandName}
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
              {/* Conditional rendering for list or grid view */}
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
                            <Group spacing="xs" mt={6}>
                              <Skeleton width={20} height={12} />
                              <Skeleton width={50} height={12} />
                              <Skeleton width={30} height={12} />
                            </Group>
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
                              justifyContent: 'flex-start',
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
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                flex: 1,
                              }}
                            >
                              <Text size="sm" w="300px" weight={500}>
                                {perfume.name}
                              </Text>
                              <Text size="xs">{perfume.brand}</Text>
                              <Group spacing="xs" style={{ display: 'flex', alignItems: 'center' }}>
                                <Text
                                  size="xs"
                                  color="dimmed"
                                  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                                >
                                  <IconStar size={12} style={{ verticalAlign: 'middle' }} />{' '}
                                  {perfume.rating_value} ({perfume.rating_count} оценок)
                                </Text>
                                <Text
                                  size="xs"
                                  color="dimmed"
                                  style={{ display: 'flex', alignItems: 'center', gap: '0px' }}
                                >
                                  <IconCalendar size={12} style={{ verticalAlign: 'middle' }} />{' '}
                                  {perfume.release_year}
                                </Text>
                                <Text ml="-14" style={{ display: 'flex', alignItems: 'center' }}>
                                  {getGenderIcon(perfume.gender)}
                                </Text>
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
                          style={{
                            minWidth: '160px',
                            margin: '0 auto',
                            marginBottom: '20px',
                            maxWidth: '200px',
                          }}
                        />
                      ))
                    : perfumes?.map((perfume) => (
                        <Link
                          href={`/perfumes/${perfume.perfume_id}`}
                          key={perfume._id}
                          style={{ textDecoration: 'none' }}
                        >
                          <div
                            key={perfume._id}
                            style={{
                              minHeight: '220px',
                              maxWidth: '200px',
                              width: '100%',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: '8px',
                              minWidth: '160px',
                              marginBottom: '20px',
                              margin: '0 auto',
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
                                maxWidth: '150px',
                              }}
                            >
                              <Image
                                src={`https://parfumetrika.ru/${perfume.main_image}`}
                                alt={perfume.name}
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement; // Явно указываем, что target — это изображение
                                  target.src = '/roman.jpg'; // Подмена изображения при ошибке загрузки
                                }}
                                fit="contain"
                                width="60px"
                              />
                            </div>
                            <Text
                              weight={500}
                              w="180px"
                              mt="4px"
                              align="center"
                              size="xs"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexWrap: 'wrap',
                                overflow: 'hidden',
                              }}
                            >
                              {perfume.name}
                              {getGenderIcon(perfume.gender)}
                            </Text>

                            {perfume.type && (
                              <Badge variant="light" mt="-2px" mb="2px" align="center">
                                {perfume.type}
                              </Badge>
                            )}

                            <Group spacing="xs" style={{ display: 'flex', alignItems: 'center' }}>
                              <Text
                                size="xs"
                                style={{
                                  color: 'var(--mantine-color-text)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                }}
                              >
                                <IconStar size={16} style={{ color: theme.colors.yellow[6] }} />{' '}
                                {perfume.rating_value} ({perfume.rating_count} оценок)
                              </Text>
                            </Group>

                            <Group spacing="xs" style={{ display: 'flex', alignItems: 'center' }}>
                              <Text
                                size="xs"
                                style={{
                                  color: 'var(--mantine-color-text)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                }}
                                align="center"
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

          {/* Описание бренда на правой стороне */}
          <div
            className="right-notes"
            style={{ flex: 1, maxWidth: '300px', textAlign: 'center', marginTop: '180px' }}
          >
            <Image
              src="https://pimages.parfumo.de/240/28793_vmydj8q4ca_240.webp"
              alt={brandName}
              style={{ borderRadius: '50%' }}
            />
            <Title mb="14" order={4}>
              {brandName}
            </Title>
            <Text mb="14">
              В коллекции {brandName} есть {total} парфюмов.
            </Text>
          </div>
        </div>
      </div>
      <FooterLinks />
    </>
  );
};

export default PerfumesByBrand;
