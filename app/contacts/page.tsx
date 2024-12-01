'use client';

import { Header } from '@/components/Header/Header';
import { FooterLinks } from '@/components/ui/Footer/Footer';
import { Container, Text, Title, Card, Group, Button, Stack, Anchor } from '@mantine/core';
import { IconMail, IconBrandVk, IconBrandTelegram, IconBrandPinterest } from '@tabler/icons-react';

export default function Contacts() {
  return (
    <>
      <Header />
      <Container size="sm" style={{ padding: '40px 20px' }}>
        <Stack spacing="xl" align="center" style={{ maxWidth: 700, margin: '0 auto' }}>
          <Title align="center" order={1} style={{ fontSize: '26px', fontWeight: 600 }}>
            Контакты
          </Title>

          <Text align="center" size="md" color="dimmed" style={{ lineHeight: 1.6 }}>
            Свяжитесь с нами, если у вас есть вопросы, предложения или идеи по улучшению
            <strong> Парфюметрики</strong>. Мы всегда рады общению и новым идеям от нашего
            сообщества!
          </Text>

          <Card
            radius="md"
            padding="lg"
            style={{
              maxWidth: 600,
              textAlign: 'center',
              backgroundColor: '#f3f4f6',
              border: '1px solid #e0e0e0',
            }}
          >
            <Group position="center" spacing="xs">
              <IconMail size={20} color="#228be6" />
              <Text size="sm" color="dimmed">
                Электронная почта:{' '}
                <Anchor href="mailto:info@parfumetrika.ru" size="sm">
                  info@parfumetrika.ru
                </Anchor>
              </Text>
            </Group>
          </Card>

          <Title align="center" order={3} size="lg" style={{ fontWeight: 500, marginTop: '30px' }}>
            Социальные сети
          </Title>
          <Text align="center" size="sm" color="dimmed">
            Следите за нашими обновлениями, присоединяйтесь к обсуждениям и делитесь своим опытом:
          </Text>

          <Group spacing="md" position="center">
            <Button
              component="a"
              href="https://vk.com/parfumetrika_ru"
              target="_blank"
              leftIcon={<IconBrandVk size={20} />}
              variant="light"
            >
              ВКонтакте
            </Button>
            <Button
              component="a"
              href="https://t.me/parfumetrika"
              target="_blank"
              leftIcon={<IconBrandTelegram size={20} />}
              variant="light"
            >
              Telegram
            </Button>
            <Button
              component="a"
              href="https://ru.pinterest.com/Parfumetrika"
              target="_blank"
              leftIcon={<IconBrandPinterest size={20} />}
              variant="light"
            >
              Pinterest
            </Button>
          </Group>

          <Text
            align="center"
            size="sm"
            color="dimmed"
            style={{ marginTop: '30px', lineHeight: 1.5 }}
          >
            Если вы хотите внести изменения или добавить информацию на сайт,{' '}
            <Anchor href="/register" size="sm">
              зарегистрируйтесь
            </Anchor>{' '}
            и начинайте делиться своим опытом с другими парфюмерными энтузиастами.
          </Text>
        </Stack>
      </Container>
      <FooterLinks />
    </>
  );
}
