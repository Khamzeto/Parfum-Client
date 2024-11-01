'use client';

import { Header } from '@/components/Header/Header';
import { FooterLinks } from '@/components/ui/Footer/Footer';
import { Container, Title, Text, List } from '@mantine/core';

export default function PrivacyPolicy() {
  return (
    <>
      <head>
        <title> Политика конфиденциальности | Parfumetrika</title>
        <meta name="description" content="Политика конфиденциальности,Parfumetrika" />
      </head>
      <Header />
      <Container size="md" style={{ padding: '40px 20px', maxWidth: '800px' }}>
        <Title
          align="center"
          order={1}
          style={{ fontSize: '28px', marginBottom: '30px', fontWeight: 600 }}
        >
          Политика конфиденциальности
        </Title>

        <Text size="sm" style={{ lineHeight: 1.6, marginBottom: '20px' }}>
          Мы ценим вашу конфиденциальность и стремимся защитить ваши персональные данные. Настоящая
          Политика конфиденциальности описывает, какие данные мы собираем, как мы их используем и
          какие меры принимаем для защиты вашей информации.
        </Text>

        <List spacing="lg" size="sm" style={{ marginBottom: '30px' }}>
          <List.Item>
            <Text weight={600}>1. Сбор информации</Text>
            <Text size="sm" style={{ lineHeight: 1.6 }}>
              Мы собираем минимальную информацию, необходимую для предоставления наших услуг,
              включая:
            </Text>
            <List
              type="unordered"
              withPadding
              size="sm"
              style={{ paddingLeft: '20px', marginTop: '10px' }}
            >
              <List.Item>
                Контактные данные, которые вы указываете при регистрации (электронная почта).
              </List.Item>
              <List.Item>
                Данные о вашем использовании сайта, чтобы улучшать и оптимизировать наш сервис.
              </List.Item>
            </List>
          </List.Item>

          <List.Item>
            <Text weight={600}>2. Использование данных</Text>
            <Text size="sm" style={{ lineHeight: 1.6 }}>
              Мы используем собранную информацию для:
            </Text>
            <List
              type="unordered"
              withPadding
              size="sm"
              style={{ paddingLeft: '20px', marginTop: '10px' }}
            >
              <List.Item>Управления вашим аккаунтом и обеспечения работы сайта.</List.Item>
              <List.Item>Улучшения функциональности и качества обслуживания.</List.Item>
              <List.Item>
                Связи с вами при необходимости (обновления, важные уведомления).
              </List.Item>
            </List>
          </List.Item>

          <List.Item>
            <Text weight={600}>3. Защита данных</Text>
            <Text size="sm" style={{ lineHeight: 1.6 }}>
              Мы принимаем меры для защиты ваших данных от несанкционированного доступа и соблюдаем
              актуальные меры безопасности, включая шифрование и защиту данных от потерь и
              кибератак.
            </Text>
          </List.Item>

          <List.Item>
            <Text weight={600}>4. Раскрытие информации третьим лицам</Text>
            <Text size="sm" style={{ lineHeight: 1.6 }}>
              Мы не передаем ваши персональные данные третьим лицам без вашего согласия, за
              исключением случаев, предусмотренных законодательством.
            </Text>
          </List.Item>

          <List.Item>
            <Text weight={600}>5. Использование файлов cookie</Text>
            <Text size="sm" style={{ lineHeight: 1.6 }}>
              Наш сайт использует файлы cookie для улучшения удобства пользования и анализа
              посещаемости. Вы можете настроить свои предпочтения по использованию cookie в вашем
              браузере.
            </Text>
          </List.Item>

          <List.Item>
            <Text weight={600}>6. Ваши права</Text>
            <Text size="sm" style={{ lineHeight: 1.6 }}>
              Вы имеете право на доступ к своим данным, их редактирование и удаление. Если у вас
              возникнут вопросы или пожелания по изменению данных, свяжитесь с нами по электронной
              почте <a href="mailto:info@parfumetrika.ru">info@parfumetrika.ru</a>.
            </Text>
          </List.Item>

          <List.Item>
            <Text weight={600}>7. Обновления политики конфиденциальности</Text>
            <Text size="sm" style={{ lineHeight: 1.6 }}>
              Мы можем периодически обновлять эту Политику конфиденциальности. В случае значительных
              изменений мы уведомим вас через наш сайт или отправим уведомление на электронную
              почту.
            </Text>
          </List.Item>
        </List>
      </Container>
      <FooterLinks />
    </>
  );
}
