import { useState } from 'react';
import { Spotlight, spotlight } from '@mantine/spotlight';
import { ActionIcon, Badge, Center, Group, Text, px, rem } from '@mantine/core'; // Import rem from Mantine
import { IconSearch } from '@tabler/icons-react';
import '@mantine/spotlight/styles.css';

const data = [


];

export function SpotlightDemo() {
  const [query, setQuery] = useState('');

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
    <>
      {/* Replace the Button with an ActionIcon for the search icon */}
      <ActionIcon
        onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
        variant="default"
        radius='9px'
        size="lg" // Changed from 'xl' to 'lg' for a more compact size
        aria-label="Toggle color scheme"
    // Reduce padding inside the ActionIcon for a smaller appearance
      >

        <IconSearch  onClick={spotlight.open}  size={18} stroke={1.5} />
        </ActionIcon>


        <Spotlight.Root radius='12px' query={query} onQueryChange={setQuery}>
        <Spotlight.Search placeholder="Найти парфюм" leftSection={<IconSearch stroke={1.5} />} />
        <Spotlight.ActionsList 
          style={{
            minWidth: '100%',
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
          }}>
          {items.length > 0 ? items : <Spotlight.Empty>Nothing found...</Spotlight.Empty>}
        </Spotlight.ActionsList>
      </Spotlight.Root>
    </>
  );
}

export default SpotlightDemo;
