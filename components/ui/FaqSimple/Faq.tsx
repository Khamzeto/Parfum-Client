import { Container, Title, Accordion, Text } from '@mantine/core';
import classes from './Faq.module.css';

export function FaqSimple() {
  return (
    <Container size="sm" mb="0" className={classes.wrapper} style={{ padding: '40px 20px' }}>
      <Title
        order={1}
        mb="30"
        className={classes.title}
        style={{ fontWeight: 600, fontSize: '28px' }}
      >
        Часто задаваемые вопросы (FAQ)
      </Title>

      <Accordion variant="separated" style={{ marginTop: '20px' }}>
        <Accordion.Item className={classes.item} value="about">
          <Accordion.Control>Что такое Парфюметрика?</Accordion.Control>
          <Accordion.Panel>
            <Text size="sm">
              Парфюметрика — это онлайн-база данных о парфюмерии, где вы можете найти информацию о
              170,000+ различных ароматах, их нотах, аккордах и многом другом. Мы даем возможность
              пользователям вносить изменения и дополнения, делая сайт более полезным для всех.
            </Text>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item className={classes.item} value="adding-info">
          <Accordion.Control>Как я могу добавить или изменить информацию?</Accordion.Control>
          <Accordion.Panel>
            <Text size="sm">
              Зарегистрированные пользователи могут редактировать существующую информацию, добавлять
              новые ароматы и делиться своими знаниями. Просто войдите в свой аккаунт и начните
              редактировать или добавлять данные.
            </Text>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item className={classes.item} value="contact">
          <Accordion.Control>Как я могу связаться с командой Парфюметрики?</Accordion.Control>
          <Accordion.Panel>
            <Text size="sm">
              Вы можете отправить нам сообщение на{' '}
              <a href="mailto:info@parfumetrika.ru">info@parfumetrika.ru</a> или написать в наших
              социальных сетях. Мы всегда рады обратной связи и предложениям.
            </Text>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item className={classes.item} value="report-error">
          <Accordion.Control>Я нашел(а) ошибку. Что делать?</Accordion.Control>
          <Accordion.Panel>
            <Text size="sm">
              Если вы нашли ошибку, вы можете исправить её самостоятельно, если являетесь
              зарегистрированным пользователем. Либо сообщите нам через форму обратной связи или по
              электронной почте, и мы оперативно внесем корректировки.
            </Text>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item className={classes.item} value="free">
          <Accordion.Control>Парфюметрика бесплатна?</Accordion.Control>
          <Accordion.Panel>
            <Text size="sm">
              Да, пользование Парфюметрикой абсолютно бесплатное. Мы стремимся сделать знания о
              парфюмерии доступными для всех.
            </Text>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
}
