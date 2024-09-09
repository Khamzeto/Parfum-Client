'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Text, Container, Title, SimpleGrid, Image, Card, Badge, Pagination, Group, Skeleton, useMantineTheme } from '@mantine/core';
import { IconMars, IconVenus, IconGenderBigender } from '@tabler/icons-react';
import $api from '@/components/api/axiosInstance';
import { Header } from '@/components/Header/Header';
import Link from 'next/link';

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
  const params = useParams();
  const brandSlug = params.brandName;

  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activePage, setActivePage] = useState<number>(1);
  const itemsPerPage = 20; 
  const [totalItems, setTotalItems] = useState<number>(0);

  useEffect(() => {
    if (brandSlug) {
      fetchPerfumesByBrand(brandSlug, activePage);
    }
  }, [brandSlug, activePage]);

  const fetchPerfumesByBrand = async (slug: string, page: number) => {
    setLoading(true); // Показать скелетоны при начале загрузки данных
    try {
      const response = await $api.get(`/brands/perfumes`, {
        params: { slug: slug, page: page, limit: itemsPerPage }
      });

      setPerfumes(response.data.perfumes);
      setTotalItems(response.data.total);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch perfumes');
    } finally {
      setLoading(false); // Скрыть скелетоны после завершения загрузки данных
    }
  };

  const formatImageUrl = (url: string) => {
    const baseURL = 'http://81.29.136.136:3001/';
    const defaultImage = 'https://pimages.parfumo.de/240/119838_img-8861-a__e__ariana__evans-platinum_240.webp';
    return url ? baseURL + url.replace(/\\/g, '/') : defaultImage;
  };

  const getGenderIcon = (gender: string) => {
    switch (gender.toLowerCase()) {
      case 'male':
        return <IconMars size={20} color={theme.colors.blue[6]} style={{ verticalAlign: 'middle', marginLeft: 4 }} />;
      case 'female':
        return <IconVenus size={20} color={theme.colors.pink[6]} style={{ verticalAlign: 'middle', marginLeft: 4 }} />;
      case 'unisex':
        return <IconGenderBigender size={20} color={theme.colors.green[6]} style={{ verticalAlign: 'middle', marginLeft: 4 }} />;
      default:
        return null;
    }
  };

  const handlePageChange = (page: number) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Прокрутка страницы вверх при смене страницы
  };

  if (error) return <Text color="red">{error}</Text>;

  return (
    <>
      <Header />
      <Container style={{ marginTop: '50px', width: '100%', alignItems: 'center', resize: 'horizontal' }}>
        <Title order={2} align="center">Парфюмы бренда {brandSlug.replace(/_/g, ' ')}</Title>

        {/* Используем SimpleGrid с адаптивными столбцами и расстоянием */}
        <SimpleGrid
          type="container"
          cols={{ base: 4, '893px': 4, '720px': 3, '300px': 2, '0px': 1 }} // Устанавливаем количество столбцов в зависимости от ширины экрана
          spacing={{ base: 'md', '500px': 'sm', '300px': 'xs' }} // Устанавливаем расстояние между элементами в зависимости от ширины экрана
          style={{ marginTop: '40px', width: '100%' }}
        >
          {loading ? (
            // Если идет загрузка, показываем скелетоны вместо карточек
            Array.from({ length: itemsPerPage }).map((_, index) => (
              <Skeleton
                key={index}
                width="100%"
                height="220px" // Matching minHeight of the card div
                radius="18"
                style={{
                  minWidth: '160px', // Matching minWidth of the card div
                  margin: '0 auto',
                  marginBottom: '20px',
                  maxWidth: '200px' // Matching marginBottom of the card div
                }}
              >
                <div
                  style={{
                    minHeight: '220px', // Matching the minHeight of the card div
                    maxWidth: '200px', // Matching maxWidth of the card div
                    width: '100%',
                    display: 'flex',  
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    minWidth: '160px', // Matching minWidth of the card div
                    marginBottom: '20px',
                    margin: '0 auto',// Matching marginBottom of the card div
                  }}
                ></div>
              </Skeleton>
            ))
          ) : (
            perfumes.map((perfume) => (
              <Link href={`/perfumes/${perfume.perfume_id}`} key={perfume._id} style={{ textDecoration: 'none' }}>
              <div key={perfume._id}  style={{ minHeight: '220px', maxWidth: '200px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',  minWidth: '160px', marginBottom: '20px',margin: '0 auto',cursor: 'pointer' }}>
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
                    src='https://pimages.parfumo.de/240/28793_vmydj8q4ca_240.webp'
                    alt={perfume.name}
                    fit="contain"
                    width='60px'
               
                  />
                </div>

                <Text
                  weight={500}
                  mt="md"
                  align="center"
                  size="xs"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
             
                    overflow: 'hidden',
             
                  }}
                >
                  {perfume.name} {getGenderIcon(perfume.gender)}
                </Text>

                {perfume.type && (
                  <Badge variant="light" mt="-2px" mb="2px" align="center">
                    {perfume.type}
                  </Badge>
                )}

                <Text size="xs" color="dimmed" align="center">
                  Год выпуска: {perfume.release_year}
                </Text>
                <Text size="xs" color="dimmed" align="center">
                  Рейтинг: {perfume.rating_value} ({perfume.rating_count} отзывов)
                </Text>
              </div>
              </Link>
            ))
          )}
        </SimpleGrid>

        {/* Контролы пагинации */}
        <Group mt="lg" mb="12" style={{ display: 'flex', justifyContent: 'center' }}>
          <Pagination
            page={activePage}
            radius='9px'
            onChange={handlePageChange} // Обработчик для изменения страницы
            total={Math.ceil(totalItems / itemsPerPage)}
          />
        </Group>
      </Container>
    </>
  );
};

export default PerfumesByBrand;
