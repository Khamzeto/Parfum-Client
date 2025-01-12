'use client';
import React from 'react';
import { Container, Title, Text, Card, Group, Divider, UnstyledButton } from '@mantine/core';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { IconInfoCircle, IconStar, IconUsers, IconMail } from '@tabler/icons-react';
import { FooterLinks } from '@/components/ui/Footer/Footer';
import { Header } from '@/components/Header/Header';

ChartJS.register(ArcElement, Tooltip, Legend);

const ParfumetrikaPage = () => {
  const audienceData = {
    labels: ['Женщины (70%)', 'Мужчины (30%)'],
    datasets: [
      {
        data: [70, 30],
        backgroundColor: ['#ff6384', '#36a2eb'],
      },
    ],
  };

  // Функция для отрисовки карточки с hover-эффектом без тени
  const HoverCard = ({ icon: Icon, title, children }) => (
    <UnstyledButton
      component="div"
      sx={(theme) => ({
        display: 'block',
        width: '100%',
        borderRadius: theme.radius.md,
        padding: theme.spacing.lg,
        border: `1px solid ${theme.colors.gray[3]}`,
        transition: 'background-color 0.2s ease',
        '&:hover': {
          backgroundColor: theme.colors.gray[0],
        },
      })}
    >
      <Group spacing="xs" mb="sm">
        <Icon size={24} stroke={2} color="#1c7ed6" />
        <Title order={3} style={{ margin: 0 }}>
          {title}
        </Title>
      </Group>
      <div>{children}</div>
    </UnstyledButton>
  );

  return (
    <>
      <head>
        <title>Реклама на сайте Парфюметрика</title>
        <meta
          name="description"
          content="Рекламные возможности для брендов и компаний, связанных с парфюмерией. Предлагаем баннерные кампании, спонсорские материалы и другие эффективные формы продвижения на платформе с активной и открытой аудиторией."
        />
      </head>
      <Header />
      <Container size="lg" style={{ padding: '2rem 0' }}>
        <Title order={1} align="center" mb="md">
          Добро пожаловать на Parfumetrika
        </Title>
        <Text size="lg" align="center" color="dimmed" mb="lg">
          Ваш надежный гид в мире ароматов!
        </Text>
        <Divider my="xl" />

        {/* Секция предложений */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
          <HoverCard icon={IconStar} title="Мы предлагаем:">
            <ul style={{ paddingLeft: '1rem' }}>
              <li>150 000+ отзывов на парфюмы от реальных пользователей</li>
              <li>Подробные обзоры и экспертные рекомендации</li>
              <li>Удобный каталог с подборками похожих ароматов</li>
              <li>Рейтинги брендов и популярных парфюмов</li>
            </ul>
          </HoverCard>
          <HoverCard icon={IconInfoCircle} title="Почему выбирают нас?">
            <ul style={{ paddingLeft: '1rem' }}>
              <li>Высокая вовлеченность аудитории</li>
              <li>Широкий охват: тысячи уникальных посетителей ежедневно</li>
              <li>Гибкие форматы рекламы</li>
              <li>Доверие аудитории</li>
            </ul>
          </HoverCard>
        </div>

        <Divider my="xl" />

        {/* Секция аудитории */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '2rem',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ flex: '1 1 300px', maxWidth: '400px' }}>
            <Group spacing="xs" mb="sm">
              <IconUsers size={28} stroke={2} color="#1c7ed6" />
              <Title order={2}>Наша аудитория</Title>
            </Group>
            <ul style={{ paddingLeft: '1rem' }}>
              <li>Целевая аудитория: ценители парфюмерии</li>
              <li>Демография: 70% женщины, 30% мужчины</li>
              <li>Возраст: 18–45 лет</li>
              <li>География: Россия, страны СНГ</li>
              <li>Глубина просмотра - 11,4</li>
              <li>Время на сайте - 12:37</li>
            </ul>
          </div>
          <div style={{ flex: '1 1 300px', maxWidth: '400px' }}>
            <Doughnut data={audienceData} />
          </div>
        </div>

        <Divider my="xl" />

        {/* Контакты */}
        <Group
          style={{
            margin: '0 auto',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '-60px',
          }}
        >
          <UnstyledButton
            component="div"
            sx={(theme) => ({
              display: 'block',
              width: '100%',
              maxWidth: 400,
              borderRadius: theme.radius.md,
              padding: theme.spacing.lg,
              border: `1px solid ${theme.colors.gray[3]}`,
              textAlign: 'center',
              transition: 'background-color 0.2s ease',
              '&:hover': {
                backgroundColor: theme.colors.gray[0],
              },
            })}
          >
            <Group spacing="xs" position="center" mb="md">
              <IconMail size={24} stroke={2} color="#1c7ed6" />
              <Title order={3}>Контакты для размещения рекламы</Title>
            </Group>
            <Text align="center" size="lg">
              Email:{' '}
              <a
                href="mailto:info@parfumetrika.ru"
                style={{ color: '#1c7ed6', textDecoration: 'underline' }}
              >
                info@parfumetrika.ru
              </a>
            </Text>
          </UnstyledButton>
        </Group>
      </Container>
      <FooterLinks />
    </>
  );
};

export default ParfumetrikaPage;
