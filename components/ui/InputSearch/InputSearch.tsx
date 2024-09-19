import React, { useState, useEffect } from 'react';
import { Spotlight, spotlight } from '@mantine/spotlight';
import {
  ActionIcon,
  Center,
  Group,
  Text,
  Image,
  Tabs,
  Flex,
  Input,
} from '@mantine/core';
import { IconArrowRight, IconSearch } from '@tabler/icons-react';
import { useDebouncedValue } from '@mantine/hooks';
import $api from '@/components/api/axiosInstance';

const SpotlightDemo = () => {
  const [searchValue, setSearchValue] = useState('');
  const [results, setResults] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [debouncedSearchValue] = useDebouncedValue(searchValue, 300);
  const [searchType, setSearchType] = useState('perfumes');

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

          if (searchType === 'perfumes' && response.data.perfumes) {
            setResults(response.data.perfumes);
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
      key={item.brand_id || item._id || item.name}
      style={{minWidth: '100%'}}
      onClick={() =>
        (window.location.href = `/${
          searchType === 'perfumes'
            ? 'perfumes'
            : searchType === 'brands'
            ? 'brand'
            : 'parfumer'
        }/${item.perfume_id || item.brand_id || item._id}`)
      }
    >
      <Group noWrap style={{minWidth: '100%'}} w="100%" >
        

        {searchType === 'perfumes' && (
        
            <Image
              src="https://pimages.parfumo.de/23124_img-2628-d-s-durga-bowmakers-eau-de-parfum.webp"
              alt={item.name}
              width={50}
              height={50}
              radius="md"
              withPlaceholder
            />
        
        )}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <Text truncate>{item.name}</Text>
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
    <div 
        style={{ marginBottom: '16px',maxWidth: '1440px',margin: '20px auto 20px  auto',marginTop: '20px',paddingLeft: '20px',paddingRight: '20px' }} >
           <Input
       leftSection={<IconSearch size={18} stroke={1.5} />}
        className='input-desk'
        placeholder="Поиск парфюмов или брендов..."
        radius="8"
        onClick={spotlight.open}
        pointer
        readOnly
// Можно настроить отступы
      />
</div>
      <Spotlight.Root
        radius="md"
        query={searchValue}
        onQueryChange={setSearchValue}
        overlayOpacity={0.3}
        overlayBlur={3}
        styles={{
          content: {
            overflow: 'hidden !important', // Скрываем вертикальный скролл
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



        <Spotlight.ActionsList style={{overflowY: 'hidden',width: '100%', maxHeight: '500px',  }}   >
        <Tabs
  value={searchType}
  onChange={(value) => setSearchType(value)}
  style={{ overflowX: 'auto', whiteSpace: 'nowrap', scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Для горизонтального скролла и скрытия палочки
>
  <Tabs.List justify='center' mt='2px' mb='8px' style={{ display: 'flex', flexWrap: 'nowrap' }}>
    <Tabs.Tab value="perfumes">Парфюмы</Tabs.Tab>
    <Tabs.Tab value="brands">Бренды</Tabs.Tab>
    <Tabs.Tab value="parfumers">Парфюмеры</Tabs.Tab>
  </Tabs.List>
</Tabs>



        <div style={{ overflowY: 'auto', maxHeight: '400px', scrollbarWidth: 'none', msOverflowStyle: 'none',overflowX: 'hidden' }}>
  {items.length > 0 ? items : <Spotlight.Empty>Ничего не найдено...</Spotlight.Empty>}
</div>

<style jsx>{`
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
