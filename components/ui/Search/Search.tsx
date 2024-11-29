'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import {
  Text,
  Image,
  Badge,
  Pagination,
  Group,
  Skeleton,
  Select,
  TextInput,
  useMantineTheme,
  Drawer,
  Button,
  SimpleGrid,
  useMantineColorScheme,
  Breadcrumbs,
  Anchor,
  TagsInput,
  Autocomplete,
} from '@mantine/core';
import {
  IconMars,
  IconVenus,
  IconGenderBigender,
  IconFilter,
  IconList,
  IconGridDots,
  IconZoomReset,
  IconStar,
  IconCalendar,
  IconSearch,
} from '@tabler/icons-react';
import debounce from 'lodash.debounce';
import axios from 'axios';
import $api from '@/components/api/axiosInstance';
import { Header } from '@/components/Header/Header';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';

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

const SearchPage = () => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  const isDark = colorScheme === 'dark';
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [nameFilter, setNameFilter] = useState(searchParams.get('query') || '');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setSelectedBrands([]);

      const params = new URLSearchParams(searchParams.toString());
      if (nameFilter) {
        params.set('query', nameFilter);
      } else {
        params.delete('query');
      }

      // Обновляем URL только при нажатии Enter
      window.history.replaceState({}, '', `${pathname}?${params.toString()}`);
      window.location.reload();
    }
  };

  const updateUrlParams = (paramKey: string, paramValue: string | null) => {
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const params = new URLSearchParams(url.search);

    if (paramValue) {
      params.set(paramKey, paramValue);
      window.location.reload();
    } else {
      params.delete(paramKey);
    }

    url.search = params.toString();
    window.history.pushState({}, '', url.toString());
  };

  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activePage, setActivePage] = useState<number>(() => {
    const savedPage = localStorage.getItem('activePage');
    return savedPage ? Number(savedPage) : 1;
  });
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isListView, setIsListView] = useState(false);

  const itemsPerPage = 20;

  // Initialize filters with safe default values
  const [gender, setGender] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('popular');

  const [releaseYear, setReleaseYear] = useState<string | null>(null);

  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const selectedNotesRef = useRef<string[]>([]);

  useEffect(() => {
    const queryNotesParam = searchParams.get('queryNotes');

    if (queryNotesParam) {
      const notesFromUrl = queryNotesParam.split(',').map(decodeURIComponent);

      if (notesFromUrl.length > 0) {
        console.log('Setting Selected Notes:', notesFromUrl);
        setSelectedNotes(notesFromUrl);
        selectedNotesRef.current = notesFromUrl; // Сохраняем значение в реф
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (selectedNotes.length !== selectedNotesRef.current.length) {
      console.log('Updating selectedNotes from ref.');
      setSelectedNotes(selectedNotesRef.current); // Принудительно обновляем из рефа, если длины отличаются
    }
    console.log('Selected Notes Updated:', selectedNotes);
  }, [selectedNotes]);

  // Отслеживаем только searchParams
  console.log(selectedNotes);
  const [releaseYearOptions, setReleaseYearOptions] = useState<{ value: string; label: string }[]>(
    []
  );
  const [notesOptions, setNotesOptions] = useState<{ value: string; label: string }[]>([]);
  const [brandOptions, setBrandOptions] = useState<{ value: string; label: string }[]>([]);

  // State for input values
  const [noteSearchValue, setNoteSearchValue] = useState('');
  const [brandSearchValue, setBrandSearchValue] = useState('');

  const queryParam = searchParams.get('query');
  const queryBrandParam = searchParams.get('queryBrand');
  const queryParfumerParam = searchParams.get('queryParfumer');

  // Determine the search type
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

  console.log('Search Query:', searchQuery);

  useEffect(() => {
    fetchData(activePage);
  }, [activePage, sortBy, gender, releaseYear, selectedNotes, selectedBrands]);

  // Read filters from localStorage after component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedGender = localStorage.getItem('gender');
      if (storedGender) setGender(storedGender);

      const storedSortBy = localStorage.getItem('sortBy');
      if (storedSortBy) setSortBy(storedSortBy);

      const storedReleaseYear = localStorage.getItem('releaseYear');
      if (storedReleaseYear) setReleaseYear(storedReleaseYear);

      const storedNameFilter = localStorage.getItem('nameFilter');
      if (storedNameFilter) setNameFilter(storedNameFilter);
    }
  }, []);

  // Save filters to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('gender', gender || '');
      localStorage.setItem('sortBy', sortBy);
      localStorage.setItem('selectedBrands', JSON.stringify(selectedBrands));
      localStorage.setItem('releaseYear', releaseYear || '');
      localStorage.setItem('nameFilter', nameFilter);
      localStorage.setItem('selectedNotes', JSON.stringify(selectedNotes));
    }
  }, [gender, sortBy, selectedBrands, releaseYear, nameFilter, selectedNotes]);

  // Fetch release years
  useEffect(() => {
    const fetchReleaseYears = async () => {
      try {
        const response = await $api.get('/perfumes/years');
        const yearsData = response.data.years.map((year: any) => ({
          value: year.toString(),
          label: year.toString(),
        }));
        setReleaseYearOptions(yearsData);
      } catch (err) {
        console.error('Не удалось получить годы выпуска', err);
      }
    };

    fetchReleaseYears();
  }, []);

  // Fetch notes from server
  const fetchNotes = async (query: string) => {
    if (query.trim().length === 0) {
      setNotesOptions([]);
      return;
    }

    try {
      console.log('Fetching notes for query:', query);
      const response = await axios.get(
        `https://hltback.parfumetrika.ru/notes/search?query=${encodeURIComponent(query)}`
      );
      console.log('Server response:', response.data);
      const notesData = response.data.notes.map((note: any) => ({
        value: note.name,
        label: note.name,
      }));
      setNotesOptions(notesData);
      console.log('Updated notesOptions:', notesData);
    } catch (err) {
      console.error('Failed to fetch notes:', err);
    }
  };

  // Fetch brands from server
  // Fetch brands from server
  const fetchBrands = async (query: string) => {
    if (query.trim().length === 0) {
      setBrandOptions([]);
      return;
    }

    try {
      console.log('Fetching brands for query:', query);
      const response = await axios.get(
        `https://hltback.parfumetrika.ru/brands/searchBrands?query=${encodeURIComponent(query)}`
      );
      console.log('Server response:', response.data);

      const brandsData = response.data.brands.map((brand: any) => ({
        value: brand.original,
        label: brand.original,
      }));

      setBrandOptions(brandsData);
      console.log('Updated brandOptions:', brandsData);
    } catch (err) {
      console.error('Failed to fetch brands:', err);
    }
  };
  useEffect(() => {
    // Сохраняем `activePage` в `localStorage`, когда оно меняется
    localStorage.setItem('activePage', activePage.toString());
  }, [activePage]);
  useEffect(() => {
    const queryBrandParam = searchParams.get('queryBrand');

    console.log(queryBrandParam);

    if (queryBrandParam) {
      setSelectedBrands([queryBrandParam]);

      // Выполняем запрос для получения брендов, если параметр присутствует
      fetchBrands(queryBrandParam);
    }
  }, [searchParams]);

  // useEffect для установки сохраненного `activePage` при первой загрузке
  useEffect(() => {
    const savedPage = localStorage.getItem('activePage');
    console.log(savedPage);
    if (savedPage) {
      setActivePage(Number(savedPage));
      console.log(savedPage);
    }
  }, []);

  // Debounce fetch functions
  const fetchNotesDebounced = useMemo(() => debounce(fetchNotes, 300), []);
  const fetchBrandsDebounced = useMemo(() => debounce(fetchBrands, 300), []);

  useEffect(() => {
    // Cancel debounced functions on unmount
    return () => {
      fetchNotesDebounced.cancel();
      fetchBrandsDebounced.cancel();
    };
  }, [fetchNotesDebounced, fetchBrandsDebounced]);

  useEffect(() => {
    // Проверяем, если searchQuery совпадает с queryBrand
    if (searchQuery === queryBrandParam) {
      const effectiveBrands = searchQuery
        ? Array.from(new Set([searchQuery, ...selectedBrands]))
        : selectedBrands;

      // Обновляем selectedBrands только если есть изменения
      if (JSON.stringify(effectiveBrands) !== JSON.stringify(selectedBrands)) {
        setSelectedBrands(effectiveBrands);
      }
    }
  }, [searchQuery, queryBrandParam]); // Отслеживаем searchQuery и queryBrandParam
  // Убедитесь, что отслеживается только searchQuery

  const fetchData = async (page: number) => {
    setLoading(true); // Установить загрузку перед началом запроса
    try {
      let endpoint = '/perfumes/search'; // По умолчанию
      const params: any = {
        page: page,
        limit: itemsPerPage,
        sortBy: sortBy,
        gender: gender,
        year: releaseYear,
      };

      // Если есть выбранные бренды, переключаемся на другой endpoint
      if (selectedBrands.length > 0) {
        endpoint = '/perfumes/searchBrands'; // Изменяем конечную точку
        params.query = selectedBrands.join(',');
      }

      if (nameFilter && endpoint !== '/perfumes/searchBrands') {
        params.query = nameFilter;
      }

      if (selectedNotes.length > 0) {
        params.notes = selectedNotes.join(',');
      }

      const response = await $api.get(endpoint, { params });
      setPerfumes(response.data.brands || response.data.results); // Заполняем массив результатов

      // Устанавливаем параметры пагинации, если они есть
      if (response.data.totalPages) {
        setTotalPages(response.data.totalPages);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Не удалось получить данные');
    } finally {
      setLoading(false); // Убедитесь, что loading сбрасывается после запроса
    }
  };

  const getGenderIcon = (gender: string | null | undefined) => {
    if (!gender || typeof gender !== 'string') return null;

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

    localStorage.setItem('activePage', page.toString());
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

  return (
    <>
      <div
        style={{
          marginTop: '50px',
          width: '100%',
          alignItems: 'center',
          maxWidth: '1440px',
          justifyContent: 'center',
          margin: '0 auto',
          paddingLeft: '20px',
          paddingRight: '20px',
          marginBottom: '200px',
        }}
      >
        <Breadcrumbs separator=">" style={{ fontSize: '14px', color: '#555', marginTop: '50px' }}>
          <Anchor href="/" style={{ textDecoration: 'none', color: '#007bff' }}>
            Главная
          </Anchor>
          <span style={{ color: '#6c757d' }}>Поиск</span>
        </Breadcrumbs>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            width: '100%',
            marginTop: '30px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Button
              leftSection={<IconZoomReset size={18} />}
              variant="light"
              color="gray"
              onClick={() => {
                setGender(null);
                setSortBy('popular');
                setSelectedBrands([]);
                setReleaseYear(null);
                setNameFilter('');
                setSelectedNotes([]);
                setNoteSearchValue('');
                setNotesOptions([]);
                setBrandSearchValue('');
                setBrandOptions([]);

                // Очистка query и queryBrand из URL
                updateUrlParams('query', null);
                updateUrlParams('queryBrand', null);

                if (typeof window !== 'undefined') {
                  localStorage.clear();
                }
              }}
            >
              Очистить
            </Button>

            {searchQuery && (
              <div
                style={{
                  backgroundColor: '#a0a3b1',
                  padding: '6px 16px',
                  borderRadius: '8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: 'fit-content',
                  color: '#fff',
                }}
              >
                <IconSearch size={16} style={{ marginRight: '8px' }} />
                <Text size="sm" weight={500} style={{ marginRight: '8px' }}>
                  {searchQuery}
                </Text>
                <span
                  style={{
                    fontSize: '16px',
                    cursor: 'pointer',
                    color: '#fff',
                  }}
                  onClick={() => {
                    /* Add your clear logic here */
                  }}
                >
                  &times;
                </span>
              </div>
            )}
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'center',
              gap: '10px',
            }}
          >
            <Button
              className="filter-mobile"
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
          {/* Filters */}
          <TextInput
            label="Название"
            placeholder="Введите название"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.currentTarget.value)}
          />

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

          {/* Brand field using TagsInput for multiple selection */}
          <Autocomplete
            label="Бренд"
            placeholder="Введите бренд"
            data={brandOptions}
            value={selectedBrands}
            onChange={(values) => {
              console.log('Selected brands:', values);
              setSelectedBrands(values);
            }}
            onSearchChange={(value) => {
              console.log('Brand search input changed:', value);
              setBrandSearchValue(value);
              fetchBrandsDebounced(value);
            }}
            searchValue={brandSearchValue}
            nothingFound="Бренд не найден"
            clearable
          />

          <Autocomplete
            label="Год выпуска"
            placeholder="Выберите год"
            data={releaseYearOptions}
            value={releaseYear}
            onChange={setReleaseYear}
            nothingFound="Год не найден"
          />

          {/* Note field using TagsInput for multiple selection */}
          <TagsInput
            label="Нота"
            placeholder="Введите ноту"
            data={notesOptions}
            value={selectedNotes}
            onChange={(values) => setSelectedNotes(values)}
            onSearchChange={(value) => {
              setNoteSearchValue(value);
              fetchNotesDebounced(value);
            }}
            searchValue={noteSearchValue}
            nothingFound="Нота не найдена"
            clearable
          />
        </Drawer>

        <div style={{ marginTop: '60px' }}>
          {/* Desktop filters */}
          <div
            className="desktopFilter"
            style={{
              display: 'flex',
              border: `1px solid ${
                isDark ? 'var(--mantine-color-dark-4)' : 'var(--mantine-color-gray-4)'
              }`,
              borderRadius: '12px',
              float: 'left',
              marginRight: '36px',
              minWidth: '200px',
              marginLeft: '0px',
              position: 'sticky',
              top: '20px',
              padding: '20px',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            {/* Filters */}
            <TextInput
              label="Название"
              placeholder="Введите название"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.currentTarget.value)}
              onKeyDown={handleKeyDown} // Отправка при нажатии Enter
            />

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

            {/* Brand field using TagsInput for multiple selection */}
            <TagsInput
              maw="210px"
              label="Бренд"
              placeholder={selectedBrands.length === 0 ? 'Введите бренд' : ''}
              data={brandOptions}
              value={selectedBrands} // Сохраняем только один бренд
              onChange={(values) => {
                setSelectedBrands(values.slice(0, 1)); // Оставляем только один бренд
                updateUrlParams('queryBrand', values[0] || null); // Обновляем queryBrand в URL
              }}
              onSearchChange={(value) => {
                setBrandSearchValue(value);
                fetchBrandsDebounced(value); // Динамически подгружаем бренды
              }}
              onOptionSubmit={(value) => {
                setSelectedBrands([value]);
                updateUrlParams('queryBrand', value); // Устанавливаем queryBrand в URL
              }}
              onRemove={() => {
                setSelectedBrands([]);
                updateUrlParams('queryBrand', null); // Удаляем queryBrand из URL
              }}
              searchValue={brandSearchValue}
              maxTags={1} // Лимитируем до одного тега
              allowDuplicates={false} // Исключаем дублирование
              clearable
              acceptValueOnBlur={false} // Исключаем пустые теги при потере фокуса
            />

            <Autocomplete
              label="Год выпуска"
              placeholder="Выберите год"
              data={releaseYearOptions}
              value={releaseYear}
              onChange={setReleaseYear}
              nothingFound="Год не найден"
            />

            {/* Note field using TagsInput for multiple selection */}

            <TagsInput
              maw="210px"
              label="Нота"
              placeholder="Введите ноту"
              data={notesOptions}
              value={selectedNotes}
              onChange={(values) => {
                console.log('Selected notes:', values);
                setSelectedNotes(values);
              }}
              onSearchChange={(value) => {
                console.log('Search input changed:', value);
                setNoteSearchValue(value);
                fetchNotesDebounced(value);
              }}
              searchValue={noteSearchValue}
              nothingFound="Нота не найдена"
              clearable
            />
          </div>

          {/* Display of perfumes */}
          {isListView ? (
            <SimpleGrid
              type="container"
              cols={{ base: 2, '893px': 2, '720px': 1, '330px': 1, '0px': 1 }}
              spacing={{ base: '0px', '0px': 'sm' }}
              style={{ width: '100%' }}
            >
              {loading ? (
                Array.from({ length: itemsPerPage }).map((_, index) => (
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
              ) : perfumes.length > 0 ? (
                perfumes.map((perfume) => (
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
                        src={`https://parfumetrika.ru/${perfume.main_image}`}
                        alt={perfume.name}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement; // Явно указываем, что target — это изображение
                          target.src = '/roman.jpg'; // Подмена изображения при ошибке загрузки
                        }}
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
                ))
              ) : (
                <Text size="lg" mb="400px" mt="lg">
                  Нет результатов по вашему запросу. Попробуйте изменить фильтры.
                </Text>
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
                      maxWidth: '200px',
                    }}
                  />
                ))
              ) : perfumes.length > 0 ? (
                perfumes.map((perfume) => (
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
                ))
              ) : (
                <Text miw="100%" mt="lg" mb="300px">
                  Нет результатов по вашему запросу. Попробуйте изменить фильтры.
                </Text>
              )}
            </SimpleGrid>
          )}
        </div>

        <Group mt="lg" mb="12" style={{ display: 'flex', justifyContent: 'center' }}>
          <Pagination
            value={activePage}
            radius="8"
            onChange={handlePageChange}
            total={totalPages}
          />
        </Group>
      </div>
    </>
  );
};

export default SearchPage;
