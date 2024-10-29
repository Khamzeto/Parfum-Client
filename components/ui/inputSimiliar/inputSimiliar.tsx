import React, { useState, useEffect } from 'react';
import { Spotlight } from '@mantine/spotlight';
import { ActionIcon, Group, Text, Image } from '@mantine/core';
import { IconSearch, IconPlus } from '@tabler/icons-react';
import { useDebouncedValue } from '@mantine/hooks';
import $api from '@/components/api/axiosInstance';

interface Perfume {
  _id: string;
  name: string;
  brand: string;
  perfume_id: string;
}

const InputSimiliar = ({ onAddSimiliar }: { onAddSimiliar: (id: string) => void }) => {
  const [searchValue, setSearchValue] = useState('');
  const [results, setResults] = useState<Perfume[]>([]);
  const [debouncedSearchValue] = useDebouncedValue(searchValue, 300);
  const [isOpen, setIsOpen] = useState(false); // локальное состояние для открытия и закрытия

  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedSearchValue.length > 0) {
        try {
          const encodedSearchValue = encodeURIComponent(debouncedSearchValue);
          const response = await $api.get(
            `/perfumes/search?query=${encodedSearchValue}&page=1&limit=8`
          );
          setResults(response.data.results || []);
        } catch (error) {
          console.error('Error fetching perfumes:', error);
          setResults([]);
        }
      } else {
        setResults([]);
      }
    };

    fetchResults();
  }, [debouncedSearchValue]);

  const items = results.map((perfume) => (
    <Spotlight.Action
      key={perfume.perfume_id}
      onClick={() => {
        onAddSimiliar(perfume.perfume_id); // передаем ID парфюма
        setIsOpen(false); // закрываем локальный Spotlight после выбора
      }}
      style={{ minWidth: '100%' }}
    >
      <Group style={{ minWidth: '100%' }}>
        <Image
          src="https://pimages.parfumo.de/23124_img-2628-d-s-durga-bowmakers-eau-de-parfum.webp"
          alt={perfume.name}
          width={50}
          height={50}
          radius="md"
        />
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <Text truncate>{perfume.name}</Text>
          <Text color="dimmed" size="xs" truncate>
            {perfume.brand}
          </Text>
        </div>
      </Group>
    </Spotlight.Action>
  ));

  return (
    <>
      <ActionIcon
        onClick={() => setIsOpen(true)} // открываем Spotlight с локальным состоянием
        radius="xl"
        size={32}
        color="blue"
        variant="filled"
        style={{ marginLeft: '8px' }}
      >
        <IconPlus size={18} />
      </ActionIcon>

      <Spotlight.Root
        radius="md"
        query={searchValue}
        opened={isOpen} // используем локальное состояние для управления открытием
        onClose={() => setIsOpen(false)} // закрываем при необходимости
        onQueryChange={setSearchValue}
        styles={{
          content: {
            overflow: 'hidden',
          },
        }}
      >
        <Spotlight.Search
          placeholder="Поиск парфюмов..."
          leftSection={<IconSearch stroke={1.5} />}
        />
        <Spotlight.ActionsList style={{ overflowY: 'auto', maxHeight: '400px' }}>
          {items.length > 0 ? items : <Spotlight.Empty>Ничего не найдено...</Spotlight.Empty>}
        </Spotlight.ActionsList>
      </Spotlight.Root>
    </>
  );
};

export default InputSimiliar;
