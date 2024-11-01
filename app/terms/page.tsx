'use client';

import { Header } from '@/components/Header/Header';
import { FooterLinks } from '@/components/ui/Footer/Footer';
import { Container, Title, Text, List } from '@mantine/core';

export default function TermsOfUse() {
  return (
    <>
      <head>
        <title>Условия использования | Parfumetrika</title>
        <meta name="description" content="Условия использования,Parfumetrika" />
      </head>
      <Header />
      <Container size="md" style={{ padding: '40px 20px', maxWidth: '800px' }}>
        <Title
          align="center"
          order={1}
          style={{ fontSize: '28px', marginBottom: '30px', fontWeight: 600 }}
        >
          Условия использования
        </Title>

        <Text size="sm" style={{ lineHeight: 1.6, marginBottom: '20px' }}>
          Добро пожаловать на Парфюметрику! Прежде чем пользоваться нашим сайтом, пожалуйста,
          ознакомьтесь с Условиями использования. Продолжая использовать сайт, вы соглашаетесь с
          этими условиями.
        </Text>

        <List spacing="lg" size="sm" style={{ marginBottom: '30px' }}>
          <List.Item>
            <Text weight={600}>1. Основные положения</Text>
            <Text size="sm" style={{ lineHeight: 1.6 }}>
              Парфюметрика — это платформа с открытым доступом к информации о парфюмерии. Мы
              стремимся поддерживать актуальность и точность данных, но не гарантируем их абсолютной
              точности.
            </Text>
          </List.Item>

          <List.Item>
            <Text weight={600}>2. Пользовательский контент</Text>
            <Text size="sm" style={{ lineHeight: 1.6 }}>
              Зарегистрированные пользователи могут добавлять и редактировать информацию на сайте.
              Вы соглашаетесь, что ваш контент может быть изменен или удален другими пользователями
              или администрацией сайта. Размещая контент, вы подтверждаете, что он не нарушает права
              третьих лиц.
            </Text>
          </List.Item>

          <List.Item>
            <Text weight={600}>3. Ответственность пользователей</Text>
            <Text size="sm" style={{ lineHeight: 1.6 }}>
              Каждый пользователь несет ответственность за точность и соответствие размещенной
              информации и обязуется не размещать материалы, нарушающие закон или права других лиц.
            </Text>
          </List.Item>

          <List.Item>
            <Text weight={600}>4. Использование данных</Text>
            <Text size="sm" style={{ lineHeight: 1.6 }}>
              Мы используем собранные данные, такие как данные о посещениях и поведении
              пользователей, для улучшения работы сайта. Мы также применяем файлы cookie для
              оптимизации пользовательского опыта.
            </Text>
          </List.Item>

          <List.Item>
            <Text weight={600}>5. Ограничение ответственности</Text>
            <Text size="sm" style={{ lineHeight: 1.6 }}>
              Администрация Парфюметрики не несет ответственности за любой ущерб, вызванный
              использованием или невозможностью использования сайта. Мы не гарантируем, что сайт
              будет работать без ошибок или сбоев.
            </Text>
          </List.Item>

          <List.Item>
            <Text weight={600}>6. Прекращение доступа</Text>
            <Text size="sm" style={{ lineHeight: 1.6 }}>
              Мы оставляем за собой право приостанавливать или прекращать доступ пользователей к
              сайту при нарушении ими настоящих Условий использования.
            </Text>
          </List.Item>

          <List.Item>
            <Text weight={600}>7. Изменение условий</Text>
            <Text size="sm" style={{ lineHeight: 1.6 }}>
              Мы можем периодически изменять Условия использования. В случае значительных изменений
              мы уведомим вас через сайт. Настоятельно рекомендуем регулярно проверять эту страницу.
            </Text>
          </List.Item>

          <List.Item>
            <Text weight={600}>8. Связь с администрацией</Text>
            <Text size="sm" style={{ lineHeight: 1.6 }}>
              Если у вас есть вопросы или предложения, пожалуйста, свяжитесь с нами по электронной
              почте <a href="mailto:info@parfumetrika.ru">info@parfumetrika.ru</a>.
            </Text>
          </List.Item>
        </List>
      </Container>
      <FooterLinks />
    </>
  );
}
