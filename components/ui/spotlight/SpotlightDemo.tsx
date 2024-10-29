import { useState } from 'react';
import { Spotlight, spotlight } from '@mantine/spotlight';
import { ActionIcon, Badge, Center, Group, Text, px, rem } from '@mantine/core'; // Import rem from Mantine
import { IconSearch } from '@tabler/icons-react';
import '@mantine/spotlight/styles.css';

const data = [];

export function SpotlightDemo() {
  const [query, setQuery] = useState('');
  const [opened, setOpened] = useState(false); // Локальное состояние для Spotlight

  const items = data
    .filter((item) => item.title.toLowerCase().includes(query.toLowerCase().trim()))
    .map((item) => (
      <Spotlight.Action key={item.title} onClick={() => console.log(item)}>
        <Group wrap="nowrap" w="100%">
          {item.image && (
            <Center>
              <img src={item.image} alt={item.title} width={50} height={50} />
            </Center>
          )}
          <div style={{ flex: 1 }}>
            <Text>{item.title}</Text>
            {item.description && (
              <Text opacity={0.6} size="xs">
                {item.description}
              </Text>
            )}
          </div>
          {item.new && <Badge variant="default">new</Badge>}
        </Group>
      </Spotlight.Action>
    ));

  return (
    <div>
      <ActionIcon
        onClick={() => setOpened(true)} // Открываем локальный Spotlight
        variant="default"
        radius="xl"
        size="lg"
        aria-label="Toggle search"
      >
        <IconSearch size={18} stroke={1.5} />
      </ActionIcon>

      <Spotlight.Root
        opened={opened} // Используем локальное состояние
        onClose={() => setOpened(false)}
        query={query}
        onQueryChange={setQuery}
        radius="12px"
      >
        <Spotlight.Search placeholder="Найти парфюм" leftSection={<IconSearch stroke={1.5} />} />
        <Spotlight.ActionsList style={{ padding: '20px' }}>
          {items.length > 0 ? items : <Spotlight.Empty>Ничего не найдено...</Spotlight.Empty>}
        </Spotlight.ActionsList>
      </Spotlight.Root>
    </div>
  );
}

export default SpotlightDemo;
