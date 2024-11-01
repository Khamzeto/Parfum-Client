'use client';
import { useState, useEffect } from 'react';
import debounce from 'lodash.debounce';
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
import { useClickOutside } from '@mantine/hooks';
import $api from '@/components/api/axiosInstance';
import styles from './Similiar.module.css';
import { Header } from '@/components/Header/Header';
import { FooterLinks } from '@/components/ui/Footer/Footer';

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
  const [suggestions, setSuggestions] = useState<{ name: string; _id: string }[]>([]);
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female' | 'unisex'>('all');
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const suggestionsRef = useClickOutside(() => setShowSuggestions(false));

  useEffect(() => {
    fetchPerfumes(); // Загружаем данные при первой загрузке
  }, [genderFilter, currentPage]);

  const fetchPerfumes = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await $api.get('/perfumes/similar', {
        params: {
          query: searchQuery || undefined, // Если нет запроса, передаем `undefined`
          gender: genderFilter === 'all' ? undefined : genderFilter,
          page: currentPage,
          limit: 8,
        },
      });
      setPerfumes(response.data.perfumes);
      setTotalPages(response.data.totalPages);
      if (response.data.perfumes.length === 0) {
        setErrorMessage('К сожалению, мы не нашли подходящие ароматы. Попробуйте изменить запрос.');
      }
    } catch (err) {
      setErrorMessage('Произошла ошибка при загрузке данных. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = debounce(async (query: string) => {
    if (!query) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    try {
      const response = await $api.get('/perfumes/search', {
        params: { query, page: 1, limit: 8 },
      });
      setSuggestions(
        response.data.results.map((item: any) => ({ name: item.name, _id: item._id }))
      );
      setShowSuggestions(true);
    } catch (err) {
      console.error('Ошибка при получении предложений:', err);
    }
  }, 300);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.currentTarget.value;
    setSearchQuery(query);
    fetchSuggestions(query);
  };

  const handleSearch = () => {
    setShowSuggestions(false);
    setCurrentPage(1);
    fetchPerfumes();
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    setCurrentPage(1);
    fetchPerfumes();
  };

  const handleGenderFilterChange = (value: 'all' | 'male' | 'female' | 'unisex') => {
    setGenderFilter(value);
    setCurrentPage(1);
    setErrorMessage('');
    setShowSuggestions(false); // Закрываем список предложений
    fetchPerfumes();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <head>
        <title>Список всех похожих ароматов с функцией поиска - Parfumetrika</title>
        <meta
          name="description"
          content="Ищете ароматы, похожие на ваши любимые? Ознакомьтесь с подборками похожих композиций и откройте для себя новые ароматы, которые могут стать вашими новыми фаворитами."
        />
        <meta
          name="keywords"
          content="Perfume, Fragrance, Reviews, Perfume details, Popular perfumes"
        />
      </head>
      <Header />
      <Container size="lg" mt="xl">
        <Title order={2} pos="left" mb="30" style={{ fontWeight: 700 }}>
          Найдите похожие ароматы по звучанию
        </Title>

        <Stack spacing="lg">
          <Box style={{ position: 'relative' }}>
            <TextInput
              placeholder="Введите название"
              leftSection={<IconSearch />}
              size="md"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setShowSuggestions(true)}
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
            {showSuggestions && suggestions.length > 0 && (
              <Box
                ref={suggestionsRef}
                style={{
                  position: 'absolute',
                  zIndex: 10,
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: 'white',
                  border: '1px solid #eaeaea',
                  borderRadius: '4px',
                  maxHeight: '200px',
                  overflowY: 'auto',
                }}
              >
                {suggestions.map((suggestion) => (
                  <Text
                    key={suggestion._id}
                    size="sm"
                    style={{
                      padding: '10px',
                      cursor: 'pointer',
                      borderBottom: '1px solid #eaeaea',
                    }}
                    onClick={() => handleSuggestionClick(suggestion.name)}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {suggestion.name}
                  </Text>
                ))}
              </Box>
            )}
          </Box>

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
          Популярные у пользователей
        </Title>

        {loading ? (
          <Loader size="lg" variant="dots" style={{ display: 'block', margin: '20px auto' }} />
        ) : errorMessage ? (
          <Text size="lg" color="dimmed" align="center" mt="xl">
            {errorMessage}
          </Text>
        ) : (
          <>
            <div className={styles.cardContainer}>
              {perfumes.map((perfume, index) => (
                <Card key={index} className={styles.perfumeCard}>
                  <Group align="flex-start" spacing="md" className={styles.groupContainer}>
                    <Image
                      src={
                        perfume.main_image ||
                        'https://pimages.parfumo.de/720/1_img-3571-prada-amber_pour_homme_eau_de_toilette_720.webp'
                      }
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

                  {perfume.similar_perfume_details && perfume.similar_perfume_details.length > 0 ? (
                    <Box mt="md" style={{ borderLeft: '3px solid #dfe2e6', paddingLeft: '10px' }}>
                      <Title order={6} mb="xs" style={{ fontWeight: 500 }}>
                        Похожие парфюмы:
                      </Title>
                      {perfume.similar_perfume_details.slice(0, 4).map((similar, similarIndex) => (
                        <Group key={similarIndex} style={{ display: 'flex', gap: '2px' }}>
                          <div className={styles.roundImageContainer}>
                            <img
                              src="https://piimages.parfumo.de/5/6/1_2c79fe1e1e26a88a33d679862e643e67_amber_pour_homme_eau_de_toilette_150.webp"
                              alt={similar.name}
                              className={styles.roundImage}
                            />
                          </div>
                          <Anchor
                            href={`/perfumes/${similar.perfume_id}`}
                            style={{ textDecoration: 'none', fontSize: '14px' }}
                          >
                            {similar.name}
                          </Anchor>
                        </Group>
                      ))}
                      {perfume.similar_perfume_details.length > 4 && (
                        <Button
                          variant="subtle"
                          size="xs"
                          mt="xs"
                          style={{ display: 'flex', justifyContent: 'center' }}
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
      <FooterLinks />
    </>
  );
};

export default PerfumeSearch;
