'use client';
import { Paper, Text, Title, Button } from '@mantine/core';
import { useRouter } from 'next/navigation';
import classes from './Card.module.css';

interface CardProps {
  image: string;
  title: string;
  category: string;
  id: string;
}

export function CardCustom({ image, title, category, id }: CardProps) {
  const router = useRouter();

  const handleNavigate = () => {
    console.log('Navigating to:', `/new/${id}`); // Проверяем, что id корректный
    router.push(`/new/${id}`);
  };

  return (
    <Paper
      shadow="md"
      p="xl"
      radius="15"
      style={{ backgroundImage: `url(https://hltback.parfumetrika.ru${image})` }}
      className={classes.card}
      onClick={handleNavigate}
    >
      <div>
        <Text className={classes.cardCategory} size="xs">
          {category}
        </Text>
        <Title order={3} className={classes.cardTitle}>
          {title}
        </Title>
      </div>
      <Button variant="white" color="dark" className={classes.cardButton} onClick={handleNavigate}>
        Перейти
      </Button>
    </Paper>
  );
}
