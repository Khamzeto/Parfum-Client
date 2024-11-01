'use client';
import { Header } from '@/components/Header/Header';
import {
  Container,
  Text,
  Card,
  Image,
  Title,
  Rating,
  useMantineTheme,
  ActionIcon,
  Group,
} from '@mantine/core';
import { IconHeart, IconMapPin, IconMessageCircle } from '@tabler/icons-react';
import './stores.css';
import { FooterLinks } from '@/components/ui/Footer/Footer';
const stores = [
  {
    id: 1,
    name: 'Тионета',
    url: 'www.tioneta.ru',
    location: 'Россия',
    image:
      'https://img.freepik.com/free-vector/perfume-shop-logo-template-beauty-business-branding-design-black-and-white-vector_53876-156447.jpg?size=626&ext=jpg',
    rating: 5,
    likes: 9,
    comments: 17,
  },
  {
    id: 2,
    name: 'Aromamore',
    url: 'www.aromamore.ru',
    location: 'Россия',
    image:
      'https://img.freepik.com/free-vector/perfume-shop-logo-template-beauty-business-branding-design-black-and-white-vector_53876-156447.jpg?size=626&ext=jpg',
    rating: 2,
    likes: 83,
    comments: 17,
  },
  {
    id: 3,
    name: 'Aromamore',
    url: 'www.aromamore.ru',
    location: 'Россия',
    image:
      'https://img.freepik.com/free-vector/perfume-shop-logo-template-beauty-business-branding-design-black-and-white-vector_53876-156447.jpg?size=626&ext=jpg',
    rating: 2,
    likes: 83,
    comments: 17,
  },
  {
    id: 4,
    name: 'Aromamore',
    url: 'www.aromamore.ru',
    location: 'Россия',
    image:
      'https://img.freepik.com/free-vector/perfume-shop-logo-template-beauty-business-branding-design-black-and-white-vector_53876-156447.jpg?size=626&ext=jpg',
    rating: 2,
    likes: 83,
    comments: 17,
  },
  // Добавьте больше магазинов по необходимости...
];

export default function Shops() {
  const theme = useMantineTheme();

  return (
    <>
      <Header />
      <Container fluid maw="1200px" mt="xl" style={{ margin: '0 auto' }}>
        <Title size="26" mb="30" style={{ textAlign: 'center' }}>
          Магазины
        </Title>

        <div className="custom-grid">
          {stores.map((store) => (
            <Card
              key={store.id}
              shadow="0"
              padding="10"
              radius="14"
              withBorder
              className="store-card"
            >
              <Group>
                <div
                  style={{
                    width: '100px', // Ширина контейнера изображения
                    height: '100px', // Высота контейнера изображения
                    overflow: 'hidden', // Чтобы изображение не выходило за пределы
                    borderRadius: '8px', // Радиус для скругления, при необходимости
                  }}
                >
                  <Image
                    src={store.image || '/images/placeholder.jpg'}
                    alt={store.name}
                    width="100%" // Изображение будет занимать 100% контейнера
                    height="100%" // Изображение будет занимать 100% контейнера
                    style={{
                      objectFit: 'cover', // Чтобы изображение полностью заполняло контейнер, сохраняя пропорции
                    }}
                  />
                </div>

                {/* Store Details */}
                <div style={{ flex: 1 }}>
                  <Text weight={600} size="lg">
                    {store.name}
                  </Text>
                  <Text size="sm" color="dimmed">
                    {store.url}
                  </Text>
                  <div
                    style={{
                      display: 'flex',
                      gap: '6px',
                      alignItems: 'center',
                      marginTop: '6px',
                      marginBottom: '6px',
                    }}
                  >
                    <IconMapPin size={16} color={theme.colors.blue[6]} />
                    <Text size="sm" style={{ paddingLeft: '0px' }} color="dimmed">
                      {store.location}
                    </Text>
                  </div>
                  <Rating value={store.rating} readOnly mt="xs" />
                </div>
              </Group>

              {/* Likes and Comments */}
            </Card>
          ))}
        </div>
      </Container>
      <FooterLinks />

      <style jsx>{``}</style>
    </>
  );
}
