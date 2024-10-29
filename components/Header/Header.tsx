'use client';
// @ts-ignore: Temporary ignore TypeScript error
import {
  HoverCard,
  Group,
  Button,
  UnstyledButton,
  Text,
  SimpleGrid,
  ThemeIcon,
  Anchor,
  Divider,
  Center,
  Box,
  Burger,
  Drawer,
  Collapse,
  ScrollArea,
  rem,
  useMantineTheme,
  Avatar,
  Menu,
  Input,
  useMantineColorScheme,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import {
  IconNotification,
  IconCode,
  IconBook,
  IconChartPie3,
  IconFingerprint,
  IconCoin,
  IconChevronDown,
  IconChevronRight,
  IconLogout,
  IconSettings,
} from '@tabler/icons-react';
import classes from './Header.module.css';

import { ActionToggle } from '../ui/ActionToggle/ActionToggle';
import { UserMenu } from '../ui/UserMenu/UserMenu';
import SpotlightDemo from '../ui/InputSearch/InputSearch';
import Link from 'next/link';

interface UserButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  image: string;
  name: string;
  email: string;
  icon?: React.ReactNode;
}

const mockdata = [
  {
    icon: IconCode,
    title: 'Open source',
    description: 'This Pokémon’s cry is very loud and distracting',
  },
  {
    icon: IconCoin,
    title: 'Free for everyone',
    description: 'The fluid of Smeargle’s tail secretions changes',
  },
  {
    icon: IconBook,
    title: 'Documentation',
    description: 'Yanma is capable of seeing 360 degrees without',
  },
  {
    icon: IconFingerprint,
    title: 'Security',
    description: 'The shell’s rounded shape and the grooves on its.',
  },
  {
    icon: IconChartPie3,
    title: 'Analytics',
    description: 'This Pokémon uses its flying ability to quickly chase',
  },
  {
    icon: IconNotification,
    title: 'Notifications',
    description: 'Combusken battles with the intensely hot flames it spews',
  },
];

const UserButton = ({ image, name, email, icon, ...others }: UserButtonProps) => (
  <UnstyledButton
    style={{
      padding: 'var(--mantine-spacing-md)',
      color: 'var(--mantine-color-text)',
      borderRadius: 'var(--mantine-radius-sm)',
    }}
    {...others}
  >
    <Group>
      <Avatar src={image} radius="xl" />

      <div style={{ flex: 1 }}>
        <Text size="sm" fw={500}>
          {name}
        </Text>

        <Text c="dimmed" size="xs">
          {email}
        </Text>
      </div>

      {icon || <IconChevronRight size="1rem" />}
    </Group>
  </UnstyledButton>
);
const navigationLinks = [
  { label: 'Главная', href: '/' },
  { label: 'Новости', href: '/news' },
  { label: 'Бренды', href: '/brands' },
  { label: 'Ароматы', href: '/search' },
  { label: 'Ноты', href: '/notes' },
  { label: 'Похожие', href: '/similar' },
  { label: 'Парфюмеры', href: '/parfumers' },
  { label: 'Статьи', href: '/articles' },
];

export function Header() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const [user, setUser] = useState<{ name: string; email: string; image: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true); // состояние загрузки

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser({
        name: 'Harriette Spoonlicker',
        email: 'hspoonlicker@outlook.com',
        image:
          'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png',
      });
    }
    setIsLoading(false); // завершаем загрузку после проверки
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/login';
  };

  const isDark = colorScheme === 'dark';
  const logoSrc = isDark ? '/logoWhite.svg' : '/logo.svg';

  const links = mockdata.map((item) => (
    <UnstyledButton className={classes.subLink} key={item.title}>
      <Group wrap="nowrap" align="flex-start">
        <ThemeIcon size={34} variant="default" radius="md">
          <item.icon style={{ width: rem(22), height: rem(22) }} color={theme.colors.blue[6]} />
        </ThemeIcon>
        <div>
          <Text size="sm" fw={500}>
            {item.title}
          </Text>
          <Text size="xs" c="dimmed">
            {item.description}
          </Text>
        </div>
      </Group>
    </UnstyledButton>
  ));

  return (
    <Box pb={4}>
      <header className={classes.header}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ height: '150px', position: 'relative', width: '20%' }}>
            <img style={{ height: '150px', position: 'absolute' }} src={logoSrc} alt="Logo" />
          </div>
          <div style={{ width: '40%' }}>
            <SpotlightDemo />
          </div>

          <Group visibleFrom="sm">
            <Box style={{ marginLeft: '8px' }}>
              <ActionToggle />
            </Box>
            {!isLoading && // Рендерим только после завершения загрузки
              (user ? (
                <UserMenu />
              ) : (
                <>
                  <Button
                    radius="8"
                    variant="default"
                    onClick={() => (window.location.href = '/login')}
                  >
                    Войти
                  </Button>
                  <Button radius="8" onClick={() => (window.location.href = '/register')}>
                    Зарегистрироваться
                  </Button>
                </>
              ))}
          </Group>

          <Group hiddenFrom="sm" gap="xs">
            <Box style={{ marginLeft: '8px', marginRight: '6px' }}>
              <ActionToggle />
            </Box>
            <Burger opened={drawerOpened} onClick={toggleDrawer} style={{ marginLeft: 'auto' }} />
          </Group>
        </div>
      </header>
      <Divider mt="44" />
      <div style={{ margin: '0 auto', maxWidth: '1380px', padding: '10px' }}>
        <Group style={{ gap: '15px', display: 'flex', justifyContent: 'space-between' }}>
          {navigationLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              style={{
                textDecoration: 'none',
                fontWeight: 800,
                fontSize: '14px',
                color: link.color || 'black',
                textTransform: 'uppercase',
                position: 'relative',
                zIndex: 9999,
              }}
            >
              {link.label}
            </Link>
          ))}
        </Group>
      </div>
      <Divider mb="20" />

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
          <Divider my="sm" />

          <a href="#" className={classes.link}>
            Home
          </a>
          <UnstyledButton className={classes.link} onClick={toggleLinks}>
            <Center inline>
              <Box component="span" mr={5}>
                Features
              </Box>
              <IconChevronDown
                style={{ width: rem(16), height: rem(16) }}
                color={theme.colors.blue[6]}
              />
            </Center>
          </UnstyledButton>
          <Collapse in={linksOpened}>{links}</Collapse>
          <a href="#" className={classes.link}>
            Learn
          </a>
          <a href="#" className={classes.link}>
            Academy
          </a>

          <Divider my="sm" />

          <Group justify="center" grow pb="xl" px="md">
            <Button variant="default">Log in</Button>
            <Button>Sign up</Button>
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}
