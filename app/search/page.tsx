'use client';

import { useEffect, useState } from 'react';
import { Text, Title, Image, Badge, Pagination, Group, Skeleton, Select, MultiSelect, useMantineTheme, Drawer, Button, SimpleGrid, useMantineColorScheme, Breadcrumbs, Anchor } from '@mantine/core';
import { IconMars, IconVenus, IconGenderBigender, IconFilter, IconList, IconGridDots, IconZoomReset, IconStar, IconCalendar, IconSearch } from '@tabler/icons-react';
import $api from '@/components/api/axiosInstance';
import { Header } from '@/components/Header/Header';
import Link from 'next/link';
import SearchInput from '@/components/ui/InputSearch/InputSearch';
import { useSearchParams } from 'next/navigation';

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

const PerfumesPage = () => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme(); // Получаем текущую цветовую схему

  const isDark = colorScheme === 'dark'; 

  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activePage, setActivePage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isListView, setIsListView] = useState(false); // Состояние для отслеживания режима отображения

  const itemsPerPage = 20;

  // Фильтры и сортировка
  const [gender, setGender] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('popular');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [releaseYear, setReleaseYear] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const queryParam = searchParams.get('query'); // Для парфюмов
  const queryBrandParam = searchParams.get('queryBrand'); // Для брендов
  const queryParfumerParam = searchParams.get('queryParfumer'); // Для парфюмеров

  // Определяем тип поиска
  let searchType = 'perfumes';
  if (queryBrandParam) {
    searchType = 'brands';
  } else if (queryParfumerParam) {
    searchType = 'parfumers';
  }

  const searchQuery = queryParam || queryBrandParam || queryParfumerParam || '';

  useEffect(() => {
    if (queryBrandParam) {
      setSelectedBrands([queryBrandParam]);
    }
  }, [queryBrandParam]);

  console.log(searchQuery);

  useEffect(() => {
    fetchData(activePage);
  }, [activePage, sortBy, gender, selectedBrands, releaseYear, searchQuery, searchType]);

  const fetchData = async (page: number) => {
    setLoading(true);
    try {
      const params: any = { 
        page: page, 
        limit: itemsPerPage, 
        sortBy: sortBy,
        gender: gender,
        brands: selectedBrands,
        year: releaseYear,
      };

      if (searchQuery) {
        params.query = searchQuery; // Используем 'query' для всех типов поиска

        if (searchType === 'perfumes') {
          const response = await $api.get('/perfumes/search', { params });
          setPerfumes(response.data.perfumes);
          setTotalPages(response.data.totalPages);
          setActivePage(response.data.currentPage);
        } else if (searchType === 'brands') {
          const response = await $api.get('/perfumes/searchBrands', { params });
          setPerfumes(response.data.brands);
          setTotalPages(response.data.totalPages);
          setActivePage(response.data.currentPage);
        } else if (searchType === 'parfumers') {
          params.parfumer = searchQuery;
          const response = await $api.get('/perfumes', { params });
          setPerfumes(response.data.perfumes);
          setTotalPages(response.data.totalPages);
          setActivePage(response.data.currentPage);
        }
      } else {
        const response = await $api.get('/perfumes', { params });
        setPerfumes(response.data.perfumes);
        setTotalPages(response.data.totalPages);
        setActivePage(response.data.currentPage);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Не удалось получить данные');
    } finally {
      setLoading(false);
    }
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const genderOptions = [
    { value: 'male', label: 'Мужской' },
    { value: 'female', label: 'Женский' },
    { value: 'unisex', label: 'Унисекс' },
  ];

  const sortOptions = [
    { value: 'popular', label: 'Популярные' },
    { value: 'unpopular', label: 'Непопулярные' },
    { value: 'newest', label: 'Новейшие' },
  ];

  const brandOptions = [
    { value: 'Brand1', label: 'Brand1' },
    { value: 'Brand2', label: 'Brand2' },
  ];

  return (
    <>
      <Header />
      <SearchInput />
      <div style={{ marginTop: '50px', width: '100%', alignItems: 'center', maxWidth: '1440px', justifyContent: 'center', margin: '0 auto', paddingLeft: '20px', paddingRight: '20px'}}>
   
        <Breadcrumbs separator=">" style={{ fontSize: '14px', color: '#555', marginTop: '50px' }}>
          <Anchor href="/" style={{ textDecoration: 'none', color: '#007bff' }}>
            Главная
          </Anchor>
          <span style={{ color: '#6c757d' }}>Поиск</span>
        </Breadcrumbs>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', marginTop: '30px' }}>
          <div style={{ display: 'flex', flexDirection: 'column',gap: '10px' }}>
            <Button 
              leftSection={<IconZoomReset size={18} />}
              variant="light" 
              color="gray"
            >
              Очистить
            </Button>
            {searchQuery && (
              <div style={{

                backgroundColor: '#a0a3b1', 
                padding: '6px 16px', 
                borderRadius: '8px', 
                display: 'inline-flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                width: 'fit-content',
                color: '#fff'
              }}>
                <IconSearch size={16} style={{ marginRight: '8px' }} />
                <Text size="sm" weight={500} style={{ marginRight: '8px' }}>
                  {searchQuery}
                </Text>
                <span
                  style={{
                    fontSize: '16px',
                    cursor: 'pointer',
                    color: '#fff'
                  }}
                  onClick={() => {/* Add your clear logic here */}}
                >
                  &times;
                </span>
              </div>
            )}
          </div>
          <div style={{display: 'flex',flexDirection: 'column', alignItems: 'flex-start',justifyContent: 'center',gap: '10px'}}>
          <Button
          className='filter-mobile'
          leftSection={<IconFilter />}
          variant="light"
          onClick={() => setIsDrawerOpen(true)}
          style={{}}
        >
          Фильтры
        </Button>

          <Button
            onClick={() => setIsListView(!isListView)}
            leftSection={isListView ? <IconGridDots size={18} /> : <IconList size={18} />}
          >
            {isListView ? 'Сетка' : 'Список'}
          </Button>
          </div>
          
        </div>

   

        <Drawer
          opened={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          title="Фильтры"
          padding="md"
          size="lg"
          position="right"
        >
          <Select
            label="Пол"
            placeholder="Выберите пол"
            data={genderOptions}
            value={gender}
            onChange={setGender}
            clearable
          />

          <Select
            label="Сортировка"
            placeholder="Выберите"
            data={sortOptions}
            value={sortBy}
            onChange={setSortBy}
          />

          <MultiSelect
            label="Бренды"
            placeholder="Выберите бренды"
            data={brandOptions}
            value={selectedBrands}
            onChange={setSelectedBrands}
          />

          <Select
            label="Год выпуска"
            placeholder="Выберите год"
            data={[
              { value: '2023', label: '2023' },
              { value: '2022', label: '2022' },
            ]}
            value={releaseYear}
            onChange={setReleaseYear}
            clearable
          />
        </Drawer>

        <div style={{ marginTop: '60px' }}>
          {/* Фильтры для десктопа */}
          <div 
            className='desktopFilter'
            style={{
              display: 'flex', 
              border: `1px solid ${isDark ? 'var(--mantine-color-dark-4)' : 'var(--mantine-color-gray-4)'}`,
              borderRadius: '12px',
              float: 'left',
              marginRight: '36px',
              minWidth: '200px',
              marginLeft: '0px',
              position: 'sticky',
              padding: '20px',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <Select
              label="Пол"
              placeholder="Выберите пол"
              data={genderOptions}
              value={gender}
              onChange={setGender}
              clearable
            />

            <Select
              label="Сортировка"
              placeholder="Выберите"
              data={sortOptions}
              value={sortBy}
              onChange={setSortBy}
            />

            <MultiSelect
              label="Бренды"
              placeholder="Выберите бренды"
              data={brandOptions}
              value={selectedBrands}
              onChange={setSelectedBrands}
            />

            <Select
              label="Год выпуска"
              placeholder="Выберите год"
              data={[
                { value: '2023', label: '2023' },
                { value: '2022', label: '2022' },
              ]}
              value={releaseYear}
              onChange={setReleaseYear}
              clearable
            />
          </div>

          {isListView ? (
            <SimpleGrid
              type="container"
              cols={{ base: 2, '893px': 2, '720px': 1, '330px': 1, '0px': 1 }}
              spacing={{ base: '0px', '0px': 'sm' }}
              style={{ width: '100%' }}
            >
              {loading ? (
                Array.from({ length: itemsPerPage }).map((_, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #eee' }}>
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
              ) : (
                perfumes.map((perfume) => (
                  <Link href={`/perfumes/${perfume.perfume_id}`} key={perfume._id} style={{ textDecoration: 'none' }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'flex-start',  
                      padding: '10px 0', 
                      borderBottom: '1px solid #eee',
                      gap: '10px' 
                    }}>
                      <Image 
                        src='https://pimages.parfumo.de/240/20666_img-6310-xerjoff-40-knots_240.webp'
                        alt={perfume.name} 
                        width={50} 
                        height={50} 
                        fit="contain" 
                        radius='8'
                      />
                      <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        justifyContent: 'center',
                        flex: 1 
                      }}>
                        <Text size="sm" w='300px' weight={500}>{perfume.name}</Text>
                        <Text size="xs">{perfume.brand}</Text>
                        <Group spacing="xs" style={{ display: 'flex', alignItems: 'center' }}>
                          <Text size="xs" color="dimmed" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <IconStar size={12} style={{ verticalAlign: 'middle' }} /> {perfume.rating_value} ({perfume.rating_count} отзывов)
                          </Text>
                          <Text size="xs" color="dimmed" style={{ display: 'flex', alignItems: 'center', gap: '0px' }}>
                            <IconCalendar size={12} style={{ verticalAlign: 'middle' }} /> {perfume.release_year}
                          </Text>
                          <Text ml='-14' style={{ display: 'flex', alignItems: 'center' }}>
                            {getGenderIcon(perfume.gender)}
                          </Text>
                        </Group>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </SimpleGrid>
          ) : (
            <SimpleGrid
              type="container"
              cols={{ base: 4, '893px': 4, '720px': 3, '330px': 2, '0px': 1 }}
              spacing={{ base: '0px', '0px': 'sm', '300px': 'xs' }}
              style={{ width: '100%' }}
            >
              {loading ? (
                Array.from({ length: itemsPerPage }).map((_, index) => (
                  <Skeleton
                    key={index}
                    width="100%"
                    height="220px"
                    radius="18"
                    style={{
                      minWidth: '160px',
                      margin: '0 auto',
                      marginBottom: '20px',
                      maxWidth: '200px'
                    }}
                  />
                ))
              ) : (
                perfumes?.map((perfume) => (
                  <Link href={`/perfumes/${perfume.perfume_id}`} key={perfume._id} style={{ textDecoration: 'none' }}>
                    <div key={perfume._id} style={{ minHeight: '220px', maxWidth: '200px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minWidth: '160px', marginBottom: '20px', margin: '0 auto', cursor: 'pointer' }}>
                      <div style={{ height: 100, minWidth: '80%', backgroundColor: '#fff', display: 'flex', justifyContent: 'center', borderRadius: '12px', maxWidth: '150px' }}>
                        <Image src='https://pimages.parfumo.de/240/20666_img-6310-xerjoff-40-knots_240.webp' alt={perfume.name} fit="contain" width='60px' />
                      </div>
                      <Text
                        weight={500}
                        w='180px'
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
                        <Text size="xs" style={{ color: 'var(--mantine-color-text)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <IconStar size={16} style={{ color: theme.colors.yellow[6] }} /> {perfume.rating_value} ({perfume.rating_count} отзывов)
                        </Text>
                      </Group>

                      <Group spacing="xs" style={{ display: 'flex', alignItems: 'center' }}>
                        <Text size="xs" style={{ color: 'var(--mantine-color-text)', display: 'flex', alignItems: 'center', gap: '4px' }} align="center">
                          <IconCalendar size={16} style={{ color: theme.colors.blue[6] }} /> {perfume.release_year}
                        </Text>
                      </Group>
                    </div>
                  </Link>
                ))
              )}
            </SimpleGrid>
          )}
        </div>

        <Group mt="lg" mb="12" style={{ display: 'flex', justifyContent: 'center' }}>
          <Pagination
            page={activePage}
            radius="8"
            onChange={handlePageChange}
            total={totalPages}
          />
        </Group>
      </div>
    </>
  );
};

export default PerfumesPage;
