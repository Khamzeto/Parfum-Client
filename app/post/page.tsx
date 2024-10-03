// pages/index.tsx
'use client'
import { AppShell, Navbar, Header, Container, Group, Text, Button, Card, Image, ScrollArea, Box } from '@mantine/core';

export default function Home() {
  return (
  
      <Container fluid  maw='1440px' style={{margin: '20px auto 0 auto'}} mt='20'>
         <Box style={{ flex: 1 }}>
            <Card style={{display: 'flex'}} padding="20" radius='14'>
              <div style={{display: 'flex',width: '100%',justifyContent: 'space-between'}}>
              <Text align="center" size="lg">
                Мои Статьи
              </Text>
              <Button radius='12' maw='200px'>Создать статью</Button>
              </div>
            </Card>
          </Box>
        <Group w='100%' mt='40' align="flex-start" spacing="xl">
          {/* My Articles section */}
          <div style={{display: 'flex',flexDirection: 'column',width: '78%',gap: '12px'}}>
         

          <Box style={{ flex: 1 }}>
            <Card radius='14'  padding="lg">
            
                <Text>Сообщения не найдены!</Text>
             
            </Card>
          </Box>
          </div>

          {/* Most Popular Section */}
          <Box  style={{ width: '20%' }}>
            <ScrollArea style={{ height: 500 }}>
              <Text size="lg" mb="xs">
                Самый популярный
              </Text>
              {popularArticles.map((article) => (
                <Card key={article.title} radius='14' padding="lg" mt="md">
                  <Group>
                    <Image src={article.image} height={60} width={100} alt={article.title} />
                    <Box>
                      <Text size="sm">{article.title}</Text>
                      <Text size="xs">{article.views} Просмотров</Text>
                      <Text size="xs">{article.date}</Text>
                    </Box>
                  </Group>
                </Card>
              ))}
            </ScrollArea>
          </Box>
        </Group>
      </Container>
  );
}

// Dummy data for the Most Popular section
const popularArticles = [
  {
    title: "Drake – In 'My Feelings.mp...",
    views: "1491",
    date: "10 мая 2021 г.",
    image: "/images/drake.jpg",
  },
  {
    title: "ТестТестТестТестТестТе...",
    views: "783",
    date: "04 июля 2023 г.",
    image: "/images/car.jpg",
  },
  {
    title: "Важность сайтов для обмен...",
    views: "607",
    date: "04 июля 2023 г.",
    image: "/images/sites.jpg",
  },
];
