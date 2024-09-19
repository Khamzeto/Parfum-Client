'use client';
import { Group, Button } from '@mantine/core';
import Link from 'next/link';
import {
  IconFolder,
  IconStar,
  IconUsersGroup,
  IconCalendarEvent,
  IconFlask2,
} from '@tabler/icons-react';
import { usePathname } from 'next/navigation';
import { useMantineColorScheme } from '@mantine/core';
import styles from './NavigationButtons.module.css'; // Внешний файл стилей

export const NavigationButtons = () => {
  const pathname = usePathname();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  // Функция для проверки активного URL
  const isActive = (url: string) => pathname === url;

  return (
    <div className={styles.scrollContainer}>
    <Group
  spacing="sm"
  mt="20px"
  className={styles.horizontalScroll}
  style={{ whiteSpace: 'nowrap'}} // Стиль, добавляющий горизонтальный скроллинг
>
        <Link href="/brands" passHref>
          <Button
            component="a"
            variant={isActive('/brands') ? 'filled' : 'default'}
            color={isActive('/brands') ? 'blue' : undefined}
            size="md"
            leftSection={<IconFolder size={18} />}
            styles={{
              root: {
                borderRadius: '8px',
                backgroundColor:
                  isDark && !isActive('/') ? '#2C2E33' : undefined,
              },
            }}
          >
            Все бренды
          </Button>
        </Link>
        {/*

        <Link href="/popular-brands" passHref>
          <Button
            component="a"
            variant={isActive('/popular-brands') ? 'filled' : 'default'}
            color={isActive('/popular-brands') ? 'blue' : undefined}
            size="md"
            leftSection={<IconStar size={18} />}
            styles={{
              root: {
                borderRadius: '8px',
                backgroundColor:
                  isDark && !isActive('/popular-brands')
                    ? '#2C2E33'
                    : undefined,
              },
            }}
          >
            Популярные бренды
          </Button>
        </Link>
*/}
        <Link href="/parfumers" passHref>
          <Button
            component="a"
            variant={isActive('/parfumers') ? 'filled' : 'default'}
            color={isActive('/parfumers') ? 'blue' : undefined}
            size="md"
            leftSection={<IconUsersGroup size={18} />}
            styles={{
              root: {
                borderRadius: '8px',
                backgroundColor:
                  isDark && !isActive('/parfumers') ? '#2C2E33' : undefined,
              },
            }}
          >
            Парфюмеры
          </Button>
        </Link>
         {/*

        <Link href="/years-of-release" passHref>
          <Button
            component="a"
            variant={isActive('/years-of-release') ? 'filled' : 'default'}
            color={isActive('/years-of-release') ? 'blue' : undefined}
            size="md"
            leftSection={<IconCalendarEvent size={18} />}
            styles={{
              root: {
                borderRadius: '8px',
                backgroundColor:
                  isDark && !isActive('/years-of-release')
                    ? '#2C2E33'
                    : undefined,
              },
            }}
          >
            Годы выпуска
          </Button>
        </Link>
        */}

        <Link href="/notes" passHref>
          <Button
            component="a"
            variant={isActive('/notes') ? 'filled' : 'default'}
            color={isActive('/notes') ? 'blue' : undefined}
            size="md"
            leftSection={<IconFlask2 size={18} />}
            styles={{
              root: {
                borderRadius: '8px',
                backgroundColor:
                  isDark && !isActive('/notes') ? '#2C2E33' : undefined,
              },
            }}
          >
            Ноты аромата
          </Button>
        </Link>
      </Group>
    </div>
  );
};
