'use client';
import { Header } from '@/components/Header/Header';
import { FooterLinks } from '@/components/ui/Footer/Footer';
import { Container, Text, Title, Card, Group, Button, Stack } from '@mantine/core';
import { IconHeart, IconUsers, IconInfoCircle } from '@tabler/icons-react';

export default function AboutUs() {
  return (
    <>
      <head>
        <title>О нас | Parfumetrika</title>
        <meta name="description" content="О нас,Parfumetrika" />
      </head>
      <Header />
      <Container mt="20" size="sm" style={{ padding: '40px 20px' }}>
        <Stack align="center" style={{ maxWidth: 700, margin: '0 auto' }}>
          <Title order={1} style={{ fontSize: '26px', fontWeight: 600 }}>
            О нас
          </Title>

          <Text align="center" size="md" color="dimmed" style={{ lineHeight: 1.6 }}>
            <strong>Парфюметрика</strong> — это открытая база данных, объединяющая информацию о{' '}
            <strong>170,000+</strong> ароматах. Здесь вы найдете подробные сведения о каждом
            аромате, от нот до отзывов. База поддерживается сообществом для поддержания актуальности
            и точности данных.
          </Text>

          <Group spacing="lg" position="center" style={{ marginTop: '40px' }}>
            <Card
              radius="md"
              padding="md"
              style={{ width: 200, textAlign: 'center', boxShadow: 'none' }}
            >
              <IconHeart size={34} color="#228be6" style={{ marginBottom: 8 }} />
              <Text weight={500} size="md">
                Сообщество
              </Text>
              <Text size="sm" color="dimmed">
                Присоединяйтесь к нам и добавляйте ароматы.
              </Text>
            </Card>

            <Card
              radius="md"
              padding="md"
              style={{ width: 200, textAlign: 'center', boxShadow: 'none' }}
            >
              <IconUsers size={34} color="#228be6" style={{ marginBottom: 8 }} />
              <Text weight={500} size="md">
                Открытая база
              </Text>
              <Text size="sm" color="dimmed">
                Вносите поправки, делитесь опытом.
              </Text>
            </Card>
          </Group>

          <Card
            radius="md"
            padding="md"
            style={{
              maxWidth: 600,
              textAlign: 'center',
              backgroundColor: '#f3f4f6',
              marginTop: '40px',
            }}
          >
            <Group position="center">
              <IconInfoCircle size={26} color="#228be6" />
              <Text size="sm" color="dimmed" style={{ lineHeight: 1.5 }}>
                Парфюметрика — это сообщество, созданное для увлеченных миром ароматов.
              </Text>
            </Group>
          </Card>

          <Button
            variant="outline"
            color="blue"
            radius="md"
            size="md"
            style={{ marginTop: '30px' }}
            onClick={() => (window.location.href = '/login')}
          >
            Присоединиться
          </Button>
        </Stack>
      </Container>
      <FooterLinks />
    </>
  );
}
