import { forwardRef, useEffect, useState } from 'react';
import {
  IconChevronRight,
  IconSettings,
  IconLogout,
  IconArticle,
  IconPlus,
  IconUser,
} from '@tabler/icons-react';
import { Group, Avatar, Text, Menu, UnstyledButton, rem, useMantineTheme } from '@mantine/core';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
}

interface UserButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  image: string;
  name: string;
  email: string;
  icon?: React.ReactNode;
}

const UserButton = forwardRef<HTMLButtonElement, UserButtonProps>(
  ({ image, name, email, icon, ...others }: UserButtonProps, ref) => (
    <UnstyledButton
      ref={ref}
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
  )
);

export function UserMenu() {
  const theme = useMantineTheme();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/Login');
  };

  return (
    <Menu withArrow zIndex="9999999" position="bottom-end" transition="pop" withinPortal>
      <Menu.Target>
        <UserButton
          image={user?.avatar || 'Unknown User'}
          name={user?.username || 'Unknown User'}
          email={user?.email || 'unknown@mail.com'}
        />
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          leftSection={<IconUser style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
          onClick={() => router.push('/profile')}
        >
          Профиль
        </Menu.Item>
        <Menu.Item
          leftSection={<IconArticle style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
          onClick={() => router.push('/my-articles')}
        >
          Мои статьи
        </Menu.Item>
        <Menu.Item
          leftSection={<IconPlus style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
          onClick={() => router.push('/create-article')}
        >
          Создать статью
        </Menu.Item>

        <Menu.Label>Настройки</Menu.Label>
        <Menu.Item
          leftSection={<IconSettings style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
          onClick={() => router.push('/account-settings')}
        >
          Настройки аккаунта
        </Menu.Item>
        <Menu.Item
          leftSection={<IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
          onClick={handleLogout}
        >
          Выйти
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
