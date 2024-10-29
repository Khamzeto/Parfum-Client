'use client';
import { useState, useEffect } from 'react';
import {
  TextInput,
  Button,
  Group,
  Box,
  Title,
  Badge,
  Anchor,
  Text,
  Card,
  Image,
  Loader,
  Stack,
  Container,
  SegmentedControl,
  Pagination,
} from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import $api from '@/components/api/axiosInstance';
import styles from './Similiar.module.css'; // Импортируем стили из CSS-модуля
import { Header } from '@/components/Header/Header';

interface SimilarPerfume {
  _id: string;
  name: string;
  perfume_id: string;
}

interface Perfume {
  name: string;
  brand: string;
  gender: string;
  type: string;
  main_image: string;
  similar_perfume_details: SimilarPerfume[] | null;
}

const PerfumeSearch = () => {
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female' | 'unisex'>('all');
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1); // Текущая страница
  const [totalPages, setTotalPages] = useState(1); // Всего страниц

  // Получаем парфюмы с похожими парфюмами из API
  useEffect(() => {
    fetchPerfumes();
  }, [genderFilter, currentPage]); // Обновляем парфюмы при смене фильтра или страницы

  const fetchPerfumes = async () => {
    setLoading(true);
    try {
      const response = await $api('/perfumes/similar', {
        params: {
          query: searchQuery,
          gender: genderFilter === 'all' ? undefined : genderFilter,
          page: currentPage, // Передаем текущую страницу
        },
      });
      setPerfumes(response.data.perfumes);
      setTotalPages(response.data.totalPages); // Устанавливаем общее количество страниц
    } catch (err) {
      console.error('Ошибка при получении парфюмов:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.currentTarget.value);
  };

  const handleGenderFilterChange = (value: 'all' | 'male' | 'female' | 'unisex') => {
    setGenderFilter(value);
    setCurrentPage(1); // Сбрасываем на первую страницу при изменении фильтра
    fetchPerfumes(); // Обновляем парфюмы при выборе фильтра
  };

  const handleSearch = () => {
    setCurrentPage(1); // При поиске возвращаемся на первую страницу
    fetchPerfumes();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page); // Меняем текущую страницу
  };

  return (
    <>
      <Header />
      <Container size="lg" mt="xl">
        <Title order={2} pos="left" mb="30" style={{ fontWeight: 700 }}>
          Найдите дубликаты ваших любимых парфюмов
        </Title>

        <Stack spacing="lg">
          <TextInput
            placeholder="Поиск дубликатов..."
            leftSection={<IconSearch />}
            size="md"
            value={searchQuery}
            onChange={handleSearchChange}
            rightSection={
              <Button
                variant="light"
                style={{ position: 'absolute', right: '10px' }}
                onClick={handleSearch}
                size="xs"
              >
                Поиск
              </Button>
            }
          />

          {/* SegmentedControl для фильтров по полу */}
          <SegmentedControl
            fullWidth
            value={genderFilter}
            onChange={handleGenderFilterChange}
            data={[
              { label: 'Все', value: 'all' },
              { label: 'Женский', value: 'female' },
              { label: 'Мужской', value: 'male' },
              { label: 'Унисекс', value: 'unisex' },
            ]}
            styles={{
              root: { display: 'flex', justifyContent: 'center', marginTop: '20px' },
              label: { fontWeight: 500 },
            }}
          />
        </Stack>

        <Title order={4} mt="lg" mb="lg">
          Популярные дубликаты
        </Title>

        {loading ? (
          <Loader size="lg" variant="dots" style={{ display: 'block', margin: '20px auto' }} />
        ) : (
          <>
            <div className={styles.cardContainer}>
              {perfumes.map((perfume, index) => (
                <Card
                  key={index}
                  className={styles.perfumeCard} // Используем стили из модуля
                >
                  {/* Основная информация о парфюме */}
                  <Group align="flex-start" spacing="md" className={styles.groupContainer}>
                    <Image
                      src="https://pimages.parfumo.de/720/1_img-3571-prada-amber_pour_homme_eau_de_toilette_720.webp"
                      alt={perfume.name}
                      width={80}
                      height={80}
                      radius="md"
                      withPlaceholder
                    />
                    <div className={styles.perfumeDetails}>
                      <Text weight={600} size="lg" style={{ marginBottom: '4px' }}>
                        {perfume.name}
                      </Text>
                      <Text size="sm" color="dimmed" style={{ marginBottom: '4px' }}>
                        {perfume.brand || 'Неизвестный бренд'}
                      </Text>
                      <Badge size="sm" color="teal">
                        {perfume.type || 'Неизвестный тип'}
                      </Badge>
                    </div>
                  </Group>

                  {/* Похожие парфюмы, если они есть */}
                  {perfume.similar_perfume_details && perfume.similar_perfume_details.length > 0 ? (
                    <Box
                      mt="md"
                      style={{
                        borderLeft: '3px solid #dfe2e6',
                        paddingLeft: '10px',
                      }}
                    >
                      <Title order={6} mb="xs" style={{ fontWeight: 500 }}>
                        Похожие парфюмы:
                      </Title>
                      {perfume.similar_perfume_details.slice(0, 4).map((similar, similarIndex) => (
                        <Group key={similarIndex} style={{ display: 'flex', gap: '2px' }}>
                          {/* Круглый контейнер с белым фоном и изображением */}
                          <div className={styles.roundImageContainer}>
                            <img
                              src="https://piimages.parfumo.de/5/6/1_2c79fe1e1e26a88a33d679862e643e67_amber_pour_homme_eau_de_toilette_150.webp"
                              alt={similar.name}
                              className={styles.roundImage} // Используем стили для изображения
                            />
                          </div>
                          <Anchor
                            href={`/perfumes/${similar.perfume_id}`}
                            style={{ textDecoration: 'none', fontSize: '14px' }}
                            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'none')}
                            onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                          >
                            {similar.name}
                          </Anchor>
                        </Group>
                      ))}

                      {/* Если больше 4 похожих парфюмов, выводим кнопку "Показать еще" */}
                      {perfume.similar_perfume_details.length > 4 && (
                        <Button
                          variant="subtle"
                          size="xs"
                          mt="xs"
                          style={{ display: 'flex', justifyContent: 'center' }}
                          onClick={() => alert('Показать еще похожие парфюмы')}
                        >
                          Показать еще
                        </Button>
                      )}
                    </Box>
                  ) : (
                    <Text size="sm" color="dimmed" mt="sm">
                      Похожие парфюмы не найдены.
                    </Text>
                  )}
                </Card>
              ))}
            </div>

            {/* Пагинация */}
            <Pagination
              value={currentPage}
              onChange={handlePageChange}
              total={totalPages}
              mt="lg"
              mb="20"
              radius="9"
            />
          </>
        )}
      </Container>
    </>
  );
};

export default PerfumeSearch;
