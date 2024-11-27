import React, { useState, useEffect } from 'react';
import { Spotlight, spotlight } from '@mantine/spotlight';
import { ActionIcon, Group, Text, Image, Tabs, Input, Button } from '@mantine/core';
import { IconArrowRight, IconSearch } from '@tabler/icons-react';
import { useDebouncedValue } from '@mantine/hooks';
import $api from '@/components/api/axiosInstance';
import { UserMenu } from '../UserMenu/UserMenu';

const SpotlightDemo = () => {
  const [searchValue, setSearchValue] = useState('');
  const [results, setResults] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [debouncedSearchValue] = useDebouncedValue(searchValue, 300);
  const [searchType, setSearchType] = useState('perfumes');
  const [tokenExists, setTokenExists] = useState(false); // Новое состояние для проверки токена

  useEffect(() => {
    // Проверяем наличие токена в localStorage при монтировании компонента
    const token = localStorage.getItem('token');
    setTokenExists(!!token);
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedSearchValue.length > 0) {
        try {
          const encodedSearchValue = encodeURIComponent(debouncedSearchValue);
          let url = '';

          if (searchType === 'perfumes') {
            url = `/perfumes/search?query=${encodedSearchValue}&page=1&limit=8`;
          } else if (searchType === 'brands') {
            url = `/perfumes/searchBrands?query=${encodedSearchValue}&page=1&limit=8`;
          } else if (searchType === 'parfumers') {
            url = `/parfumers/search?query=${encodedSearchValue}&page=1&limit=8`;
          }

          const response = await $api.get(url);

          if (searchType === 'perfumes' && response.data.results) {
            setResults(response.data.results);
            setNotFound(response.data.perfumes.length === 0);
          } else if (searchType === 'brands' && response.data.brands) {
            const uniqueBrandsMap = new Map();
            response.data.brands.forEach((perfume) => {
              const brandName = perfume.brand;
              const brandId = perfume.brand_id || perfume._id;

              if (!uniqueBrandsMap.has(brandName)) {
                uniqueBrandsMap.set(brandName, { name: brandName, brand_id: brandId });
              }
            });

            const uniqueBrands = Array.from(uniqueBrandsMap.values());
            setResults(uniqueBrands);
            setNotFound(uniqueBrands.length === 0);
          } else if (searchType === 'parfumers' && response.data.parfumers) {
            setResults(response.data.parfumers);
            setNotFound(response.data.parfumers.length === 0);
          } else {
            setResults([]);
            setNotFound(true);
          }
        } catch (error) {
          if (error.response && error.response.status === 404) {
            setResults([]);
            setNotFound(true);
          } else {
            console.error('Error fetching data:', error);
          }
        }
      } else {
        setResults([]);
        setNotFound(false);
      }
    };

    fetchResults();
  }, [debouncedSearchValue, searchType]);

  const items = results.map((item) => (
    <Spotlight.Action
      key={item._id}
      style={{ minWidth: '100%' }}
      onClick={() => {
        let url = '';
        if (searchType === 'perfumes') {
          url = `/perfumes/${item.perfume_id}`;
        } else if (searchType === 'brands') {
          url = `/search?queryBrand=${encodeURIComponent(item.name)}`;
        } else if (searchType === 'parfumers') {
          url = `/parfumer/${item.slug}`;
        }
        window.location.href = url;
      }}
    >
      <Group noWrap style={{ minWidth: '100%' }} w="100%">
        {searchType === 'perfumes' && (
          <Image
            src={`https://parfumetrika.ru/${item.main_image}`}
            alt={item.name}
            width={50}
            height={50}
            radius="md"
          />
        )}
        <div style={{ flex: 1, overflow: 'hidden', paddingBottom: '10px' }}>
          <Text truncate>{item.original_ru || item.name}</Text>
          {searchType === 'perfumes' && (
            <Text color="dimmed" size="xs" truncate>
              {item.brand}
            </Text>
          )}
        </div>
      </Group>
    </Spotlight.Action>
  ));

  return (
    <>
      <div className="search-container">
        <Input
          leftSection={<IconSearch size={18} stroke={1.5} />}
          className="search-input"
          placeholder="Поиск парфюмов или брендов..."
          radius="8"
          onClick={spotlight.open}
          readOnly
        />
        <ActionIcon
          size="40"
          variant="filled"
          color="blue"
          radius="12"
          className="search-icon"
          onClick={spotlight.open}
        >
          <IconSearch size={24} stroke={1.5} />
        </ActionIcon>

        {/* Здесь мы условно рендерим UserMenu или кнопку "Войти" */}
        <Group w="100%" h="100px" hiddenFrom="sm">
          {tokenExists ? (
            <UserMenu />
          ) : (
            <Button
              radius="8"
              ml="14"
              mr="18"
              variant="default"
              onClick={() => (window.location.href = '/login')}
            >
              Войти
            </Button>
          )}
        </Group>
      </div>

      <Spotlight.Root
        radius="md"
        query={searchValue}
        onQueryChange={setSearchValue}
        styles={{
          content: {
            overflow: 'hidden !important',
          },
        }}
      >
        <Spotlight.Search
          placeholder="Поиск парфюмов или брендов..."
          leftSection={<IconSearch stroke={1.5} />}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const encodedValue = encodeURIComponent(searchValue);
              let url = '';
              if (searchType === 'perfumes') {
                url = `/search?query=${encodedValue}`;
              } else if (searchType === 'brands') {
                url = `/search?queryBrand=${encodedValue}`;
              } else if (searchType === 'parfumers') {
                url = `/parfumers?query=${encodedValue}`;
              }
              window.location.href = url;
            }
          }}
          rightSection={
            <div
              onClick={() => {
                const encodedValue = encodeURIComponent(searchValue);
                let url = '';
                if (searchType === 'perfumes') {
                  url = `/search?query=${encodedValue}`;
                } else if (searchType === 'brands') {
                  url = `/search?queryBrand=${encodedValue}`;
                } else if (searchType === 'parfumers') {
                  url = `/parfumers?query=${encodedValue}`;
                }
                window.location.href = url;
              }}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: '#e0e0e0',
                cursor: 'pointer',
                pointerEvents: 'all',
              }}
            >
              <IconArrowRight size={18} stroke={1.5} />
            </div>
          }
        />

        <Spotlight.ActionsList style={{ overflowY: 'hidden', width: '100%', maxHeight: '500px' }}>
          <Tabs
            value={searchType}
            onChange={(value) => setSearchType(value)}
            style={{
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <Tabs.List
              justify="center"
              mt="2px"
              mb="8px"
              style={{ display: 'flex', flexWrap: 'nowrap' }}
            >
              <Tabs.Tab value="perfumes">Парфюмы</Tabs.Tab>
              <Tabs.Tab value="brands">Бренды</Tabs.Tab>
              <Tabs.Tab value="parfumers">Парфюмеры</Tabs.Tab>
            </Tabs.List>
          </Tabs>

          <div
            style={{
              overflowY: 'auto',
              maxHeight: '400px',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              overflowX: 'hidden',
              padding: '10px',
            }}
          >
            {items.length > 0 ? items : <Spotlight.Empty>Ничего не найдено...</Spotlight.Empty>}
          </div>

          <style jsx>{`
            .search-container {
              position: relative;
              max-width: 1440px;
              margin: 20px auto;
              padding: 0 40px;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .search-input {
              display: block;
              width: 100%;
            }

            .search-icon {
              display: none;
            }

            @media (max-width: 768px) {
              .search-input {
                display: none;
              }

              .search-icon {
                display: flex;
              }
            }

            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
        </Spotlight.ActionsList>
      </Spotlight.Root>
    </>
  );
};

export default SpotlightDemo;
