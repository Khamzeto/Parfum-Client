import { IconCheck } from '@tabler/icons-react'; // Импортируем иконку галочки
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
import axios from 'axios';
import './UserMenu.css';

interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  isVerified?: boolean; // Добавляем поле isVerified
}

interface UserButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  image: string;
  name: string;
  email: string;
  isVerified?: boolean;
  icon?: React.ReactNode;
}

const UserButton = forwardRef<HTMLButtonElement, UserButtonProps>(
  ({ image, name, email, isVerified, icon, ...others }: UserButtonProps, ref) => (
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
        <Avatar src={image} className="avatar-user" radius="xl" />
        <div style={{ flex: 1 }}>
          <Text
            size="sm"
            fw={500}
            style={{
              display: 'flex',
              alignItems: 'center',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            className="user-text"
          >
            {name}
            {isVerified && (
              <IconCheck
                size="1rem"
                color="gray"
                style={{ marginLeft: '0.2rem' }} // Добавляем иконку галочки, если isVerified === true
              />
            )}
          </Text>
          <Text
            c="dimmed"
            size="xs"
            style={{
              display: 'block',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            className="user-text"
          >
            {email}
          </Text>
        </div>
        {icon || <IconChevronRight size="1rem" />}
      </Group>

      <style jsx>{`
        @media (max-width: 768px) {
          .user-text {
            display: none;
          }
        }
      `}</style>
    </UnstyledButton>
  )
);

export function UserMenu() {
  const theme = useMantineTheme();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  // Функция для запроса данных пользователя
  const fetchUser = async (userId: string) => {
    try {
      const response = await axios.get<User>(`https://hltback.parfumetrika.ru/users/${userId}`);
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data)); // Обновляем данные в localStorage
    } catch (error) {
      console.error('Ошибка загрузки данных пользователя:', error);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      let parsedUser = JSON.parse(storedUser);

      // Если существует _id, преобразуем его в id и обновляем localStorage
      if (parsedUser._id && !parsedUser.id) {
        parsedUser.id = parsedUser._id;
        delete parsedUser._id; // Удаляем _id, чтобы не было путаницы
        localStorage.setItem('user', JSON.stringify(parsedUser)); // Обновляем в localStorage
      }

      setUser(parsedUser);
      const userId = parsedUser.id; // Теперь мы всегда используем id

      if (userId) {
        console.log(parsedUser);
        fetchUser(userId); // Передаем идентификатор для загрузки данных
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <Menu withArrow zIndex="9999999" position="bottom-end" transition="pop" withinPortal>
      <Menu.Target>
        <UserButton
          image={user?.avatar || 'Unknown User'}
          name={user?.username || 'Unknown User'}
          email={user?.email || 'unknown@mail.com'}
          isVerified={user?.isVerified} // Передаем isVerified в UserButton
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
          onClick={() => router.push('/change-profile')}
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
