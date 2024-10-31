import { Text, Container, ActionIcon, Group, rem } from '@mantine/core';
import { IconBrandTwitter, IconBrandYoutube, IconBrandInstagram } from '@tabler/icons-react';

import classes from './Footer.module.css';

const data = [
  {
    title: 'О нас',
    links: [
      { label: 'О проекте', link: '#' },
      { label: 'Контакты', link: '#' },
      { label: 'Политика конфиденциальности', link: '#' },
      { label: 'Условия использования', link: '#' },
      { label: 'FAQ', link: '#' },
    ],
  },
  {
    title: 'Все о парфюмерии',
    links: [
      { label: 'Новости', link: 'news' },
      { label: 'Ароматы', link: 'search' },
      { label: 'Бренды', link: 'brands' },
      { label: 'Ноты', link: 'notes' },
      { label: 'Парфюмеры', link: 'parfumers' },
      { label: 'Похожее', link: 'similar' },
    ],
  },
  {
    title: 'Комьюнити',
    links: [
      { label: 'Статьи', link: 'articles' },
      { label: 'Новости', link: 'news' },
    ],
  },
];

export function FooterLinks() {
  const groups = data.map((group) => {
    const links = group.links.map((link, index) => (
      <Text<'a'>
        key={index}
        className={classes.link}
        style={{ cursor: 'pointer' }}
        component="a"
        href={link.link}
      >
        {link.label}
      </Text>
    ));

    return (
      <div className={classes.wrapper} key={group.title}>
        <Text className={classes.title}>{group.title}</Text>
        {links}
      </div>
    );
  });

  return (
    <footer className={classes.footer}>
      <Container className={classes.inner}>
        <div className={classes.logo}>
          <h2>Parfumetrika</h2>
          <Text size="xs" c="dimmed" className={classes.description}>
            Ваш гид в мире парфюмерии
          </Text>
        </div>
        <div className={classes.groups}>{groups}</div>
      </Container>
      <Container className={classes.afterFooter}>
        <Text c="dimmed" size="sm">
          © 2020 mantine.dev. All rights reserved.
        </Text>

        <Group gap={0} className={classes.social} justify="flex-end" wrap="nowrap">
          <ActionIcon size="lg" color="gray" variant="subtle">
            <IconBrandTwitter style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
          </ActionIcon>
          <ActionIcon size="lg" color="gray" variant="subtle">
            <IconBrandYoutube style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
          </ActionIcon>
          <ActionIcon size="lg" color="gray" variant="subtle">
            <IconBrandInstagram style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
          </ActionIcon>
        </Group>
      </Container>
    </footer>
  );
}
