'use client';
import { Header } from '@/components/Header/Header';
import { Container, Text, Card, Image, Title, Rating, useMantineTheme, Group } from '@mantine/core';
import { IconMapPin } from '@tabler/icons-react';
import './stores.css';
import { FooterLinks } from '@/components/ui/Footer/Footer';
import { useEffect, useState } from 'react';
import $api from '@/components/api/axiosInstance'; // Assuming $api is configured here

interface Shop {
  _id: string;
  name: string;
  url: string;
  location: string;
  image: string;
  rating: number;
  likes: number;
  comments: number;
}

export default function Shops() {
  const theme = useMantineTheme();
  const [shops, setShops] = useState<Shop[]>([]);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await $api.get('/shops');
        setShops(response.data);
      } catch (error) {
        console.error('Ошибка при получении данных магазинов:', error);
      }
    };

    fetchShops();
  }, []);

  return (
    <>
      <Header />
      <Container fluid maw="1200px" mt="xl" style={{ margin: '0 auto' }}>
        <Title size="26" mb="30" style={{ textAlign: 'center' }}>
          Магазины
        </Title>

        <div className="custom-grid">
          {shops.map((store) => (
            <Card
              key={store._id}
              shadow="0"
              padding="10"
              radius="14"
              withBorder
              className="store-card"
            >
              <Group>
                <div
                  style={{
                    width: '100px',
                    height: '100px',
                    overflow: 'hidden',
                    borderRadius: '8px',
                  }}
                >
                  <Image
                    src={store.image || '/images/placeholder.jpg'}
                    alt={store.name}
                    width="100%"
                    height="100%"
                    style={{
                      objectFit: 'cover',
                    }}
                  />
                </div>

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
                    <Text size="sm" color="dimmed">
                      {store.location}
                    </Text>
                  </div>
                  <Rating value={store.rating} readOnly mt="xs" />
                </div>
              </Group>
            </Card>
          ))}
        </div>
      </Container>
      <FooterLinks />
    </>
  );
}
