import React, { useState, useEffect } from 'react';
import {
  Modal,
  TextInput,
  Group,
  Text,
  Image,
  Button,
  ActionIcon,
  useMantineTheme,
} from '@mantine/core';
import { IconSearch, IconPlus, IconX } from '@tabler/icons-react';
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
  const [isOpen, setIsOpen] = useState(false); // Controls modal visibility
  const theme = useMantineTheme();

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
    <div
      key={perfume.perfume_id}
      onClick={() => {
        onAddSimiliar(perfume.perfume_id);
        setIsOpen(false);
      }}
      style={{
        padding: '10px',
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        borderBottom: `1px solid ${theme.colors.gray[2]}`,
      }}
    >
      <Image
        src="https://pimages.parfumo.de/23124_img-2628-d-s-durga-bowmakers-eau-de-parfum.webp"
        alt={perfume.name}
        width={50}
        height={50}
        radius="md"
        style={{ marginRight: '10px' }}
      />
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <Text
          weight={500}
          style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {perfume.name}
        </Text>
        <Text
          color="dimmed"
          size="xs"
          style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {perfume.brand}
        </Text>
      </div>
    </div>
  ));

  return (
    <>
      <ActionIcon
        onClick={() => setIsOpen(true)}
        radius="xl"
        size={32}
        color="blue"
        variant="filled"
      >
        <IconPlus size={18} />
      </ActionIcon>

      <Modal
        opened={isOpen}
        onClose={() => setIsOpen(false)}
        title="Поиск парфюмов"
        radius="14"
        centered
        size="md"
      >
        <TextInput
          placeholder="Поиск парфюмов..."
          icon={<IconSearch />}
          value={searchValue}
          onChange={(e) => setSearchValue(e.currentTarget.value)}
          mb="md"
        />

        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {items.length > 0 ? (
            items
          ) : (
            <Text align="center" color="dimmed" mt="md">
              Ничего не найдено...
            </Text>
          )}
        </div>
      </Modal>
    </>
  );
};

export default InputSimiliar;
